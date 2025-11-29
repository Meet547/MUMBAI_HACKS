import React from "react";
import { Scale, BarChart3, Users } from "lucide-react";
import "./ProblemSection.css";

export default function ProblemSection() {
  return (
    <section className="problem-section">
      <div className="problem-container">
        <div className="problem-header">
          <h2 className="problem-title">Why Professionals Need Draftzi</h2>
          <p className="problem-subtitle">
            Legal and compliance professionals face the same challenges every day
          </p>
        </div>

        <div className="problem-cards">
          <div className="problem-card">
            <div className="problem-icon">
              <Scale size={24} />
            </div>
            <h3 className="problem-card-title">Lawyers</h3>
            <p className="problem-card-text">
              Waste hours redrafting vakalatnamas, notices, and agreements from scratch every time.
            </p>
          </div>

          <div className="problem-card">
            <div className="problem-icon">
              <BarChart3 size={24} />
            </div>
            <h3 className="problem-card-title">CAs/CS</h3>
            <p className="problem-card-text">
              Juggle endless compliance registers, filings, and regulatory documents manually.
            </p>
          </div>

          <div className="problem-card">
            <div className="problem-icon">
              <Users size={24} />
            </div>
            <h3 className="problem-card-title">HR Teams</h3>
            <p className="problem-card-text">
              Drown in repetitive offer letters, exit documents, and policy paperwork.
            </p>
          </div>
        </div>

        <div className="problem-result">
          <p className="result-text">
            <strong>Result:</strong> Time wasted. Missed deadlines. Costly errors.
          </p>
        </div>
      </div>
    </section>
  );
}
