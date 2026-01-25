import "dotenv/config";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import app from "../src/app";

// MongoDB connection for serverless
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/apexsports";

// Connect to MongoDB with caching for serverless
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Handler wrapper for Vercel
const handler = async (req: Request, res: Response) => {
  await connectDB();
  return app(req, res);
};

export default handler;
