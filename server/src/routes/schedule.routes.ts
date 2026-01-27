import { Router } from "express";
import {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../controllers/schedule.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.get("/", getAllSchedules);
router.get("/:id", getScheduleById);
router.post("/", authMiddleware, createSchedule);
router.put("/:id", authMiddleware, updateSchedule);
router.delete("/:id", authMiddleware, deleteSchedule);

export default router;
