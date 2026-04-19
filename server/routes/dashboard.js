import express from "express";
import { getDashboard } from "../controllers.js/dashboardController.js";
import { authenticateToken } from "../middleware/middleware.js";

const router = express.Router();

router.get("/", authenticateToken, getDashboard);

export default router;