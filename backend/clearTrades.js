import Trade from "./models/Trade.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const clearTradeHistory = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const result = await Trade.deleteMany({});
        console.log(`✅ Deleted ${result.deletedCount} trade records from the database`);

        console.log("Trade history cleared successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error clearing trade history:", error);
        process.exit(1);
    }
};

clearTradeHistory();
