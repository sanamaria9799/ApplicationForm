const express = require('express');
const {
  getApplications,
  getApplicationStats,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  seedApplications,
} = require('../controllers/applicationController');
const { applicationValidationRules, validate } = require('../middleware/validator');
const { apiLimiter, mutationLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Apply general rate limiter to reading endpoints
router.get('/', apiLimiter, getApplications);
router.get('/stats', apiLimiter, getApplicationStats);
router.get('/:id', apiLimiter, getApplicationById);

// Apply mutation rate limiter and validation to write endpoints
router.post('/', mutationLimiter, applicationValidationRules, validate, createApplication);
router.put('/:id', mutationLimiter, applicationValidationRules, validate, updateApplication);
router.delete('/:id', mutationLimiter, deleteApplication);

// Quick seed route for demonstration
router.post('/seed', mutationLimiter, seedApplications);

module.exports = router;
