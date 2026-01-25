import { Router } from "express";
import {
  getAllMatches,
  getMatchById,
  createMatch,
  updateMatch,
  updateScore,
  deleteMatch,
} from "../controllers/match.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.get("/", getAllMatches);
router.get("/:id", getMatchById);
router.post("/", authMiddleware, createMatch);
router.put("/:id", authMiddleware, updateMatch);
router.put("/:id/score", authMiddleware, updateScore);
router.delete("/:id", authMiddleware, deleteMatch);

export default router;
