import { Router } from "express";
import {
  adminLogin,
  getAdminProfile,
  updateAdminProfile,
} from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

// Admin routes - signup removed for security (admin already created)
router.post("/login", adminLogin);
router.get("/profile", authMiddleware, getAdminProfile);
router.put("/profile/update", authMiddleware, updateAdminProfile);

export default router;
