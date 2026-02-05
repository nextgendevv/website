import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import logo from "../assets/logo.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const layer1 = useRef(null);
  const layer2 = useRef(null);

  useEffect(() => {
    let latestScrollY = 0;
    let ticking = false;

    const updateParallax = () => {
      if (layer1.current && layer2.current) {
        layer1.current.style.transform = `translateY(${latestScrollY * 0.4}px)`;
        layer2.current.style.transform = `translateY(${latestScrollY * 0.2}px)`;
      }
      ticking = false;
    };

    const onScroll = () => {
      latestScrollY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="dashboard-wrapper">
      {/* PARALLAX BACKGROUNDS */}
      <div ref={layer1} className="parallax-bg layer-1" />
      <div ref={layer2} className="parallax-bg layer-2" />

      {/* NAV */}
      <nav className="top-nav glass-header">
        <button className="nav-btn admin-btn" onClick={() => navigate("/admin")}>
          ADMIN LOGIN
        </button>

        <img src={logo} alt="logo" className="hero-logo" />

        <div className="nav-actions">
          <button className="nav-btn" onClick={() => navigate("/signin")}>
            SIGN IN
          </button>
          <button className="nav-btn highlight" onClick={() => navigate("/signup")}>
            SIGN UP
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            The Future of <span>NFT Staking</span>
          </h1>
          <p className="hero-subtitle">
            Secure assets, earn rewards, and experience ultra-smooth DeFi staking.
          </p>
          <div className="hero-buttons">
            <button className="cta-btn primary">Get Started</button>
            <button className="cta-btn secondary">Marketplace</button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-preview">
        <div className="glass-card">
          <h3>Secure Vault</h3>
          <p>Enterprise-grade security for NFTs.</p>
        </div>
        <div className="glass-card">
          <h3>Instant Rewards</h3>
          <p>Live staking income without delays.</p>
        </div>
        <div className="glass-card">
          <h3>Global Access</h3>
          <p>Trade anywhere, anytime.</p>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
