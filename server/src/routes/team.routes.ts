import { Router } from "express";
import {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
} from "../controllers/team.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.get("/", getAllTeams);
router.get("/:id", getTeamById);
router.post("/", authMiddleware, createTeam);
router.put("/:id", authMiddleware, updateTeam);
router.delete("/:id", authMiddleware, deleteTeam);

export default router;
