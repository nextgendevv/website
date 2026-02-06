import { useState, useEffect } from "react";
import "../styles/UserDeposit.css"; // Reusing styles for consistency
import UserSidebar from "./UserSidebar";
import API_BASE_URL from "../config";

const Invest = () => {
    const token = localStorage.getItem("authToken");
    const [amount, setAmount] = useState("");
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            window.location.href = "/signin";
            return;
        }
        fetchInvestments();
    }, [token]);

    const fetchInvestments = async () => {
        try {
            const resp = await fetch(`${API_BASE_URL}/api/investment/my`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await resp.json();
            setHistory(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching investments:", err);
        }
    };

    const handleInvest = async () => {
        if (!amount || amount <= 0) return alert("Enter a valid amount");
        if (amount < 2500) return alert("Minimum investment is 2500");

        setLoading(true);
        try {
            const resp = await fetch(`${API_BASE_URL}/api/investment/activate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ amount: Number(amount) }),
            });

            const data = await resp.json();
            if (resp.ok) {
                alert("Investment plan activated successfully!");
                setAmount("");
                fetchInvestments();
            } else {
                alert(data.message || "Failed to activate plan");
            }
        } catch (err) {
            alert("Error sending request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="deposit-layout">
            <UserSidebar />
            <div className="deposit-container">
                <h2>📈 ROI Investment</h2>
                <p>Invest your funds and get 200% return in 24 installments.</p>

                <div style={{ background: "rgba(255,255,255,0.05)", padding: "20px", borderRadius: "15px", marginBottom: "20px" }}>
                    <p><b>Payout Logic:</b> 2X Return (e.g. 2500 &rarr; 5000)</p>
                    <p><b>Installments:</b> 24 Payouts</p>
                </div>

                <input
                    type="number"
                    placeholder="Enter investment amount (Min 2500)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />

                <button
                    className="deposit-btn"
                    onClick={handleInvest}
                    disabled={loading}
                >
                    {loading ? "PROCESSING..." : "ACTIVATE PLAN"}
                </button>

                <h3>📜 Your Investments</h3>
                {history.length === 0 ? (
                    <p>No active plans.</p>
                ) : (
                    <table className="deposit-table">
                        <thead>
                            <tr>
                                <th>Invested</th>
                                <th>Total Return</th>
                                <th>Paid</th>
                                <th>Installments</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((inv, i) => (
                                <tr key={i}>
                                    <td>{inv.amountInvested}</td>
                                    <td>{inv.totalToReturn}</td>
                                    <td>{inv.amountReturned.toFixed(2)}</td>
                                    <td>{inv.installmentsPaid}/{inv.totalInstallments}</td>
                                    <td>
                                        <span style={{
                                            color: inv.status === "ACTIVE" ? "#00d2ff" : "#00ff88",
                                            fontWeight: "bold"
                                        }}>
                                            {inv.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Invest;
