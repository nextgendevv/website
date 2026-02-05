import express from "express";
import protect from "../middleware/authMiddleware.js";
import Report from "../models/Report.js";

const router = express.Router();
// @route   POST /api/report/submit
// @desc    Submit a new user report
// @access  Private
router.post("/submit", protect, async (req, res) => {
  const { title, message } = req.body;

  if (!title || !message) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    const report = new Report({
      userId: req.user.id,
      title,
      message,
    });

    await report.save();
    res.status(201).json({ message: "Report submitted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/report/history
// @desc    Get user's report history
// @access  Private
router.get("/history", protect, async (req, res) => {
  const reports = await Report.find({ userId: req.user.id }).sort({ date: -1 });
  res.json(reports);
});

export default router;