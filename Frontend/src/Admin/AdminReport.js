import React, { useEffect, useState } from "react";
import "../styles/UserDashboard.css";
import API_BASE_URL from "../config";

const AdminReport = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const resp = await fetch(`${API_BASE_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await resp.json();
        if (resp.ok) {
          setStats(data);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) return <div className="loading-text">Loading Reports...</div>;

  return (
    <div className="admin-report-container" style={{ padding: 20 }}>
      <h2 style={{ color: "white", marginBottom: 20 }}>📊 System Financial Report</h2>

      <div className="wallet-row" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
        <div className="wallet-card glass-card">
          <h4>TOTAL USERS</h4>
          <div className="amount">{stats?.users || 0}</div>
          <p>Registered Members</p>
        </div>

        <div className="wallet-card glass-card">
          <h4>TOTAL DEPOSITS</h4>
          <div className="amount">${stats?.amounts?.deposits?.toFixed(2) || "0.00"}</div>
          <p>Approved Total</p>
        </div>

        <div className="wallet-card glass-card">
          <h4>TOTAL WITHDRAWALS</h4>
          <div className="amount">${stats?.amounts?.withdrawals?.toFixed(2) || "0.00"}</div>
          <p>Approved Total</p>
        </div>

        <div className="wallet-card glass-card">
          <h4>TOTAL STAKING</h4>
          <div className="amount">${stats?.amounts?.staking?.toFixed(2) || "0.00"}</div>
          <p>Active Staked Amount</p>
        </div>
      </div>

      <div className="income-section glass-card" style={{ marginTop: 30 }}>
        <h3 style={{ color: "white", marginBottom: 15 }}>Summary Overview</h3>
        <div style={{ color: "rgba(255,255,255,0.7)", lineHeight: "2" }}>
          <div>Pending Support Tickets: <span style={{ color: "#fbbf24", fontWeight: "bold" }}>{stats?.support || 0}</span></div>
          <div>System Efficiency: <span style={{ color: "#4ade80", fontWeight: "bold" }}>High</span></div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 10, pt: 10 }}>
            <p>This report provides a real-time summary of all financial activities across the platform, including user balances, staking pools, and transaction volumes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReport;

