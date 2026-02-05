import React, { useState } from "react";
import UserSidebar from "./UserSidebar";
import "../styles/RegisterMember.css";
import API_BASE_URL from "../config";

const Register = () => {
  const token = localStorage.getItem("authToken");
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    if (!token) {
      window.location.href = "/signin";
    }
  }, [token]);

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    wallet: "",
  });

  const [sponsorCode, setSponsorCode] = useState("");

  React.useEffect(() => {
    if (!token) {
      window.location.href = "/signin";
      return;
    }

    const fetchProfile = async () => {
      try {
        const resp = await fetch(`${API_BASE_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await resp.json();
        if (data.success) {
          setSponsorCode(data.user.userCode || data.user.id);
        }
      } catch (err) { }
    };
    fetchProfile();
  }, [token]);

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (form.password !== form.confirm) return alert("Passwords do not match");

    try {
      const resp = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          sponsorCode: sponsorCode,
        }),
      });

      const data = await resp.json();
      if (resp.ok) {
        alert("Registration Successful!");
        setForm({ fullname: "", email: "", phone: "", password: "", confirm: "", wallet: "" });
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      alert("Error registering user");
    }
  };

  return (
    <div className="user-layout">
      <UserSidebar />

      <div className="reg-member-container">
        <div className="reg-header">
          <h1>DeFiDrogan NFT — <span>Registration</span></h1>
          <button className="wallet-btn">Connect Wallet</button>
        </div>

        <div className="reg-content-grid">
          {/* LEFT FORM BOX */}
          <div className="glass-card">
            <div className="sponsor-badge">
              <div className="nft-indicator">NFT</div>
              <div className="sponsor-id">SPONSOR ID : {sponsorCode}</div>
            </div>

            <div className="form-body">
              <div className="input-group full-width">
                <input name="fullname" placeholder="Full Name" value={form.fullname} onChange={update} />
              </div>
              <div className="input-group">
                <input name="email" placeholder="Email" value={form.email} onChange={update} />
              </div>
              <div className="input-group">
                <input name="phone" placeholder="Phone" value={form.phone} onChange={update} />
              </div>
              <div className="input-group">
                <input type="password" name="password" placeholder="Password" value={form.password} onChange={update} />
              </div>
              <div className="input-group">
                <input type="password" name="confirm" placeholder="Confirm Password" value={form.confirm} onChange={update} />
              </div>
              <div className="input-group full-width">
                <input name="wallet" placeholder="Wallet Address (optional)" value={form.wallet} onChange={update} />
              </div>

              <div className="reg-submit-section">
                <span className="login-hint">Already have an account?</span>
                <button className="register-main-btn" onClick={handleRegister}>Register Now</button>
              </div>
            </div>
          </div>

          {/* RIGHT DATA BOX */}
          <div className="info-box">
            <div className="glass-card address-box">
              <label>opUSDT address :</label>
              <input readOnly placeholder="Connect wallet or paste address" />
            </div>

            <div className="glass-card address-box">
              <label>opDRN coin address :</label>
              <input readOnly placeholder="Connect wallet or paste address" />
            </div>

            <button className="change-pwd-btn">Change Password</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

