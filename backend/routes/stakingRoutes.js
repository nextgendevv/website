import express from "express";
import Staking from "../models/Staking.js";
import StakingHistory from "../models/StakingHistory.js";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

/* SAVE / UPDATE STAKING DATA */
router.post("/save", authMiddleware, async (req, res) => {
  const { wallet, data, history } = req.body;

  try {
    let staking = await Staking.findOne({ wallet });

    if (!staking) {
      staking = new Staking({ wallet, ...data });
    } else {
      Object.assign(staking, data);
    }

    await staking.save();

    if (history) {
      await StakingHistory.create({ wallet, ...history });
    }

    res.json({ message: "Staking data stored" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET STAKING DATA */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const staking = await Staking.findOne({ wallet: user.wallet });
    res.json(staking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* GET STAKING HISTORY */
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const history = await StakingHistory.find({ wallet: user.wallet });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* GET REWARDS HISTORY */
router.get("/rewards", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const history = await StakingHistory.find({ wallet: user.wallet });
    const rewards = [];
    history.forEach(h => {
      if (h.dailyReward > 0) {
        rewards.push({
          date: h.time,
          type: 'Daily',
          amount: h.dailyReward,
          level: 'N/A'
        });
      }
      if (h.affiliateReward > 0) {
        rewards.push({
          date: h.time,
          type: 'Affiliate',
          amount: h.affiliateReward,
          level: 'N/A'
        });
      }
    });
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
