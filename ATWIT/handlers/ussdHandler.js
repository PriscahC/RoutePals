// USSD Handler for Nairobi Commuter Info System

// Sample data for Nairobi routes
const routes = {
  '1': { name: 'CBD - Westlands', fare: 'KES 50-80', time: '20-30 mins' },
  '2': { name: 'CBD - Eastlands', fare: 'KES 50-70', time: '30-45 mins' },
  '3': { name: 'CBD - South B/C', fare: 'KES 60-100', time: '25-40 mins' },
  '4': { name: 'CBD - Ngong Road', fare: 'KES 50-80', time: '20-35 mins' },
  '5': { name: 'CBD - Thika Road', fare: 'KES 50-100', time: '30-60 mins' }
};

// Traffic status
const trafficStatus = {
  '1': 'Light traffic',
  '2': 'Moderate traffic',
  '3': 'Heavy traffic'
};

// Session storage (in production, use Redis or a database)
const sessions = {};

function handleUSSD(req, res) {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;

  let response = '';

  if (!text) {
    // First interaction - Main menu
    response = `CON Welcome to Nairobi Commuter Info
1. Route Information
2. Fare Estimates
3. Traffic Updates
4. Report Issue`;
  } else {
    const textArray = text.split('*');
    const level = textArray.length;
    const userInput = textArray[textArray.length - 1];

    if (level === 1) {
      // First level menu selection
      if (userInput === '1') {
        response = `CON Select a route:
1. CBD - Westlands
2. CBD - Eastlands
3. CBD - South B/C
4. CBD - Ngong Road
5. CBD - Thika Road`;
      } else if (userInput === '2') {
        response = `CON Select route for fare estimate:
1. CBD - Westlands
2. CBD - Eastlands
3. CBD - South B/C
4. CBD - Ngong Road
5. CBD - Thika Road`;
      } else if (userInput === '3') {
        response = `CON Current Traffic Status:
1. Westlands Route - Light
2. Eastlands Route - Moderate
3. Ngong Road - Heavy
0. Back to Main Menu`;
      } else if (userInput === '4') {
        response = `CON Report an issue:
1. Overcharging
2. Reckless Driving
3. Route Change
4. Vehicle Condition
0. Back to Main Menu`;
      } else {
        response = 'END Invalid option. Please try again.';
      }
    } else if (level === 2) {
      // Second level - specific route selection
      const firstChoice = textArray[0];
      
      if (firstChoice === '1' || firstChoice === '2') {
        // Route info or fare estimate
        if (routes[userInput]) {
          const route = routes[userInput];
          if (firstChoice === '1') {
            response = `END Route: ${route.name}
Estimated Time: ${route.time}
Typical Fare: ${route.fare}

Safe travels!`;
          } else {
            response = `END Fare Estimate
Route: ${route.name}
Fare Range: ${route.fare}

Note: Fares may vary by time of day`;
          }
        } else {
          response = 'END Invalid route selection.';
        }
      } else if (firstChoice === '3') {
        // Traffic updates
        if (userInput === '0') {
          response = `CON Welcome to Nairobi Commuter Info
1. Route Information
2. Fare Estimates
3. Traffic Updates
4. Report Issue`;
        } else {
          response = 'END Thank you for checking traffic status.';
        }
      } else if (firstChoice === '4') {
        // Issue reporting
        if (userInput === '0') {
          response = `CON Welcome to Nairobi Commuter Info
1. Route Information
2. Fare Estimates
3. Traffic Updates
4. Report Issue`;
        } else {
          response = 'CON Enter vehicle registration number:';
        }
      }
    } else if (level === 3) {
      // Third level - issue reporting details
      const firstChoice = textArray[0];
      
      if (firstChoice === '4') {
        // Save the vehicle registration
        sessions[sessionId] = { vehicle: userInput };
        response = 'CON Enter route number (e.g., 46):';
      }
    } else if (level === 4) {
      // Fourth level - final submission
      const firstChoice = textArray[0];
      
      if (firstChoice === '4') {
        response = `END Report submitted successfully!
Vehicle: ${sessions[sessionId]?.vehicle}
Route: ${userInput}

Thank you for helping improve commuter safety.`;
        delete sessions[sessionId]; // Clean up session
      }
    }
  }

  // Send response back
  res.set('Content-Type', 'text/plain');
  res.send(response);
}

module.exports = { handleUSSD };
