// TeamAdvanced.jsx
import React, { useEffect, useState } from "react";
import UserSidebar from "./UserSidebar";
import { buildLevels, getUsers } from "../U/referralUtils";
import "../styles/teamAdvanced.css";

const formatId = id => String(id).slice(-6).padStart(6, "0");

export default function TeamAdvanced() {
  const [levels, setLevels] = useState([]);
  const [levelIndex, setLevelIndex] = useState(0);
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      window.location.href = "/signin";
      return;
    }

    const fetchTeam = async () => {
      try {
        const resp = await fetch("http://localhost:5000/api/user/team", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await resp.json();

        if (data.users && data.loggedUser) {
          const lvl = buildLevels(data.loggedUser.id || data.loggedUser._id, 10, data.users);
          setLevels(lvl);
          setRows(lvl[0] || []);
        }
      } catch (err) {
        console.error("Error fetching team:", err);
      }
    };

    fetchTeam();
  }, [token]);

  useEffect(() => {
    setRows(levels[levelIndex] || []);
  }, [levelIndex, levels]);

  const filtered = rows.filter(r =>
    !q ? true :
      (r.fullname || "").toLowerCase().includes(q.toLowerCase()) ||
      (r.email || "").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="team-advanced-layout">
      <UserSidebar />
      <div className="team-advanced-main">
        <h1>Team Members & Downline Structure</h1>

        <div className="controls">
          <select value={levelIndex} onChange={(e) => setLevelIndex(Number(e.target.value))}>
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i} value={i}>Level {i + 1} ({levels[i]?.length || 0})</option>
            ))}
          </select>

          <input
            placeholder="Search name or email..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </div>

        <div className="table-wrap">
          <div className="table-head">
            <div>USER ID</div>
            <div>NAME</div>
            <div>SPONSOR NAME</div>
            <div>REGISTRATION DATE</div>
            <div>ACTIVATION DATE</div>
          </div>

          {filtered.length === 0 ? (
            <div className="no-data">No members in this level</div>
          ) : (
            filtered.map(u => (
              <div className="table-row" key={u.id}>
                <div>{formatId(u.id)}</div>
                <div>{u.fullname}</div>
                <div>{u.sponsorName || "—"}</div>
                <div>{u.registerDate || u.registrationDate || "—"}</div>
                <div>{u.activationDate || "—"}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
