import express from "express";
import Deposit from "../models/Deposit.js";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/deposits/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const router = express.Router();

/* SAVE DEPOSIT */
router.post("/save", authMiddleware, upload.single("proof"), async (req, res) => {
  try {
    const { amount, method } = req.body;
    if (!amount || !method) {
      return res.status(400).json({ message: "Amount and method are required" });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const depositData = {
      ...req.body,
      amount: Number(amount),
      userId: user._id,
      name: user.fullname,
      status: "PENDING",
    };

    if (req.file) {
      depositData.proof = `/uploads/deposits/${req.file.filename}`;
    }

    await Deposit.create(depositData);
    res.json({ message: "Deposit stored" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET USER DEPOSITS */
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const deposits = await Deposit.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(deposits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
