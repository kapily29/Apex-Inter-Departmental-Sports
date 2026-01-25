import { Response } from "express";
import { Player } from "../models/Player";
import { AuthRequest } from "../middlewares/auth";
import bcrypt from "bcryptjs";

// Generate unique player ID
function generateUniqueId(rNumber: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  const rPart = rNumber ? rNumber.slice(-4) : Math.random().toString(36).substring(2, 6).toUpperCase();
  return `APX-${rPart}-${random}${timestamp.slice(-2)}`.toUpperCase();
}

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
    const { name, email, rNumber, phone, password, team, department, position, number, status } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // Check for existing email if provided
    if (email) {
      const existingEmail = await Player.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ error: "Email already registered" });
      }
    }

    // Check for existing rNumber if provided
    if (rNumber) {
      const existingRNumber = await Player.findOne({ rNumber });
      if (existingRNumber) {
        return res.status(400).json({ error: "R-Number already registered" });
      }
    }

    // Generate unique ID
    const uniqueId = generateUniqueId(rNumber || "");

    // Hash password if provided
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const player = await Player.create({
      name,
      email,
      rNumber,
      uniqueId,
      phone,
      password: hashedPassword,
      team: team || null,
      department,
      position,
      number,
      status: status || "approved", // Admin-created players are auto-approved
    });

    res.status(201).json({ message: "Player created successfully", player });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePlayer = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Handle empty team string - convert to null
    if (updates.team === "" || updates.team === undefined) {
      updates.team = null;
    }

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
