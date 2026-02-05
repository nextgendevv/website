import React, { useEffect, useState } from "react";
import UserSidebar from "./UserSidebar";
import "../styles/Team.css";

const Team = () => {
  const [team, setTeam] = useState([]);
  const [level, setLevel] = useState("all");
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

        if (data.success || data.users) {
          const users = data.users || [];
          const logged = data.loggedUser;

          if (!logged) return;

          // Filter downline based on the logic (this can be improved on backend later)
          const level1 = users.filter(u => u.sponsorCode === logged.userCode);
          const level2 = users.filter(u => level1.some(l1 => u.sponsorCode === l1.userCode));
          const level3 = users.filter(u => level2.some(l2 => u.sponsorCode === l2.userCode));

          let finalList = [];
          if (level === "1") finalList = level1;
          else if (level === "2") finalList = level2;
          else if (level === "3") finalList = level3;
          else finalList = [...level1, ...level2, ...level3];

          setTeam(finalList);
        }
      } catch (err) {
        console.error("Error fetching team:", err);
      }
    };

    fetchTeam();
  }, [level, token]);

  return (
    <div className="team-layout">
      <UserSidebar />

      <div className="team-container">
        <h1>Team Members & Downline Structure</h1>

        <select className="level-dropdown" onChange={(e) => setLevel(e.target.value)}>
          <option value="all">View Level</option>
          <option value="1">Level 1</option>
          <option value="2">Level 2</option>
          <option value="2">Level 3</option>
        </select>

        <div className="team-table">
          <div className="table-header">
            <span>USER ID</span>
            <span>NAME</span>
            <span>SPONSOR ID</span>
            <span>REGISTRATION DATE</span>
            <span>ACTIVATION DATE</span>
          </div>

          {team.length === 0 ? (
            <p className="no-data">No team members found</p>
          ) : (
            team.map((member, index) => (
              <div className="table-row" key={index}>
                <span>{String(member.id).padStart(6, "0")}</span>
                <span>{member.fullname}</span>
                <span>{member.sponsor || "—"}</span>
                <span>{member.registerDate}</span>
                <span>{member.activationDate || "—"}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Team;
