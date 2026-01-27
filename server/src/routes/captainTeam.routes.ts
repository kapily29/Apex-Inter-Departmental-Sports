import { Router } from "express";
import { captainAuthMiddleware } from "../middlewares/captainAuth";
import {
  createTeam,
  getMyTeams,
  addPlayerToTeam,
  removePlayerFromTeam
} from "../controllers/captainTeam.controller";

const router = Router();

router.post("/teams", captainAuthMiddleware, createTeam);
router.get("/teams", captainAuthMiddleware, getMyTeams);
router.post("/teams/add-player", captainAuthMiddleware, addPlayerToTeam);
router.post("/teams/remove-player", captainAuthMiddleware, removePlayerFromTeam);

export default router;
