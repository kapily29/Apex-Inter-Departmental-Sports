import express from "express";
import cors from "cors";
import adminRoutes from "./routes/admin.routes";
import teamRoutes from "./routes/team.routes";
import matchRoutes from "./routes/match.routes";
import playerRoutes from "./routes/player.routes";
import announcementRoutes from "./routes/announcement.routes";
import galleryRoutes from "./routes/gallery.routes";

const app = express();

// Middleware
app.use(express.json());

// CORS configuration - Allow all origins
app.use(cors());

// Routes with /api prefix
app.use("/api/admin", adminRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/gallery", galleryRoutes);



// Root route
app.get("/", (_req, res) => {
  res.status(200).json({ message: "Apex Sports API is running!", version: "1.0.0" });
});

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "API is running" });
});

// API root
app.get("/api", (_req, res) => {
  res.status(200).json({ message: "Apex Sports API", status: "online" });
});

export default app;
