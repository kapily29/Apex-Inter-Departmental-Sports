import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/apexsports";
    await mongoose.connect(mongoUri);
  } catch (error) {
    process.exit(1);
  }
};

export default dbConnection;
