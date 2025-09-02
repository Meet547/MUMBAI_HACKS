import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaTimes,
  FaChartLine,
  FaFileAlt,
  FaClock,
  FaCalendarAlt,
  FaArrowRight,
} from "react-icons/fa";
import "../styles/Dashboard.css";

// Custom hook for number animation
const useCountAnimation = (endValue, duration = 1500, delay = 0) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
      const startTime = Date.now();
      const startValue = 0;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const animatedValue = Math.floor(startValue + (endValue - startValue) * easeOut);
        
        setCurrentValue(animatedValue);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCurrentValue(endValue);
          setIsAnimating(false);
        }
      };
      
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [endValue, duration, delay]);

  return { currentValue, isAnimating };
};

// Animated Number Component
const AnimatedNumber = ({ value, delay = 0, className = "" }) => {
  const { currentValue, isAnimating } = useCountAnimation(value, 1500, delay);
  
  return (
    <div className={`metric-number ${isAnimating ? 'animating' : ''} ${className}`}>
      {currentValue}
    </div>
  );
};

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const userProfile = location.state?.userProfile;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isContentTransitioning, setIsContentTransitioning] = useState(false);
  const [hasPageLoaded, setHasPageLoaded] = useState(false);
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

  // Custom hook for the saved time animation
  const { currentValue: animatedSavedTime } = useCountAnimation(SAVED_TIME, 2000, 500);

  // Trigger animations on page load
  useEffect(() => {
    setHasPageLoaded(true);
  }, []);

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle metric card selection
  const handleMetricSelect = (metricKey) => {
    if (selectedMetric === metricKey) return;

    setIsContentTransitioning(true);
    setIsAnimating(true);

    // Add a small delay for smooth transition
    setTimeout(() => {
      setSelectedMetric(metricKey);
      setIsContentTransitioning(false);
    }, 150);

    // Reset animation after completion
    setTimeout(() => setIsAnimating(false), 1000);
  };

  // Handle navigation to different pages
  const handleNavigation = (page) => {
    navigate(`/${page}`);
  };

  // Handle click outside sidebar and body scroll
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
      // Add event listener when sidebar is open
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function - remove event listener when component unmounts or dependency changes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
              } ${hasPageLoaded ? "loaded" : ""}`}
              onClick={() => handleMetricSelect("totalClients")}
            >
              <div className="metric-icon">
                <FaUser />
              </div>
              <AnimatedNumber value={METRICS.totalClients} delay={100} />
              <div className="metric-label">Total Clients</div>
              {selectedMetric === "totalClients" && isAnimating && (
                <div className="flow-animation"></div>
              )}
            </div>

            <div
              className={`metric-card ${
                selectedMetric === "documentsGenerated" ? "selected" : ""
              } ${hasPageLoaded ? "loaded" : ""}`}
              onClick={() => handleMetricSelect("documentsGenerated")}
            >
              <div className="metric-icon">
                <FaFileAlt />
              </div>
              <AnimatedNumber value={METRICS.documentsGenerated} delay={200} />
              <div className="metric-label">Documents Generated</div>
              {selectedMetric === "documentsGenerated" && isAnimating && (
                <div className="flow-animation"></div>
              )}
            </div>

            <div
              className={`metric-card ${
                selectedMetric === "pendingDocuments" ? "selected" : ""
              } ${hasPageLoaded ? "loaded" : ""}`}
              onClick={() => handleMetricSelect("pendingDocuments")}
            >
              <div className="metric-icon">
                <FaClock />
              </div>
              <AnimatedNumber value={METRICS.pendingDocuments} delay={300} />
              <div className="metric-label">Pending Documents</div>
              {selectedMetric === "pendingDocuments" && isAnimating && (
                <div className="flow-animation"></div>
              )}
            </div>

            <div
              className={`metric-card ${
                selectedMetric === "upcomingDeadlines" ? "selected" : ""
              } ${hasPageLoaded ? "loaded" : ""}`}
              onClick={() => handleMetricSelect("upcomingDeadlines")}
            >
              <div className="metric-icon">
                <FaCalendarAlt />
              </div>
              <AnimatedNumber value={METRICS.upcomingDeadlines} delay={400} />
              <div className="metric-label">Upcoming Deadlines</div>
              {selectedMetric === "upcomingDeadlines" && isAnimating && (
                <div className="flow-animation"></div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Main Content */}
        <div className="dashboard-right">
          {selectedMetric ? (
            <div
              className={`metric-detail-container ${
                isContentTransitioning
                  ? "content-transitioning"
                  : "content-visible"
              }`}
            >
              {selectedMetric === "totalClients" && (
                <>
                  <h2 className="section-title">Client Summary</h2>
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
                  <div className="summary-section">
                    <h3>Summary</h3>
                    <ul className="summary-list">
                      <li>
                        Document generation has increased by 12% compared to
                        last month.
                      </li>
                      <li>Peak usage observed on Mondays and Wednesdays.</li>
                      <li>
                        Most active clients: Aryan & Co., Kevin Law Associates.
                      </li>
                    </ul>
                  </div>
                  <button
                    className="cta-btn"
                    onClick={() => handleNavigation("client-vault")}
                  >
                    Open Client Vault <FaArrowRight />
                  </button>
                </>
              )}

              {selectedMetric === "documentsGenerated" && (
                <>
                  <h2 className="section-title">Documents Overview</h2>
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
                  <div className="summary-section">
                    <h3>Summary</h3>
                    <ul className="summary-list">
                      <li>Total documents generated this month: 263</li>
                      <li>Most popular document type: Legal Contracts</li>
                      <li>Average generation time: 2.3 minutes per document</li>
                    </ul>
                  </div>
                  <button
                    className="cta-btn"
                    onClick={() => handleNavigation("documents-overview")}
                  >
                    Open Documents Overview <FaArrowRight />
                  </button>
                </>
              )}

              {selectedMetric === "pendingDocuments" && (
                <>
                  <h2 className="section-title">Pending Documents</h2>
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
                  <div className="summary-section">
                    <h3>Summary</h3>
                    <ul className="summary-list">
                      <li>8 documents are currently pending review</li>
                      <li>Average pending time: 1.2 days</li>
                      <li>Priority documents: 3 urgent, 5 standard</li>
                    </ul>
                  </div>
                  <button
                    className="cta-btn"
                    onClick={() => handleNavigation("pending-documents")}
                  >
                    Open Pending Documents <FaArrowRight />
                  </button>
                </>
              )}

              {selectedMetric === "upcomingDeadlines" && (
                <>
                  <h2 className="section-title">Compliance Deadlines</h2>
                  <div className="deadlines-preview">
                    <div className="deadline-item urgent">
                      <div className="deadline-info">
                        <h4>Contract Renewal - Aryan & Co.</h4>
                        <p>Due: Jan 26, 2024 (1 day remaining)</p>
                      </div>
                      <div className="priority-indicator high"></div>
                    </div>
                    <div className="deadline-item">
                      <div className="deadline-info">
                        <h4>Compliance Report Submission</h4>
                        <p>Due: Jan 28, 2024 (3 days remaining)</p>
                      </div>
                      <div className="priority-indicator medium"></div>
                    </div>
                    <div className="deadline-item">
                      <div className="deadline-info">
                        <h4>Privacy Policy Update</h4>
                        <p>Due: Feb 1, 2024 (6 days remaining)</p>
                      </div>
                      <div className="priority-indicator low"></div>
                    </div>
                  </div>
                  <div className="summary-section">
                    <h3>Summary</h3>
                    <ul className="summary-list">
                      <li>3 deadlines approaching in the next 7 days</li>
                      <li>Next deadline: Contract renewal - 1 day</li>
                      <li>All deadlines are on track for completion</li>
                    </ul>
                  </div>
                  <button
                    className="cta-btn"
                    onClick={() => handleNavigation("compliance-calendar")}
                  >
                    Open Compliance Calendar <FaArrowRight />
                  </button>
                </>
              )}
            </div>
          ) : (
            <div
              className={`empty-state ${
                isContentTransitioning
                  ? "content-transitioning"
                  : "content-visible"
              }`}
            >
              <div className="empty-state-content">
                <FaChartLine className="empty-state-icon" />
                <h3>Select a Metric</h3>
                <p>
                  Choose a metric card from the left to view detailed
                  information and insights.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Centered Slogan in Background */}
        <div className="dashboard-slogan">
          <div className="slogan-line top"></div>
          <div className="slogan-text">
            You have saved <strong>{animatedSavedTime} minutes</strong> in total with
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