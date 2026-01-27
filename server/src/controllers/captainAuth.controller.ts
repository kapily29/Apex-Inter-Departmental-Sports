import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Captain } from "../models/Captain";
import { DepartmentPlayer, SPORTS_LIST } from "../models/DepartmentPlayer";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

// Generate unique captain ID
function generateUniqueId(rNumber: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CPT-${rNumber.slice(-4)}-${random}${timestamp.slice(-2)}`.toUpperCase();
}

// Generate unique player ID
function generatePlayerUniqueId(rNumber: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PLY-${rNumber.slice(-4)}-${random}${timestamp.slice(-2)}`.toUpperCase();
}

// Captain Registration
export const registerCaptain = async (req: Request, res: Response) => {
  try {
    const { name, email, password, rNumber, phone, department, bloodGroup } = req.body;

    // Validation
    if (!name || !email || !password || !rNumber || !phone || !department || !bloodGroup) {
      return res.status(400).json({
        error: "All fields are required: Name, Email, Password, R-Number, Phone, Department, Blood Group",
      });
    }

    // Check if email already exists
    const existingEmail = await Captain.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Check if R-Number already exists
    const existingRNumber = await Captain.findOne({ rNumber });
    if (existingRNumber) {
      return res.status(400).json({ error: "R-Number already registered" });
    }

    // Generate unique ID
    const uniqueId = generateUniqueId(rNumber);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create captain
    const captain = await Captain.create({
      name,
      email,
      password: hashedPassword,
      rNumber,
      uniqueId,
      phone,
      department,
      bloodGroup,
      status: "pending",
    });

    res.status(201).json({
      message: "Registration successful! Please wait for admin approval.",
      captain: {
        id: captain._id,
        name: captain.name,
        email: captain.email,
        rNumber: captain.rNumber,
        uniqueId: captain.uniqueId,
        department: captain.department,
        status: captain.status,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Captain Login
export const loginCaptain = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;

    // Identifier can be email, R-Number, or unique ID
    if (!identifier || !password) {
      return res.status(400).json({
        error: "Email/R-Number/Unique ID and password are required",
      });
    }

    // Find captain by email, rNumber, or uniqueId
    const captain = await Captain.findOne({
      $or: [
        { email: identifier },
        { rNumber: identifier },
        { uniqueId: identifier },
      ],
    });

    if (!captain) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, captain.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if approved
    if (captain.status === "pending") {
      return res.status(403).json({
        error: "Your account is pending approval. Please wait for admin approval.",
      });
    }

    if (captain.status === "rejected") {
      return res.status(403).json({
        error: "Your account has been rejected. Please contact admin.",
      });
    }

    if (captain.status === "inactive") {
      return res.status(403).json({
        error: "Your account is inactive. Please contact admin.",
      });
    }

    // Generate token
    const token = jwt.sign(
      { captainId: captain._id, role: "captain" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      captain: {
        id: captain._id,
        name: captain.name,
        email: captain.email,
        rNumber: captain.rNumber,
        uniqueId: captain.uniqueId,
        phone: captain.phone,
        department: captain.department,
        bloodGroup: captain.bloodGroup,
        status: captain.status,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get Captain Profile (protected)
export const getCaptainProfile = async (req: any, res: Response) => {
  try {
    const captainId = req.captain?.captainId;

    const captain = await Captain.findById(captainId);
    if (!captain) {
      return res.status(404).json({ error: "Captain not found" });
    }

    res.status(200).json({
      captain: {
        id: captain._id,
        name: captain.name,
        email: captain.email,
        rNumber: captain.rNumber,
        uniqueId: captain.uniqueId,
        phone: captain.phone,
        department: captain.department,
        bloodGroup: captain.bloodGroup,
        status: captain.status,
        joinDate: captain.joinDate,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update Captain Profile (protected)
export const updateCaptainProfile = async (req: any, res: Response) => {
  try {
    const captainId = req.captain?.captainId;
    const { name, phone, bloodGroup } = req.body;

    const captain = await Captain.findById(captainId);
    if (!captain) {
      return res.status(404).json({ error: "Captain not found" });
    }

    // Update allowed fields only (cannot change email, rNumber, department, uniqueId)
    if (name) captain.name = name;
    if (phone) captain.phone = phone;
    if (bloodGroup) captain.bloodGroup = bloodGroup;

    await captain.save();

    res.status(200).json({
      message: "Profile updated successfully",
      captain: {
        id: captain._id,
        name: captain.name,
        email: captain.email,
        rNumber: captain.rNumber,
        uniqueId: captain.uniqueId,
        phone: captain.phone,
        department: captain.department,
        bloodGroup: captain.bloodGroup,
        status: captain.status,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Add Player to Department (protected - captain only)
export const addDepartmentPlayer = async (req: any, res: Response) => {
  try {
    const captainId = req.captain?.captainId;
    const { name, rNumber, phone, email, sport } = req.body;

    // Get captain to get department
    const captain = await Captain.findById(captainId);
    if (!captain) {
      return res.status(404).json({ error: "Captain not found" });
    }

    // Validation
    if (!name || !rNumber || !phone || !email || !sport) {
      return res.status(400).json({
        error: "All fields are required: Name, R-Number, Phone, Email, Sport",
      });
    }

    // Check if player already exists in this sport in this department
    const existingPlayer = await DepartmentPlayer.findOne({
      rNumber,
      department: captain.department,
      sport,
    });

    if (existingPlayer) {
      return res.status(400).json({
        error: "This player is already registered for this sport in your department",
      });
    }

    // Check if player is already in 2 sports in this department
    const playerSportsCount = await DepartmentPlayer.countDocuments({
      rNumber,
      department: captain.department,
    });

    if (playerSportsCount >= 2) {
      return res.status(400).json({
        error: "This player is already registered in 2 sports. Maximum limit reached.",
      });
    }

    // Generate unique player ID
    const uniqueId = generatePlayerUniqueId(rNumber);

    // Create player
    const player = await DepartmentPlayer.create({
      name,
      rNumber,
      uniqueId,
      phone,
      email,
      sport,
      department: captain.department,
      captain: captainId,
      status: "pending",
    });

    res.status(201).json({
      message: "Player added successfully. Waiting for admin approval.",
      player,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: "This player is already registered for this sport",
      });
    }
    res.status(500).json({ error: error.message });
  }
};

// Get Department Players (protected - captain only)
export const getDepartmentPlayers = async (req: any, res: Response) => {
  try {
    const captainId = req.captain?.captainId;

    const captain = await Captain.findById(captainId);
    if (!captain) {
      return res.status(404).json({ error: "Captain not found" });
    }

    const players = await DepartmentPlayer.find({ captain: captainId }).sort({ createdAt: -1 });

    res.status(200).json({ players });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update Department Player (protected - captain only)
export const updateDepartmentPlayer = async (req: any, res: Response) => {
  try {
    const captainId = req.captain?.captainId;
    const { id } = req.params;
    const { name, phone, email } = req.body;

    const player = await DepartmentPlayer.findOne({ _id: id, captain: captainId });
    if (!player) {
      return res.status(404).json({ error: "Player not found or not authorized" });
    }

    // Update allowed fields
    if (name) player.name = name;
    if (phone) player.phone = phone;
    if (email) player.email = email;

    await player.save();

    res.status(200).json({
      message: "Player updated successfully",
      player,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Department Player (protected - captain only)
export const deleteDepartmentPlayer = async (req: any, res: Response) => {
  try {
    const captainId = req.captain?.captainId;
    const { id } = req.params;

    const player = await DepartmentPlayer.findOneAndDelete({ _id: id, captain: captainId });
    if (!player) {
      return res.status(404).json({ error: "Player not found or not authorized" });
    }

    res.status(200).json({ message: "Player deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get Sports List
export const getSportsList = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ sports: SPORTS_LIST });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
