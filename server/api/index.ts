import "dotenv/config";
import app from "../src/app";
import connectDB from "../src/config/db";

// Connect to database
let isConnected = false;

const connectOnce = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

connectOnce();

// Export for Vercel serverless
export default app;
