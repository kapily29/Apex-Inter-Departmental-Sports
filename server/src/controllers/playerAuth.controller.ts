import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Player } from "../models/Player";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

// Generate unique player ID
function generateUniqueId(rNumber: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `APX-${rNumber.slice(-4)}-${random}${timestamp.slice(-2)}`.toUpperCase();
}

// Player Registration
export const registerPlayer = async (req: Request, res: Response) => {
  try {
    const { name, email, password, rNumber, phone, department, position } = req.body;

    // Validation
    if (!name || !email || !password || !rNumber || !department) {
      return res.status(400).json({
        error: "Name, email, password, R-Number and department are required",
      });
    }

    // Check if email already exists
    const existingEmail = await Player.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Check if R-Number already exists
    const existingRNumber = await Player.findOne({ rNumber });
    if (existingRNumber) {
      return res.status(400).json({ error: "R-Number already registered" });
    }

    // Generate unique ID
    const uniqueId = generateUniqueId(rNumber);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create player
    const player = await Player.create({
      name,
      email,
      password: hashedPassword,
      rNumber,
      uniqueId,
      phone,
      department,
      position,
      status: "pending",
    });

    res.status(201).json({
      message: "Registration successful! Please wait for admin approval.",
      player: {
        id: player._id,
        name: player.name,
        email: player.email,
        rNumber: player.rNumber,
        uniqueId: player.uniqueId,
        department: player.department,
        status: player.status,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Player Login
export const loginPlayer = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;

    // Identifier can be email, R-Number, or unique ID
    if (!identifier || !password) {
      return res.status(400).json({
        error: "Email/R-Number/Unique ID and password are required",
      });
    }

    // Find player by email, rNumber, or uniqueId
    const player = await Player.findOne({
      $or: [
        { email: identifier },
        { rNumber: identifier },
        { uniqueId: identifier },
      ],
    }).populate("team");

    if (!player) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, player.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if approved
    if (player.status === "pending") {
      return res.status(403).json({
        error: "Your account is pending approval. Please wait for admin approval.",
      });
    }

    // Generate token
    const token = jwt.sign(
      { playerId: player._id, role: "player" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      player: {
        id: player._id,
        name: player.name,
        email: player.email,
        rNumber: player.rNumber,
        uniqueId: player.uniqueId,
        phone: player.phone,
        department: player.department,
        position: player.position,
        team: player.team,
        status: player.status,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Verify Player (check if R-Number and Unique ID match)
export const verifyPlayer = async (req: Request, res: Response) => {
  try {
    const { rNumber, uniqueId } = req.body;

    if (!rNumber || !uniqueId) {
      return res.status(400).json({ error: "R-Number and Unique ID are required" });
    }

    const player = await Player.findOne({ rNumber, uniqueId });

    if (!player) {
      return res.status(404).json({ error: "Player not found or credentials don't match" });
    }

    res.status(200).json({
      verified: true,
      player: {
        name: player.name,
        department: player.department,
        status: player.status,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get Player Profile (protected)
export const getPlayerProfile = async (req: any, res: Response) => {
  try {
    const playerId = req.player?.playerId;

    const player = await Player.findById(playerId).populate("team");
    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    res.status(200).json({
      player: {
        id: player._id,
        name: player.name,
        email: player.email,
        rNumber: player.rNumber,
        uniqueId: player.uniqueId,
        phone: player.phone,
        department: player.department,
        team: player.team,
        position: player.position,
        number: player.number,
        status: player.status,
        joinDate: player.joinDate,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update Player Profile (protected)
export const updatePlayerProfile = async (req: any, res: Response) => {
  try {
    const playerId = req.player?.playerId;
    const { name, phone, department, position } = req.body;

    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    // Update allowed fields only
    if (name) player.name = name;
    if (phone !== undefined) player.phone = phone;
    if (department) player.department = department;
    if (position !== undefined) player.position = position;

    await player.save();
    await player.populate("team");

    res.status(200).json({
      message: "Profile updated successfully",
      player: {
        id: player._id,
        name: player.name,
        email: player.email,
        rNumber: player.rNumber,
        uniqueId: player.uniqueId,
        phone: player.phone,
        department: player.department,
        team: player.team,
        position: player.position,
        status: player.status,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
