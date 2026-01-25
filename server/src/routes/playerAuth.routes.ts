import { Router } from "express";
import {
  registerPlayer,
  loginPlayer,
  verifyPlayer,
  getPlayerProfile,
  updatePlayerProfile,
} from "../controllers/playerAuth.controller";
import { playerAuthMiddleware } from "../middlewares/playerAuth";

const router = Router();

// Public routes
router.post("/register", registerPlayer);
router.post("/login", loginPlayer);
router.post("/verify", verifyPlayer);

// Protected routes
router.get("/profile", playerAuthMiddleware, getPlayerProfile);
router.put("/profile", playerAuthMiddleware, updatePlayerProfile);

export default router;
