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
app.use(cors());

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/gallery", galleryRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "API is running" });
});

export default app;
