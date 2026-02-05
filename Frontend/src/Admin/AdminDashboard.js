import React, { useEffect, useState } from "react";
import AdminSidebar from "./Sidebar";
import PackageSettings from "./PackageSettings";
import TradeHistory from "./TradeHistory";
import AdminReport from "./AdminReport";
import AdminDeposits from "./AdminDeposit";
import AdminStaking from "./AdminStaking";
import AdminWithdrawal from "./AdminWithdrawal";
import AdminTeamAdvanced from "./AdminTeamAdvanced";
import AdminSupport from "./AdminSupport";
import AdminHistory from "./AdminHistory";
import "../styles/adminDashboard.css";
import API_BASE_URL from "../config";

const AdminDashboard = () => {
  const [page, setPage] = useState("dashboard");
  const [stats, setStats] = useState({
    users: 0,
    deposits: 0,
    withdrawals: 0,
    staking: 0,
    support: 0,
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const resp = await fetch(`${API_BASE_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await resp.json();
        if (resp.ok) {
          setStats(result);
        }
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (!token) {
    window.location.href = "/admin";
    return null;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar currentPage={page} onSelect={setPage} />

      <div className="dashboard-container">
        <div className="top-header-row">
          <div className="welcome-text">
            <h2>Admin <span>Panel</span></h2>
          </div>
        </div>

        {page === "dashboard" && (
          <>
            <div className="wallet-row">
              <div className="wallet-box">
                <h3>Total Users</h3>
                <p className="amount">{stats.users}</p>
              </div>
              <div className="wallet-box">
                <h3>Total Deposits</h3>
                <p className="amount">{stats.deposits}</p>
              </div>
              <div className="wallet-box">
                <h3>Total Withdrawals</h3>
                <p className="amount">{stats.withdrawals}</p>
              </div>
              <div className="wallet-box accent">
                <h3>Staking Count</h3>
                <p className="amount">{stats.staking}</p>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="income-section glass-card">
                <h4>Admin Actions</h4>
                <div className="income-list">
                  <p><span>Pending Support</span> <span>{stats.support}</span></p>
                  <p><span>System Status</span> <span style={{ color: "#4ade80" }}>Online</span></p>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="admin-page-content">
          {page === "trade" && <TradeHistory />}
          {page === "deposits" && <AdminDeposits />}
          {page === "staking-reports" && <AdminStaking />}
          {page === "report" && <AdminReport />}
          {page === "withdraw" && <AdminWithdrawal />}
          {page === "team" && <AdminTeamAdvanced />}
          {page === "history" && <AdminHistory />}
          {page === "support" && <AdminSupport />}
          {page === "settings" && <PackageSettings />}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;

