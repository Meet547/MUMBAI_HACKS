import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css";
import lawyerImage from "../Images/lawyer.png";
import hrwomanImage from "../Images/HRwoman.png";
import cacsImage from "../Images/cacs.png";

export default function Signup() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);

  const userTypes = [
    {
      id: "lawyer",
      label: "Lawyer",
      image: lawyerImage,
    },
    {
      id: "HR manager",
      label: "HR manager",
      image: hrwomanImage,
    },
    {
      id: "Chartered Accountant",
      label: "Chartered Accountant",
      image: cacsImage,
    },
  ];

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
  };

  const handleContinue = () => {
    if (selectedType) {
      console.log("Selected type:", selectedType);
    }
  };

  const getSelectedLabel = () => {
    const selected = userTypes.find((type) => type.id === selectedType);
    return selected ? selected.label.toUpperCase() : null;
  };

  return (
    <div className="signup-container">
      <div className="signup-header">
        <h1>What best describes you?</h1>
        <p>Choose the option that best fits your role in the legal field</p>
      </div>

      <div className="selection-area">
        <div className="option-cards">
          {userTypes.map((type) => (
            <div
              key={type.id}
              className={`option-card ${
                selectedType === type.id ? "selected" : ""
              }`}
              onClick={() => handleTypeSelect(type.id)}
            >
              <div className="option-image">
                <img src={type.image} alt={type.label} />
              </div>
            </div>
          ))}
        </div>

        {selectedType && (
          <div className="feedback-state">
            <span>{getSelectedLabel()}</span>
          </div>
        )}
      </div>

      <div className="action-area">
        <button
          className="continue-btn"
          onClick={handleContinue}
          disabled={!selectedType}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
