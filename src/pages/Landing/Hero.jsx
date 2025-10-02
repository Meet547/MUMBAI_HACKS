import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "./Hero.css";

export default function Hero() {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Draft Legal & Compliance Docs the Easy Way, with Draftzi.
          </h1>
          <p className="hero-subtitle">
            Draftzi is your AI co-pilot for legal, HR & compliance paperwork.
            Why wrestle with drafts when Draftzi drafts for you?
          </p>
          <button className="hero-cta" onClick={handleSignUpClick}>
            Sign Up Free
            <ArrowRight size={20} />
          </button>
          <p className="hero-tagline">
            "Draftzi — From Draft Easy to Done Easy."
          </p>
        </div>
        
        <div className="hero-visual">
          <div className="document-preview">
            <div className="doc-header">
              <div className="doc-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="doc-title">Employment Agreement</span>
            </div>
            <div className="doc-content">
              <div className="doc-line long"></div>
              <div className="doc-line medium"></div>
              <div className="doc-line short"></div>
              <div className="doc-line long"></div>
              <div className="doc-line medium"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
