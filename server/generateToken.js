import jwt from "jsonwebtoken";
import dotenv  from "dotenv";
dotenv.config();

const token = jwt.sign(
  { userId: "c18be67f-3e85-48d4-9cbe-d3e835365444" },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);
