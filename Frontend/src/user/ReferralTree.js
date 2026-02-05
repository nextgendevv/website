import React, { useEffect, useState } from "react";
import UserSidebar from "./UserSidebar";
import "../styles/ReferralTree.css";
import API_BASE_URL from "../config";

const ReferralTree = () => {
  const [me, setMe] = useState(null);
  const [users, setUsers] = useState([]);
  const [directReferrals, setDirectReferrals] = useState([]);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      window.location.href = "/signin";
      return;
    }

    const fetchData = async () => {
      try {
        const resp = await fetch(`${API_BASE_URL}/api/user/team`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await resp.json();

        if (data.loggedUser) {
          setMe(data.loggedUser);
          setUsers(data.users || []);
          const directs = (data.users || []).filter(
            (u) => u.sponsor === data.loggedUser.id.toString() || u.sponsorCode === data.loggedUser.userCode
          );
          setDirectReferrals(directs);
        }
      } catch (err) {
        console.error("Error fetching referral tree:", err);
      }
    };

    fetchData();
  }, [token]);

  if (!me) {
    return <div className="tree-layout"><div className="tree-container">Loading...</div></div>;
  }

  const sponsor =
    users.find((u) => u.id.toString() === (me.sponsor || "")) || null;

  return (
    <div className="tree-layout">
      <UserSidebar />

      <div className="tree-container">
        <h2>Referral Tree</h2>

        <div className="tree-card">
          <h3>You</h3>
          <p><b>ID:</b> {me.id}</p>
          <p><b>Name:</b> {me.fullname}</p>
          <p><b>Email:</b> {me.email}</p>
        </div>

        {/* Sponsor (upline) */}
        <div className="tree-card">
          <h3>Upline (Sponsor)</h3>
          {sponsor ? (
            <>
              <p><b>ID:</b> {sponsor.id}</p>
              <p><b>Name:</b> {sponsor.fullname}</p>
              <p><b>Email:</b> {sponsor.email}</p>
            </>
          ) : (
            <p>No sponsor (top level user).</p>
          )}
        </div>

        {/* Direct referrals (level 1) */}
        <div className="tree-card">
          <h3>Direct Referrals (Level 1)</h3>
          {directReferrals.length === 0 ? (
            <p>No direct referrals yet.</p>
          ) : (
            <table className="tree-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {directReferrals.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.fullname}</td>
                    <td>{u.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
};

export default ReferralTree;
