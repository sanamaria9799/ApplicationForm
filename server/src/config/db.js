const mongoose = require('mongoose');

let isConnected = false;

/**
 * Connect to MongoDB Atlas or local MongoDB instance
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('\n⚠️  [DATABASE WARNING]: MONGODB_URI is not defined in environment variables.');
    console.warn('   The server will start, but MongoDB operations will require a valid Atlas connection string.');
    console.warn('   Please copy server/.env.example to server/.env and fill in MONGODB_URI.\n');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
    });

    isConnected = true;
    console.log(`✅ [MongoDB Atlas Connected]: ${conn.connection.host} / Database: ${conn.connection.name}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.error(`❌ [MongoDB Connection Error]: ${error.message}`);
    console.warn('   Ensure your MongoDB Atlas network access allows your current IP (or 0.0.0.0/0).');
    return false;
  }
};

const getDbStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  const stateCode = mongoose.connection.readyState;
  return {
    state: states[stateCode] || 'unknown',
    connected: stateCode === 1,
  };
};

module.exports = {
  connectDB,
  getDbStatus,
};
