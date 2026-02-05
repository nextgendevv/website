import React from "react";
import "../styles/packageSettings.css";

const data = [
  { pkg: 25, staking: 50, start: 10, max: 263 },
  { pkg: 50, staking: 100, start: 20, max: 500 },
  { pkg: 100, staking: 200, start: 30, max: 1000 },
  { pkg: 200, staking: 400, start: 40, max: 2000 },
  { pkg: 400, staking: 600, start: 50, max: 4000 },
  { pkg: 600, staking: 800, start: 60, max: 6000 },
  { pkg: 800, staking: 10000, start: 70, max: 8000 },
  { pkg: 1000, staking: 1500, start: 80, max: 10000 },
  { pkg: 1500, staking: 2000, start: 90, max: 150000 },
  { pkg: 2000, staking: 2500, start: 100, max: 250000 }
];

const PackageSettings = () => {
  return (
    <div className="pkg-container">
      {data.map((row, i) => (
        <div className="pkg-row" key={i}>
          <div className="item">
            <label>PACKAGE</label>
            <input value={row.pkg} readOnly />
          </div>

          <div className="item">
            <label>NEXT TRADE STARING TIME SET</label>
            <input value="04:00:00" readOnly />
          </div>

          <div className="item">
            <label>PACKAGE STAKING</label>
            <input value={row.staking} readOnly />
          </div>

          <div className="item small">
            <label>START</label>
            <input value={row.start} readOnly />
          </div>

          <div className="item">
            <label>MAXIMUM TRADE LIMIT</label>
            <input value={row.max} readOnly />
          </div>

          <button className="save-btn">SET & SAVE</button>
        </div>
      ))}
    </div>
  );
};

export default PackageSettings;
