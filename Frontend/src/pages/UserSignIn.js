import React, { useState } from "react";
import "../styles/UserSignIn.css";
import API_BASE_URL from "../config";

const UserSignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");

  const loginUser = async () => {
    try {
      const resp = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });


      const data = await resp.json();

      if (data.success) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("loggedInUser", JSON.stringify(data.user));
        alert("Login Success!");
        window.location.href = "/user/UserDashboard"; // Unified redirect
      } else {
        alert(data.message || "Invalid Email or Password");
      }
    } catch (err) {
      alert("Error connecting to server");
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-card">
        <h1>Sign In</h1>

        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" onChange={(e) => setPass(e.target.value)} />

        <button className="signin-btn" onClick={loginUser}>Sign In</button>
      </div>
    </div>
  );
};

export default UserSignIn;
