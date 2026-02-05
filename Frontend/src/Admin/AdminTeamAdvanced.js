import React, { useEffect, useState } from "react";
import "../styles/adminTeamAdvanced.css";
import API_BASE_URL from "../config";

const formatId = id => String(id).slice(-6).padStart(6, "0");

export default function AdminTeamAdvanced() {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const resp = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await resp.json();
      if (resp.ok) {
        setUsers(data);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const headers = ["User ID", "Name", "Email", "Sponsor", "Reg Date", "Balance"];
    const rows = filtered.map(u => [
      u.userCode,
      u.fullname,
      u.email,
      u.sponsorName || "—",
      u.registerDate,
      u.balance
    ]);

    let csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "all_users.csv");
    document.body.appendChild(link);
    link.click();
  };

  const filtered = users.filter(u => !q ? true : (
    (u.fullname || "").toLowerCase().includes(q.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(q.toLowerCase()) ||
    (u.userCode || "").includes(q)
  ));

  if (loading) return <div className="loading-text">Loading Members...</div>;

  return (
    <div className="admin-team-wrap">
      <div className="admin-top">
        <h2>👥 All Members</h2>
        <div className="admin-controls">
          <input
            placeholder="Search members..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          <button onClick={handleExport}>Export CSV</button>
        </div>
      </div>

      <div className="admin-table">
        <div className="row head">
          <div>User Code</div>
          <div>Name</div>
          <div>Email</div>
          <div>Sponsor</div>
          <div>Reg Date</div>
          <div>Balance</div>
        </div>

        {filtered.map(u => (
          <div className="row" key={u._id}>
            <div data-label="User Code" style={{ color: "#1e90ff", fontWeight: "bold" }}>{u.userCode}</div>
            <div data-label="Name">{u.fullname}</div>
            <div data-label="Email" style={{ wordBreak: "break-all" }}>{u.email}</div>
            <div data-label="Sponsor">{u.sponsorName || "—"}</div>
            <div data-label="Reg Date">{u.registerDate}</div>
            <div data-label="Balance" style={{ fontWeight: "bold", color: "#28a745" }}>${u.balance?.toFixed(2)}</div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ padding: 20, textAlign: "center", color: "#888" }}>
            No members found.
          </div>
        )}
      </div>
    </div>
  );
}

