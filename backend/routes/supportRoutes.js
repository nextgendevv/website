import express from "express";
import protect from "../middleware/authMiddleware.js";
import SupportTicket from "../models/SupportTicket.js";
import User from "../models/User.js";

const router = express.Router();

// @route   POST /api/support/submit
// @desc    Submit a new support ticket
// @access  Private
router.post("/submit", protect, async (req, res) => {
  const { title, category, message } = req.body;

  if (!title || !category || !message) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newTicket = new SupportTicket({
      userId: user.id,
      name: user.fullname,
      email: user.email,
      title,
      category,
      message,
    });

    await newTicket.save();
    res.status(201).json({ message: "Support request submitted!" });
  } catch (error) {
    console.error("Error submitting ticket:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/support/history
// @desc    Get user's support ticket history
// @access  Private
router.get("/history", protect, async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(tickets);
  } catch (error) {
    console.error("Error fetching ticket history:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;