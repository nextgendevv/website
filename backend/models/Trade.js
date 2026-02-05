import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        tradeType: {
            type: String,
            enum: ["BUY", "SELL"],
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        asset: {
            type: String,
            default: "USDT"
        },
        price: {
            type: Number,
            required: true
        },
        total: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ["PENDING", "COMPLETED", "FAILED"],
            default: "COMPLETED"
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

export default mongoose.model("Trade", tradeSchema);
