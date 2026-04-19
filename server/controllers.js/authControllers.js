import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db.js"; 
import dotenv from "dotenv";
dotenv.config();

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    
    const checkResult = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (checkResult.rows.length > 0) {
      return res.status(400).json({
        error: "Email already exists"
      });
    }

    
    const hash = await bcrypt.hash(password, 10);

    
    const result = await db.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hash]
    );

    const user = result.rows[0];

    
    await db.query(
      `INSERT INTO buckets (user_id, name, balance, goal_amount, is_main)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        user.id,
        "Main Account",
        Math.floor(Math.random() * 20000) + 5000, 
        0,
        true
      ]
    );

    
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Something went wrong"
    });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


export const getCurrentUser = async (req, res) => {
  try {
    const { userId } = req.user;

    const result = await db.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};


export const verifyPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user?.userId;

    if (!userId || !password) {
      return res.status(400).json({
        valid: false,
        error: "Missing credentials",
      });
    }

    const result = await db.query(
      "SELECT password_hash FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        valid: false,
        error: "User not found",
      });
    }

    const match = await bcrypt.compare(
      password,
      result.rows[0].password_hash
    );

    if (!match) {
      return res.status(401).json({
        valid: false,
        error: "Invalid password",
      });
    }

    return res.status(200).json({ valid: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      valid: false,
      error: "Server error",
    });
  }
};