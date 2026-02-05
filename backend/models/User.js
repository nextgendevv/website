import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userCode: { type: String, unique: true }, // referral ID

    fullname: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    role: { type: String, enum: ["user", "admin"], default: "user" },
    wallet: String,
    profilePicture: { type: String, default: null },

    sponsorCode: String,
    sponsorName: String,

    uplines: [String],

    referralIncome: { type: Number, default: 0 },
    totalRewards: { type: Number, default: 0 },

    balance: { type: Number, default: 0 },
    stakingWallet: { type: Number, default: 0 },
    depositWallet: { type: Number, default: 0 },
    withdrawWallet: { type: Number, default: 0 },

    tradeLimit: { type: Number, default: 500 },
    remainingTrade: { type: Number, default: 500 },
    lastTradeReset: { type: Date, default: Date.now },

    registerDate: String,
    activationDate: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
