import React, { useState, useEffect } from "react";
import UserSidebar from "./UserSidebar";
import "../styles/Transfer.css";

const Transfer = () => {
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      window.location.href = "/signin";
      return;
    }

    const fetchData = async () => {
      try {
        const [profileResp, historyResp] = await Promise.all([
          fetch("http://localhost:5000/api/user/profile", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://localhost:5000/api/user/transfer-history", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const profileData = await profileResp.json();
        const historyData = await historyResp.json();

        if (profileData.success) {
          setBalance(profileData.user.balance || 0);
        }
        setHistory(Array.isArray(historyData) ? historyData : []);
      } catch (err) {
        console.error("Error fetching transfer data:", err);
      }
    };

    fetchData();
  }, [token]);

  const handleTransfer = async () => {
    if (!receiver || !amount) {
      alert("Enter all fields");
      return;
    }

    try {
      const resp = await fetch(`${API_BASE_URL}/api/user/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receiver, amount, message }),
      });

      const data = await resp.json();
      if (data.success) {
        alert("Transfer successful!");
        window.location.reload();
      } else {
        alert(data.message || "Transfer failed");
      }
    } catch (err) {
      alert("Error processing transfer");
    }
  };

  return (
    <div className="transfer-layout">
      <UserSidebar />

      <div className="transfer-container">
        <h1>Transfer Funds</h1>

        <div className="glass-box">
          <label>Receiver (Email or User ID)</label>
          <input
            type="text"
            placeholder="Enter receiver email or ID"
            onChange={(e) => setReceiver(e.target.value)}
          />

          <label>Amount</label>
          <input
            type="number"
            placeholder="Enter amount"
            onChange={(e) => setAmount(e.target.value)}
          />

          <label>Message (optional)</label>
          <input
            type="text"
            placeholder="Message"
            onChange={(e) => setMessage(e.target.value)}
          />

          <p className="balance-label">
            Your Balance: <b>{balance}</b>
          </p>

          <button className="transfer-btn" onClick={handleTransfer}>
            Send Transfer
          </button>
        </div>

        <h2 className="section-title">Transfer History</h2>

        <div className="transfer-table">
          <div className="table-header">
            <span>DATE</span>
            <span>SENDER</span>
            <span>RECEIVER</span>
            <span>AMOUNT</span>
          </div>

          {history.length ? (
            history.map((t, i) => (
              <div className="table-row" key={i}>
                <span>{t.date}</span>
                <span>You</span>
                <span>{t.receiverEmail}</span>
                <span>{t.amount}</span>
              </div>
            ))
          ) : (
            <p className="no-data">No transfer records found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transfer;
