import { Router } from "express";
import {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  approvePlayer,
  deletePlayer,
} from "../controllers/player.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.get("/", getAllPlayers);
router.get("/:id", getPlayerById);
router.post("/", authMiddleware, createPlayer);
router.put("/:id", authMiddleware, updatePlayer);
router.put("/:id/approve", authMiddleware, approvePlayer);
router.delete("/:id", authMiddleware, deletePlayer);

export default router;
