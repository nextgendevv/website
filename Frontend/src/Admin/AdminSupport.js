import React, { useEffect, useState } from "react";
import "../styles/AdminSupport.css";
import API_BASE_URL from "../config";

const AdminSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const resp = await fetch(`${API_BASE_URL}/api/admin/support`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await resp.json();
      if (resp.ok) {
        setTickets(data);
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  const sendReply = async (id) => {
    if (!replyText.trim()) {
      alert("Reply cannot be empty");
      return;
    }

    try {
      const resp = await fetch(`${API_BASE_URL}/api/admin/support/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reply: replyText, status: "Replied" }),
      });
      if (resp.ok) {
        alert("Reply sent!");
        setReplyText("");
        fetchTickets();
      }
    } catch (err) {
      console.error("Error sending reply:", err);
    }
  };

  if (loading) return <div className="loading-text">Loading Support Tickets...</div>;

  return (
    <div className="admin-support-layout">
      <div className="support-header">
        <h2>💬 Support Tickets</h2>
      </div>

      <div className="admin-support-table">
        <div className="row head">
          <div>User</div>
          <div>Subject</div>
          <div>Message</div>
          <div>Status</div>
          <div>Reply</div>
          <div>Action</div>
        </div>

        {tickets.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#aaa" }}>
            No support tickets found
          </div>
        ) : (
          tickets.map((t) => (
            <div className="row" key={t._id}>
              <div style={{ fontWeight: "600", color: "white" }}>{t.name || "User"}</div>
              <div>{t.subject || t.title}</div>
              <div style={{ fontSize: "12px", color: "#ccc", maxHeight: 60, overflow: "hidden" }}>{t.message}</div>
              <div>
                <span className={`status-badge status-${t.status?.toLowerCase() || 'pending'}`}>
                  {t.status}
                </span>
              </div>
              <div>
                {t.status === "PENDING" ? (
                  <textarea
                    placeholder="Type reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                ) : (
                  <span style={{ color: "#aaa", fontSize: 13, fontStyle: "italic" }}>
                    Replied: {t.adminReply}
                  </span>
                )}
              </div>
              <div>
                {t.status === "PENDING" && (
                  <button
                    className="reply-btn"
                    onClick={() => sendReply(t._id)}
                  >
                    Send
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminSupport;

