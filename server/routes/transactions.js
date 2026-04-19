import express from "express";
import { createTransfer, getTransactionHistory } from "../controllers.js/transactionController.js";
import { authenticateToken } from "../middleware/middleware.js";

const router = express.Router();


router.post("/transfer", authenticateToken, createTransfer);


router.get("/transactions", authenticateToken, getTransactionHistory);

export default router;