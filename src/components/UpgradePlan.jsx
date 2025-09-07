import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../styles/MenuOptionPages.css";

export default function UpgradePlan() {
  const navigate = useNavigate();
  return (
    <div className="mop-page">
      <div className="mop-container">
        <div className="mop-layout">
          <main className="mop-main" style={{width:'100%'}}>
            <div className="mop-topbar">
              <button className="back-btn" onClick={() => navigate("/dashboard")}><FaArrowLeft /> Back to Dashboard</button>
              <button className="back-btn next-btn" onClick={() => navigate('/account-settings')}>Go to Account Settings</button>
            </div>
            <div className="mop-header">
              <div>
                <h1 className="mop-title" style={{margin:0}}>Upgrade Plan</h1>
                <p className="mop-subtitle" style={{margin:0}}>Choose a plan that fits your needs</p>
              </div>
            </div>
            <div className="deadlines-grid">
              <div className="deadline-card"><div className="deadline-header"><div className="deadline-title-section"><h3 className="deadline-title">Pro Plan</h3></div></div><div className="deadline-details"><div className="detail-row">Feature highlights...</div></div></div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}


