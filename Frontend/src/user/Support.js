import React, { useState, useEffect } from "react";
import UserSidebar from "./UserSidebar";
import "../styles/Support.css";

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({
    title: "",
    category: "",
    message: ""
  });
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      window.location.href = "/signin";
      return;
    }

    const fetchTickets = async () => {
      try {
        const resp = await fetch("http://localhost:5000/api/support/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await resp.json();
        setTickets(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching tickets:", err);
      }
    };

    fetchTickets();
  }, [token]);

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitTicket = async () => {
    if (!form.title || !form.category || !form.message) {
      alert("All fields are required!");
      return;
    }

    try {
      const resp = await fetch(`${API_BASE_URL}/api/support/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (resp.ok) {
        alert("Support request submitted!");
        window.location.reload();
      } else {
        const data = await resp.json();
        alert(data.message || "Failed to submit ticket");
      }
    } catch (err) {
      alert("Error submitting request");
    }
  };

  return (
    <div className="support-layout">
      <UserSidebar />

      <div className="support-container">
        <h1>Support Center</h1>

        {/* FORM BOX */}
        <div className="glass-box">
          <label>Issue Title</label>
          <input
            type="text"
            name="title"
            placeholder="Example: Withdrawal not received"
            onChange={update}
          />

          <label>Category</label>
          <select name="category" onChange={update}>
            <option value="">Select Category</option>
            <option value="Deposit">Deposit Issue</option>
            <option value="Withdrawal">Withdrawal Issue</option>
            <option value="Login">Login Issue</option>
            <option value="Account">Account Issue</option>
            <option value="Other">Other</option>
          </select>

          <label>Description</label>
          <textarea
            name="message"
            placeholder="Describe your problem..."
            rows="5"
            onChange={update}
          ></textarea>

          <button className="submit-btn" onClick={submitTicket}>
            Submit Ticket
          </button>
        </div>

        {/* TICKET HISTORY */}
        <h2 className="section-title">Your Ticket History</h2>

        <div className="ticket-table">
          <div className="table-header">
            <span>Date</span>
            <span>Title</span>
            <span>Status</span>
            <span>Admin Reply</span>
          </div>

          {tickets.length === 0 ? (
            <p className="no-data">No support tickets found</p>
          ) : (
            tickets.map((t, i) => (
              <div className="table-row" key={i}>
                <span>{t.date}</span>
                <span>{t.title}</span>
                <span className={t.status.toLowerCase()}>{t.status}</span>
                <span>{t.adminReply || "—"}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Support;
