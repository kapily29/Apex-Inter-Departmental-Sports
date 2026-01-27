import { Response } from "express";
import { Team } from "../models/Team";
import { DepartmentPlayer } from "../models/DepartmentPlayer";
import { Captain } from "../models/Captain";

interface CaptainRequest {
  captain?: {
    captainId: string;
    email: string;
    department: string;
    role: string;
  };
  body: any;
  params: any;
  query: any;
}

const ALLOWED_SPORTS = [
  "Football",
  "Volleyball",
  "Basketball",
  "Kabaddi",
  "Badminton",
  "Chess",
  "Kho Kho",
  "Table Tennis",
  "Tug of War",
  "Athletics (100 or 200 meter)",
  "Cricket"
];

// Create a team for a sport (one per sport per captain)
export const createTeam = async (req: CaptainRequest, res: Response) => {
  try {
    const { sport, name, playerIds } = req.body;
    const captainId = req.captain?.captainId;
    if (!sport || !name) {
      return res.status(400).json({ error: "Sport and team name are required" });
    }
    if (!ALLOWED_SPORTS.includes(sport)) {
      return res.status(400).json({ error: "Invalid sport" });
    }
    // Only one team per sport per captain
    const existing = await Team.findOne({ sport, captain: captainId });
    if (existing) {
      return res.status(400).json({ error: "You already have a team for this sport" });
    }
    // Only allow players added by this captain and approved by admin (same department)
    let players: any[] = [];
    if (playerIds && Array.isArray(playerIds)) {
      players = await DepartmentPlayer.find({
        _id: { $in: playerIds },
        department: req.captain?.department,
        captain: req.captain?.captainId,
        status: "approved"
      });
    }
    const team = await Team.create({
      name,
      sport,
      department: req.captain?.department,
      captain: captainId,
      players: players.map(p => p._id)
    });
    res.status(201).json({ message: "Team created", team });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get all teams for this captain
export const getMyTeams = async (req: CaptainRequest, res: Response) => {
  try {
    const teams = await Team.find({ captain: req.captain?.captainId })
      .populate("players")
      .populate("captain", "name uniqueId");
    res.status(200).json({ teams });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Add player to team (must be from department and not already in team)
export const addPlayerToTeam = async (req: CaptainRequest, res: Response) => {
  try {
    const { teamId, playerId } = req.body;
    const team = await Team.findOne({ _id: teamId, captain: req.captain?.captainId });
    if (!team) return res.status(404).json({ error: "Team not found" });
    const player = await DepartmentPlayer.findOne({ _id: playerId, department: req.captain?.department });
    if (!player) return res.status(404).json({ error: "Player not found or not in your department" });
    if (team.players.includes(player._id)) return res.status(400).json({ error: "Player already in team" });
    team.players.push(player._id);
    await team.save();
    res.status(200).json({ message: "Player added", team });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Remove player from team
export const removePlayerFromTeam = async (req: CaptainRequest, res: Response) => {
  try {
    const { teamId, playerId } = req.body;
    const team = await Team.findOne({ _id: teamId, captain: req.captain?.captainId });
    if (!team) return res.status(404).json({ error: "Team not found" });
    team.players = team.players.filter((id: any) => id.toString() !== playerId);
    await team.save();
    res.status(200).json({ message: "Player removed", team });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
