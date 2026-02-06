import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  adminReply: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "PENDING",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("SupportTicket", supportTicketSchema);