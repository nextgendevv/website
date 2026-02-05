import React, { useEffect, useState } from "react";
import "../styles/AdminWithdrawal.css";
import API_BASE_URL from "../config";

const AdminWithdrawal = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const resp = await fetch(`${API_BASE_URL}/api/admin/withdrawals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await resp.json();
      if (resp.ok) {
        setWithdrawals(data);
      }
    } catch (err) {
      console.error("Error fetching withdrawals:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const resp = await fetch(`${API_BASE_URL}/api/admin/withdrawals/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const result = await resp.json();
      if (resp.ok) {
        alert(`Withdrawal ${status}`);
        fetchWithdrawals();
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error("Error updating withdrawal:", err);
    }
  };

  if (loading) return <div className="loading-text">Loading Withdrawals...</div>;

  return (
    <div className="admin-withdrawal-layout">
      <div className="withdrawal-header">
        <h2>💸 Withdrawal Requests</h2>
      </div>

      <div className="admin-withdrawal-table">
        <div className="row head">
          <div>Date</div>
          <div>User</div>
          <div>Amount</div>
          <div>Method</div>
          <div>Status</div>
          <div>Action</div>
        </div>

        {withdrawals.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#aaa" }}>
            No withdrawal requests found
          </div>
        ) : (
          withdrawals.map((w) => (
            <div className="row" key={w._id}>
              <div>{new Date(w.date).toLocaleDateString()}</div>
              <div style={{ color: "white", fontWeight: "600" }}>{w.userId?.fullname || "User"}</div>
              <div style={{ color: "#4fa7ff", fontWeight: "bold" }}>${w.amount}</div>
              <div>{w.method}</div>
              <div>
                <span className={`status-badge status-${w.status?.toLowerCase() || 'pending'}`}>
                  {w.status}
                </span>
              </div>
              <div>
                {w.status === "Pending" && (
                  <>
                    <button
                      className="action-btn btn-approve"
                      onClick={() => updateStatus(w._id, "Approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="action-btn btn-reject"
                      onClick={() => updateStatus(w._id, "Rejected")}
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminWithdrawal;

