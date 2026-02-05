import React, { useState, useEffect } from "react";
import UserSidebar from "./UserSidebar";
import "../styles/UserReport.css";
import API_BASE_URL from "../config";

const UserReport = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [reports, setReports] = useState([]);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      window.location.href = "/signin";
      return;
    }

    const fetchHistory = async () => {
      try {
        const resp = await fetch(`${API_BASE_URL}/api/report/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await resp.json();
        setReports(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching reports:", err);
      }
    };

    fetchHistory();
  }, [token]);

  const sendReport = async () => {
    if (!title || !message) return alert("Please fill all fields");

    try {
      const resp = await fetch(`${API_BASE_URL}/api/report/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, message }),
      });

      if (resp.ok) {
        alert("Report submitted successfully!");
        setTitle("");
        setMessage("");
        window.location.reload();
      } else {
        const data = await resp.json();
        alert(data.message || "Failed to submit report");
      }
    } catch (err) {
      alert("Error sending report");
    }
  };

  return (
    <div className="report-layout">
      <UserSidebar />

      <div className="report-container">
        <h1>Support</h1>

        {/* SUPPORT FORM */}
        <div className="support-box">
          <input
            type="text"
            placeholder="Enter report title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Describe your issue..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>

          <button className="support-btn" onClick={sendReport}>
            Submit Report
          </button>
        </div>

        {/* REPORT HISTORY */}
        <h2 className="section-title">Your Previous Reports</h2>

        <div className="report-table">
          <div className="table-header">
            <span>TITLE</span>
            <span>MESSAGE</span>
            <span>STATUS</span>
          </div>

          {reports.length === 0 ? (
            <p className="no-data">No reports found</p>
          ) : (
            reports.map((r) => (
              <div className="table-row" key={r.id}>
                <span>{r.title}</span>
                <span>{r.message.slice(0, 40)}...</span>
                <span>{r.status}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserReport;
