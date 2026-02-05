import mongoose from "mongoose";

const transferSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    message: { type: String },
    date: { type: String, default: () => new Date().toLocaleString() }
});

export default mongoose.model("Transfer", transferSchema);
