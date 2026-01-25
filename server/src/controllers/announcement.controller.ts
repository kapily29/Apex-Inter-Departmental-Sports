import { Response } from "express";
import { Announcement } from "../models/Announcement";
import { AuthRequest } from "../middlewares/auth";

export const getAllAnnouncements = async (req: AuthRequest, res: Response) => {
  try {
    const announcements = await Announcement.find().sort({ date: -1 });
    res.status(200).json({ announcements });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAnnouncementById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found" });
    }
    res.status(200).json({ announcement });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const announcement = await Announcement.create({
      title,
      description,
      priority: priority || "medium",
    });

    res.status(201).json({ message: "Announcement created successfully", announcement });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const announcement = await Announcement.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    res.status(200).json({ message: "Announcement updated successfully", announcement });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findByIdAndDelete(id);
    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
