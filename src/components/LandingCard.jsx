import React from "react";
import "../styles/LandingCard.css";

/**
 * Reusable landing card.
 * Pass any JSX as `rightContent` (e.g., the white doc card).
 */
export default function LandingCard({
  logo,
  title,
  subtitle,
  text,
  buttonLabel,
  onButtonClick,
  rightContent,
  backgroundColor = "#ffffff",
  textColor = "#000000",
}) {
  return (
    <section
      className="landing-card"
      style={{ backgroundColor, color: textColor }}
    >
      <div className="landing-left">
        {logo && <div className="landing-logo">{logo}</div>}

        {title && <h1 className="landing-title">{title}</h1>}
        {subtitle && <p className="landing-subtitle">{subtitle}</p>}
        {text && <p className="landing-text">{text}</p>}

        {buttonLabel && (
          <button className="landing-btn" onClick={onButtonClick}>
            {buttonLabel}
          </button>
        )}
      </div>

      <div className="landing-right">
        {rightContent}
      </div>
    </section>
  );
}
