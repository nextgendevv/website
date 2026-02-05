import mongoose from "mongoose";

const StakingHistorySchema = new mongoose.Schema({
  wallet: String,
  amount: Number,
  dailyReward: Number,
  affiliateReward: Number,
  time: String,
});

export default mongoose.model("StakingHistory", StakingHistorySchema);
