import mongoose from "mongoose";

const StakingSchema = new mongoose.Schema({
  wallet: String,
  stakingWallet: Number,
  remainingLimit: Number,
  affiliateStake: Number,
  dailyStake: Number,
  referralCommission: Number,
  totalStaked: Number,
});

export default mongoose.model("Staking", StakingSchema);
