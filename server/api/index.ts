import "dotenv/config";
import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import app from "../src/app";

// MongoDB connection with caching for serverless
const MONGO_URI = process.env.MONGO_URI || "";

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }
  
  try {
    await mongoose.connect(MONGO_URI, {
      bufferCommands: false,
    });
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

// Middleware to ensure DB connection before handling requests
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

export default app;
