import User from "../models/User.js";
import Deposit from "../models/Deposit.js";
import Withdrawal from "../models/Withdrawal.js";
import Staking from "../models/Staking.js";
import SupportTicket from "../models/SupportTicket.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Transfer from "../models/Transfer.js";
import Report from "../models/Report.js";
import Trade from "../models/Trade.js";


// @desc    Get all users
// @route   GET /api/admin/users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password").sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all deposits
// @route   GET /api/admin/deposits
export const getAllDeposits = async (req, res) => {
    try {
        const deposits = await Deposit.find({}).sort({ date: -1 });
        res.json(deposits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve or Reject Deposit
// @route   PUT /api/admin/deposits/:id
export const updateDepositStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const deposit = await Deposit.findById(req.params.id);

        if (!deposit) {
            return res.status(404).json({ message: "Deposit not found" });
        }

        if (deposit.status !== "PENDING") {
            return res.status(400).json({ message: "Deposit already processed" });
        }

        deposit.status = status; // Expected "APPROVED" or "REJECTED"
        await deposit.save();

        if (status === "APPROVED") {
            const user = await User.findById(deposit.userId);
            if (user) {
                user.depositWallet = (user.depositWallet || 0) + deposit.amount;
                await user.save();
            }
        }

        res.json({ message: `Deposit ${status}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all withdrawals
// @route   GET /api/admin/withdrawals
export const getAllWithdrawals = async (req, res) => {
    try {
        const withdrawals = await Withdrawal.find({}).populate("userId", "fullname").sort({ date: -1 });
        res.json(withdrawals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Withdrawal Status
// @route   PUT /api/admin/withdrawals/:id
export const updateWithdrawalStatus = async (req, res) => {
    try {
        const { status } = req.body; // APPROVED or REJECTED
        const withdrawal = await Withdrawal.findById(req.params.id);

        if (!withdrawal) {
            return res.status(404).json({ message: "Withdrawal not found" });
        }

        if (withdrawal.status !== "PENDING") {
            return res.status(400).json({ message: "Withdrawal already processed" });
        }

        if (status === "REJECTED") {
            // Refund the balance if rejected (since we now freeze it on request)
            const user = await User.findById(withdrawal.userId);
            if (user) {
                user.balance = (user.balance || 0) + withdrawal.amount;
                await user.save();
            }
        } else if (status === "APPROVED") {
            // Just update withdrawWallet tracker if needed
            const user = await User.findById(withdrawal.userId);
            if (user) {
                user.withdrawWallet = (user.withdrawWallet || 0) + withdrawal.amount;
                await user.save();
            }
        }

        withdrawal.status = status;
        await withdrawal.save();

        res.json({ message: `Withdrawal ${status}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all staking records
// @route   GET /api/admin/staking
export const getAllStaking = async (req, res) => {
    try {
        const stakings = await Staking.find({}).sort({ createdAt: -1 });
        res.json(stakings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all support tickets
// @route   GET /api/admin/support
export const getAllSupport = async (req, res) => {
    try {
        const tickets = await SupportTicket.find({}).sort({ date: -1 });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reply to Support Ticket
// @route   PUT /api/admin/support/:id
export const updateSupportStatus = async (req, res) => {
    try {
        const { reply, status } = req.body;
        const ticket = await SupportTicket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        ticket.adminReply = reply || ticket.adminReply;
        ticket.status = status || "REPLIED";
        await ticket.save();

        res.json({ message: "Ticket updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all reports
// @route   GET /api/admin/reports
export const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find({}).populate("userId", "fullname").sort({ date: -1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all transfers
// @route   GET /api/admin/transfers
export const getAllTransfers = async (req, res) => {
    try {
        const transfers = await Transfer.find({}).populate("senderId", "fullname").sort({ date: -1 });
        res.json(transfers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all trades
// @route   GET /api/admin/trades
export const getAllTrades = async (req, res) => {
    try {
        const trades = await Trade.find({}).populate("userId", "fullname email").sort({ date: -1 });
        res.json(trades);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get summary stats
// @route   GET /api/admin/stats
export const getStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments({ role: "user" });
        const depositCount = await Deposit.countDocuments({});
        const withdrawalCount = await Withdrawal.countDocuments({});
        const stakingCount = await Staking.countDocuments({});
        const supportCount = await SupportTicket.countDocuments({ status: "PENDING" });

        // Total amounts
        const totalDeposits = await Deposit.aggregate([{ $match: { status: "APPROVED" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]);
        const totalWithdrawals = await Withdrawal.aggregate([{ $match: { status: "Approved" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]);
        const totalStaking = await Staking.aggregate([{ $group: { _id: null, total: { $sum: "$totalStaked" } } }]);

        res.json({
            users: userCount,
            deposits: depositCount,
            withdrawals: withdrawalCount,
            staking: stakingCount,
            support: supportCount,
            amounts: {
                deposits: totalDeposits[0]?.total || 0,
                withdrawals: totalWithdrawals[0]?.total || 0,
                staking: totalStaking[0]?.total || 0
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Admin Login
// @route   POST /api/admin/login
export const loginAdmin = async (req, res) => {
    const { username, password } = req.body;
    if (username === "Stake" && password === "stake@123") {
        const token = jwt.sign({ id: "admin", role: "admin" }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.json({ success: true, token });
    } else {
        res.status(401).json({ message: "Invalid Admin Credentials" });
    }
};

