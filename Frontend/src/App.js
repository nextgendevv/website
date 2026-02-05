import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/AdminLogin";
import UserSignIn from "./pages/UserSignIn";
import UserSignUp from "./pages/UserSignUp";
import AdminDashboard from "./Admin/AdminDashboard";
import UserProfile from "./user/UserProfile";
import UserDashboard from "./user/UserDashboard";
import Register from "./user/Register";
import ChangePassword from "./user/Changepassword";
import UserStaking from "./user/UserStaking";
import StakingHistory from "./user/StakingHistory";
import Team from "./user/Team";
import TeamAdvanced from "./user/TeamAdvanced";
import History from "./user/History";
import Withdrawal from "./user/Withdrawal";
import UserReport from "./user/UserReport";
import Transfer from "./user/Transfer";
import Support from "./user/Support";
import Invest from "./user/Invest";


import AdminTeamAdvanced from "./Admin/AdminTeamAdvanced";
import AdminStaking from "./Admin/AdminStaking";
import ReferralTree from "./user/ReferralTree";
import UserDeposit from "./user/UserDeposit";
import AdminDeposits from "./Admin/AdminDeposit";
import AdminHistory from "./Admin/AdminHistory";
import AdminWithdrawal from "./Admin/AdminWithdrawal";
import AdminSupport from "./Admin/AdminSupport";

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/signin" element={<UserSignIn />} />
        <Route path="/signup" element={<UserSignUp />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/user/UserDashboard" element={<UserDashboard />} />
        <Route path="/user/registration" element={<Register />} />
        <Route path="/user/change-password" element={<ChangePassword />} />
        <Route path="/user/staking" element={<UserStaking />} />
        <Route path="/user/staking-history" element={<StakingHistory />} />
        <Route path="/admin/staking-reports" element={<AdminStaking />} />
        <Route path="/user/team" element={<Team />} />
        <Route path="/user/team-advanced" element={<TeamAdvanced />} />
        <Route path="/admin/team-advanced" element={<AdminTeamAdvanced />} />
        <Route path="/user/history" element={<History />} />
        <Route path="/admin/history" element={<AdminHistory />} />
        <Route path="/user/withdrawal" element={<Withdrawal />} />
        <Route path="/admin/withdrawals" element={<AdminWithdrawal />} />
        <Route path="/user/report" element={<UserReport />} />
        <Route path="/user/transfer" element={<Transfer />} />
        <Route path="/user/invest" element={<Invest />} />
        <Route path="/user/support" element={<Support />} />

        <Route path="/user/referral-tree" element={<ReferralTree />} />
        <Route path="/user/deposit" element={<UserDeposit />} />
        <Route path="/admin/deposits" element={<AdminDeposits />} />
        <Route path="/admin/support" element={<AdminSupport />} />
        <Route path="*" element={<Dashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
