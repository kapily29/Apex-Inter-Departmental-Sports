import { Router } from "express";
import {
  adminLogin,
  getAdminProfile,
  updateAdminProfile,
  getAllCaptains,
  updateCaptainStatus,
  updateCaptain,
  deleteCaptain,
  getAllDepartmentPlayers,
  updateDepartmentPlayerStatus,
  updateDepartmentPlayer,
  deleteDepartmentPlayer,
} from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

// Admin routes - signup removed for security (admin already created)
router.post("/login", adminLogin);
router.get("/profile", authMiddleware, getAdminProfile);
router.put("/profile/update", authMiddleware, updateAdminProfile);

// Captain management routes
router.get("/captains", authMiddleware, getAllCaptains);
router.put("/captains/:id/status", authMiddleware, updateCaptainStatus);
router.put("/captains/:id", authMiddleware, updateCaptain);
router.delete("/captains/:id", authMiddleware, deleteCaptain);

// Department Player management routes
router.get("/department-players", authMiddleware, getAllDepartmentPlayers);
router.put("/department-players/:id/status", authMiddleware, updateDepartmentPlayerStatus);
router.put("/department-players/:id", authMiddleware, updateDepartmentPlayer);
router.delete("/department-players/:id", authMiddleware, deleteDepartmentPlayer);

export default router;
