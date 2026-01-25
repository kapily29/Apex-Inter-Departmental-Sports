import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/apexsports";
    
    if (mongoose.connection.readyState >= 1) {
      console.log("MongoDB already connected");
      return;
    }
    
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // Don't exit in serverless environment
    throw error;
  }
};

export default dbConnection;
