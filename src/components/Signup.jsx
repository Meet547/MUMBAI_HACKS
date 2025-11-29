import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css";
import lawyerImage from "../Images/lawyer.png";
import hrwomanImage from "../Images/HRwoman.png";
import cacsImage from "../Images/cacs.png";
import { FaUser, FaEnvelope, FaBriefcase } from "react-icons/fa";


export default function Signup() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    industry: "",
    customIndustry: "",
  });
  const [errors, setErrors] = useState({});

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
      id: "Corporate",
      label: "Corporate",
      image: cacsImage,
    },
  ];

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
  };

  const handleContinue = () => {
    if (selectedType) {
      setCurrentStep(2);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Industry is now optional, but if custom industry is selected, it must be filled
    if (formData.industry === "Others" && !formData.customIndustry.trim()) {
      newErrors.customIndustry = "Please specify your industry";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGetStarted = () => {
    if (validateForm()) {
      // Navigate to dashboard with user profile data
      const userProfile = {
        name: formData.name,
        email: formData.email,
        industry: formData.industry === "Others" ? formData.customIndustry : formData.industry,
        userType: formData.industry === "Company Secretary" ? "Company Secretary" : 
                  formData.industry === "Chartered Accountant" ? "Chartered Accountant" : 
                  selectedType,
      };
      try { localStorage.setItem('userProfile', JSON.stringify(userProfile)); } catch {}
      navigate("/dashboard", {
        state: {
          userProfile,
        },
      });
    }
  };

  const getSelectedLabel = () => {
    const selected = userTypes.find((type) => type.id === selectedType);
    return selected ? selected.label.toUpperCase() : null;
  };

  const getSelectedImage = () => {
    const selected = userTypes.find((type) => type.id === selectedType);
    return selected ? selected.image : null;
  };

  return (
    <div className="signup-container">
      {currentStep === 1 ? (
        // Step 1: User Type Selection
        <>
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
        </>
      ) : (
        // Step 2: User Information Form
        <div className="signup-step-2">
          <div className="signup-content-left">
            <h1>Awesome!</h1>
            <p>
              Let's set up your Draftzi workspace.
              <br />
              First, tell us about yourself.
            </p>

            <div className="signup-form">
              <div className="form-group">
                <FaUser className="icon" />
                <input
                  type="text"
                  name="name"
                  placeholder="What should we call you?"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? "error" : ""}
                />
                {errors.name && (
                  <div className="error-message">{errors.name}</div>
                )}
              </div>

              <div className="form-group">
                <FaEnvelope className="icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Your work email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? "error" : ""}
                />
                {errors.email && (
                  <div className="error-message">{errors.email}</div>
                )}
              </div>

              <div className="form-group select-group">
                <FaBriefcase className="icon" />
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className={`brand-select ${errors.industry ? "error" : ""}`}
                  aria-label="Industry"
                >
                  {/* Hidden empty option so no text is shown until user selects */}
                  <option value="" disabled hidden></option>
                  {/* Dynamic options based on selected profession */}
                  {selectedType === "lawyer" && (
                    <>
                      <option value="Criminal">Criminal</option>
                      <option value="Civil">Civil</option>
                      <option value="Corporate">Corporate</option>
                    </>
                  )}
                  {selectedType === "HR manager" && (
                    <>
                      <option value="Technology">Technology</option>
                      <option value="Retail">Retail</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Hospitality">Hospitality</option>
                      <option value="Others">Others - specify</option>
                    </>
                  )}
                  {(selectedType === "Corporate") && (
                    <>
                      <option value="Chartered Accountant">Chartered Accountant</option>
                      <option value="Company Secretary">Company Secretary</option>
                    </>
                  )}
                </select>
                {!formData.industry && (
                  <span className="select-placeholder">
                    {selectedType === "lawyer" ? "What type of law do you practice? (Optional)" :
                     selectedType === "HR manager" ? "What industry do you work in? (Optional)" :
                     selectedType === "Corporate" ? "Select your qualification (Optional)" :
                     "What industry do you work in? (Optional)"}
                  </span>
                )}
                {errors.industry && (
                  <div className="error-message">{errors.industry}</div>
                )}
              </div>

              {formData.industry === "Others" && (
                <div className="form-group">
                  <FaBriefcase className="icon" />
                  <input
                    type="text"
                    name="customIndustry"
                    placeholder="Please specify your industry"
                    value={formData.customIndustry}
                    onChange={handleInputChange}
                    className={errors.customIndustry ? "error" : ""}
                  />
                  {errors.customIndustry && (
                    <div className="error-message">{errors.customIndustry}</div>
                  )}
                </div>
              )}

              <button className="get-started-btn" onClick={handleGetStarted}>
                Get Started
              </button>

              <div className="slogan-container">
                <div className="slogan-line top"></div>
                <div className="slogan-text">Legal contracts made easy.</div>
                <div className="slogan-line bottom"></div>
              </div>
            </div>
          </div>

          <div className="signup-content-right">
            <div className="enlarged-image">
              <img src={getSelectedImage()} alt="Selected profession" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
