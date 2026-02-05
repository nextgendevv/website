import React, { useState, useEffect } from "react";
import "../styles/AdminDeposit.css";
import API_BASE_URL from "../config";

const AdminDeposits = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      const resp = await fetch(`${API_BASE_URL}/api/admin/deposits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await resp.json();
      if (resp.ok) {
        setList(data);
      }
    } catch (err) {
      console.error("Error fetching deposits:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const resp = await fetch(`${API_BASE_URL}/api/admin/deposits/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const result = await resp.json();
      if (resp.ok) {
        alert(`Deposit ${status}`);
        fetchDeposits();
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error("Error updating deposit:", err);
    }
  };

  if (loading) return <div className="loading-text">Loading Deposits...</div>;

  return (
    <div className="admin-deposit-layout">
      <div className="deposit-header">
        <h2>🔔 User Deposit Requests</h2>
      </div>

      <div className="admin-deposit-table">
        <div className="row head">
          <div>User</div>
          <div>Amount</div>
          <div>Method</div>
          <div>UPI / Bank</div>
          <div>Date</div>
          <div>Status</div>
          <div>Action</div>
        </div>

        {list.map((x) => (
          <div className="row" key={x._id}>
            <div data-label="User" style={{ fontWeight: "600", color: "white" }}>{x.name}</div>
            <div data-label="Amount" style={{ color: "#4fa7ff", fontWeight: "bold" }}>₹{x.amount}</div>
            <div data-label="Method">{x.method}</div>
            <div data-label="UPI / Bank" style={{ fontSize: "12px", color: "#aaa" }}>{x.upi || "BANK"}</div>
            <div data-label="Date">{new Date(x.date).toLocaleDateString()}</div>
            <div data-label="Status">
              <span className={`status-badge status-${x.status?.toLowerCase() || 'pending'}`}>
                {x.status}
              </span>
            </div>
            <div data-label="Action">
              {x.status === "PENDING" && (
                <>
                  <button
                    className="action-btn btn-approve"
                    onClick={() => updateStatus(x._id, "APPROVED")}
                  >
                    Approve
                  </button>
                  <button
                    className="action-btn btn-reject"
                    onClick={() => updateStatus(x._id, "REJECTED")}
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDeposits;

