import "dotenv/config";
import mongoose from "mongoose";
import app from "../src/app";

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "";

// Connect immediately
mongoose.connect(MONGO_URI).catch((err) => console.error("MongoDB error:", err));

export default app;
