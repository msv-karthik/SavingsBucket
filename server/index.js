import express from "express";
const app = express();
import dotenv  from "dotenv";
dotenv.config();
const port = process.env.PORT || 3000;
import cors from "cors";
import db from "./db.js";
import authRoutes from "./routes/auth.js";
import bucketsRoutes from "./routes/buckets.js";
import dashboardRoutes from "./routes/dashboard.js";
import transactionRoutes from './routes/transactions.js';



const allowedOrigins = [
    "http:localhost:5173",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


db.query("SELECT 1")
  .then(() => console.log("DB connected"))
  .catch(err => console.error("DB connection error:", err));



app.use("/api/auth", authRoutes);
app.use("/api/buckets", bucketsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", transactionRoutes);

app.listen(port, ()=>{
    console.log(`server running at port: ${port}.`);
});