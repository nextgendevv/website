import mongoose from "mongoose";

const WithdrawalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: String,
  amount: Number,
  method: String,
  status: String,
});

export default mongoose.model("Withdrawal", WithdrawalSchema);
