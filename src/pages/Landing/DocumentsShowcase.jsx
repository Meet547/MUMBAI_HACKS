import React, { useState } from "react";
import { 
  Scale, 
  TrendingUp, 
  Users, 
  FileText, 
  Shield, 
  Handshake,
  Building,
  UserCheck,
  Award,
  AlertCircle,
  Briefcase,
  Calendar,
  ArrowRight
} from "lucide-react";
import "./DocumentsShowcase.css";

const documentsData = {
  lawyers: [
    { name: "Power of Attorney", icon: Scale },
    { name: "Lease Agreement", icon: Building },
    { name: "Legal Notice", icon: AlertCircle },
    { name: "Settlement Agreement", icon: Handshake },
    { name: "Vakalatnama", icon: Scale },
    { name: "Sale Agreement", icon: FileText },
    { name: "Partition Deed", icon: Building },
    { name: "Gift Deed", icon: Award },
    { name: "NDA", icon: Shield },
    { name: "MoU", icon: Handshake },
    { name: "Service Agreement", icon: Briefcase },
    { name: "Shareholder Agreement", icon: TrendingUp },
    { name: "Employment Agreement", icon: Users },
    { name: "Founder Agreement", icon: Handshake },
    { name: "Term Sheet", icon: FileText },
    { name: "Bail Bond", icon: Scale },
    { name: "Criminal Complaint", icon: AlertCircle },
    { name: "Affidavit (Identity)", icon: UserCheck },
    { name: "Affidavit (Incident)", icon: AlertCircle },
    { name: "Section 41A Notice Reply", icon: FileText },
    { name: "Section 200 CrPC", icon: Scale }
  ],
  cas: [
    { name: "Minutes of Board Meeting", icon: Users },
    { name: "Shareholder Resolution", icon: TrendingUp },
    { name: "Business Board Resolution", icon: Building },
    { name: "MoA/AoA", icon: FileText },
    { name: "Reply to GST Notice", icon: AlertCircle },
    { name: "Reply to Legal Notice", icon: FileText },
    { name: "MGT-7 Register", icon: TrendingUp },
    { name: "MGT-9 Register", icon: TrendingUp },
    { name: "DIR-12", icon: FileText },
    { name: "ADT-1", icon: FileText },
    { name: "AGM Notice", icon: Calendar },
    { name: "DIR-8", icon: FileText },
    { name: "MBP-1", icon: FileText },
    { name: "GST Filing Documents", icon: TrendingUp },
    { name: "NDAs", icon: Shield }
  ],
  hr: [
    { name: "Offer Letter", icon: Award },
    { name: "Employment Letter", icon: Users },
    { name: "NDAs", icon: Shield },
    { name: "Confirmation Letter", icon: UserCheck },
    { name: "Exit Letter", icon: AlertCircle },
    { name: "Termination Letter", icon: AlertCircle },
    { name: "Salary Increment Letter", icon: TrendingUp },
    { name: "Joining Letter", icon: UserCheck },
    { name: "Application Letter", icon: FileText },
    { name: "Performance Appraisal Form", icon: Award },
    { name: "Warning Letter", icon: AlertCircle }
  ]
};

export default function DocumentsShowcase() {
  const [activeTab, setActiveTab] = useState("lawyers");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const tabs = [
    { id: "lawyers", label: "👩‍⚖ Lawyers", icon: Scale },
    { id: "cas", label: "📊 CAs/CSs", icon: TrendingUp },
    { id: "hr", label: "👩‍💼 HR Teams", icon: Users }
  ];

  const handleTabChange = (newTab) => {
    if (newTab === activeTab) return;
    
    setIsTransitioning(true);
    
    // After cards slide out, change tab and slide in new cards
    setTimeout(() => {
      setActiveTab(newTab);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <section className="documents-showcase">
      <div className="documents-container">
        <div className="documents-header">
          <h2 className="documents-title">
            📂 Documents You Can Draft with Draftzi
          </h2>
          <p className="documents-subtitle">
            From contracts to compliance, Draftzi makes every draft easy.
          </p>
        </div>

        {/* Clean Tabs */}
        <div className="documents-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Cards Grid with Deck Animation */}
        <div className={`documents-grid ${isTransitioning ? 'transitioning' : ''}`}>
          {documentsData[activeTab].map((doc, index) => {
            const IconComponent = doc.icon;
            return (
              <div 
                key={`${activeTab}-${doc.name}`}
                className="document-card"
                style={{
                  animationDelay: isTransitioning ? '0ms' : `${index * 50}ms`
                }}
              >
                <div className="card-icon">
                  <IconComponent size={20} />
                </div>
                <h4 className="card-title">{doc.name}</h4>
              </div>
            );
          })}
        </div>

        <div className="documents-footer">
          <p className="footer-text">
            50+ ready-to-use legal & business templates. All accessible in just a few clicks.
          </p>
          <button className="get-started-btn">
            Get Started
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
