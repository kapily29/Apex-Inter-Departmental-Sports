import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/apexsports";

// Admin Schema (inline to avoid import issues)
const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "admin", enum: ["admin", "super_admin"] },
    profileImage: { type: String, default: null },
    firstName: String,
    lastName: String,
    phone: String,
    bio: String,
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: "admin" });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists!");
      console.log("Username: admin");
      process.exit(0);
    }

    // Create admin
    const hashedPassword = await bcrypt.hash("Admin@123", 10);
    const admin = await Admin.create({
      username: "admin",
      email: "admin@apexsports.com",
      password: hashedPassword,
      role: "super_admin",
      firstName: "Super",
      lastName: "Admin",
    });

    console.log("✅ Admin created successfully!");
    console.log("================================");
    console.log("🔐 LOGIN CREDENTIALS:");
    console.log("   Username: admin");
    console.log("   Password: Admin@123");
    console.log("   Email: admin@apexsports.com");
    console.log("================================");
    console.log("⚠️ IMPORTANT: Change this password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
