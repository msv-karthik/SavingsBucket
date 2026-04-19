import db from "../db.js";


export const getBuckets = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await db.query(
      "SELECT * FROM buckets WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching buckets:", err);
    res.status(500).json({ error: "Server error" });
  }
};


export const createBucket = async (req, res) => {
  try {
    const { name, goal_amount } = req.body;
    const userId = req.user.userId;

    
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        error: "Bucket name is required",
      });
    }

    if (goal_amount === undefined || goal_amount === null) {
      return res.status(400).json({
        error: "Goal amount is required",
      });
    }

    const goal = Number(goal_amount);

    if (isNaN(goal) || goal < 0) {
      return res.status(400).json({
        error: "Goal amount must be a valid positive number",
      });
    }

    
    const result = await db.query(
      `INSERT INTO buckets (user_id, name, goal_amount)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, name.trim(), goal]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating bucket:", err);
    res.status(500).json({ error: "Server error" });
  }
};


export const updateBucket = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, goal_amount } = req.body;
    const userId = req.user.userId;

    
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        error: "Bucket name is required",
      });
    }

    const goal = Number(goal_amount);

    if (isNaN(goal) || goal < 0) {
      return res.status(400).json({
        error: "Goal amount must be a valid positive number",
      });
    }

    const result = await db.query(
      `UPDATE buckets
       SET name = $1, goal_amount = $2, updated_at = NOW()
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [name.trim(), goal, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Bucket not found",
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating bucket:", err);
    res.status(500).json({ error: "Server error" });
  }
};