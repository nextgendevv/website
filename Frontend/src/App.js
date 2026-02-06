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

import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/signin" element={<UserSignIn />} />
        <Route path="/signup" element={<UserSignUp />} />
        <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />

        {/* Protected User Routes */}
        <Route path="/user/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/user/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/user/registration" element={<ProtectedRoute><Register /></ProtectedRoute>} />
        <Route path="/user/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
        <Route path="/user/staking" element={<ProtectedRoute><UserStaking /></ProtectedRoute>} />
        <Route path="/user/staking-history" element={<ProtectedRoute><StakingHistory /></ProtectedRoute>} />
        <Route path="/admin/staking-reports" element={<AdminProtectedRoute><AdminStaking /></AdminProtectedRoute>} />
        <Route path="/user/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
        <Route path="/user/team-advanced" element={<ProtectedRoute><TeamAdvanced /></ProtectedRoute>} />
        <Route path="/admin/team-advanced" element={<AdminProtectedRoute><AdminTeamAdvanced /></AdminProtectedRoute>} />
        <Route path="/user/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/admin/history" element={<AdminProtectedRoute><AdminHistory /></AdminProtectedRoute>} />
        <Route path="/user/withdrawal" element={<ProtectedRoute><Withdrawal /></ProtectedRoute>} />
        <Route path="/admin/withdrawals" element={<AdminProtectedRoute><AdminWithdrawal /></AdminProtectedRoute>} />
        <Route path="/user/report" element={<ProtectedRoute><UserReport /></ProtectedRoute>} />
        <Route path="/user/transfer" element={<ProtectedRoute><Transfer /></ProtectedRoute>} />
        <Route path="/user/invest" element={<ProtectedRoute><Invest /></ProtectedRoute>} />
        <Route path="/user/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
        <Route path="/user/referral-tree" element={<ProtectedRoute><ReferralTree /></ProtectedRoute>} />
        <Route path="/user/deposit" element={<ProtectedRoute><UserDeposit /></ProtectedRoute>} />

        <Route path="/admin/deposits" element={<AdminProtectedRoute><AdminDeposits /></AdminProtectedRoute>} />
        <Route path="/admin/support" element={<AdminProtectedRoute><AdminSupport /></AdminProtectedRoute>} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
