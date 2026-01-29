// server.js - Main server file for Nairobi Commuter Info USSD/SMS System
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { handleUSSD } = require('./handlers/ussdHandler');
const { handleSMS } = require('./handlers/smsHandler');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - ORDER MATTERS!
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS middleware (important for ngrok)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Body:', req.body);
  next();
});

// Health check endpoint - BEFORE static files
app.get('/', (req, res) => {
  res.json({ 
    status: 'running', 
    service: 'Nairobi Commuter Info USSD/SMS',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      dashboard: '/dashboard.html',
      api: '/api/routes',
      ussd: '/ussd',
      sms: '/sms',
      test: '/test-ussd'
    }
  });
});

// USSD endpoint - MUST be before static files
app.post('/ussd', (req, res) => {
  console.log('\n=== USSD REQUEST RECEIVED ===');
  console.log('Body:', req.body);
  console.log('Headers:', req.headers);
  handleUSSD(req, res);
});

// SMS endpoint - Africa's Talking SMS callback
app.post('/sms', (req, res) => {
  console.log('\n=== SMS REQUEST RECEIVED ===');
  console.log('Body:', req.body);
  console.log('Headers:', req.headers);
  handleSMS(req, res);
});

// Test endpoint to simulate USSD interaction
app.post('/test-ussd', (req, res) => {
  console.log('\n=== TEST USSD REQUEST ===');
  console.log('Body:', req.body);
  handleUSSD(req, res);
});

// API Routes
app.use('/api', apiRoutes);

// Serve static files from public directory - AFTER API routes
app.use(express.static(path.join(__dirname, 'public')));

// 404 handler
app.use((req, res, next) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method,
    availableEndpoints: ['/ussd', '/sms', '/api/routes', '/dashboard.html']
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚍 Nairobi Commuter Info USSD/SMS Server`);
  console.log(`${'='.repeat(60)}`);
  console.log(`📱 Server running on port ${PORT}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
  console.log(`\n📊 Dashboard: http://localhost:${PORT}/dashboard.html`);
  console.log(`🔌 API: http://localhost:${PORT}/api/routes`);
  console.log(`📞 USSD endpoint: http://localhost:${PORT}/ussd`);
  console.log(`💬 SMS endpoint: http://localhost:${PORT}/sms`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/test-ussd`);
  console.log(`${'='.repeat(60)}\n`);
  console.log('✅ Server is ready to receive requests!');
  console.log('Waiting for USSD/SMS requests...\n');
});

module.exports = app;