import { Response } from "express";
import { Match } from "../models/Match";
import { Team } from "../models/Team";
import { AuthRequest } from "../middlewares/auth";

export const getAllMatches = async (req: AuthRequest, res: Response) => {
  try {
    const { status, sport } = req.query;
    const filter: any = {};
    if (status) filter.status = status;
    if (sport) filter.sport = sport;

    const matches = await Match.find(filter)
      .populate("teamA")
      .populate("teamB")
      .sort({ date: -1 });
    res.status(200).json({ matches });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMatchById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const match = await Match.findById(id).populate("teamA").populate("teamB");
    if (!match) {
      return res.status(404).json({ error: "Match not found" });
    }
    res.status(200).json({ match });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createMatch = async (req: AuthRequest, res: Response) => {
  try {
    const { date, teamA, teamB, sport, venue } = req.body;

    if (!date || !teamA || !teamB || !sport) {
      return res
        .status(400)
        .json({ error: "Date, teams, and sport are required" });
    }

    const match = await Match.create({
      date,
      teamA,
      teamB,
      sport,
      venue,
      status: "scheduled",
    });

    res.status(201).json({ message: "Match created successfully", match });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMatch = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const match = await Match.findByIdAndUpdate(id, updates, { new: true })
      .populate("teamA")
      .populate("teamB");
    if (!match) {
      return res.status(404).json({ error: "Match not found" });
    }

    res.status(200).json({ message: "Match updated successfully", match });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateScore = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { scoreA, scoreB, status } = req.body;

    const match = await Match.findById(id);
    if (!match) {
      return res.status(404).json({ error: "Match not found" });
    }

    // Check if match was already completed (to avoid double counting)
    const wasAlreadyCompleted = match.status === "completed";

    // Update match
    match.scoreA = scoreA;
    match.scoreB = scoreB;
    match.status = status || "completed";
    await match.save();

    // Update team stats if match is now completed and wasn't before
    if (match.status === "completed" && !wasAlreadyCompleted) {
      const teamAId = match.teamA;
      const teamBId = match.teamB;

      const teamA = await Team.findById(teamAId);
      const teamB = await Team.findById(teamBId);

      if (teamA && teamB) {
        // Parse current records
        const [teamAWins, teamALosses] = (teamA.record || "0-0").split("-").map(Number);
        const [teamBWins, teamBLosses] = (teamB.record || "0-0").split("-").map(Number);

        if (scoreA > scoreB) {
          // Team A wins
          teamA.record = `${teamAWins + 1}-${teamALosses}`;
          teamA.wins = String(Number(teamA.wins || 0) + 1);
          teamB.record = `${teamBWins}-${teamBLosses + 1}`;
        } else if (scoreB > scoreA) {
          // Team B wins
          teamB.record = `${teamBWins + 1}-${teamBLosses}`;
          teamB.wins = String(Number(teamB.wins || 0) + 1);
          teamA.record = `${teamAWins}-${teamALosses + 1}`;
        }
        // If draw, no changes to wins

        await teamA.save();
        await teamB.save();
      }
    }

    const updatedMatch = await Match.findById(id)
      .populate("teamA")
      .populate("teamB");

    res.status(200).json({ message: "Score updated successfully", match: updatedMatch });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMatch = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const match = await Match.findByIdAndDelete(id);
    if (!match) {
      return res.status(404).json({ error: "Match not found" });
    }

    res.status(200).json({ message: "Match deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
