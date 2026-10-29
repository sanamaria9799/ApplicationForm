const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const healthRoutes = require('./routes/healthRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

// 1. Security Headers via Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// 2. Restricted CORS Configuration
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Default development origins
if (process.env.NODE_ENV !== 'production') {
  if (!allowedOrigins.includes('http://localhost:5173')) allowedOrigins.push('http://localhost:5173');
  if (!allowedOrigins.includes('http://localhost:3000')) allowedOrigins.push('http://localhost:3000');
  if (!allowedOrigins.includes('http://127.0.0.1:5173')) allowedOrigins.push('http://127.0.0.1:5173');
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. curl, server-to-server, postman) or matching origins
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      console.warn(`[CORS Blocked]: Request from unapproved origin: ${origin}`);
      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// 3. JSON & URL-encoded request body parsing with size limits (10kb prevents payload bloat/DoS)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 4. API Routes
app.use('/api', healthRoutes);
app.use('/api/applications', applicationRoutes);

// Root route friendly welcome
app.get('/', (req, res) => {
  res.json({
    service: 'ApplyFlow Backend API',
    status: 'Running',
    documentation: 'See README.md for endpoint specifications',
    healthCheck: '/api/health',
    endpoints: {
      applications: '/api/applications',
      dashboardStats: '/api/applications/stats',
      seedDemoData: 'POST /api/applications/seed',
    },
  });
});

// 5. 404 Handler & Centralized Error Handler
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
