import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

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

// Connect to database
connectDB();

const app = express();

// --- MIDDLEWARE ---

// Security Headers (Basic Implementation)
app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    next();
});

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enable CORS with specific options
app.use(cors({
    origin: "*", // Adjust this in production to specific domains
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Robust request logger
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    });
    next();
});

// Serve static files
app.use('/uploads', express.static('uploads'));
app.use('/uploads/deposits', express.static('uploads/deposits'));

// --- ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/deposit", depositRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/staking", stakingRoutes);
app.use("/api/user", userRoutes);
app.use("/api/withdrawal", withdrawalRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/investment", investmentRoutes);

// --- FRONTEND SERVING ---
const __dirname = path.resolve();
const buildPath = path.join(__dirname, "Frontend", "build");
app.use(express.static(buildPath));

app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"), (err) => {
        if (err) {
            res.status(500).send(err);
        }
    });
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
