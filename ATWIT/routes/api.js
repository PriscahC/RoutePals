// routes/api.js - API routes for Nairobi Commuter Info

const express = require('express');
const router = express.Router();
const { routes, reports, reportIdCounter, trafficUpdates, stats } = require('../data/routesData');
const { handleSMS } = require('../handlers/smsHandler');

// Get all routes
router.get('/routes', (req, res) => {
  try {
    res.json({
      success: true,
      count: routes.length,
      data: routes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch routes'
    });
  }
});

// Get single route by ID
router.get('/routes/:id', (req, res) => {
  try {
    const route = routes.find(r => r.id === parseInt(req.params.id));
    if (!route) {
      return res.status(404).json({
        success: false,
        error: 'Route not found'
      });
    }
    res.json({
      success: true,
      data: route
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch route'
    });
  }
});

// Search routes
router.get('/routes/search/:query', (req, res) => {
  try {
    const query = req.params.query.toLowerCase();
    const filteredRoutes = routes.filter(r => 
      r.name.toLowerCase().includes(query) ||
      r.from.toLowerCase().includes(query) ||
      r.to.toLowerCase().includes(query)
    );
    res.json({
      success: true,
      count: filteredRoutes.length,
      data: filteredRoutes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to search routes'
    });
  }
});

// Get traffic updates
router.get('/traffic', (req, res) => {
  try {
    res.json({
      success: true,
      count: trafficUpdates.length,
      data: trafficUpdates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch traffic updates'
    });
  }
});

// Get statistics
router.get('/stats', (req, res) => {
  try {
    // Update stats
    stats.totalRoutes = routes.length;
    stats.totalReports = reports.length;
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
});

// Get all reports
router.get('/reports', (req, res) => {
  try {
    res.json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reports'
    });
  }
});

// Submit a new report
router.post('/reports', (req, res) => {
  try {
    const { type, vehicle, route, description, phoneNumber } = req.body;
    
    if (!type || !vehicle || !route) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const newReport = {
      id: reportIdCounter++,
      type,
      vehicle,
      route,
      description: description || '',
      phoneNumber: phoneNumber || 'Anonymous',
      status: 'pending',
      timestamp: new Date().toISOString()
    };

    reports.push(newReport);
    stats.totalReports = reports.length;

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully',
      data: newReport
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to submit report'
    });
  }
});

// Update report status
router.patch('/reports/:id', (req, res) => {
  try {
    const reportId = parseInt(req.params.id);
    const { status } = req.body;
    
    const reportIndex = reports.findIndex(r => r.id === reportId);
    
    if (reportIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    reports[reportIndex].status = status || reports[reportIndex].status;
    reports[reportIndex].updatedAt = new Date().toISOString();

    res.json({
      success: true,
      message: 'Report updated successfully',
      data: reports[reportIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update report'
    });
  }
});

// Get fare estimate
router.post('/fare-estimate', (req, res) => {
  try {
    const { from, to } = req.body;
    
    const route = routes.find(r => 
      r.from.toLowerCase() === from.toLowerCase() && 
      r.to.toLowerCase() === to.toLowerCase()
    );

    if (!route) {
      return res.status(404).json({
        success: false,
        error: 'Route not found',
        suggestion: 'Try searching for available routes'
      });
    }

    res.json({
      success: true,
      data: {
        route: route.name,
        fareRange: `KES ${route.fare.min} - ${route.fare.max}`,
        estimatedTime: `${route.estimatedTime.min} - ${route.estimatedTime.max} mins`,
        distance: route.distance,
        trafficStatus: route.trafficStatus
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to calculate fare estimate'
    });
  }
});

// SMS webhook endpoint
router.post('/sms', handleSMS);

module.exports = router;
