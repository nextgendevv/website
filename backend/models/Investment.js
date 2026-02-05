import mongoose from "mongoose";

const InvestmentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        planName: { type: String, default: "Standard ROI Plan" },
        amountInvested: { type: Number, required: true },
        totalToReturn: { type: Number, required: true },
        amountReturned: { type: Number, default: 0 },
        installmentsPaid: { type: Number, default: 0 },
        totalInstallments: { type: Number, default: 24 },
        lastPayout: { type: Date },
        status: {
            type: String,
            enum: ["ACTIVE", "COMPLETED"],
            default: "ACTIVE",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Investment", InvestmentSchema);
