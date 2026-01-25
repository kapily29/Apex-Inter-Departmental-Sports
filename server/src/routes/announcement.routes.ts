import { Router } from "express";
import {
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcement.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.get("/", getAllAnnouncements);
router.get("/:id", getAnnouncementById);
router.post("/", authMiddleware, createAnnouncement);
router.put("/:id", authMiddleware, updateAnnouncement);
router.delete("/:id", authMiddleware, deleteAnnouncement);

export default router;
