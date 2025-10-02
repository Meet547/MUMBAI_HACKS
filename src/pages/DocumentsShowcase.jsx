import React, { useEffect, useRef } from "react";
import "./DocumentsShowcase.css";

const documentsData = {
  lawyers: {
    title: "For Lawyers",
    subtitle: "Comprehensive legal documents that meet court standards",
    documents: [
      { name: "Legal Notice", icon: "⚖️" },
      { name: "Power of Attorney", icon: "📄" },
      { name: "Agreement Draft", icon: "🤝" },
      { name: "Court Petition", icon: "🏛️" },
      { name: "Affidavit", icon: "✍️" },
      { name: "Contract Review", icon: "📋" },
      { name: "NDA Template", icon: "🔒" },
      { name: "Lease Agreement", icon: "📝" },
      { name: "Cease & Desist", icon: "⚡" }
    ]
  },
  cas: {
    title: "For CAs/CSs",
    subtitle: "Statutory compliance documents that save hours of work",
    documents: [
      { name: "Annual Return", icon: "📊" },
      { name: "Board Resolution", icon: "💼" },
      { name: "Company Formation", icon: "🏢" },
      { name: "Financial Statement", icon: "📈" },
      { name: "Audit Report", icon: "🔍" },
      { name: "Secretarial Audit", icon: "📑" },
      { name: "Tax Filing", icon: "💰" },
      { name: "Compliance Report", icon: "🎯" },
      { name: "AGM Notice", icon: "📌" }
    ]
  },
  hr: {
    title: "For HRs",
    subtitle: "Employee documentation that maintains consistency and professionalism",
    documents: [
      { name: "Offer Letter", icon: "👤" },
      { name: "Employment Contract", icon: "📋" },
      { name: "Warning Letter", icon: "⚠️" },
      { name: "Termination Notice", icon: "🚪" },
      { name: "Performance Review", icon: "📊" },
      { name: "Experience Letter", icon: "🎓" },
      { name: "Policy Document", icon: "📝" },
      { name: "Transfer Letter", icon: "🔄" },
      { name: "Increment Letter", icon: "✅" }
    ]
  }
};

export default function DocumentsShowcase() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Add a delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      const container = containerRef.current;
      if (!container) {
        console.error('Container not found!');
        return;
      }

      const sections = container.querySelectorAll('.section-wrapper');
      console.log('DocumentsShowcase: Found sections:', sections.length);
      
      if (sections.length === 0) {
        console.error('No sections found!');
        return;
      }

      sections.forEach((section, i) => {
        const track = section.querySelector('.cards-track');
        const cards = track?.querySelectorAll('.card');
        console.log(`Section ${i}: track=${!!track}, cards=${cards?.length || 0}`);
      });

      // Scroll handler
      let ticking = false;
      const handleScroll = () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(() => {
            sections.forEach((section, index) => {
              const track = section.querySelector('.cards-track');
              if (!track) {
                console.log(`Section ${index}: No track found`);
                return;
              }
              
              const rect = section.getBoundingClientRect();
              
              // Check if section is in viewport and scrolling through it
              if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
                const sectionHeight = section.offsetHeight;
                const windowHeight = window.innerHeight;
                const scrollDistance = sectionHeight - windowHeight;
                const progress = Math.max(0, Math.min(1, -rect.top / scrollDistance));
                
                const cards = track.querySelectorAll('.card');
                const cardWidth = 280;
                const gap = 32;
                const totalWidth = (cardWidth + gap) * cards.length;
                const translateX = -(totalWidth * progress * 0.6); // Reduced multiplier
                
                track.style.transform = `translateX(${translateX}px)`;
                
                // Debug all sections when scrolling
                console.log(`Section ${index}: progress=${progress.toFixed(2)}, translateX=${translateX.toFixed(0)}px, rect.top=${rect.top.toFixed(0)}`);
              }
            });
            ticking = false;
          });
        }
      };

      // Add event listeners
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      // Test transform to verify CSS is working
      const firstTrack = sections[0]?.querySelector('.cards-track');
      if (firstTrack) {
        firstTrack.style.transform = 'translateX(-100px)';
        console.log('Test transform applied to first track');
        setTimeout(() => {
          firstTrack.style.transform = 'translateX(0px)';
          console.log('Test transform reset');
        }, 1000);
      }

      // Initial call to set positions
      handleScroll();
      
      console.log('Scroll handler added successfully');

      // Cleanup
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, 200); // Wait 200ms for DOM to be ready

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="documents-showcase" ref={containerRef}>
      {/* Lawyers Section */}
      <div className="section-wrapper" data-section="lawyers">
        <div className="section-sticky">
          <div className="section-header">
            <h2 className="section-title">{documentsData.lawyers.title}</h2>
            <p className="section-subtitle">{documentsData.lawyers.subtitle}</p>
          </div>
          <div className="cards-container">
            <div className="cards-track">
              {documentsData.lawyers.documents.map((doc, index) => (
                <div key={`lawyers-${index}`} className="card">
                  <div className="card-icon">{doc.icon}</div>
                  <div className="card-title">{doc.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CAs Section */}
      <div className="section-wrapper" data-section="cas">
        <div className="section-sticky">
          <div className="section-header">
            <h2 className="section-title">{documentsData.cas.title}</h2>
            <p className="section-subtitle">{documentsData.cas.subtitle}</p>
          </div>
          <div className="cards-container">
            <div className="cards-track">
              {documentsData.cas.documents.map((doc, index) => (
                <div key={`cas-${index}`} className="card">
                  <div className="card-icon">{doc.icon}</div>
                  <div className="card-title">{doc.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* HR Section */}
      <div className="section-wrapper" data-section="hr">
        <div className="section-sticky">
          <div className="section-header">
            <h2 className="section-title">{documentsData.hr.title}</h2>
            <p className="section-subtitle">{documentsData.hr.subtitle}</p>
          </div>
          <div className="cards-container">
            <div className="cards-track">
              {documentsData.hr.documents.map((doc, index) => (
                <div key={`hr-${index}`} className="card">
                  <div className="card-icon">{doc.icon}</div>
                  <div className="card-title">{doc.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
