import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Investment from "../models/Investment.js";
import User from "../models/User.js";

const router = express.Router();

// @desc    Activate a new investment plan
// @route   POST /api/investment/activate
router.post("/activate", authMiddleware, async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid investment amount" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Use depositWallet for investment
        if (user.depositWallet < amount) {
            return res.status(400).json({ message: "Insufficient funds in deposit wallet" });
        }

        // Create investment (2X ROI)
        const totalToReturn = amount * 2;
        const newInvestment = new Investment({
            userId: user._id,
            amountInvested: amount,
            totalToReturn: totalToReturn,
            totalInstallments: 24, // As per image 5000 / 24
        });

        // Deduct from wallet
        user.depositWallet -= amount;

        await newInvestment.save();
        await user.save();

        res.json({ success: true, message: "Investment plan activated!", investment: newInvestment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get user's investments
// @route   GET /api/investment/my
router.get("/my", authMiddleware, async (req, res) => {
    try {
        const investments = await Investment.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(investments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
