import React, { useEffect, useState } from "react";
import "../styles/tradeHistory.css";
import API_BASE_URL from "../config";

// Component to display trade history cards
const TradeHistory = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    try {
      const resp = await fetch(`${API_BASE_URL}/api/admin/trades`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await resp.json();
      setTrades(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching trades:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="trade-box"><p style={{ color: 'white', textAlign: 'center' }}>Loading trades...</p></div>;
  }

  if (trades.length === 0) {
    return (
      <div className="trade-box">
        <div className="history-card">
          <p style={{ textAlign: 'center', width: '100%', fontStyle: 'italic' }}>
            No trade history available. Future user trades will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="trade-box">
      {trades.map((trade, i) => (
        <div className="history-card" key={trade._id || i}>
          <div>
            <p><b>User:</b> {trade.userId?.fullname || 'Unknown'}</p>
            <p><b>Type:</b> {trade.tradeType}</p>
          </div>
          <div>
            <p><b>Asset:</b> {trade.asset}</p>
            <p><b>Amount:</b> {trade.amount}</p>
          </div>
          <div>
            <p><b>Price:</b> ${trade.price}</p>
            <p><b>Total:</b> ${trade.total}</p>
          </div>
          <div>
            <p><b>Status:</b> {trade.status}</p>
            <p><b>Date:</b> {new Date(trade.date).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TradeHistory;
