import "dotenv/config";
import mongoose from "mongoose";
import app from "../src/app";

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "";

if (MONGO_URI && mongoose.connection.readyState === 0) {
  mongoose.connect(MONGO_URI).catch(console.error);
}

export default app;
