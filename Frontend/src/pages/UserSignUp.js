import React, { useState } from "react";
import "../styles/userRegistration.css";
import API_BASE_URL from "../config";

const UserSignUp = () => {

  // 🔹 DETECT REFERRAL ID FROM URL → ?ref=12345
  const params = new URLSearchParams(window.location.search);
  const sponsorId = params.get("ref");

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    wallet: "",
  });

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const registerUser = async () => {
    if (!form.fullname || !form.email || !form.password) {
      alert("Fill required fields");
      return;
    }
    if (form.password !== form.confirm) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const resp = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: form.fullname,
          email: form.email,
          phone: form.phone,
          password: form.password,
          wallet: form.wallet,
          sponsorCode: sponsorId, // Passed from URL ?ref=...
        }),
      });

      const data = await resp.json();

      if (data.success) {
        alert("Registration Successful!");
        window.location.href = "/signin";
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      alert("Error connecting to server");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1 className="title">DeFiDroganNFT — Register</h1>

        <input name="fullname" placeholder="Full Name" onChange={update} />
        <input name="email" placeholder="Email" onChange={update} />
        <input name="phone" placeholder="Phone" onChange={update} />

        {sponsorId && (
          <div className="referral-info">
            Referred by User ID: {sponsorId}
          </div>
        )}

        <input type="password" name="password" placeholder="Password" onChange={update} />
        <input type="password" name="confirm" placeholder="Confirm Password" onChange={update} />
        <input name="wallet" placeholder="Wallet Address (optional)" onChange={update} />

        <button className="signup-btn" onClick={registerUser}>
          REGISTER
        </button>

        <p className="login-link">
          Already have an account? <a href="/signin">Login</a>
        </p>
      </div>
    </div>
  );
};

export default UserSignUp;
