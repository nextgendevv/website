import Investment from "./models/Investment.js";
import User from "./models/User.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const distributeProfits = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for profit distribution");

        const activeInvestments = await Investment.find({ status: "ACTIVE" });

        console.log(`Processing ${activeInvestments.length} active investments...`);

        for (const inv of activeInvestments) {
            // Logic: amount = totalToReturn / totalInstallments
            const payoutPerInstallment = inv.totalToReturn / inv.totalInstallments;

            // Deduct from remaining and add to user balance
            const user = await User.findById(inv.userId);
            if (user) {
                user.balance += payoutPerInstallment;
                // Track total rewards in User model if needed
                user.totalRewards = (user.totalRewards || 0) + payoutPerInstallment;

                inv.amountReturned += payoutPerInstallment;
                inv.installmentsPaid += 1;
                inv.lastPayout = new Date();

                if (inv.installmentsPaid >= inv.totalInstallments) {
                    inv.status = "COMPLETED";
                }

                await user.save();
                await inv.save();
                console.log(`Paid ${payoutPerInstallment.toFixed(2)} to ${user.fullname} (${inv.installmentsPaid}/${inv.totalInstallments})`);
            }
        }

        console.log("Profit distribution completed!");
        process.exit(0);
    } catch (error) {
        console.error("Error distributing profits:", error);
        process.exit(1);
    }
};

distributeProfits();
