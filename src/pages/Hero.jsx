import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import "./Hero.css";

export default function Hero() {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  return (
    <section className="hero">
      <div className="hero-background">
        <div className="hero-gradient"></div>
        <div className="hero-pattern"></div>
      </div>
      
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-text">✨ AI-Powered Legal Drafting</span>
          </div>
          
          <h1 className="hero-title">
            Draft Legal & Compliance Docs the{" "}
            <span className="hero-highlight">Easy Way</span>, with Draftzi.
          </h1>
          
          <p className="hero-subtitle">
            Draftzi is your AI co-pilot for legal, HR & compliance paperwork.
            Why wrestle with drafts when Draftzi drafts for you?
          </p>
          
          <div className="hero-actions">
            <button className="hero-cta primary" onClick={handleSignUpClick}>
              <span>Start Drafting Free</span>
              <ArrowRight size={20} />
            </button>
            
            <button className="hero-cta secondary">
              <Play size={18} />
              <span>Watch Demo</span>
            </button>
          </div>
          
          <div className="hero-social-proof">
            <p className="social-proof-text">
              Trusted by <strong>1000+</strong> legal professionals
            </p>
            <div className="social-proof-avatars">
              <div className="avatar"></div>
              <div className="avatar"></div>
              <div className="avatar"></div>
              <div className="avatar more">+</div>
            </div>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="hero-cards">
            <div className="floating-card card-1">
              <div className="card-header">
                <div className="card-icon">📄</div>
                <span>NDA</span>
              </div>
              <div className="card-status">Ready</div>
            </div>
            
            <div className="floating-card card-2">
              <div className="card-header">
                <div className="card-icon">📋</div>
                <span>Employment Agreement</span>
              </div>
              <div className="card-status">Generating...</div>
            </div>
            
            <div className="floating-card card-3">
              <div className="card-header">
                <div className="card-icon">⚖️</div>
                <span>Legal Notice</span>
              </div>
              <div className="card-status">Complete</div>
            </div>
          </div>
          
          <div className="hero-dashboard">
            <div className="dashboard-header">
              <h3>Draftzi Dashboard</h3>
              <div className="dashboard-status">
                <div className="status-dot"></div>
                <span>Live</span>
              </div>
            </div>
            
            <div className="dashboard-stats">
              <div className="stat">
                <span className="stat-number">24</span>
                <span className="stat-label">Documents</span>
              </div>
              <div className="stat">
                <span className="stat-number">5</span>
                <span className="stat-label">Templates</span>
              </div>
              <div className="stat">
                <span className="stat-number">12</span>
                <span className="stat-label">Clients</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="hero-scroll-indicator">
        <div className="scroll-arrow"></div>
      </div>
    </section>
  );
}
