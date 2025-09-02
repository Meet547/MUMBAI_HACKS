import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Calendar from "./Calendar";
import "../styles/ComplianceCalendar.css";
import "../styles/Calendar.css";

export default function ComplianceCalendar() {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="standard-page-container">
      <div className="standard-content-container">
        {/* Header */}
        <div className="calendar-header">
          <button className="back-btn" onClick={handleBackToDashboard}>
            <FaArrowLeft />
            Back to Dashboard
          </button>
          <h1 className="calendar-title">Compliance Calendar</h1>
          <p className="calendar-subtitle">
            Track and manage all compliance deadlines
          </p>
        </div>

        {/* Calendar Component */}
        <div className="calendar-wrapper">
          <Calendar />
        </div>
      </div>
    </div>
  );
}
