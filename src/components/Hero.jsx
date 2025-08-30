import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Hero.css";

export default function Hero() {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  return (
    <section className="hero">
      <div className="hero-container">
        {/* Left */}
        <div className="hero-left">
          <h1 className="hero-title">
            Draft Legal Documents <br /> Faster and Smarter
          </h1>
          <p className="hero-subtitle">
            Automate drafting, manage clients, and track compliance all in one
            secure platform.
          </p>
          <button className="hero-btn" onClick={handleSignUpClick}>
            Sign up &gt;&gt;&gt;
          </button>
        </div>

        {/* Right */}
        <div className="hero-right">
          <div className="doc-card">Employment Agreement</div>
        </div>
      </div>
    </section>
  );
}
