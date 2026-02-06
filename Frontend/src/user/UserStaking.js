import React, { useState, useEffect } from "react";
import UserSidebar from "./UserSidebar";
import "../styles/UserStaking.css";
import API_BASE_URL from "../config";

const UserStaking = () => {
  const token = localStorage.getItem("authToken");
  const [wallet, setWallet] = useState("");
  const [amount, setAmount] = useState("");

  const [data, setData] = useState({
    stakingWallet: 0,
    remainingLimit: 20000,
    affiliateStake: 0,
    dailyStake: 0,
    referralCommission: 0,
    totalStaked: 0,
  });

  useEffect(() => {
    if (!token) {
      window.location.href = "/signin";
      return;
    }

    const fetchStakingData = async () => {
      try {
        const resp = await fetch(`${API_BASE_URL}/api/staking/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await resp.json();
        if (result && !result.message) {
          setData(result);
        }
      } catch (err) {
        console.error("Error fetching staking data:", err);
      }
    };

    fetchStakingData();
  }, [token]);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Install MetaMask!");
    const acc = await window.ethereum.request({ method: "eth_requestAccounts" });
    setWallet(acc[0]);
  };

  const stakeNow = async () => {
    const stakeValue = Number(amount);
    if (stakeValue <= 0) return alert("Enter valid amount");
    if (stakeValue > data.remainingLimit) return alert("Limit exceeded");

    const newData = {
      ...data,
      stakingWallet: data.stakingWallet + stakeValue,
      remainingLimit: data.remainingLimit - stakeValue,
      affiliateStake: data.affiliateStake + stakeValue * 0.02,
      dailyStake: data.dailyStake + stakeValue * 0.1,
      referralCommission: data.referralCommission + stakeValue * 0.03,
      totalStaked: data.totalStaked + stakeValue,
    };

    const historyRecord = {
      amount: stakeValue,
      dailyReward: stakeValue * 0.1,
      affiliateReward: stakeValue * 0.02,
      time: new Date().toLocaleString(),
    };

    try {
      const resp = await fetch(`${API_BASE_URL}/api/staking/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          wallet: wallet || "DEFAULT_WALLET", // Use fallback if not connected
          data: newData,
          history: historyRecord,
        }),
      });

      if (resp.ok) {
        setData(newData);
        setAmount("");
        alert("Staking Successful!");
      }
    } catch (err) {
      alert("Error saving staking data");
    }
  };

  return (
    <div className="staking-layout">
      <UserSidebar />

      <div className="staking-container">

        {/* wallet button */}
        <button className="wallet-btn" onClick={connectWallet}>
          {wallet ? wallet.slice(0, 6) + "..." + wallet.slice(-4) : "Connect Wallet"}
        </button>

        {/* Stake input */}
        <div className="stake-input-panel">
          <input
            type="number"
            placeholder="Enter staking amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={stakeNow} className="stake-btn">
            STAKE NOW

          </button>
        </div>

        {/* Display boxes */}
        <div className="staking-grid">

          <div className="box">
            <h4>Staking Wallet</h4>
            <p>{data.stakingWallet}</p>
          </div>

          <div className="box">
            <h4>Remaining Limit</h4>
            <p>{data.remainingLimit}</p>
          </div>

          <div className="box">
            <h4>Affiliate Stake</h4>
            <p>₹{(data.affiliateStake || 0).toFixed(2)}</p>
          </div>

          <div className="box">
            <h4>Daily Stake</h4>
            <p>₹{(data.dailyStake || 0).toFixed(2)}</p>
          </div>

          <div className="box">
            <h4>Referral Commission</h4>
            <p>₹{(data.referralCommission || 0).toFixed(2)}</p>
          </div>

          <div className="box">
            <h4>Total Staked</h4>
            <p>{data.totalStaked}</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserStaking;
