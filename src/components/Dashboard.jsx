import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  FaUser,
  FaTimes,
  FaChartLine,
  FaFileAlt,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const location = useLocation();
  const userProfile = location.state?.userProfile;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);

  // Constants for metrics
  const METRICS = {
    totalClients: 153,
    documentsGenerated: 263,
    pendingDocuments: 8,
    upcomingDeadlines: 3,
  };

  const SAVED_TIME = 134;

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle metric card selection
  const handleMetricSelect = (metricKey) => {
    if (selectedMetric === metricKey) return;

    setSelectedMetric(metricKey);
    setIsAnimating(true);

    // Reset animation after completion
    setTimeout(() => setIsAnimating(false), 1000);
  };

  // Handle click outside sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        overlayRef.current &&
        !overlayRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  return (
    <div className="dashboard-page-wrapper">
      <div className="dashboard-container">
        {/* Left Section - Profile and Metrics */}
        <div className="dashboard-left">
          {/* Profile Icon */}
          <div className="profile-section">
            <div className="profile-icon" onClick={toggleSidebar}>
              <FaUser />
              <div className="notification-dot"></div>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="metrics-section">
            <div
              className={`metric-card ${
                selectedMetric === "totalClients" ? "selected" : ""
              }`}
              onClick={() => handleMetricSelect("totalClients")}
            >
              <div className="metric-icon">
                <FaUser />
              </div>
              <div className="metric-number">{METRICS.totalClients}</div>
              <div className="metric-label">Total Clients</div>
              {selectedMetric === "totalClients" && isAnimating && (
                <div className="flow-animation"></div>
              )}
            </div>

            <div
              className={`metric-card ${
                selectedMetric === "documentsGenerated" ? "selected" : ""
              }`}
              onClick={() => handleMetricSelect("documentsGenerated")}
            >
              <div className="metric-icon">
                <FaFileAlt />
              </div>
              <div className="metric-number">{METRICS.documentsGenerated}</div>
              <div className="metric-label">Documents Generated</div>
              {selectedMetric === "documentsGenerated" && isAnimating && (
                <div className="flow-animation"></div>
              )}
            </div>

            <div
              className={`metric-card ${
                selectedMetric === "pendingDocuments" ? "selected" : ""
              }`}
              onClick={() => handleMetricSelect("pendingDocuments")}
            >
              <div className="metric-icon">
                <FaClock />
              </div>
              <div className="metric-number">{METRICS.pendingDocuments}</div>
              <div className="metric-label">Pending Documents</div>
              {selectedMetric === "pendingDocuments" && isAnimating && (
                <div className="flow-animation"></div>
              )}
            </div>

            <div
              className={`metric-card ${
                selectedMetric === "upcomingDeadlines" ? "selected" : ""
              }`}
              onClick={() => handleMetricSelect("upcomingDeadlines")}
            >
              <div className="metric-icon">
                <FaCalendarAlt />
              </div>
              <div className="metric-number">{METRICS.upcomingDeadlines}</div>
              <div className="metric-label">Upcoming Deadlines</div>
              {selectedMetric === "upcomingDeadlines" && isAnimating && (
                <div className="flow-animation"></div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Main Content */}
        <div className="dashboard-right">
          {/* Client Growth Section - Separate styled container */}
          <div className="client-growth-container">
            <h2 className="section-title">Client Growth</h2>

            {/* Chart Placeholder */}
            <div className="chart-container">
              <div className="chart-line light-blue"></div>
              <div className="chart-line pink"></div>
              <div className="chart-markers">
                <div className="marker light-blue"></div>
                <div className="marker light-blue"></div>
                <div className="marker light-blue"></div>
                <div className="marker light-blue"></div>
                <div className="marker light-blue"></div>
                <div className="marker light-blue"></div>
                <div className="marker light-blue"></div>
                <div className="marker pink"></div>
                <div className="marker pink"></div>
                <div className="marker pink"></div>
                <div className="marker pink"></div>
                <div className="marker pink"></div>
                <div className="marker pink"></div>
                <div className="marker pink"></div>
              </div>
            </div>

            {/* Summary Section */}
            <div className="summary-section">
              <h3>Summary</h3>
              <ul className="summary-list">
                <li>
                  Document generation has increased by 12% compared to last
                  month.
                </li>
                <li>Peak usage observed on Mondays and Wednesdays.</li>
                <li>Most active clients: Aryan & Co., Kevin Law Associates.</li>
              </ul>
            </div>

            {/* Action Button */}
            <button className="open-vault-btn">Open Client Vault</button>
          </div>
          </div>

        {/* Centered Slogan in Background */}
        <div className="dashboard-slogan">
          <div className="slogan-line top"></div>
          <div className="slogan-text">
            You have saved <strong>{SAVED_TIME} minutes</strong> in total with
            the help of <strong>DRAFTZI</strong>
          </div>
          <div className="slogan-line bottom"></div>
        </div>
      </div>
      

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" ref={overlayRef}></div>
      )}

      {/* Sidebar */}
      <div
        className={`sidebar ${isSidebarOpen ? "open" : ""}`}
        ref={sidebarRef}
      >
        <div className="sidebar-header">
          <h3>Profile</h3>
          <button className="close-btn" onClick={toggleSidebar}>
            <FaTimes />
          </button>
        </div>

        <div className="sidebar-content">
          {userProfile && (
            <>
              <div className="profile-info">
                <div className="profile-avatar">
                  <FaUser />
                </div>
                <h4>{userProfile.name}</h4>
                <p>{userProfile.email}</p>
                <p className="industry">{userProfile.industry}</p>
              </div>
            </>
          )}

          <div className="sidebar-menu">
            <div className="menu-item">
              <FaChartLine />
              <span>Analytics</span>
            </div>
            <div className="menu-item">
              <FaUser />
              <span>Settings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
