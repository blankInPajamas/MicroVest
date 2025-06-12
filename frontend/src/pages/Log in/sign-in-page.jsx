"use client"

import { useState } from "react"
import { Link } from "react-router-dom"


export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState("investor")

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle sign in logic here
    console.log("Sign in attempt:", { email, password, userType })
  }

  const handleLinkClick = (e, href) => {
    e.preventDefault()
    // Handle navigation - you can implement your own routing logic here
    console.log("Navigate to:", href)
    // For example: window.location.href = href
  }

  return (
<><style>{`
    /* Reset default styles */
* {
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
.signin-container {
  min-height: 100vh;
  width: 100%;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  font-family: 'Roboto Mono', monospace;
}

.signin-wrapper {
  width: 100%;
  max-width: 28rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
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
  font-size: 1.75rem;
  font-weight: bold;
  color: #ffffff;
  margin: 0;
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
  letter-spacing: 0.5px;
}

.brand-subtitle {
  color: rgba(255, 255, 255, 0.9);
  margin-top: 0.5rem;
  margin-bottom: 0;
  font-size: 1rem;
  letter-spacing: 0.5px;
}

/* Sign In Card */
.signin-card {
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.75rem;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.15);
  background-color: rgba(0, 0, 0, 0.9);
  overflow: hidden;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.card-header {
  padding: 2rem 2rem 1.5rem 2rem;
  text-align: center;
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
}

/* Form Styles */
.signin-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-label {
  color: #ffffff;
  font-weight: 500;
  font-size: 1rem;
  letter-spacing: 0.5px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.form-input {
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 0.375rem;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  letter-spacing: 0.5px;
  transition: all 0.15s ease-in-out;
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  width: 100%;
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.form-input:focus {
  outline: none;
  border-color: #ffffff;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  background-color: rgba(255, 255, 255, 0.15);
}

.password-container {
  position: relative;
}

.password-input {
  padding-right: 3rem;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 0;
  transition: color 0.15s ease-in-out;
}

.password-toggle:hover {
  color: #ffffff;
}

.eye-icon {
  height: 1.25rem;
  width: 1.25rem;
}

.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 0.5rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.checkbox {
  border-radius: 0.25rem;
  border: 2px solid rgba(255, 255, 255, 0.4);
  width: 1.25rem;
  height: 1.25rem;
  accent-color: white;
}

.checkbox-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.5px;
}

.forgot-link {
  font-size: 0.875rem;
  color: #ffffff;
  font-weight: 500;
  text-decoration: none;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  position: relative;
}

.forgot-link:after {
  content: '';
  position: absolute;
  width: 100%;
  height: 1px;
  bottom: -2px;
  left: 0;
  background-color: #ffffff;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}

.signin-button {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  color: black;
  font-weight: 500;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  font-size: 1rem;
  letter-spacing: 0.5px;
}

.signin-button:hover {
  background-color: #ffffff;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
}

/* Social Login Section */
.divider-section {
  margin-top: 1.5rem;
}

.divider {
  position: relative;
  text-align: center;
}

.divider::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.2);
}

.divider-text {
  background-color: rgba(0, 0, 0, 0.9);
  padding: 0 0.75rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  position: relative;
  letter-spacing: 0.5px;
}

.social-buttons {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.social-button {
  border: 2px solid rgba(255, 255, 255, 0.4);
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.15s ease-in-out;
  color: #ffffff;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
}

.social-button:hover {
  border-color: #ffffff;
  background-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
}

.social-icon {
  height: 1.25rem;
  width: 1.25rem;
  filter: brightness(0) invert(1);
}

/* Card Footer */
.card-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.05);
}

.signup-link {
  text-align: center;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.5px;
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

.legal-text {
  text-align: center;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 1rem;
  letter-spacing: 0.5px;
}

/* Investment Notice */
.investment-notice {
  text-align: center;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1.25rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  letter-spacing: 0.5px;
}

.notice-title {
  font-weight: 500;
  color: #ffffff;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.notice-text {
  margin: 0;
  line-height: 1.5;
}

/* User Type Selection */
.user-type-selection {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.user-type-toggle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.toggle-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  border: none;
  background-color: transparent;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  letter-spacing: 0.5px;
}

.toggle-button:hover {
  color: #ffffff;
}

.toggle-button.active {
  background-color: rgba(255, 255, 255, 0.9);
  color: black;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
}

.user-icon {
  height: 1.25rem;
  width: 1.25rem;
}

.user-type-description {
  text-align: center;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 1rem;
  line-height: 1.5;
  letter-spacing: 0.5px;
}

/* Responsive Design */
@media (max-width: 640px) {
  .signin-container {
    padding: 1rem 0.5rem;
  }

  .signin-wrapper {
    gap: 1.5rem;
  }

  .card-content {
    padding: 1.5rem;
  }

  .card-header {
    padding: 1.5rem 1.5rem 1rem 1.5rem;
  }

  .card-footer {
    padding: 1rem 1.5rem;
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

  .social-buttons {
    grid-template-columns: 1fr;
  }
}
  
  `}</style>
<div className="signin-container">
      <div className="signin-wrapper">
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
          <p className="brand-subtitle">Invest in tomorrow's businesses today</p>
        </div>

        {/* Sign In Card */}
        <div className="signin-card">
          <div className="card-header">
            <h2 className="card-title">Welcome Back</h2>
            <p className="card-description">Sign in to your account</p>

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
                  ? "Access your investment portfolio and discover new opportunities"
                  : "Manage your business campaigns and connect with investors"}
              </p>
            </div>
          </div>

          <div className="card-content">
            <form onSubmit={handleSubmit} className="signin-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder={userType === "investor" ? "investor@example.com" : "founder@startup.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-input password-input"
                  />
                
                </div>
              </div>

              <div className="form-options">
                <div className="remember-me">
                  <input id="remember" type="checkbox" className="checkbox" />
                  <label htmlFor="remember" className="checkbox-label">
                    Remember me
                  </label>
                </div>
                <a
                  href="/forgot-password"
                  className="forgot-link"
                  onClick={(e) => handleLinkClick(e, "/forgot-password")}
                >
                  Forgot password?
                </a>
              </div>

              <button type="submit" className="signin-button">
                Sign In
              </button>
            </form>

            <div className="divider-section">
              <div className="divider">
                <span className="divider-text">Or continue with</span>
              </div>
            </div>

            <div className="social-buttons">
              <button className="social-button">
                <svg className="social-icon" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button className="social-button">
                <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z" />
                </svg>
                Facebook
              </button>
            </div>
          </div>

          <div className="card-footer">
            <div className="signup-link">
              New to MicroVest?{" "}
              <Link to="/signup" className="link" onClick={(e) => handleLinkClick(e, "/sign-up")}>
                Create {userType === "investor" ? "an investor" : "an entrepreneur"} account
              </Link>
            </div>
            <div className="legal-text">
              By signing in, you agree to our{" "}
              <a href="/terms" className="link" onClick={(e) => handleLinkClick(e, "/terms")}>
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="link" onClick={(e) => handleLinkClick(e, "/privacy")}>
                Privacy Policy
              </a>
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
  </>)
}
