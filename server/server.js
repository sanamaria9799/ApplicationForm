const dotenv = require('dotenv');
// Load environment variables before anything else
dotenv.config();

const app = require('./src/app');
const { connectDB } = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// Initialize Database connection and start server
const startServer = async () => {
  // Connect to MongoDB Atlas
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 ApplyFlow API Server running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📁 Applications API: http://localhost:${PORT}/api/applications`);
    console.log(`======================================================\n`);
  });

  // Graceful shutdown handling
  const shutdown = () => {
    console.log('\nReceived shutdown signal. Closing HTTP server gracefully...');
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer();
