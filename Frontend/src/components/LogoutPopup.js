import React from "react";
import "../styles/LogoutPopup.css";

const LogoutPopup = ({ onCancel, onConfirm }) => {
  return (
    <div className="logout-overlay">
      <div className="logout-box">
        <h2>Are you sure you want to logout?</h2>

        <div className="btn-group">
          <button className="cancel-btn" onClick={onCancel}>Cancel</button>
          <button className="logout-btn" onClick={onConfirm}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPopup;
