import express from "express";
import Withdrawal from "../models/Withdrawal.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* CREATE WITHDRAWAL REQUEST */
router.post("/request", authMiddleware, async (req, res) => {
  try {
    const { amount, method } = req.body;
    if (!amount || !method) {
      return res.status(400).json({ message: "Amount and method are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.balance < Number(amount)) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const newWithdrawal = new Withdrawal({
      userId: req.user.id,
      date: new Date().toLocaleString(),
      amount: Number(amount),
      method,
      status: "Pending",
    });
    await newWithdrawal.save();
    res.json({ message: "Withdrawal request submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* GET USER WITHDRAWALS */
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ userId: req.user.id });
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
