import mongoose from "mongoose";

const DepositSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  method: { type: String, required: true },
  upi: { type: String },
  proof: { type: String },
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    default: "PENDING",
  },
});

export default mongoose.model("Deposit", DepositSchema);
