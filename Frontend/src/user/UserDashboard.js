import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import "../styles/UserDashboardMember.css";
import dragonNft from "../assets/dragon-nft.png";
import API_BASE_URL from "../config";

const UserDashboard = () => {
  const [data, setData] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/signin");
      return;
    }

    const fetchData = async () => {
      try {
        const resp = await fetch(`${API_BASE_URL}/api/user/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!resp.ok) {
          const errorData = await resp.json();
          console.error("Dashboard Fetch Error:", errorData.message);
          return;
        }

        const result = await resp.json();
        setData(result);
        if (result.trade && result.trade.tradeTimer) {
          setTimeLeft(result.trade.tradeTimer);
        }
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      }
    };

    fetchData();
  }, [token]);

  // Trade Countdown Timer Effect
  useEffect(() => {
    if (!timeLeft || timeLeft === "00:00:00") return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        let [h, m, s] = prev.split(":").map(Number);
        if (h === 0 && m === 0 && s === 0) {
          clearInterval(interval);
          return "00:00:00";
        }
        if (s > 0) s--;
        else {
          s = 59;
          if (m > 0) m--;
          else {
            m = 59;
            if (h > 0) h--;
          }
        }
        return [h, m, s].map((v) => v.toString().padStart(2, "0")).join(":");
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleConnectWallet = () => {
    alert("Connect Wallet: Coming Soon!");
  };

  const handleUpgrade = async (type) => {
    setLoadingAction(type);
    // Simulate API call
    setTimeout(() => {
      alert(`${type} Upgrade initiated!`);
      setLoadingAction(null);
    }, 1500);
  };

  const handleBuyNft = async (price) => {
    setLoadingAction(`nft-${price}`);
    // Simulate API call
    setTimeout(() => {
      alert(`Dragon NFT for ₹${price} purchased!`);
      setLoadingAction(null);
    }, 1500);
  };

  const handleCopyReferral = () => {
    if (data?.referral?.referralLink) {
      navigator.clipboard.writeText(data.referral.referralLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  if (!data) return (
    <div className="user-layout">
      <UserSidebar />
      <div className="loading-screen">
        <div className="loader">Loading Dashboard...</div>
      </div>
    </div>
  );

  return (
    <div className="user-layout">
      <UserSidebar />

      <div className="dashboard-member-container">
        {/* TOP HEADER */}
        <div className="top-header-row">
          <div className="welcome-text">
            <h2>Welcome back, <span>{data.user?.fullname || "User"}</span></h2>
          </div>
          <div className="top-wallet-btn">
            <button onClick={handleConnectWallet} className="connect-btn">Connect Wallet</button>
          </div>
        </div>

        {/* WALLET BOXES */}
        <div className="wallet-row">
          <div className="wallet-box accent">
            <h3>Available Balance</h3>
            <p className="amount">₹{(data.availableBalance || 0).toFixed(2)}</p>
          </div>

          <div className="wallet-box">
            <h3>Deposit Wallet</h3>
            <p className="amount">₹{(data.depositWallet || 0).toFixed(2)}</p>
          </div>

          <div className="wallet-box">
            <h3>Total Withdrawn</h3>
            <p className="amount">₹{(data.withdrawWallet || 0).toFixed(2)}</p>
          </div>

          <div className="wallet-box">
            <h3>Staking Wallet</h3>
            <p className="amount">₹{data.stakingWallet || 0}</p>
            <button
              className="upgrade-btn-small"
              onClick={() => handleUpgrade("₹ Staking")}
              disabled={loadingAction === "Staking"}
            >
              {loadingAction === "Staking" ? "Processing..." : "UPGRADE"}
            </button>
          </div>
        </div>

        {/* GRID SECTION */}
        <div className="dashboard-grid">
          <div className="income-section glass-card">
            <h4>Income Streams</h4>
            <div className="income-list">
              <p><span>Activation income</span> <span>{data.income.activation}</span></p>
              <p><span>Activation level income</span> <span>{data.income.activationLevel}</span></p>
              <p><span>Trade income</span> <span>{data.income.trade}</span></p>
              <p><span>Trade level income</span> <span>{data.income.tradeLevel}</span></p>
              <p><span>Package staking income</span> <span>{data.income.staking}</span></p>
              <p><span>Autofull income</span> <span>{data.income.autofill}</span></p>
              <p><span>Referral coin income</span> <span>{data.income.referralCoin}</span></p>
              <p><span>ROI income (2X Plan)</span> <span>{data.income.staking || 0}</span></p>
              <p><span>Daily coin collect income</span> <span>{data.income.dailyCoin}</span></p>
            </div>
          </div>

          <div className="referral-section">
            <div className="referral-box glass-card">
              <h4>Referral & Downline</h4>
              <div className="referral-stats">
                <p><span>Direct referral</span> <span>{data.referral.directReferrals}</span></p>
                <p><span>Total Downline</span> <span>{data.referral.totalDownline}</span></p>
                <p><span>Team Staking</span> <span>{data.referral.totalCoinDownlineStaking}</span></p>
              </div>
              <div className="referral-link-container">
                <label>Your Referral Link</label>
                <div className="copy-input">
                  <input type="text" value={data.referral.referralLink} readOnly />
                  <button onClick={handleCopyReferral} className={copySuccess ? "copied" : ""}>
                    {copySuccess ? "COPIED" : "COPY"}
                  </button>
                </div>
              </div>
            </div>

            <div className="quick-actions glass-card">
              <h4>Quick Upgrades</h4>
              <div className="ref-upgrade">
                <p>Active Package</p>
                <button onClick={() => handleUpgrade("Active Package")}>
                  {loadingAction === "Active Package" ? "..." : "UPGRADE"}
                </button>
              </div>
              <div className="ref-upgrade">
                <p>Staking Package</p>
                <button onClick={() => handleUpgrade("Staking Package")}>
                  {loadingAction === "Staking Package" ? "..." : "UPGRADE"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PKG BUTTONS */}
        <div className="pkg-buttons-row">
          <button className="pkg-btn" onClick={() => handleUpgrade("₹25")}>
            {loadingAction === "₹25" ? "Wait..." : "₹25 UPGRADE"}
          </button>
          <button className="pkg-btn" onClick={() => handleUpgrade("₹50")}>
            {loadingAction === "₹50" ? "Wait..." : "₹50 UPGRADE"}
          </button>
          <div className="trade-status-btn">
            <span>REMAINING TRADE</span>
            <strong>{data.trade.remainingTrade}₹</strong>
          </div>
          <div className="trade-timer-btn">
            <span>NEXT RESET</span>
            <strong>{timeLeft}</strong>
          </div>
        </div>

        {/* NFT SECTION */}
        <div className="nft-section">
          <h3>Collection: Dragon NFT</h3>
          <div className="nft-row">
            {[10, 15, 22.5, 33.75, 50, 20].map((price, i) => (
              <div className="nft-card" key={i}>
                <div className="nft-img-wrapper">
                  <img src={dragonNft} alt="nft" />
                </div>
                <div className="nft-details">
                  <h3>Dragon NFT #{i + 1}</h3>
                  <p className="price">₹{price}</p>
                  <button
                    onClick={() => handleBuyNft(price)}
                    disabled={loadingAction === `nft-${price}`}
                  >
                    {loadingAction === `nft-${price}` ? "BUYING..." : "BUY NOW"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

