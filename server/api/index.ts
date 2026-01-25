import "dotenv/config";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import adminRoutes from "../src/routes/admin.routes";
import teamRoutes from "../src/routes/team.routes";
import matchRoutes from "../src/routes/match.routes";
import playerRoutes from "../src/routes/player.routes";
import playerAuthRoutes from "../src/routes/playerAuth.routes";
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

// DB middleware
const dbMiddleware = async (_req: express.Request, _res: express.Response, next: express.NextFunction) => {
  await connectDB();
  next();
};

// Health routes
app.get("/", (_req, res) => res.json({ message: "Apex Sports API", version: "1.0.0" }));
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Routes
app.use("/admin", dbMiddleware, adminRoutes);
app.use("/teams", dbMiddleware, teamRoutes);
app.use("/matches", dbMiddleware, matchRoutes);
app.use("/players", dbMiddleware, playerRoutes);
app.use("/player-auth", dbMiddleware, playerAuthRoutes);
app.use("/announcements", dbMiddleware, announcementRoutes);
app.use("/gallery", dbMiddleware, galleryRoutes);

export default app;
