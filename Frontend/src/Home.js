import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="top-bar">
        <button className="btn admin-btn" onClick={() => navigate("/admin")}>
          ADMIN LOGIN
        </button>

        <div className="right-buttons">
          <button className="btn sign-btn" onClick={() => navigate("/signin")}>SIGN IN</button>
          <button className="btn signup-btn" onClick={() => navigate("/signup")}>SIGN UP</button>
        </div>

      </div>
    </div>
  );
};

export default Home;
