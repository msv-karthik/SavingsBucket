import express from "express";
import { signup , login , getCurrentUser , verifyPassword } from "../controllers.js/authControllers.js";
import { authenticateToken } from "../middleware/middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authenticateToken , getCurrentUser);
router.post("/verify-password", authenticateToken, verifyPassword);

export default router;