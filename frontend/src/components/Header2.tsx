import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header2() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('first_name');
    localStorage.removeItem('last_name');
    localStorage.removeItem('phone_number');
    localStorage.removeItem('prof_pic');

    navigate('/login');
  };

  const isAuthenticated = localStorage.getItem('authToken') && localStorage.getItem('username');

  return (
    <header className="bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-xl font-bold">Microvest</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/catalogue" className="hover:text-gray-300 transition-colors">
              Browse Investments
            </Link>
            <Link to="/pitch" className="hover:text-gray-300 transition-colors">
              Submit Pitch
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-gray-300 transition-colors">
                  Dashboard
                </Link>
                <Link to="/profile" className="hover:text-gray-300 transition-colors">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-gray-300 transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <nav className="flex flex-col space-y-4">
              <Link to="/catalogue" className="hover:text-gray-300 transition-colors">
                Browse Investments
              </Link>
              <Link to="/pitch" className="hover:text-gray-300 transition-colors">
                Submit Pitch
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="hover:text-gray-300 transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/profile" className="hover:text-gray-300 transition-colors">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-gray-300 transition-colors">
                    Login
                  </Link>
                  <Link to="/signup" className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-center">
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 