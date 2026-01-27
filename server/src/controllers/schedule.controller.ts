import { Response } from "express";
import { Schedule } from "../models/Schedule";
import { AuthRequest } from "../middlewares/auth";

export const getAllSchedules = async (req: AuthRequest, res: Response) => {
  try {
    const { sport } = req.query;
    const filter: any = {};
    if (sport && sport !== "All") filter.sport = sport;

    const schedules = await Schedule.find(filter).sort({ date: 1, sno: 1 });
    res.status(200).json({ schedules });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getScheduleById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const schedule = await Schedule.findById(id);
    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }
    res.status(200).json({ schedule });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createSchedule = async (req: AuthRequest, res: Response) => {
  try {
    const { sno, date, time, activity, sport, gender, matchDetail } = req.body;

    if (!sno || !date || !time || !activity) {
      return res
        .status(400)
        .json({ error: "Sno, date, time, and activity are required" });
    }

    const schedule = await Schedule.create({
      sno,
      date,
      time,
      activity,
      sport: sport || "General",
      gender: sport && sport !== "General" ? (gender || "Male") : "",
      matchDetail: sport && sport !== "General" ? (matchDetail || "") : "",
    });

    res.status(201).json({ message: "Schedule created successfully", schedule });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSchedule = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const schedule = await Schedule.findByIdAndUpdate(id, updates, { new: true });
    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    res.status(200).json({ message: "Schedule updated successfully", schedule });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSchedule = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const schedule = await Schedule.findByIdAndDelete(id);
    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
