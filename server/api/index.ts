import "dotenv/config";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import adminRoutes from "../src/routes/admin.routes";
import teamRoutes from "../src/routes/team.routes";
import matchRoutes from "../src/routes/match.routes";
import playerRoutes from "../src/routes/player.routes";
import playerAuthRoutes from "../src/routes/playerAuth.routes";
import captainAuthRoutes from "../src/routes/captainAuth.routes";
import announcementRoutes from "../src/routes/announcement.routes";
import galleryRoutes from "../src/routes/gallery.routes";
import scheduleRoutes from "../src/routes/schedule.routes";
import ruleRoutes from "../src/routes/rule.routes";

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

// DB middleware
const dbMiddleware = async (_req: express.Request, _res: express.Response, next: express.NextFunction) => {
  await connectDB();
  next();
};

// Health routes
app.get("/", (_req, res) => res.json({ message: "Apex Sports API", version: "1.0.0" }));
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.get("/api", (_req, res) => res.json({ message: "Apex Sports API", status: "online" }));

// Routes with /api prefix (matching frontend expectations)
app.use("/api/admin", dbMiddleware, adminRoutes);
app.use("/api/teams", dbMiddleware, teamRoutes);
app.use("/api/matches", dbMiddleware, matchRoutes);
app.use("/api/players", dbMiddleware, playerRoutes);
app.use("/api/player-auth", dbMiddleware, playerAuthRoutes);
app.use("/api/captain-auth", dbMiddleware, captainAuthRoutes);
app.use("/api/announcements", dbMiddleware, announcementRoutes);
app.use("/api/gallery", dbMiddleware, galleryRoutes);
app.use("/api/schedules", dbMiddleware, scheduleRoutes);
app.use("/api/rules", dbMiddleware, ruleRoutes);

export default app;
