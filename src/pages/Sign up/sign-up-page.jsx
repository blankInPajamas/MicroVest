import { useState } from "react";
import { Link } from "react-router-dom";
// import "./sign-up-page.css"; // We will remove or significantly reduce this file

export default function SignUpPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState("investor");

  // Basic signup data
  const [basicData, setBasicData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  // Investor specific data
  const [investorData, setInvestorData] = useState({
    annual_income_range: "",
    annual_investing_capacity: "",
    avg_investment_amount: "",
    prior_investments_count: "",
    risk_tolerance: "",
    proof_of_funds_file: null,
  });

  // Entrepreneur specific data
  const [entrepreneurData, setEntrepreneurData] = useState({
    previous_ventures: "",
    entrepreneurial_experience_years: "",
    current_employment_status: "",
    current_funds_available: "",
    personal_funds_invested: "",
    time_commitment: "",
  });

  const handleBasicSubmit = (e) => {
    e.preventDefault();
    if (basicData.password !== basicData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    setStep(2);
  };

  const handleDetailedSubmit = (e) => {
    e.preventDefault();
    const completeData = {
      ...basicData,
      userType,
      ...(userType === "investor" ? investorData : entrepreneurData),
    };
    console.log("Complete signup data:", completeData);
    alert("Account created successfully!");
  };

  // IMPORTANT: For internal app navigation, use React Router's Link
  // For external links (like /terms, /privacy), you might still use <a>,
  // but if /terms and /privacy are internal routes, replace with <Link>
  // and handleLinkClick is no longer needed.
  // For now, I'll keep the a tags as they were originally, but replace handleLinkClick with Link functionality.
  // You should import Link from 'react-router-dom' if /terms and /privacy are internal.
  // Example for these links:
  // import { Link } from 'react-router-dom';
  // <Link to="/terms" className="text-white font-medium hover:underline relative after:content-[''] after:absolute after:w-full after:h-[1px] after:bottom-[-2px] after:left-0 after:bg-white after:shadow-[0_0_5px_rgba(255,255,255,0.5)]">
  //   Terms of Service
  // </Link>


  const updateBasicData = (field, value) => {
    setBasicData((prev) => ({ ...prev, [field]: value }));
  };

  const updateInvestorData = (field, value) => {
    setInvestorData((prev) => ({ ...prev, [field]: value }));
  };

  const updateEntrepreneurData = (field, value) => {
    setEntrepreneurData((prev) => ({ ...prev, [field]: value }));
  };

  // Add file handling function
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // You can add file validation here if needed
      updateInvestorData("proof_of_funds_file", file);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-8 font-mono overflow-x-hidden">
      <div className="w-full max-w-xl flex flex-col gap-8 box-border">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-transparent border-2 border-white rounded-lg p-3 shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              <svg className="h-8 w-8 text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mt-0 mb-2 py-4 shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            MicroVest
          </h1>
          <p className="text-gray-400 mt-2 mb-0">Join the future of business investment</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center bg-white/10 p-4 rounded-lg border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.15)]">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center font-bold text-sm text-white/70 bg-transparent transition-all duration-300 ease-in-out ${
                  step >= 1 ? "bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" : ""
                }`}
              >
                1
              </div>
              <span className="text-xs text-white/70 font-medium">Basic Info</span>
            </div>
            <div
              className={`w-12 h-[2px] bg-white/30 transition-colors duration-300 ease-in-out ${
                step >= 2 ? "bg-white shadow-[0_0_5px_rgba(255,255,255,0.5)]" : ""
              }`}
            ></div>
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center font-bold text-sm text-white/70 bg-transparent transition-all duration-300 ease-in-out ${
                  step >= 2 ? "bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" : ""
                }`}
              >
                2
              </div>
              <span className="text-xs text-white/70 font-medium">Details</span>
            </div>
          </div>
        </div>

        {/* Sign Up Card */}
        <div className="border-2 border-white/30 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.15)] bg-black/[.9] overflow-hidden box-border backdrop-blur-lg">
          <div className="p-8 pb-6 text-center border-b border-white/20 bg-white/5">
            <h2 className="text-3xl font-bold text-white py-4 mb-2 tracking-wide shadow-[0_0_15px_rgba(255,255,255,0.5)]">
              {step === 1 ? "Create Your Account" : userType === "investor" ? "Investment Profile" : "Business Profile"}
            </h2>
            <p className="text-white/90 text-base m-0 tracking-wide">
              {step === 1
                ? "Start your investment journey"
                : userType === "investor"
                ? "Help us understand your investment preferences"
                : "Tell us about your entrepreneurial background"}
            </p>

            {/* User Type Selection (only for step 1) */}
            {step === 1 && (
              <div className="mt-6 mb-4">
                <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-lg border-2 border-gray-200">
                  <button
                    type="button"
                    className={`flex items-center justify-center gap-2 p-3 rounded-md border-none bg-transparent text-gray-500 font-medium cursor-pointer transition-all duration-150 ease-in-out ${
                      userType === "investor" ? "bg-black text-white shadow-sm" : "hover:text-gray-700"
                    }`}
                    onClick={() => setUserType("investor")}
                  >
                    <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className={`flex items-center justify-center gap-2 p-3 rounded-md border-none bg-transparent text-gray-500 font-medium cursor-pointer transition-all duration-150 ease-in-out ${
                      userType === "entrepreneur" ? "bg-black text-white shadow-sm" : "hover:text-gray-700"
                    }`}
                    onClick={() => setUserType("entrepreneur")}
                  >
                    <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <p className="text-center text-sm text-gray-500 mt-3 mb-0 leading-tight">
                  {userType === "investor"
                    ? "Build your investment portfolio with promising startups"
                    : "Raise capital and grow your business with our investor network"}
                </p>
              </div>
            )}
          </div>

          <div className="p-8 box-border">
            {step === 1 ? (
              // Step 1: Basic Information
              <form onSubmit={handleBasicSubmit} className="flex flex-col gap-6 box-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 box-border">
                  <div className="flex flex-col gap-3 box-border min-w-0">
                    <label htmlFor="firstName" className="text-white font-medium text-base tracking-wide shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={basicData.firstName}
                      onChange={(e) => updateBasicData("firstName", e.target.value)}
                      required
                      className="border-2 border-white/40 rounded-md p-3 text-base tracking-wide transition-all duration-150 ease-in-out bg-white/10 text-white box-border w-full min-w-0 placeholder-white/50 focus:outline-none focus:border-white focus:shadow-[0_0_15px_rgba(255,255,255,0.3)] focus:bg-white/15"
                    />
                  </div>
                  <div className="flex flex-col gap-3 box-border min-w-0">
                    <label htmlFor="lastName" className="text-white font-medium text-base tracking-wide shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={basicData.lastName}
                      onChange={(e) => updateBasicData("lastName", e.target.value)}
                      required
                      className="border-2 border-white/40 rounded-md p-3 text-base tracking-wide transition-all duration-150 ease-in-out bg-white/10 text-white box-border w-full min-w-0 placeholder-white/50 focus:outline-none focus:border-white focus:shadow-[0_0_15px_rgba(255,255,255,0.3)] focus:bg-white/15"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 box-border">
                  <label htmlFor="email" className="text-white font-medium text-base tracking-wide shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder={userType === "investor" ? "investor@example.com" : "founder@startup.com"}
                    value={basicData.email}
                    onChange={(e) => updateBasicData("email", e.target.value)}
                    required
                    className="border-2 border-white/40 rounded-md p-3 text-base tracking-wide transition-all duration-150 ease-in-out bg-white/10 text-white box-border w-full min-w-0 placeholder-white/50 focus:outline-none focus:border-white focus:shadow-[0_0_15px_rgba(255,255,255,0.3)] focus:bg-white/15"
                  />
                </div>

                <div className="flex flex-col gap-3 box-border">
                  <label htmlFor="password" className="text-white font-medium text-base tracking-wide shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={basicData.password}
                      onChange={(e) => updateBasicData("password", e.target.value)}
                      required
                      className="border-2 border-white/40 rounded-md p-3 text-base tracking-wide transition-all duration-150 ease-in-out bg-white/10 text-white box-border w-full min-w-0 placeholder-white/50 focus:outline-none focus:border-white focus:shadow-[0_0_15px_rgba(255,255,255,0.3)] focus:bg-white/15 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-gray-400 cursor-pointer p-0 hover:text-gray-500"
                    >
                      {showPassword ? (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                <div className="flex flex-col gap-3 box-border">
                  <label htmlFor="confirmPassword" className="text-white font-medium text-base tracking-wide shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={basicData.confirmPassword}
                      onChange={(e) => updateBasicData("confirmPassword", e.target.value)}
                      required
                      className="border-2 border-white/40 rounded-md p-3 text-base tracking-wide transition-all duration-150 ease-in-out bg-white/10 text-white box-border w-full min-w-0 placeholder-white/50 focus:outline-none focus:border-white focus:shadow-[0_0_15px_rgba(255,255,255,0.3)] focus:bg-white/15 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-gray-400 cursor-pointer p-0 hover:text-gray-500"
                    >
                      {showConfirmPassword ? (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                <div className="flex items-start gap-3 mt-2 bg-white/10 p-4 rounded-md">
                  <input
                    id="agreeToTerms"
                    type="checkbox"
                    checked={basicData.agreeToTerms}
                    onChange={(e) => updateBasicData("agreeToTerms", e.target.checked)}
                    required
                    className="mt-0.5 rounded-sm border-2 border-white/40 flex-shrink-0 w-5 h-5 accent-white"
                  />
                  <label htmlFor="agreeToTerms" className="text-sm text-white/90 leading-normal tracking-wide">
                    I agree to the{" "}
                    {/* Using <a> tags here, but if /terms and /privacy are internal routes, replace with <Link> */}
                    <a
                      href="/terms"
                      className="text-white font-medium relative after:content-[''] after:absolute after:w-full after:h-[1px] after:bottom-[-2px] after:left-0 after:bg-white after:shadow-[0_0_5px_rgba(255,255,255,0.5)]"
                      onClick={(e) => { e.preventDefault(); console.log("Navigate to /terms"); }}
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      className="text-white font-medium relative after:content-[''] after:absolute after:w-full after:h-[1px] after:bottom-[-2px] after:left-0 after:bg-white after:shadow-[0_0_5px_rgba(255,255,255,0.5)]"
                      onClick={(e) => { e.preventDefault(); console.log("Navigate to /privacy"); }}
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <button type="submit" className="w-full bg-black text-white font-medium py-3 px-4 rounded-md border-none cursor-pointer transition-colors duration-150 ease-in-out hover:bg-gray-700">
                  Continue
                </button>
              </form>
            ) : (
              // Step 2: Detailed Information
              <>
                <div className="p-8 box-border">
                  <form onSubmit={handleDetailedSubmit} className="flex flex-col gap-6 box-border">
                    {userType === "investor" ? (
                      // Investor Form
                      <>
                        <div className="flex flex-col gap-3 box-border">
                          <label htmlFor="annual_income_range" className="text-white font-medium text-base tracking-wide shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                            Annual Income Range
                          </label>
                          <select
                            id="annual_income_range"
                            value={investorData.annual_income_range}
                            onChange={(e) => updateInvestorData("annual_income_range", e.target.value)}
                            required
                            className="border-2 border-white/40 rounded-md p-3 text-base tracking-wide transition-all duration-150 ease-in-out bg-white/10 text-white box-border w-full min-w-0 appearance-none bg-[url('data:image/svg+xml,%3csvg_xmlns=%27http://www.w3.org/2000/svg%27_fill=%27none%27_viewBox=%270_0_20_20%27%3e%3cpath_stroke=%27%23FFFFFF%27_stroke-linecap=%27round%27_stroke-linejoin=%27round%27_stroke-width=%271.5%27_d=%27m6_8_4_4_4-4%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_1rem_center] bg-[length:1.5em_1.5em] pr-12 focus:outline-none focus:border-white focus:shadow-[0_0_15px_rgba(255,255,255,0.3)] focus:bg-white/15"
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 box-border">
                          <div className="flex flex-col gap-3 box-border min-w-0">
                            <label htmlFor="annual_investing_capacity" className="text-white font-medium text-base tracking-wide shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                              Annual Investment Capacity (৳)
                            </label>
                            <input
                              id="annual_investing_capacity"
                              type="number"
                              placeholder="50000"
                              value={investorData.annual_investing_capacity}
                              onChange={(e) => updateInvestorData("annual_investing_capacity", e.target.value)}
                              required
                              className="border-2 border-white/40 rounded-md p-3 text-base tracking-wide transition-all duration-150 ease-in-out bg-white/10 text-white box-border w-full min-w-0 placeholder-white/50 focus:outline-none focus:border-white focus:shadow-[0_0_15px_rgba(255,255,255,0.3)] focus:bg-white/15"
                            />
                          </div>
                          <div className="flex flex-col gap-3 box-border min-w-0">
                            <label htmlFor="avg_investment_amount" className="text-white font-medium text-base tracking-wide shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                              Average Investment Amount (৳)
                            </label>
                            <input
                              id="avg_investment_amount"
                              type="number"
                              placeholder="10000"
                              value={investorData.avg_investment_amount}
                              onChange={(e) => updateInvestorData("avg_investment_amount", e.target.value)}
                              required
                              className="border-2 border-white/40 rounded-md p-3 text-base tracking-wide transition-all duration-150 ease-in-out bg-white/10 text-white box-border w-full min-w-0 placeholder-white/50 focus:outline-none focus:border-white focus:shadow-[0_0_15px_rgba(255,255,255,0.3)] focus:bg-white/15"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 box-border">
                          <label htmlFor="prior_investments_count" className="text-white font-medium text-base tracking-wide shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                            Number of Prior Investments
                          </label>
                          <input
                            id="prior_investments_count"
                            type="number"
                            placeholder="5"
                            value={investorData.prior_investments_count}
                            onChange={(e) => updateInvestorData("prior_investments_count", e.target.value)}
                            required
                            className="border-2 border-white/40 rounded-md p-3 text-base tracking-wide transition-all duration-150 ease-in-out bg-white/10 text-white box-border w-full min-w-0 placeholder-white/50 focus:outline-none focus:border-white focus:shadow-[0_0_15px_rgba(255,255,255,0.3)] focus:bg-white/15"
                          />
                        </div>

                        <div className="flex flex-col gap-3 box-border">
                          <label htmlFor="risk_tolerance" className="text-white font-medium text-base tracking-wide shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                            Risk Tolerance
                          </label>
                          <select
                            id="risk_tolerance"
                            value={investorData.risk_tolerance}
                            onChange={(e) => updateInvestorData("risk_tolerance", e.target.value)}
                            required
                            className="border-2 border-white/40 rounded-md p-3 text-base tracking-wide transition-all duration-150 ease-in-out bg-white/10 text-white box-border w-full min-w-0 appearance-none bg-[url('data:image/svg+xml,%3csvg_xmlns=%27http://www.w3.org/2000/svg%27_fill=%27none%27_viewBox=%270_0_20_20%27%3e%3cpath_stroke=%27%23FFFFFF%27_stroke-linecap=%27round%27_stroke-linejoin=%27round%27_stroke-width=%271.5%27_d=%27m6_8_4_4_4-4%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_1rem_center] bg-[length:1.5em_1.5em] pr-12 focus:outline-none focus:border-white focus:shadow-[0_0_15px_rgba(255,255,255,0.3)] focus:bg-white/15"
                          >
                            <option value="">Select risk tolerance</option>
                            <option value="low">Low - Conservative investments</option>
                            <option value="medium">Medium - Balanced approach</option>
                            <option value="high">High - Aggressive growth</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-3 box-border">
                          <label htmlFor="proof_of_funds_file" className="text-white font-medium text-base tracking-wide shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                            Proof of Funds (Upload Document)
                          </label>
                          <input
                            id="proof_of_funds_file"
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={handleFileUpload}
                            className="p-3 border-2 border-dashed border-gray-400 bg-gray-100 rounded-md cursor-pointer hover:border-black hover:bg-gray-200 transition-all duration-300 ease-in-out text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" // Tailwind's file input styling
                            required
                          />
                          <small className="block mt-1 text-sm text-white/70 tracking-wide">
                            Upload your financial documents (Supported formats: PDF, DOC, DOCX, JPG, PNG)
                          </small>
                        </div>
                      </>
                    ) : (
                      // Entrepreneur Form
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 box-border">
                          <div className="flex flex-col gap-3 box-border min-w-0">
                            <label htmlFor="previous_ventures" className="text-white font-medium text-base tracking-wide shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                              Previous Ventures
                            </label>
                            <input
                              id="previous_ventures"
                              type="number"
                              placeholder="2"
                              value={entrepreneurData.previous_ventures}
                              onChange={(e) => updateEntrepreneurData("previous_ventures", e.target.value)}
                              required
                              className="border-2 border-white/40 rounded-md p-3 text-base tracking-wide transition-all duration-150 ease-in-out bg-white/10 text-white box-border w-full min-w-0 placeholder-white/50 focus:outline-none focus:border-white focus:shadow-[0_0_15px_rgba(255,255,255,0.3)] focus:bg-white/15"
                            />
                          </div>
                          <div className="flex flex-col gap-3 box-border min-w-0">
                            <label htmlFor="entrepreneurial_experience_years" className="text-white font-medium text-base tracking-wide shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                              Years of Experience
                            </label>
                            <input
                              id="entrepreneurial_experience_years"
                              type="number"
                              placeholder="5"
                              value={entrepreneurData.entrepreneurial_experience_years}
                              onChange={(e) => updateEntrepreneurData("entrepreneurial_experience_years", e.target.value)}
                              required
                              className="border-2 border-white/40 rounded-md p-3 text-base tracking-wide transition-all duration-150 ease-in-out bg-white/10 text-white box-border w-full min-w-0 placeholder-white/50 focus:outline-none focus:border-white focus:shadow-[0_0_15px_rgba(255,255,255,0.3)] focus:bg-white/15"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 box-border">
                          <label htmlFor="current_employment_status" className="text-white font-medium text-base tracking-wide shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                            Current Employment Status
                          </label>
                          <select
                            id="current_employment_status"
                            value={entrepreneurData.current_employment_status}
                            onChange={(e) => updateEntrepreneurData("current_employment_status", e.target.value)}
                            required
                            className="border-2 border-white/40 rounded-md p-3 text-base tracking-wide transition-all duration-150 ease-in-out bg-white/10 text-white box-border w-full min-w-0 appearance-none bg-[url('data:image/svg+xml,%3csvg_xmlns=%27http://www.w3.org/2000/svg%27_fill=%27none%27_viewBox=%270_0_20_20%27%3e%3cpath_stroke=%27%23FFFFFF%27_stroke-linecap=%27round%27_stroke-linejoin=%27round%27_stroke-width=%271.5%27_d=%27m6_8_4_4_4-4%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_1rem_center] bg-[length:1.5em_1.5em] pr-12 focus:outline-none focus:border-white focus:shadow-[0_0_15px_rgba(255,255,255,0.3)] focus:bg-white/15"
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 box-border">
                          <div className="flex flex-col gap-3 box-border min-w-0">
                            <label htmlFor="current_funds_available" className="text-white font-medium text-base tracking-wide shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                              Current Funds Available (৳)
                            </label>
                            <input
                              id="current_funds_available"
                              type="number"
                              placeholder="25000"
                              value={entrepreneurData.current_funds_available}
                              onChange={(e) => updateEntrepreneurData("current_funds_available", e.target.value)}
                              required
                              className="border-2 border-white/40 rounded-md p-3 text-base tracking-wide transition-all duration-150 ease-in-out bg-white/10 text-white box-border w-full min-w-0 placeholder-white/50 focus:outline-none focus:border-white focus:shadow-[0_0_15px_rgba(255,255,255,0.3)] focus:bg-white/15"
                            />
                          </div>
                          <div className="flex flex-col gap-3 box-border min-w-0">
                            <label htmlFor="personal_funds_invested" className="text-white font-medium text-base tracking-wide shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                              Personal Funds Invested (৳)
                            </label>
                            <input
                              id="personal_funds_invested"
                              type="number"
                              placeholder="10000"
                              value={entrepreneurData.personal_funds_invested}
                              onChange={(e) => updateEntrepreneurData("personal_funds_invested", e.target.value)}
                              required
                              className="border-2 border-white/40 rounded-md p-3 text-base tracking-wide transition-all duration-150 ease-in-out bg-white/10 text-white box-border w-full min-w-0 placeholder-white/50 focus:outline-none focus:border-white focus:shadow-[0_0_15px_rgba(255,255,255,0.3)] focus:bg-white/15"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 box-border">
                          <label htmlFor="time_commitment" className="text-white font-medium text-base tracking-wide shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                            Time Commitment
                          </label>
                          <select
                            id="time_commitment"
                            value={entrepreneurData.time_commitment}
                            onChange={(e) => updateEntrepreneurData("time_commitment", e.target.value)}
                            required
                            className="border-2 border-white/40 rounded-md p-3 text-base tracking-wide transition-all duration-150 ease-in-out bg-white/10 text-white box-border w-full min-w-0 appearance-none bg-[url('data:image/svg+xml,%3csvg_xmlns=%27http://www.w3.org/2000/svg%27_fill=%27none%27_viewBox=%270_0_20_20%27%3e%3cpath_stroke=%27%23FFFFFF%27_stroke-linecap=%27round%27_stroke-linejoin=%27round%27_stroke-width=%271.5%27_d=%27m6_8_4_4_4-4%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_1rem_center] bg-[length:1.5em_1.5em] pr-12 focus:outline-none focus:border-white focus:shadow-[0_0_15px_rgba(255,255,255,0.3)] focus:bg-white/15"
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

                    <div className="flex gap-4 mt-4">
                      <button type="button" onClick={() => setStep(1)} className="flex-1 bg-white text-black border-2 border-black font-medium py-2 px-4 rounded-md cursor-pointer transition-all duration-150 ease-in-out hover:bg-gray-100">
                        Back
                      </button>
                      <button type="submit" className="flex-2 bg-black text-white font-medium py-2 px-4 rounded-md border-none cursor-pointer transition-colors duration-150 ease-in-out hover:bg-gray-700">
                        Create Account
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}

            <div className="p-6 text-center box-border">
              <div className="text-sm text-gray-500">
                Already have an account?{" "}
                {/* As before, convert this to <Link> if /sign-in is an internal route */}
                <Link
                  to="/consultant"
                  className="text-white font-medium relative after:content-[''] after:absolute after:w-full after:h-[1px] after:bottom-[-2px] after:left-0 after:bg-white after:shadow-[0_0_5px_rgba(255,255,255,0.5)]"
                  onClick={(e) => { e.preventDefault(); console.log("Navigate to /sign-in"); }}
                >
                  Sign in here
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Platform Notice */}
        <div className="text-center text-xs text-gray-500 bg-gray-100 p-4 rounded-md border border-gray-200 box-border">
          <p className="font-medium text-black m-0 mb-1">Investment Notice</p>
          <p className="m-0">
            All investments carry risk. Past performance does not guarantee future results. Please invest responsibly.
          </p>
        </div>
      </div>
    </div>
  );
}