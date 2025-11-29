import React from "react";
import { FaBell, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/MenuOptionPages.css";

export default function Notifications() {
  const navigate = useNavigate();
  // Placeholder: you can pass real deadlines via state/context later
  const items = [
    { id: 1, title: "Contract Renewal - Aryan & Co.", date: "10/09/2025", priority: "high" },
    { id: 2, title: "Compliance Report Submission", date: "13/09/2025", priority: "medium" },
  ];

  return (
    <div className="mop-page">
      <div className="mop-container">
        <div className="mop-layout">
          <main className="mop-main" style={{width:'100%'}}>
            <div className="mop-topbar">
              <button className="back-btn" onClick={() => navigate('/dashboard')}><FaArrowLeft /> Back to Dashboard</button>
              <button className="back-btn next-btn" onClick={() => navigate('/profile-settings')}>Go to Profile Settings</button>
            </div>
            <div className="mop-header">
              <div>
                <h1 className="mop-title" style={{margin:0}}>Notifications</h1>
                <p className="mop-subtitle" style={{margin:0}}>Upcoming deadlines and updates</p>
              </div>
            </div>

        <div className="client-stats" style={{ marginBottom: "1rem" }}>
          <div className="stat-card">
            <div className="stat-icon"><FaBell /></div>
            <div className="stat-content">
              <h3>Total Alerts</h3>
              <p className="stat-number">{items.length}</p>
            </div>
          </div>
        </div>

        <div className="deadlines-grid">
          {items.map((n) => (
            <div key={n.id} className={`deadline-card ${n.priority === 'high' ? 'overdue' : n.priority === 'medium' ? 'urgent' : ''}`}>
              <div className="deadline-header">
                <div className="deadline-title-section">
                  <h3 className="deadline-title">{n.title}</h3>
                </div>
              </div>
              <div className="deadline-details">
                <div className="detail-row"><span>Date: {n.date}</span></div>
              </div>
            </div>
          ))}
        </div>
          </main>
        </div>
      </div>
    </div>
  );
}


