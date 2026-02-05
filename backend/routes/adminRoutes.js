import express from "express";
import {
    getAllUsers,
    getAllDeposits,
    updateDepositStatus,
    getAllWithdrawals,
    updateWithdrawalStatus,
    getAllStaking,
    getAllSupport,
    getAllReports,
    getAllTransfers,
    getAllTrades,
    getStats,
    loginAdmin
} from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);



// All admin routes should be protected by authMiddleware
router.use(authMiddleware);

router.get("/users", getAllUsers);
router.get("/deposits", getAllDeposits);
router.put("/deposits/:id", updateDepositStatus);
router.get("/withdrawals", getAllWithdrawals);
router.put("/withdrawals/:id", updateWithdrawalStatus);
router.get("/staking", getAllStaking);
router.get("/support", getAllSupport);
router.get("/reports", getAllReports);
router.get("/transfers", getAllTransfers);
router.get("/trades", getAllTrades);
router.get("/stats", getStats);

export default router;
