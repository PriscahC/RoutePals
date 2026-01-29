// SMS Handler for Nairobi Commuter Info System
// Works with Africa's Talking SMS API and Sandbox

const { routes, reports, reportIdCounter, trafficUpdates } = require('../data/routesData');

// Africa's Talking Configuration
let sms = null;

// Initialize Africa's Talking SDK
function initializeAfricasTalking() {
  try {
    const credentials = {
      apiKey: process.env.AT_API_KEY || '',
      username: process.env.AT_USERNAME || 'sandbox'
    };
    
    // Only initialize if we have an API key
    if (credentials.apiKey) {
      const AfricasTalking = require('africastalking')(credentials);
      sms = AfricasTalking.SMS;
      console.log('✅ Africa\'s Talking SMS initialized');
    } else {
      console.log('⚠️  Africa\'s Talking API key not found. Running in simulation mode.');
    }
  } catch (error) {
    console.error('Failed to initialize Africa\'s Talking:', error.message);
  }
}

// Initialize on module load
initializeAfricasTalking();

// SMS command keywords
const COMMANDS = {
  ROUTE: ['route', 'routes', 'r'],
  FARE: ['fare', 'fares', 'f'],
  TRAFFIC: ['traffic', 'jam', 't'],
  REPORT: ['report', 'complaint', 'rep'],
  HELP: ['help', 'h', 'info']
};

/**
 * Handle incoming SMS messages
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function handleSMS(req, res) {
  // Africa's Talking sends these parameters
  const { from, to, text, date, id, linkId } = req.body;
  
  console.log('\n📱 SMS Received:');
  console.log('   From:', from);
  console.log('   To:', to);
  console.log('   Message:', text);
  console.log('   Date:', date);
  
  let responseMessage = '';

  try {
    // Clean and parse the message
    const message = text.trim().toLowerCase();
    const parts = message.split(' ');
    const command = parts[0];
    const args = parts.slice(1);

    console.log('   Command:', command);
    console.log('   Args:', args);

    // Route command: ROUTE <number> or ROUTE <search term>
    if (COMMANDS.ROUTE.includes(command)) {
      responseMessage = handleRouteCommand(args);
    }
    // Fare command: FARE <number>
    else if (COMMANDS.FARE.includes(command)) {
      responseMessage = handleFareCommand(args);
    }
    // Traffic command: TRAFFIC or TRAFFIC <route>
    else if (COMMANDS.TRAFFIC.includes(command)) {
      responseMessage = handleTrafficCommand(args);
    }
    // Report command: REPORT <vehicle> <route> <issue>
    else if (COMMANDS.REPORT.includes(command)) {
      responseMessage = handleReportCommand(args, from);
    }
    // Help command
    else if (COMMANDS.HELP.includes(command)) {
      responseMessage = getHelpMessage();
    }
    // Unknown command
    else {
      responseMessage = `Unknown command: "${command}"\n\n${getHelpMessage()}`;
    }

    console.log('   Response:', responseMessage);

    // Send SMS response using Africa's Talking API
    if (sms) {
      await sendSMS(from, responseMessage);
      console.log('✅ SMS sent successfully');
    } else {
      console.log('⚠️  SMS would be sent (simulation mode):', responseMessage.substring(0, 50) + '...');
    }

    // Important: Africa's Talking expects a 200 OK response
    // The actual SMS is sent via their API, not in the HTTP response
    res.status(200).send('Received');

  } catch (error) {
    console.error('❌ SMS Handler Error:', error);
    
    // Try to send error message to user
    if (sms) {
      try {
        await sendSMS(from, 'Sorry, we encountered an error. Please try again later.');
      } catch (sendError) {
        console.error('Failed to send error SMS:', sendError);
      }
    }
    
    // Still return 200 OK to Africa's Talking to avoid retries
    res.status(200).send('Error handled');
  }
}

/**
 * Send SMS using Africa's Talking API
 */
async function sendSMS(to, message) {
  if (!sms) {
    console.log('SMS sending skipped - No API configured');
    return { status: 'simulated', message };
  }

  try {
    // For sandbox, you need to add the phone number to your sandbox
    const options = {
      to: [to],
      message: message,
      // Uncomment if you have a shortcode/alphanumeric sender ID
      // from: 'YOUR_SHORTCODE'
    };

    console.log('📤 Sending SMS to:', to);
    console.log('   Message length:', message.length);
    
    const result = await sms.send(options);
    console.log('📬 SMS API Response:', JSON.stringify(result, null, 2));
    
    return result;
  } catch (error) {
    console.error('❌ Error sending SMS:', error);
    throw error;
  }
}

/**
 * Handle route information requests
 */
