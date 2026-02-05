import React, { useEffect, useState } from "react";
import "../styles/AdminHistory.css";
import API_BASE_URL from "../config";

const AdminHistory = () => {
  const [data, setData] = useState({
    deposits: [],
    withdrawals: [],
    staking: [],
    transfers: [],
    trades: [],
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchAllHistory();
  }, []);

  const fetchAllHistory = async () => {
    try {
      const resp1 = await fetch(`${API_BASE_URL}/api/admin/deposits`, { headers: { Authorization: `Bearer ${token}` } });
      const resp2 = await fetch(`${API_BASE_URL}/api/admin/withdrawals`, { headers: { Authorization: `Bearer ${token}` } });
      const resp3 = await fetch(`${API_BASE_URL}/api/admin/staking`, { headers: { Authorization: `Bearer ${token}` } });
      const resp4 = await fetch(`${API_BASE_URL}/api/admin/transfers`, { headers: { Authorization: `Bearer ${token}` } });
      const resp5 = await fetch(`${API_BASE_URL}/api/admin/trades`, { headers: { Authorization: `Bearer ${token}` } });

      const d1 = await resp1.json();
      const d2 = await resp2.json();
      const d3 = await resp3.json();
      const d4 = await resp4.json();
      const d5 = await resp5.json();

      setData({
        deposits: Array.isArray(d1) ? d1 : [],
        withdrawals: Array.isArray(d2) ? d2 : [],
        staking: Array.isArray(d3) ? d3 : [],
        transfers: Array.isArray(d4) ? d4 : [],
        trades: Array.isArray(d5) ? d5 : [],
      });
    } catch (err) {
      console.error("Error fetching admin history:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-text">Loading History...</div>;

  return (
    <div className="admin-history-layout">
      <div className="admin-history-container">
        <h1>📊 Transaction History</h1>

        {/* TRADES */}
        <div className="history-section">
          <h2 className="section-title">💹 Trade History</h2>
          <div className="history-table">
            {data.trades.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Type</th>
                    <th>Asset</th>
                    <th>Amount</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.trades.map(t => (
                    <tr key={t._id}>
                      <td>{t.userId?.fullname || "User"}</td>
                      <td><span className={`status-badge ${t.tradeType === 'BUY' ? 'status-approved' : 'status-pending'}`}>{t.tradeType}</span></td>
                      <td>{t.asset}</td>
                      <td>{t.amount}</td>
                      <td>${t.price}</td>
                      <td>${t.total}</td>
                      <td>{new Date(t.date).toLocaleDateString()}</td>
                      <td><span className={`status-badge status-${t.status?.toLowerCase()}`}>{t.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">No trade records found. Trades will appear here when users make transactions.</p>
            )}
          </div>
        </div>

        {/* DEPOSITS */}
        <div className="history-section">
          <h2 className="section-title">📥 Deposit History</h2>
          <div className="history-table">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.deposits.map(d => (
                  <tr key={d._id}>
                    <td>{d.name}</td>
                    <td>${d.amount}</td>
                    <td>{d.method}</td>
                    <td>{new Date(d.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge status-${d.status?.toLowerCase()}`}>{d.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* WITHDRAWALS */}
        <div className="history-section">
          <h2 className="section-title">📤 Withdrawal History</h2>
          <div className="history-table">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.withdrawals.map(w => (
                  <tr key={w._id}>
                    <td>{w.userId?.fullname || "User"}</td>
                    <td>${w.amount}</td>
                    <td>{w.method}</td>
                    <td>{new Date(w.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge status-${w.status?.toLowerCase()}`}>{w.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TRANSFERS */}
        <div className="history-section">
          <h2 className="section-title">💸 Transfer History</h2>
          <div className="history-table">
            <table>
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Receiver Email</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.transfers.map(t => (
                  <tr key={t._id}>
                    <td>{t.senderId?.fullname || "User"}</td>
                    <td>{t.receiverEmail}</td>
                    <td>${t.amount}</td>
                    <td>{new Date(t.date).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHistory;
