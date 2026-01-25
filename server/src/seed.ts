import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Admin } from "./models/Admin";
import { Team } from "./models/Team";

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/apexsports";
    await mongoose.connect(mongoUri);

    // Clear existing data
    await Admin.deleteMany({});
    await Team.deleteMany({});

    // Create default admin
    const hashedPassword = await bcrypt.hash("apexsportsadmin@123", 10);
    const adminUser = await Admin.create({
      username: "apexsportsadmin",
      password: hashedPassword,
      email: "admin@apexsports.edu",
      role: "super_admin",
    });

    // Create sample teams
    const teams = await Team.insertMany([
      {
        name: "Mavericks",
        sport: "Basketball",
        record: "8-3",
        wins: "3m",
        standings: "1st",
        coach: "John Smith",
      },
      {
        name: "Falcons",
        sport: "Soccer",
        record: "6-4-1",
        wins: "2m",
        standings: "1st",
        coach: "Sarah Johnson",
      },
      {
        name: "Titans",
        sport: "Baseball",
        record: "6-4",
        wins: "2m",
        standings: "1st",
        coach: "Mike Davis",
      },
      {
        name: "Panthers",
        sport: "Basketball",
        record: "7-4",
        wins: "4th",
        standings: "Standings",
        coach: "Tom Wilson",
      },
      {
        name: "Cougars",
        sport: "Soccer",
        record: "5-6-1",
        wins: "5th",
        standings: "Standings",
        coach: "Emma White",
      },
      {
        name: "Eagles",
        sport: "Baseball",
        record: "4-8",
        wins: "6th",
        standings: "Standings",
        coach: "Robert Brown",
      },
    ]);

    console.log("✅ Database seeded successfully!");
    console.log("Admin credentials:");
    console.log("Username: apexsportsadmin");
    console.log("Password: apexsportsadmin@123");
    console.log("Email: admin@apexsports.edu");
    console.log(`\n✅ Created ${teams.length} teams`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
