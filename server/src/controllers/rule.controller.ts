import { Response } from "express";
import { Rule } from "../models/Rule";
import { AuthRequest } from "../middlewares/auth";

export const getAllRules = async (req: AuthRequest, res: Response) => {
  try {
    const { sport, category } = req.query;
    const filter: any = {};
    if (sport && sport !== "All") filter.sport = sport;
    if (category && category !== "All") filter.category = category;

    const rules = await Rule.find(filter).sort({ sport: 1, category: 1, order: 1 });
    res.status(200).json({ rules });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getRuleById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const rule = await Rule.findById(id);
    if (!rule) {
      return res.status(404).json({ error: "Rule not found" });
    }
    res.status(200).json({ rule });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createRule = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, sport, category, order } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required" });
    }

    const rule = await Rule.create({
      title,
      description,
      sport: sport || "General",
      category: category || "General Rules",
      order: order || 0,
    });

    res.status(201).json({ message: "Rule created successfully", rule });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateRule = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const rule = await Rule.findByIdAndUpdate(id, updates, { new: true });
    if (!rule) {
      return res.status(404).json({ error: "Rule not found" });
    }

    res.status(200).json({ message: "Rule updated successfully", rule });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteRule = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const rule = await Rule.findByIdAndDelete(id);
    if (!rule) {
      return res.status(404).json({ error: "Rule not found" });
    }

    res.status(200).json({ message: "Rule deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
