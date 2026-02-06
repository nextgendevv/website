import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#0f172a",
            color: "white",
            fontFamily: "sans-serif"
        }}>
            <h1 style={{ fontSize: "6rem", margin: 0 }}>404</h1>
            <p style={{ fontSize: "1.5rem", opacity: 0.7 }}>Oops! Page not found.</p>
            <button
                onClick={() => navigate("/")}
                style={{
                    marginTop: "20px",
                    padding: "10px 25px",
                    background: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold"
                }}
            >
                GO HOME
            </button>
        </div>
    );
};

export default NotFound;
