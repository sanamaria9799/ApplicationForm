const rateLimit = require('express-rate-limit');

/**
 * General API Rate Limiter:
 * Allows up to 200 requests per 15-minute window per IP.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true, // Return standard RateLimit headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  message: {
    success: false,
    message: 'Too many requests from this IP address. Please try again after 15 minutes.',
  },
});

/**
 * More restrictive rate limiter for write/mutation endpoints (POST, PUT, DELETE)
 */
const mutationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many modifications from this IP. Please slow down and try again later.',
  },
});

module.exports = {
  apiLimiter,
  mutationLimiter,
};
