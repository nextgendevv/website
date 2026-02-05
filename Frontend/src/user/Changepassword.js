import React, { useState } from "react";
import UserSidebar from "./UserSidebar";
import "../styles/Changepassword.css";
import API_BASE_URL from "../config";

const ChangePassword = () => {
  const [pass, setPass] = useState({ current: "", newPass: "", confirm: "" });
  const token = localStorage.getItem("authToken");

  React.useEffect(() => {
    if (!token) {
      window.location.href = "/signin";
    }
  }, [token]);

  const handleUpdate = async () => {
    if (pass.newPass !== pass.confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      const resp = await fetch(`${API_BASE_URL}/api/user/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current: pass.current,
          newPass: pass.newPass,
        }),
      });

      const data = await resp.json();
      if (data.success) {
        alert("Password updated successfully!");
        setPass({ current: "", newPass: "", confirm: "" });
      } else {
        alert(data.message || "Failed to update password");
      }
    } catch (err) {
      alert("Error updating password");
    }
  };

  return (
    <div className="change-password-layout">
      <UserSidebar />
      <div className="change-password-container">
        <div className="password-card">
          <h2>Update Password</h2>
          <div className="input-group">
            <label>Current Password</label>
            <input
              type="password"
              value={pass.current}
              onChange={(e) => setPass({ ...pass, current: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label>New Password</label>
            <input
              type="password"
              value={pass.newPass}
              onChange={(e) => setPass({ ...pass, newPass: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={pass.confirm}
              onChange={(e) => setPass({ ...pass, confirm: e.target.value })}
            />
          </div>
          <button className="change-btn" onClick={handleUpdate}>
            UPDATE PASSWORD
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
