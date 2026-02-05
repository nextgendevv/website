import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState;
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error.message);
    // In serverless, we don't necessarily want to exit the process
    // but for now, we'll keep it consistent or just throw
    throw error;
  }
};

export default connectDB;

