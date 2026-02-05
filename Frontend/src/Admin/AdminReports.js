import React, { useEffect, useState } from "react";
import "../styles/AdminReports.css";

const AdminReports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("reports")) || [];
    setReports(data);
  }, []);

  const updateStatus = (id, status) => {
    const updated = reports.map(r =>
      r.id === id ? { ...r, status } : r
    );

    setReports(updated);
    localStorage.setItem("reports", JSON.stringify(updated));
  };

  return (
    <div className="admin-report-layout">
      <div className="report-header">
        <h2>User Reports (Admin Panel)</h2>
      </div>

      <div className="admin-report-table">
        <div className="row head">
          <div>User</div>
          <div>Title</div>
          <div>Message</div>
          <div>Date</div>
          <div>Status</div>
          <div>Action</div>
        </div>

        {reports.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#aaa" }}>
            No reports submitted
          </div>
        ) : (
          reports.map((r) => (
            <div className="row" key={r.id}>
              <div style={{ fontWeight: "600", color: "white" }}>{r.fullname}</div>
              <div>{r.title}</div>
              <div style={{ fontSize: "12px", color: "#ccc" }}>{r.message}</div>
              <div>{r.date}</div>
              <div>
                <span className={`status-badge status-${r.status?.toLowerCase() || 'pending'}`}>
                  {r.status}
                </span>
              </div>
              <div>
                <button
                  className="resolve-btn"
                  disabled={r.status === "Resolved"}
                  onClick={() => updateStatus(r.id, "Resolved")}
                >
                  {r.status === "Resolved" ? "Resolved" : "Mark Resolved"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminReports;
