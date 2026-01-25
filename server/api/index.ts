import "dotenv/config";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import adminRoutes from "../src/routes/admin.routes";
import teamRoutes from "../src/routes/team.routes";
import matchRoutes from "../src/routes/match.routes";
import playerRoutes from "../src/routes/player.routes";
import announcementRoutes from "../src/routes/announcement.routes";
import galleryRoutes from "../src/routes/gallery.routes";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection cache
let cachedDb: typeof mongoose | null = null;

async function connectDB() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }
  
  const MONGO_URI = process.env.MONGO_URI || "";
  cachedDb = await mongoose.connect(MONGO_URI);
  return cachedDb;
}

// Routes
app.get("/", (_req, res) => {
  res.json({ message: "Apex Sports API is running!", version: "1.0.0" });
});

app.get("/health", (_req, res) => {
  res.json({ status: "API is running" });
});

// API routes with DB connection
app.use("/api/admin", async (req, res, next) => {
  await connectDB();
  next();
}, adminRoutes);

app.use("/api/teams", async (req, res, next) => {
  await connectDB();
  next();
}, teamRoutes);

app.use("/api/matches", async (req, res, next) => {
  await connectDB();
  next();
}, matchRoutes);

app.use("/api/players", async (req, res, next) => {
  await connectDB();
  next();
}, playerRoutes);

app.use("/api/announcements", async (req, res, next) => {
  await connectDB();
  next();
}, announcementRoutes);

app.use("/api/gallery", async (req, res, next) => {
  await connectDB();
  next();
}, galleryRoutes);

// Without /api prefix
app.use("/admin", async (req, res, next) => {
  await connectDB();
  next();
}, adminRoutes);

app.use("/teams", async (req, res, next) => {
  await connectDB();
  next();
}, teamRoutes);

app.use("/matches", async (req, res, next) => {
  await connectDB();
  next();
}, matchRoutes);

app.use("/players", async (req, res, next) => {
  await connectDB();
  next();
}, playerRoutes);

app.use("/announcements", async (req, res, next) => {
  await connectDB();
  next();
}, announcementRoutes);

app.use("/gallery", async (req, res, next) => {
  await connectDB();
  next();
}, galleryRoutes);

export default app;
