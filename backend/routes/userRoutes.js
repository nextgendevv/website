import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  getProfile,
  updateProfile,
  changePassword,
  getTeam,
  getUserDashboard,
  transferFunds,
  getTransferHistory,
} from "../controllers/userController.js";

const router = express.Router();

// 🔐 PROTECTED ROUTES
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, upload.single('profilePicture'), updateProfile);
router.put("/change-password", authMiddleware, changePassword);
router.get("/team", authMiddleware, getTeam);
router.get("/dashboard", authMiddleware, getUserDashboard);
router.post("/transfer", authMiddleware, transferFunds);
router.get("/transfer-history", authMiddleware, getTransferHistory);

export default router;
