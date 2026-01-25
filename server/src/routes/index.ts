import { Router } from "express";
import { testController } from "../controllers/hello.controller";

const router = Router();

router.get("/test", testController);

export default router;
