import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminLogin.css";
import API_BASE_URL from "../config";

const AdminLogin = () => {
  const [username, setUsername] = useState("Stake");
  const [password, setPassword] = useState("stake@123");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resp = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await resp.json();

      if (resp.ok) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("isAdmin", "true");
        navigate("/admin/dashboard");
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("Something went wrong");
    }
  };
  return (
    <div className="admin-page">
      <div className="login-card">
        <h1 className="title">DeFiDroganNFT</h1>
        <h2 className="subtitle">Admin</h2>

        <label>Username</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />

        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <div className="remember-row">
          <input type="checkbox" />
          <label>Remember me</label>
        </div>

        <button className="login-btn" onClick={handleSubmit}>Log In</button>
        <div className="forgot">Forgot your password?</div>
      </div>
    </div>
  );
};

export default AdminLogin;
