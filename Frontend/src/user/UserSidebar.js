import React, { useState } from "react";
import "../styles/UserSidebar.css";
import { useNavigate } from "react-router-dom";
import LogoutPopup from "../components/LogoutPopup";

const items = [
  "Dashboard",
  "Profile",
  "Registration",
  "Staking",
  "Deposit",
  "Team",
  "History",
  "Withdrawal",
  "Report",
  "Transfer",
  "Invest",
  "Support",
  "Logout"
];

const UserSidebar = () => {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (item) => {
    const path = item.toLowerCase();
    setIsOpen(false); // Close sidebar on navigation (mobile)

    switch (path) {
      case "dashboard":
        navigate("/user/dashboard");
        break;

      case "profile":
        navigate("/user/profile");
        break;

      case "registration":
        navigate("/user/registration");
        break;

      case "staking":
        navigate("/user/staking");
        break;

      case "deposit":
        navigate("/user/deposit");
        break;

      case "team":
        navigate("/user/team");
        break;

      case "history":
        navigate("/user/history");
        break;

      case "withdrawal":
        navigate("/user/withdrawal");
        break;

      case "report":
        navigate("/user/report");
        break;

      case "transfer":
        navigate("/user/transfer");
        break;

      case "invest":
        navigate("/user/invest");
        break;

      case "support":
        navigate("/user/support");
        break;

      case "logout":
        setShowLogout(true);
        break;

      default:
        console.log("Unknown path:", item);
    }
  };

  const confirmLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("authToken");
    window.location.href = "/"; // redirect to landing page
  };

  const currentPath = window.location.pathname.toLowerCase();

  return (
    <>
      {/* Mobile Toggle Button */}
      <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
        <span className={isOpen ? "close-icon" : "menu-icon"}></span>
      </button>

      <div className={`user-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <h2>PRO<span>DASH</span></h2>
        </div>

        {items.map((item, index) => {
          const path = item.toLowerCase();
          const isActive =
            (path === "dashboard" && currentPath.includes("dashboard")) ||
            (currentPath.includes(path));

          return (
            <button
              key={index}
              className={isActive ? "active" : ""}
              onClick={() => handleNavigate(item)}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* Logout Confirmation Popup */}
      {showLogout && (
        <LogoutPopup
          onCancel={() => setShowLogout(false)}
          onConfirm={confirmLogout}
        />
      )}

      {/* Backdrop for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>}
    </>
  );
};

export default UserSidebar;
