import React from "react";
import { Zap, Lock, Calendar, LayoutDashboard } from "lucide-react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import "./SolutionSection.css";

export default function SolutionSection() {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section className="solution-section" ref={ref}>
      <div className={`solution-container ${isVisible ? 'animate-in' : ''}`}>
        <div className="solution-header">
          <h2 className="solution-title">
            Draftzi turns Draft Hard into Draft Smart
          </h2>
          <p className="solution-subtitle">
            Automate your document workflow with intelligent templates and AI assistance
          </p>
        </div>

        <div className="solution-grid">
          <div className="solution-features">
            <div className="feature-card">
              <div className="feature-icon">
                <Zap size={24} />
              </div>
              <h3 className="feature-title">AI Drafting Engine</h3>
              <p className="feature-text">
                NDAs, MoAs, Affidavits, Offer Letters & more generated instantly.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Lock size={24} />
              </div>
              <h3 className="feature-title">Client Vault</h3>
              <p className="feature-text">
                Save client data once, auto-fill documents forever.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Calendar size={24} />
              </div>
              <h3 className="feature-title">Compliance Calendar</h3>
              <p className="feature-text">
                Never miss a deadline with intelligent reminders.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <LayoutDashboard size={24} />
              </div>
              <h3 className="feature-title">Smart Dashboard</h3>
              <p className="feature-text">
                Track pending work, filings & recent documents.
              </p>
            </div>
          </div>

          <div className="solution-visual">
            <div className="dashboard-preview">
              <div className="dashboard-header">
                <h4>Draftzi Dashboard</h4>
                <span className="status-indicator">Live</span>
              </div>
              <div className="dashboard-stats">
                <div className="stat-item">
                  <span className="stat-number">12</span>
                  <span className="stat-label">Pending Documents</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">3</span>
                  <span className="stat-label">Compliance Due</span>
                </div>
              </div>
              <div className="dashboard-recent">
                <h5>Recent Activity</h5>
                <div className="activity-item">
                  <div className="activity-icon">
                    <Zap size={16} />
                  </div>
                  <span>NDA generated for Client ABC</span>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">
                    <Calendar size={16} />
                  </div>
                  <span>GST filing reminder set</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
