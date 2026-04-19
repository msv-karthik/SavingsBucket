import express from "express";
import { getBuckets, createBucket, updateBucket } from "../controllers.js/bucketController.js";
import { authenticateToken } from "../middleware/middleware.js";

const router = express.Router();

router.get("/", authenticateToken, getBuckets);
router.post("/", authenticateToken, createBucket);
router.patch("/:id", authenticateToken, updateBucket);

export default router;