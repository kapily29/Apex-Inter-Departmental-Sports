import { Response } from "express";
import { Player } from "../models/Player";
import { AuthRequest } from "../middlewares/auth";

export const getAllPlayers = async (req: AuthRequest, res: Response) => {
  try {
    const { team, status } = req.query;
    const filter: any = {};
    if (team) filter.team = team;
    if (status) filter.status = status;

    const players = await Player.find(filter).populate("team");
    res.status(200).json({ players });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPlayerById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const player = await Player.findById(id).populate("team");
    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }
    res.status(200).json({ player });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createPlayer = async (req: AuthRequest, res: Response) => {
  try {
    const { name, team, department, position, number, status } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const player = await Player.create({
      name,
      team,
      department,
      position,
      number,
      status: status || "pending",
    });

    res.status(201).json({ message: "Player created successfully", player });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePlayer = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const player = await Player.findByIdAndUpdate(id, updates, { new: true }).populate("team");
    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    res.status(200).json({ message: "Player updated successfully", player });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const approvePlayer = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const player = await Player.findByIdAndUpdate(id, { status: "approved" }, { new: true }).populate(
      "team"
    );
    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    res.status(200).json({ message: "Player approved successfully", player });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePlayer = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const player = await Player.findByIdAndDelete(id);
    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    res.status(200).json({ message: "Player deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
