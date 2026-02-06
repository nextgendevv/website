import React, { useState, useEffect } from "react";
import "../styles/AdminStaking.css";
import API_BASE_URL from "../config";

const AdminStaking = () => {
  const [stakingRecords, setStakingRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchStaking();
  }, []);

  const fetchStaking = async () => {
    try {
      const resp = await fetch(`${API_BASE_URL}/api/admin/staking`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await resp.json();
      if (resp.ok) {
        setStakingRecords(data);
      }
    } catch (err) {
      console.error("Error fetching staking:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-text">Loading Staking Reports...</div>;

  return (
    <div className="admin-staking-layout">
      <div className="staking-header">
        <h2>📊 User Staking Reports</h2>
      </div>

      <div className="admin-staking-table">
        <div className="row head">
          <div>Wallet</div>
          <div>Total Staked</div>
          <div>Daily Stake</div>
          <div>Affiliate Stake</div>
          <div>Remaining Limit</div>
        </div>

        {stakingRecords.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#aaa" }}>
            No staking records found
          </div>
        ) : (
          stakingRecords.map((s) => (
            <div className="row" key={s._id}>
              <div style={{ fontWeight: "600", color: "#b0c4de", fontFamily: "monospace" }}>{s.wallet}</div>
              <div style={{ color: "white", fontWeight: "bold" }}>₹{s.totalStaked}</div>
              <div style={{ color: "#4ade80" }}>₹{s.dailyStake}</div>
              <div style={{ color: "#4fa7ff" }}>₹{s.affiliateStake}</div>
              <div style={{ color: "#f87171" }}>₹{s.remainingLimit}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminStaking;

