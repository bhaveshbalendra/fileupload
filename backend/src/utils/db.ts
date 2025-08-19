import mongoose from "mongoose";
import { Env } from "../config/env.config";
import logger from "./logger";

// MongoDB connection
const connectDB = async () => {
  const DB_URI = Env.MONGODB_URI;
  if (!DB_URI) {
    throw new Error("Database URI is not defined in environment variables.");
  }
  try {
    await mongoose.connect(DB_URI);
    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error("MongoDB connection failed", error);
  }
};

// MongoDB disconnection
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    logger.info("MongoDB disconnected successfully");
  } catch (error) {
    logger.error("MongoDB disconnection failed", error);
  }
};

export { connectDB, disconnectDB };
