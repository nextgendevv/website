import React from "react";
import "../styles/sidebar.css";

const sidebarItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "trade", label: "Trade History" },
  { id: "report", label: "Report" },
  { id: "team", label: "Team" },
  { id: "withdraw", label: "Withdrawal" },
  { id: "deposits", label: "Deposits" },
  { id: "staking-reports", label: "Staking Reports" },
  { id: "support", label: "Support" },
  { id: "history", label: "History" },
  { id: "logout", label: "Logout" },
];

const Sidebar = ({ currentPage, onSelect }) => {
  const handleClick = (id) => {
    if (id === "logout") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("isAdmin");
      window.location.href = "/";
      return;
    }


    onSelect(id); // ← THIS IS WHAT SWITCHES THE PAGE
  };

  return (
    <div className="sidebar">
      {sidebarItems.map((item) => (
        <button
          key={item.id}
          className={currentPage === item.id ? "active" : ""}
          onClick={() => handleClick(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
