import React, { useState } from "react";
import UserSidebar from "./UserSidebar";
import "../styles/WithdrawalMember.css";
import API_BASE_URL from "../config";

const Withdrawal = () => {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("UPI");
  const [history, setHistory] = useState([]);
  const token = localStorage.getItem("authToken");

  React.useEffect(() => {
    if (!token) {
      window.location.href = "/signin";
      return;
    }

    const fetchHistory = async () => {
      try {
        const resp = await fetch(`${API_BASE_URL}/api/withdrawal/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await resp.json();
        setHistory(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching withdrawal history:", err);
      }
    };

    fetchHistory();
  }, [token]);

  const handleWithdraw = async () => {
    if (!amount) {
      alert("Enter withdrawal amount");
      return;
    }

    try {
      const resp = await fetch(`${API_BASE_URL}/api/withdrawal/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: Number(amount), method }),
      });


      const data = await resp.json();
      if (resp.ok) {
        alert("Withdrawal request submitted!");
        setAmount("");
        window.location.reload();
      } else {
        alert(data.message || "Failed to submit withdrawal");
      }
    } catch (err) {
      alert("Error submitting request");
    }
  };

  return (
    <div className="user-layout">
      <UserSidebar />

      <div className="withdraw-member-container">
        <div className="withdraw-header">
          <h1>Withdrawal <span>Portal</span></h1>
        </div>

        <div className="withdraw-grid">
          {/* WITHDRAWAL FORM */}
          <div className="glass-card withdraw-form-box">
            <h2 className="section-title">New Request</h2>

            <label>Amount to Withdraw</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <label>Select Method</label>
            <select value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Crypto Wallet">Crypto Wallet</option>
            </select>

            <button className="withdraw-main-btn" onClick={handleWithdraw}>
              Submit Withdrawal
            </button>
          </div>

          {/* WITHDRAWAL HISTORY */}
          <div className="history-section">
            <h2 className="section-title">Withdrawal History</h2>
            <div className="glass-card history-card">
              <div className="table-header">
                <span>DATE</span>
                <span>AMOUNT</span>
                <span>METHOD</span>
                <span>STATUS</span>
              </div>

              {history.length > 0 ? (
                history.map((w, i) => (
                  <div className="table-row" key={i}>
                    <span>{w.date}</span>
                    <span>₹{w.amount}</span>
                    <span>{w.method}</span>
                    <span>
                      <span className={`status-badge status-${w.status?.toLowerCase() || 'pending'}`}>
                        {w.status || 'Pending'}
                      </span>
                    </span>
                  </div>
                ))
              ) : (
                <p className="no-data">No withdrawal records found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdrawal;

