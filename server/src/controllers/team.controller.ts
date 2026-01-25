import { Response } from "express";
import { Team } from "../models/Team";
import { AuthRequest } from "../middlewares/auth";

export const getAllTeams = async (req: AuthRequest, res: Response) => {
  try {
    const { sport } = req.query;
    const filter = sport ? { sport } : {};
    const teams = await Team.find(filter);
    res.status(200).json({ teams });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTeamById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }
    res.status(200).json({ team });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createTeam = async (req: AuthRequest, res: Response) => {
  try {
    const { name, sport, department, record, wins, standings, coach, imageUrl } = req.body;

    if (!name || !sport || !department) {
      return res.status(400).json({ error: "Name, sport, and department are required" });
    }

    const team = await Team.create({
      name,
      sport,
      department,
      record,
      wins,
      standings,
      coach,
      imageUrl,
    });

    res.status(201).json({ message: "Team created successfully", team });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTeam = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const team = await Team.findByIdAndUpdate(id, updates, { new: true });
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.status(200).json({ message: "Team updated successfully", team });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTeam = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const team = await Team.findByIdAndDelete(id);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.status(200).json({ message: "Team deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
