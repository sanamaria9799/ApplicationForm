const express = require('express');
const { getDbStatus } = require('../config/db');

const router = express.Router();

/**
 * @desc   System health check endpoint
 * @route  GET /api/health
 */
router.get('/health', (req, res) => {
  const dbStatus = getDbStatus();

  res.status(200).json({
    status: 'healthy',
    service: 'ApplyFlow Backend API',
    version: '1.0.0',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    database: {
      provider: 'MongoDB Atlas',
      status: dbStatus.state,
      connected: dbStatus.connected,
    },
    environment: process.env.NODE_ENV || 'development',
  });
});

module.exports = router;
