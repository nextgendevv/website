import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

/* ================= TEAM DATA ================= */
router.get("/team", authMiddleware, async (req, res) => {
  try {
    // Logged-in user (from token)
    const loggedUser = await User.findById(req.user.id).select("-password");

    if (!loggedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch all users except self
    const users = await User.find({
      _id: { $ne: loggedUser._id },
    }).select("-password");

    res.json({
      loggedUser,
      users,
    });

  } catch (error) {
    console.error("TEAM API ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