function handleRouteCommand(args) {
  if (args.length === 0) {
    // List all routes
    let message = 'NAIROBI ROUTES:\n\n';
    routes.slice(0, 5).forEach((route, index) => {
      message += `${index + 1}. ${route.name}\n`;
    });
    message += '\nSend: ROUTE <number> for details';
    return message;
  }

  // Search by number
  const routeNum = parseInt(args[0]);
  if (!isNaN(routeNum) && routeNum > 0 && routeNum <= routes.length) {
    const route = routes[routeNum - 1];
    return formatRouteInfo(route);
  }

  // Search by name
  const searchTerm = args.join(' ');
  const matchedRoute = routes.find(r => 
    r.name.toLowerCase().includes(searchTerm) ||
    r.from.toLowerCase().includes(searchTerm) ||
    r.to.toLowerCase().includes(searchTerm)
  );

  if (matchedRoute) {
    return formatRouteInfo(matchedRoute);
  }

  return `Route not found: "${searchTerm}"\n\nSend ROUTE to see all routes.`;
}

/**
 * Handle fare estimate requests
 */
function handleFareCommand(args) {
  if (args.length === 0) {
    return 'Send: FARE <route number> to get fare estimates.\n\nExample: FARE 1';
  }

  const routeNum = parseInt(args[0]);
  if (!isNaN(routeNum) && routeNum > 0 && routeNum <= routes.length) {
    const route = routes[routeNum - 1];
    return `FARE ESTIMATE\n\n` +
           `Route: ${route.name}\n` +
           `Fare Range: ${route.fareRange}\n` +
           `Peak Hours: Higher fares may apply\n` +
           `Off-Peak: Lower end of range\n\n` +
           `Note: Fares vary by vehicle type and time.`;
  }

  return 'Invalid route number. Send ROUTE to see all routes.';
}

/**
 * Handle traffic status requests
 */
function handleTrafficCommand(args) {
  if (args.length === 0) {
    // General traffic status
    let message = 'TRAFFIC STATUS:\n\n';
    
    if (trafficUpdates.length === 0) {
      message += 'No current traffic updates.\n\n';
    } else {
      trafficUpdates.slice(0, 3).forEach(update => {
        message += `${update.route}: ${update.status}\n`;
      });
      message += '\n';
    }
    
    message += 'Send: TRAFFIC <route> for specific route';
    return message;
  }

  // Specific route traffic
  const searchTerm = args.join(' ');
  const route = routes.find(r => 
    r.name.toLowerCase().includes(searchTerm) ||
    String(routes.indexOf(r) + 1) === searchTerm
  );

  if (route) {
    const traffic = trafficUpdates.find(t => 
      t.route.toLowerCase().includes(route.name.toLowerCase())
    );
    
    if (traffic) {
      return `TRAFFIC UPDATE\n\n` +
             `Route: ${route.name}\n` +
             `Status: ${traffic.status}\n` +
             `Updated: ${new Date(traffic.timestamp).toLocaleTimeString()}\n` +
             `Estimated Time: ${route.estimatedTime}`;
    }
    
    return `Route: ${route.name}\n\n` +
           `No traffic data available.\n` +
           `Estimated Time: ${route.estimatedTime}`;
  }

  return 'Route not found. Send ROUTE to see all routes.';
}

/**
 * Handle issue/complaint reports
 */
function handleReportCommand(args, phoneNumber) {
  if (args.length < 3) {
    return 'REPORT FORMAT:\n\n' +
           'REPORT <vehicle> <route> <issue>\n\n' +
           'Example:\n' +
           'REPORT KCA123A 46 overcharging\n\n' +
           'Issues: overcharging, reckless, unsafe, delay';
  }

  const vehicle = args[0].toUpperCase();
  const routeNumber = args[1];
  const issue = args.slice(2).join(' ');

  // Save report to data
  const report = {
    id: reportIdCounter.value++,
    vehicle: vehicle,
    route: routeNumber,
    issue: issue,
    reporter: phoneNumber,
    timestamp: new Date().toISOString(),
    status: 'pending'
  };

  reports.push(report);

  return `REPORT SUBMITTED\n\n` +
         `ID: #${report.id}\n` +
         `Vehicle: ${vehicle}\n` +
         `Route: ${routeNumber}\n` +
         `Issue: ${issue}\n\n` +
         `Thank you for helping improve commuter safety!`;
}

/**
 * Get help message with available commands
 */
function getHelpMessage() {
  return `NAIROBI COMMUTER INFO\n\n` +
         `Commands:\n` +
         `• ROUTE - View all routes\n` +
         `• ROUTE <num> - Route details\n` +
         `• FARE <num> - Fare estimate\n` +
         `• TRAFFIC - Traffic status\n` +
         `• REPORT <vehicle> <route> <issue>\n` +
         `• HELP - Show this message\n\n` +
         `Example: ROUTE 1`;
}

/**
 * Format route information for SMS
 */
function formatRouteInfo(route) {
  return `ROUTE INFO\n\n` +
         `${route.name}\n` +
         `From: ${route.from}\n` +
         `To: ${route.to}\n` +
         `Fare: ${route.fareRange}\n` +
         `Time: ${route.estimatedTime}\n` +
         `Distance: ${route.distance}`;
}

module.exports = { 
  handleSMS,
  sendSMS,
  COMMANDS 
};
