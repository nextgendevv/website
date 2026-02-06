import { useState, useEffect } from "react";
import "../styles/UserDeposit.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import UserSidebar from "./UserSidebar";
import API_BASE_URL from "../config";

const UserDeposit = () => {
  const token = localStorage.getItem("authToken");

  const [proof, setProof] = useState("");
  const [method, setMethod] = useState("bank");
  const [amount, setAmount] = useState("");
  const [upi, setUpi] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!token) {
      window.location.href = "/signin";
      return;
    }

    const fetchHistory = async () => {
      try {
        const resp = await fetch(`${API_BASE_URL}/api/deposit/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await resp.json();
        setHistory(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching deposit history:", err);
      }
    };

    fetchHistory();
  }, [token]);

  const generateReceipt = (details) => {
    const doc = new jsPDF();

    // BRANDING
    doc.setFillColor(0, 210, 255); // Primary Cyan
    doc.rect(0, 0, 210, 20, "F");
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text("DRAGON NFT", 105, 13, { align: "center" });

    // TITLE
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text("DEPOSIT RECEIPT", 105, 40, { align: "center" });

    // DATE
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleString()}`, 14, 55);

    // TABLE
    doc.autoTable({
      startY: 65,
      head: [["Description", "Details"]],
      body: [
        ["User", "Valued Member"],
        ["Transaction Type", "Deposit"],
        ["Method", details.method.toUpperCase()],
        ["Amount", `₹${details.amount}`],
        ["Status", "Pending Approval"],
        ["Reference ID", details.upi || "Bank Transfer"],
      ],
      theme: "grid",
      headStyles: { fillColor: [0, 210, 255] },
    });

    // FOOTER
    doc.setFontSize(10);
    doc.text("Thank you for investing with Dragon NFT.", 105, doc.lastAutoTable.finalY + 20, { align: "center" });
    doc.text("This is a computer-generated receipt.", 105, doc.lastAutoTable.finalY + 26, { align: "center" });

    doc.save(`Deposit_Receipt_${Date.now()}.pdf`);
  };

  const [proofFile, setProofFile] = useState(null);

  const submitDeposit = async () => {
    if (!amount) return alert("Enter amount");
    if (!proofFile) return alert("Please upload proof of payment");

    try {
      const formData = new FormData();
      formData.append("amount", amount);
      formData.append("method", method);
      formData.append("upi", upi);
      formData.append("proof", proofFile); // The actual file
      formData.append("date", new Date().toLocaleString());

      const resp = await fetch(`${API_BASE_URL}/api/deposit/save`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Content-Type is automatically set for FormData
        },
        body: formData,
      });

      const data = await resp.json();
      if (resp.ok) {
        // GENERATE RECEIPT
        generateReceipt({ amount, method, upi });
        alert("Deposit Request Sent & Receipt Downloaded!");
        setTimeout(() => window.location.reload(), 2000);
      } else {
        alert(data.message || "Failed to submit deposit");
      }
    } catch (err) {
      alert("Error sending request");
    }
  };
  const upiQR = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=dragon@upi&pn=DragonNFt";
  return (
    <div className="deposit-layout">
      <UserSidebar />

      <div className="deposit-container">
        <h2>💰 Deposit Funds</h2>

        {/* SELECT METHOD */}
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="bank">Bank Transfer</option>
          <option value="upi">UPI</option>
        </select>

        <input
          type="number"
          placeholder="Enter deposit amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {method === "upi" && (
          <>
            <img src={upiQR} alt="UPI QR Code" width="160px" style={{ marginTop: "10px", borderRadius: "10px" }} />
            <p><b>Scan & Pay UPI</b></p>
            <input
              type="text"
              placeholder="Enter UPI Transaction ID"
              value={upi}
              onChange={(e) => setUpi(e.target.value)}
            />
          </>
        )}

        {method === "bank" && (
          <div className="bank-box">
            <p><b>BANK NAME:</b> SBI</p>
            <p><b>ACC NO:</b> 9988776655</p>
            <p><b>IFSC:</b> SBIN000121</p>
            <p><b>NAME:</b> DRAGON NFT LTD</p>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProofFile(e.target.files[0])}
        />

        <button className="deposit-btn" onClick={submitDeposit}>
          SUBMIT DEPOSIT
        </button>

        {/* HISTORY SECTION */}
        <h3>📜 Deposit History</h3>

        {history.length === 0 ? (
          <p>No deposits yet.</p>
        ) : (
          <table className="deposit-table">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Method</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {history.map((h, i) => (
                <tr key={i}>
                  <td>{h.amount}</td>
                  <td>{h.method}</td>
                  <td>{h.date}</td>
                  <td>{h.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
};

export default UserDeposit;
