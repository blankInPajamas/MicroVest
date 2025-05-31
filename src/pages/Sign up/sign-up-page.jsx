import { useState } from "react"
import { Link } from "react-router-dom"

export default function SignUpPage() {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [userType, setUserType] = useState("investor")

  // Basic signup data
  const [basicData, setBasicData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  // Investor specific data
  const [investorData, setInvestorData] = useState({
    annual_income_range: "",
    annual_investing_capacity: "",
    avg_investment_amount: "",
    prior_investments_count: "",
    risk_tolerance: "",
    proof_of_funds_file: null,
  })

  // Entrepreneur specific data
  const [entrepreneurData, setEntrepreneurData] = useState({
    previous_ventures: "",
    entrepreneurial_experience_years: "",
    current_employment_status: "",
    current_funds_available: "",
    personal_funds_invested: "",
    time_commitment: "",
  })

  const handleBasicSubmit = (e) => {
    e.preventDefault()
    if (basicData.password !== basicData.confirmPassword) {
      alert("Passwords don't match!")
      return
    }
    setStep(2)
  }

  const handleDetailedSubmit = (e) => {
    e.preventDefault()
    const completeData = {
      ...basicData,
      userType,
      ...(userType === "investor" ? investorData : entrepreneurData),
    }
    console.log("Complete signup data:", completeData)
    alert("Account created successfully!")
  }

  const handleLinkClick = (e, href) => {
    e.preventDefault()
    console.log("Navigate to:", href)
  }

  const updateBasicData = (field, value) => {
    setBasicData((prev) => ({ ...prev, [field]: value }))
  }

  const updateInvestorData = (field, value) => {
    setInvestorData((prev) => ({ ...prev, [field]: value }))
  }

  const updateEntrepreneurData = (field, value) => {
    setEntrepreneurData((prev) => ({ ...prev, [field]: value }))
  }

  // Add file handling function
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // You can add file validation here if needed
      updateInvestorData("proof_of_funds_file", file)
    }
  }

  return (

    <>
    <style>{`* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Import Roboto Mono font */
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&display=swap');

/* Container and Layout */
.signup-container {
  min-height: 100vh;
  width: 100%;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  font-family: 'Roboto Mono', monospace;
}

.signup-wrapper {
  width: 100%;
  max-width: 32rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  box-sizing: border-box;
}

/* Header Section */
.header-section {
  text-align: center;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.logo-icon {
  background-color: transparent;
  border-radius: 0.5rem;
  padding: 0.75rem;
  border: 2px solid white;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.trending-icon {
  height: 2rem;
  width: 2rem;
  color: white;
  filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.5));
}

.brand-title {
  font-size: 1.875rem;
  font-weight: bold;
  color: white;
  margin: 0;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.brand-subtitle {
  color: #a3a3a3;
  margin-top: 0.5rem;
  margin-bottom: 0;
}

/* Progress Indicator */
.progress-indicator {
  display: flex;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
}

.progress-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.step-number {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  background-color: transparent;
  transition: all 0.3s ease;
}

.progress-step.active .step-number {
  background-color: white;
  color: black;
  border-color: white;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.step-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.progress-step.active .step-label {
  color: white;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}

.progress-line {
  width: 3rem;
  height: 2px;
  background-color: rgba(255, 255, 255, 0.3);
  transition: background-color 0.3s ease;
}

.progress-line.active {
  background-color: white;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}

/* Sign Up Card */
.signup-card {
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.75rem;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.15);
  background-color: rgba(0, 0, 0, 0.9);
  overflow: hidden;
  box-sizing: border-box;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.card-header {
  padding: 2rem 2rem 1.5rem 2rem;
  text-align: center;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.05);
}

.card-title {
  font-size: 1.75rem;
  font-weight: bold;
  color: #ffffff;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
  letter-spacing: 0.5px;
}

.card-description {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  margin: 0;
  letter-spacing: 0.5px;
}

.card-content {
  padding: 2rem;
  box-sizing: border-box;
}

/* Form Styles */
.signup-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-sizing: border-box;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  box-sizing: border-box;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  box-sizing: border-box;
  min-width: 0;
}

.form-label {
  color: #ffffff;
  font-weight: 500;
  font-size: 1rem;
  letter-spacing: 0.5px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.form-input,
.form-select {
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 0.375rem;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  letter-spacing: 0.5px;
  transition: all 0.15s ease-in-out;
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #ffffff;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  background-color: rgba(255, 255, 255, 0.15);
}

.form-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23FFFFFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 1rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 3rem;
}

.form-select option {
  background-color: #000000;
  color: #ffffff;
  padding: 0.75rem;
}

.form-hint {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.5px;
}

.password-container {
  position: relative;
}

.password-input {
  padding-right: 2.5rem;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
}

.password-toggle:hover {
  color: black;
}

.eye-icon {
  height: 1rem;
  width: 1rem;
}

.checkbox-group {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-top: 0.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 0.5rem;
}

.checkbox {
  margin-top: 0.125rem;
  border-radius: 0.25rem;
  border: 2px solid rgba(255, 255, 255, 0.4);
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  accent-color: white;
}

.checkbox-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
  letter-spacing: 0.5px;
}

/* Enhanced File Upload Styles */
.file-upload-wrapper {
  width: 100%;
  box-sizing: border-box;
}

.file-input-hidden {
  display: none;
}

.file-upload-area {
  border: 3px dashed #d1d5db;
  border-radius: 0.5rem;
  background-color: #f9fafb;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 1.5rem;
  text-align: center;
  box-sizing: border-box;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-upload-area:hover {
  border-color: black;
  background-color: #f3f4f6;
}

.file-upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.upload-icon {
  height: 2rem;
  width: 2rem;
  color: #6b7280;
  flex-shrink: 0;
}

.file-upload-area:hover .upload-icon {
  color: black;
}

.file-upload-text {
  text-align: center;
}

.file-main-text {
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
}

.file-sub-text {
  font-size: 0.875rem;
  color: #6b7280;
}

.file-selected {
  font-size: 0.875rem;
  color: #059669;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.file-name {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
  word-break: break-all;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.back-button {
  flex: 1;
  background-color: white;
  color: black;
  border: 2px solid black;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.back-button:hover {
  background-color: #f9fafb;
}

.signup-button {
  flex: 2;
  background-color: black;
  color: white;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
}

.signup-button:hover {
  background-color: #374151;
}

/* Card Footer */
.card-footer {
  padding: 0 1.5rem 1.5rem 1.5rem;
  text-align: center;
  box-sizing: border-box;
}

.signin-link {
  font-size: 0.875rem;
  color: #6b7280;
}

.link {
  color: #ffffff;
  font-weight: 500;
  text-decoration: none;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  position: relative;
}

.link:after {
  content: '';
  position: absolute;
  width: 100%;
  height: 1px;
  bottom: -2px;
  left: 0;
  background-color: #ffffff;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}

/* Investment Notice */
.investment-notice {
  text-align: center;
  font-size: 0.75rem;
  color: #6b7280;
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  box-sizing: border-box;
}

.notice-title {
  font-weight: 500;
  color: black;
  margin: 0 0 0.25rem 0;
}

.notice-text {
  margin: 0;
}

/* User Type Selection */
.user-type-selection {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.user-type-toggle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  background-color: #f3f4f6;
  padding: 0.25rem;
  border-radius: 0.5rem;
  border: 2px solid #e5e7eb;
  box-sizing: border-box;
}

.toggle-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  border: none;
  background-color: transparent;
  color: #6b7280;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  box-sizing: border-box;
  min-width: 0;
}

.toggle-button:hover {
  color: #374151;
}

.toggle-button.active {
  background-color: black;
  color: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.user-icon {
  height: 1.25rem;
  width: 1.25rem;
  flex-shrink: 0;
}

.user-type-description {
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.75rem;
  margin-bottom: 0;
  line-height: 1.4;
}

/* Responsive Design */
@media (max-width: 640px) {
  .signup-container {
    padding: 0.5rem;
  }

  .signup-wrapper {
    gap: 1.5rem;
    max-width: 100%;
  }

  .card-content {
    padding: 1rem;
  }

  .card-header {
    padding: 1rem 1rem 0 1rem;
  }

  .card-footer {
    padding: 0 1rem 1rem 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .toggle-button {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }

  .user-icon {
    height: 1rem;
    width: 1rem;
  }

  .user-type-description {
    font-size: 0.8rem;
  }

  .progress-bar {
    gap: 0.5rem;
  }

  .progress-line {
    width: 2rem;
  }

  .step-label {
    font-size: 0.7rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .back-button,
  .signup-button {
    flex: 1;
  }

  .file-upload-area {
    padding: 1rem;
    min-height: 100px;
  }

  .upload-icon {
    height: 1.5rem;
    width: 1.5rem;
  }

  .file-main-text {
    font-size: 0.875rem;
  }

  .file-sub-text {
    font-size: 0.75rem;
  }
}

/* Additional overflow prevention */
* {
  box-sizing: border-box;
}

.file-input {
  padding: 0.5rem;
  border: 2px dashed #d1d5db;
  background-color: #f9fafb;
  cursor: pointer;
}

.file-input:hover {
  border-color: black;
  background-color: #f3f4f6;
}

    `}</style>

    <div className="signup-container">
      
      <div className="signup-wrapper">
        {/* Logo and Header */}
        <div className="header-section">
          <div className="logo-container">
            <div className="logo-icon">
              <svg className="trending-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <h1 className="brand-title">MicroVest</h1>
          <p className="brand-subtitle">Join the future of business investment</p>
        </div>

        {/* Progress Indicator */}
        <div className="progress-indicator">
          <div className="progress-bar">
            <div className={`progress-step ${step >= 1 ? "active" : ""}`}>
              <div className="step-number">1</div>
              <span className="step-label">Basic Info</span>
            </div>
            <div className={`progress-line ${step >= 2 ? "active" : ""}`}></div>
            <div className={`progress-step ${step >= 2 ? "active" : ""}`}>
              <div className="step-number">2</div>
              <span className="step-label">Details</span>
            </div>
          </div>
        </div>

        {/* Sign Up Card */}
        <div className="signup-card">
          {step === 1 ? (
            // Step 1: Basic Information
            <>
              <div className="card-header">
                <h2 className="card-title">Create Your Account</h2>
                <p className="card-description">Start your investment journey</p>

                {/* User Type Selection */}
                <div className="user-type-selection">
                  <div className="user-type-toggle">
                    <button
                      type="button"
                      className={`toggle-button ${userType === "investor" ? "active" : ""}`}
                      onClick={() => setUserType("investor")}
                    >
                      <svg className="user-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                      Investor
                    </button>
                    <button
                      type="button"
                      className={`toggle-button ${userType === "entrepreneur" ? "active" : ""}`}
                      onClick={() => setUserType("entrepreneur")}
                    >
                      <svg className="user-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                      Entrepreneur
                    </button>
                  </div>
                  <p className="user-type-description">
                    {userType === "investor"
                      ? "Build your investment portfolio with promising startups"
                      : "Raise capital and grow your business with our investor network"}
                  </p>
                </div>
              </div>

              <div className="card-content">
                <form onSubmit={handleBasicSubmit} className="signup-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName" className="form-label">
                        First Name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={basicData.firstName}
                        onChange={(e) => updateBasicData("firstName", e.target.value)}
                        required
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName" className="form-label">
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        value={basicData.lastName}
                        onChange={(e) => updateBasicData("lastName", e.target.value)}
                        required
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder={userType === "investor" ? "investor@example.com" : "founder@startup.com"}
                      value={basicData.email}
                      onChange={(e) => updateBasicData("email", e.target.value)}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <div className="password-container">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={basicData.password}
                        onChange={(e) => updateBasicData("password", e.target.value)}
                        required
                        className="form-input password-input"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                        {showPassword ? (
                          <svg className="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                            />
                          </svg>
                        ) : (
                          <svg className="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm Password
                    </label>
                    <div className="password-container">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={basicData.confirmPassword}
                        onChange={(e) => updateBasicData("confirmPassword", e.target.value)}
                        required
                        className="form-input password-input"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="password-toggle"
                      >
                        {showConfirmPassword ? (
                          <svg className="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                            />
                          </svg>
                        ) : (
                          <svg className="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="checkbox-group">
                    <input
                      id="agreeToTerms"
                      type="checkbox"
                      checked={basicData.agreeToTerms}
                      onChange={(e) => updateBasicData("agreeToTerms", e.target.checked)}
                      required
                      className="checkbox"
                    />
                    <label htmlFor="agreeToTerms" className="checkbox-label">
                      I agree to the{" "}
                      <a href="/terms" className="link" onClick={(e) => handleLinkClick(e, "/terms")}>
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" className="link" onClick={(e) => handleLinkClick(e, "/privacy")}>
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  <button type="submit" className="signup-button">
                    Continue
                  </button>
                </form>
              </div>
            </>
          ) : (
            // Step 2: Detailed Information
            <>
              <div className="card-header">
                <h2 className="card-title">{userType === "investor" ? "Investment Profile" : "Business Profile"}</h2>
                <p className="card-description">
                  {userType === "investor"
                    ? "Help us understand your investment preferences"
                    : "Tell us about your entrepreneurial background"}
                </p>
              </div>

              <div className="card-content">
                <form onSubmit={handleDetailedSubmit} className="signup-form">
                  {userType === "investor" ? (
                    // Investor Form
                    <>
                      <div className="form-group">
                        <label htmlFor="annual_income_range" className="form-label">
                          Annual Income Range
                        </label>
                        <select
                          id="annual_income_range"
                          value={investorData.annual_income_range}
                          onChange={(e) => updateInvestorData("annual_income_range", e.target.value)}
                          required
                          className="form-select"
                        >
                          <option value="">Select income range</option>
                          <option value="under-50k">Under $50,000</option>
                          <option value="50k-100k">$50,000 - $100,000</option>
                          <option value="100k-250k">$100,000 - $250,000</option>
                          <option value="250k-500k">$250,000 - $500,000</option>
                          <option value="500k-1m">$500,000 - $1,000,000</option>
                          <option value="over-1m">Over $1,000,000</option>
                        </select>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="annual_investing_capacity" className="form-label">
                            Annual Investment Capacity (৳)
                          </label>
                          <input
                            id="annual_investing_capacity"
                            type="number"
                            placeholder="50000"
                            value={investorData.annual_investing_capacity}
                            onChange={(e) => updateInvestorData("annual_investing_capacity", e.target.value)}
                            required
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="avg_investment_amount" className="form-label">
                            Average Investment Amount (৳)
                          </label>
                          <input
                            id="avg_investment_amount"
                            type="number"
                            placeholder="10000"
                            value={investorData.avg_investment_amount}
                            onChange={(e) => updateInvestorData("avg_investment_amount", e.target.value)}
                            required
                            className="form-input"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="prior_investments_count" className="form-label">
                          Number of Prior Investments
                        </label>
                        <input
                          id="prior_investments_count"
                          type="number"
                          placeholder="5"
                          value={investorData.prior_investments_count}
                          onChange={(e) => updateInvestorData("prior_investments_count", e.target.value)}
                          required
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="risk_tolerance" className="form-label">
                          Risk Tolerance
                        </label>
                        <select
                          id="risk_tolerance"
                          value={investorData.risk_tolerance}
                          onChange={(e) => updateInvestorData("risk_tolerance", e.target.value)}
                          required
                          className="form-select"
                        >
                          <option value="">Select risk tolerance</option>
                          <option value="low">Low - Conservative investments</option>
                          <option value="medium">Medium - Balanced approach</option>
                          <option value="high">High - Aggressive growth</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="proof_of_funds_file" className="form-label">
                          Proof of Funds (Upload Document)
                        </label>
                        <input
                          id="proof_of_funds_file"
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={handleFileUpload}
                          className="form-input file-input"
                          required
                        />
                        <small className="form-hint">
                          Upload your financial documents (Supported formats: PDF, DOC, DOCX, JPG, PNG)
                        </small>
                      </div>
                    </>
                  ) : (
                    // Entrepreneur Form
                    <>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="previous_ventures" className="form-label">
                            Previous Ventures
                          </label>
                          <input
                            id="previous_ventures"
                            type="number"
                            placeholder="2"
                            value={entrepreneurData.previous_ventures}
                            onChange={(e) => updateEntrepreneurData("previous_ventures", e.target.value)}
                            required
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="entrepreneurial_experience_years" className="form-label">
                            Years of Experience
                          </label>
                          <input
                            id="entrepreneurial_experience_years"
                            type="number"
                            placeholder="5"
                            value={entrepreneurData.entrepreneurial_experience_years}
                            onChange={(e) => updateEntrepreneurData("entrepreneurial_experience_years", e.target.value)}
                            required
                            className="form-input"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="current_employment_status" className="form-label">
                          Current Employment Status
                        </label>
                        <select
                          id="current_employment_status"
                          value={entrepreneurData.current_employment_status}
                          onChange={(e) => updateEntrepreneurData("current_employment_status", e.target.value)}
                          required
                          className="form-select"
                        >
                          <option value="">Select employment status</option>
                          <option value="full-time-entrepreneur">Full-time Entrepreneur</option>
                          <option value="part-time-entrepreneur">Part-time Entrepreneur</option>
                          <option value="employed-full-time">Employed Full-time</option>
                          <option value="employed-part-time">Employed Part-time</option>
                          <option value="student">Student</option>
                          <option value="unemployed">Unemployed</option>
                        </select>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="current_funds_available" className="form-label">
                            Current Funds Available (৳)
                          </label>
                          <input
                            id="current_funds_available"
                            type="number"
                            placeholder="25000"
                            value={entrepreneurData.current_funds_available}
                            onChange={(e) => updateEntrepreneurData("current_funds_available", e.target.value)}
                            required
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="personal_funds_invested" className="form-label">
                            Personal Funds Invested (৳)
                          </label>
                          <input
                            id="personal_funds_invested"
                            type="number"
                            placeholder="10000"
                            value={entrepreneurData.personal_funds_invested}
                            onChange={(e) => updateEntrepreneurData("personal_funds_invested", e.target.value)}
                            required
                            className="form-input"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="time_commitment" className="form-label">
                          Time Commitment
                        </label>
                        <select
                          id="time_commitment"
                          value={entrepreneurData.time_commitment}
                          onChange={(e) => updateEntrepreneurData("time_commitment", e.target.value)}
                          required
                          className="form-select"
                        >
                          <option value="">Select time commitment</option>
                          <option value="full-time">Full-time (40+ hours/week)</option>
                          <option value="part-time">Part-time (20-40 hours/week)</option>
                          <option value="side-project">Side Project (10-20 hours/week)</option>
                          <option value="minimal">Minimal (Less than 10 hours/week)</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div className="form-actions">
                    <button type="button" onClick={() => setStep(1)} className="back-button">
                      Back
                    </button>
                    <button type="submit" className="signup-button">
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}

          <div className="card-footer">
            <div className="signin-link">
              Already have an account?{" "}
              <Link to="/login" className="link" onClick={(e) => handleLinkClick(e, "/sign-in")}>
                Sign in here
              </Link>
            </div>
          </div>
        </div>

        {/* Investment Platform Notice */}
        <div className="investment-notice">
          <p className="notice-title">Investment Notice</p>
          <p className="notice-text">
            All investments carry risk. Past performance does not guarantee future results. Please invest responsibly.
          </p>
        </div>
      </div>
    </div>
    </>
  )
}