import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Transfer from "../models/Transfer.js";
import mongoose from "mongoose";

/* ================= TRANSFER FUNDS ================= */
export const transferFunds = async (req, res) => {
  try {
    const { receiver, amount, message } = req.body;
    const sender = await User.findById(req.user.id);

    if (!receiver || !amount) {
      return res.status(400).json({ success: false, message: "Enter all fields" });
    }

    const recUser = await User.findOne({
      $or: [{ email: receiver }, { _id: mongoose.isValidObjectId(receiver) ? receiver : null }]
    });

    if (!recUser) {
      return res.status(404).json({ success: false, message: "Receiver not found" });
    }

    if (Number(amount) > sender.balance) {
      return res.status(400).json({ success: false, message: "Insufficient balance" });
    }

    sender.balance -= Number(amount);
    recUser.balance = (recUser.balance || 0) + Number(amount);

    await sender.save();
    await recUser.save();

    const transfer = new Transfer({
      senderId: sender._id,
      receiverEmail: recUser.email,
      amount: Number(amount),
      message,
    });
    await transfer.save();

    res.json({ success: true, message: "Transfer successful!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET TRANSFER HISTORY ================= */
export const getTransferHistory = async (req, res) => {
  try {
    const history = await Transfer.find({ senderId: req.user.id }).sort({ date: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET USER PROFILE ================= */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= UPDATE PROFILE ================= */
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phone, country } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.fullname = fullname || user.fullname;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.country = country || user.country;

    // Handle profile picture upload
    if (req.file) {
      user.profilePicture = `/uploads/profiles/${req.file.filename}`;
    }

    await user.save();

    const updatedUser = await User.findById(req.user.id).select("-password");
    res.json({ success: true, message: "Profile updated successfully", user: updatedUser });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= CHANGE PASSWORD ================= */
export const changePassword = async (req, res) => {
  try {
    const { current, newPass } = req.body;

    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(current, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password incorrect" });
    }

    user.password = await bcrypt.hash(newPass, 10);
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET TEAM ================= */
export const getTeam = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    const loggedUser = await User.findById(req.user.id).select("-password");
    res.json({ users, loggedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Handle Trade Limit Reset (24h logic)
    const now = new Date();
    const lastReset = new Date(user.lastTradeReset || now);
    const diffHours = (now - lastReset) / (1000 * 60 * 60);

    let timeLeftVal = "00:00:00";
    if (diffHours >= 24) {
      user.remainingTrade = user.tradeLimit || 500;
      user.lastTradeReset = now;
      await user.save();
    } else {
      const remainingMs = (24 * 60 * 60 * 1000) - (now - lastReset);
      const h = Math.floor(remainingMs / 3600000);
      const m = Math.floor((remainingMs % 3600000) / 60000);
      const s = Math.floor((remainingMs % 60000) / 1000);
      timeLeftVal = [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
    }

    // Calculate Referrals & Downline (Simplified for now - direct referrals)
    const directReferrals = await User.countDocuments({ sponsorCode: user.userCode });

    // Calculate Team Staking (Sum of stakingWallet for all downline users)
    // For now, we sum direct referrals; complex multi-level should use $graphLookup
    const teamStats = await User.aggregate([
      { $match: { sponsorCode: user.userCode } },
      { $group: { _id: null, totalStaking: { $sum: "$stakingWallet" } } }
    ]);
    const totalTeamStaking = teamStats.length > 0 ? teamStats[0].totalStaking : 0;

    const dashboardData = {
      user: {
        fullname: user.fullname,
        email: user.email
      },
      depositWallet: user.depositWallet || 0,
      withdrawWallet: user.withdrawWallet || 0,
      stakingWallet: user.stakingWallet || 0,
      income: {
        activation: user.referralIncome || 0,
        activationLevel: 0,
        trade: 0,
        tradeLevel: 0,
        staking: user.totalRewards || 0,
        autofill: 0,
        referralCoin: 0,
        dailyCoin: 0,
      },
      referral: {
        userId: user.userCode || user._id,
        referralLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/signup?ref=${user.userCode || user._id}`,
        directReferrals: directReferrals,
        totalDownline: directReferrals, // Placeholder for deep downline
        totalCoinDownlineStaking: totalTeamStaking,
      },
      trade: {
        remainingTrade: user.remainingTrade || 0,
        tradeTimer: timeLeftVal,
      }
    };

    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
