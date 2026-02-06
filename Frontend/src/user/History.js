import React, { useEffect, useState } from "react";
import UserSidebar from "./UserSidebar";
import "../styles/History.css";
import API_BASE_URL from "../config";

const History = () => {
  const [history, setHistory] = useState({
    deposits: [],
    withdrawals: [],
    staking: [],
    rewards: []
  });
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      window.location.href = "/signin";
      return;
    }

    const fetchAllHistory = async () => {
      try {
        const [dep, wit, stk, rew] = await Promise.all([
          fetch(`${API_BASE_URL}/api/deposit/history`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/withdrawal/history`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/staking/history`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/staking/rewards`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        ]);

        setHistory({
          deposits: Array.isArray(dep) ? dep : [],
          withdrawals: Array.isArray(wit) ? wit : [],
          staking: Array.isArray(stk) ? stk : [],
          rewards: Array.isArray(rew) ? rew : []
        });
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    fetchAllHistory();
  }, [token]);

  return (
    <div className="history-layout">

      <UserSidebar />

      <div className="history-container">
        <h1>Transaction History</h1>

        {/* ====================== DEPOSIT HISTORY ====================== */}
        <h2 className="section-title">Deposit History</h2>
        <div className="history-table">
          <div className="table-header">
            <span>DATE</span>
            <span>AMOUNT</span>
            <span>METHOD</span>
            <span>STATUS</span>
          </div>

          {history.deposits.length === 0 ? (
            <p className="no-data">No deposit records found</p>
          ) : (
            history.deposits.map((d, i) => (
              <div className="table-row" key={i}>
                <span>{d.date}</span>
                <span>₹{d.amount}</span>
                <span>{d.method}</span>
                <span>{d.status}</span>
              </div>
            ))
          )}
        </div>

        {/* ====================== WITHDRAWAL HISTORY ====================== */}
        <h2 className="section-title">Withdrawal History</h2>
        <div className="history-table">
          <div className="table-header">
            <span>DATE</span>
            <span>AMOUNT</span>
            <span>METHOD</span>
            <span>STATUS</span>
          </div>

          {history.withdrawals.length === 0 ? (
            <p className="no-data">No withdrawal records found</p>
          ) : (
            history.withdrawals.map((w, i) => (
              <div className="table-row" key={i}>
                <span>{w.date}</span>
                <span>₹{w.amount}</span>
                <span>{w.method}</span>
                <span>{w.status}</span>
              </div>
            ))
          )}
        </div>

        {/* ====================== STAKING HISTORY ====================== */}
        <h2 className="section-title">Staking History</h2>
        <div className="history-table">
          <div className="table-header">
            <span>DATE</span>
            <span>PACKAGE</span>
            <span>AMOUNT</span>
            <span>STATUS</span>
          </div>

          {history.staking.length === 0 ? (
            <p className="no-data">No staking history found</p>
          ) : (
            history.staking.map((s, i) => (
              <div className="table-row" key={i}>
                <span>{s.date}</span>
                <span>{s.package}</span>
                <span>₹{s.amount}</span>
                <span>{s.status}</span>
              </div>
            ))
          )}
        </div>

        {/* ====================== REWARD / INCOME HISTORY ====================== */}
        <h2 className="section-title">Reward Income History</h2>
        <div className="history-table">
          <div className="table-header">
            <span>DATE</span>
            <span>TYPE</span>
            <span>AMOUNT</span>
            <span>LEVEL</span>
          </div>

          {history.rewards.length === 0 ? (
            <p className="no-data">No rewards found</p>
          ) : (
            history.rewards.map((r, i) => (
              <div className="table-row" key={i}>
                <span>{r.date}</span>
                <span>{r.type}</span>
                <span>₹{r.amount}</span>
                <span>{r.level}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
