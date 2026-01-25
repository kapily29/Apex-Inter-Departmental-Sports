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

// CORS configuration for production
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
  /\.vercel\.app$/,
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      // Check if origin is allowed
      const isAllowed = allowedOrigins.some((allowed) => {
        if (allowed instanceof RegExp) return allowed.test(origin);
        return allowed === origin;
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all in development
      }
    },
    credentials: true,
  })
);

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
