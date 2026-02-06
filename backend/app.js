import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import depositRoutes from "./routes/depositRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import stakingRoutes from "./routes/stakingRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import withdrawalRoutes from "./routes/withdrawalRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import investmentRoutes from "./routes/investmentRoutes.js";

// Load env vars
dotenv.config();

// Connect to database (reused in serverless)
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Serve static files (uploaded profile pictures)
// WARNING: These will not persist in Netlify Functions
app.use('/uploads', express.static('uploads'));
app.use('/uploads/deposits', express.static('uploads/deposits'));

// Mount routers
app.use("/api/auth", authRoutes);
app.use("/api/deposit", depositRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/staking", stakingRoutes);
app.use("/api/user", userRoutes);
app.use("/api/withdrawal", withdrawalRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/investment", investmentRoutes);

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/Frontend/build")));
    app.get("*path", (req, res) =>
        res.sendFile(path.resolve(__dirname, "Frontend", "build", "index.html"))
    );
} else {
    app.get("/", (req, res) => {
        res.send("API is running...");
    });
}

export default app;
