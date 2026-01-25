import { Router } from "express";
import {
  adminSignup,
  adminLogin,
  getAdminProfile,
  updateAdminProfile,
} from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.post("/signup", adminSignup);
router.post("/login", adminLogin);
router.get("/profile", authMiddleware, getAdminProfile);
router.put("/profile/update", authMiddleware, updateAdminProfile);

export default router;
