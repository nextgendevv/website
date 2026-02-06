import React from "react";
import UserSidebar from "./UserSidebar";
import "../styles/StakingHistory.css";
import API_BASE_URL from "../config";

const StakingHistory = () => {
  const token = localStorage.getItem("authToken");
  const [history, setHistory] = React.useState([]);

  React.useEffect(() => {
    if (!token) {
      window.location.href = "/signin";
      return;
    }

    const fetchHistory = async () => {
      try {
        const resp = await fetch(`${API_BASE_URL}/api/staking/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await resp.json();
        setHistory(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching staking history:", err);
      }
    };

    fetchHistory();
  }, [token]);

  return (
    <div className="staking-history-layout">
      <UserSidebar />
      <div className="staking-history-container">
        <h2>Staking History</h2>
        <table className="staking-table">
          <thead>
            <tr>
              <th>Amount (₹)</th>
              <th>Daily Reward (₹)</th>
              <th>Affiliate Reward (₹)</th>
              <th>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? (
              history.map((h, i) => (
                <tr key={i}>
                  <td>₹{h.amount}</td>
                  <td>₹{h.dailyReward}</td>
                  <td>₹{h.affiliateReward}</td>
                  <td>{h.time}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-data">No Staking History Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StakingHistory;
