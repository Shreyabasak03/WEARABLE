const mongoose = require("mongoose");

let cachedConnection = null;

const connectDB = async () => {
  try {
    // Already connected
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    // Reuse cached connection
    if (cachedConnection) {
      return cachedConnection;
    }

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }

    cachedConnection = mongoose.connect(
      process.env.MONGO_URI
    );

    const connection = await cachedConnection;

    console.log(
      `MongoDB connected: ${connection.connection.name}`
    );

    return connection;

  } catch (error) {
    cachedConnection = null;

    console.error(
      "MongoDB connection error:",
      error
    );

    throw error;
  }
};

module.exports = connectDB;