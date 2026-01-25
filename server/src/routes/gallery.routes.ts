import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import {
  getAllGalleryItems,
  getGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from "../controllers/gallery.controller";

const router = Router();

// Public routes
router.get("/", getAllGalleryItems);
router.get("/:id", getGalleryItemById);

// Protected routes (admin only)
router.post("/", authMiddleware, createGalleryItem);
router.put("/:id", authMiddleware, updateGalleryItem);
router.delete("/:id", authMiddleware, deleteGalleryItem);

export default router;
