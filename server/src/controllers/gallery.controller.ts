import { Response } from "express";
import { Gallery } from "../models/Gallery";
import { AuthRequest } from "../middlewares/auth";

export const getAllGalleryItems = async (req: AuthRequest, res: Response) => {
  try {
    const { category } = req.query;
    const filter = category && category !== "All" ? { category } : {};
    const items = await Gallery.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ gallery: items });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getGalleryItemById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const item = await Gallery.findById(id);
    if (!item) {
      return res.status(404).json({ error: "Gallery item not found" });
    }
    res.status(200).json({ item });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createGalleryItem = async (req: AuthRequest, res: Response) => {
  try {
    const { title, imageUrl, category, description } = req.body;

    if (!title || !imageUrl || !category) {
      return res.status(400).json({ error: "Title, image URL, and category are required" });
    }

    const item = await Gallery.create({
      title,
      imageUrl,
      category,
      description,
      uploadedBy: req.admin?.id,
    });

    res.status(201).json({ message: "Gallery item created successfully", item });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateGalleryItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const item = await Gallery.findByIdAndUpdate(id, updates, { new: true });
    if (!item) {
      return res.status(404).json({ error: "Gallery item not found" });
    }

    res.status(200).json({ message: "Gallery item updated successfully", item });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteGalleryItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const item = await Gallery.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ error: "Gallery item not found" });
    }

    res.status(200).json({ message: "Gallery item deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
