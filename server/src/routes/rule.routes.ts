import { Router } from "express";
import {
  getAllRules,
  getRuleById,
  createRule,
  updateRule,
  deleteRule,
} from "../controllers/rule.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.get("/", getAllRules);
router.get("/:id", getRuleById);
router.post("/", authMiddleware, createRule);
router.put("/:id", authMiddleware, updateRule);
router.delete("/:id", authMiddleware, deleteRule);

export default router;
