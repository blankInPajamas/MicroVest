import React from "react";
import heroImage from "../../assets/landing_hero_section.png";
import { Link } from "react-router-dom";

function HeroSection01() {
  return (
    <>
      <section className="flex items-center justify-center min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between text-center md:text-left">
          {/* Text Content */}
          <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Empowering small businesses to grow
            </h2>
            <p className="text-base sm:text-lg text-gray-700 mb-8">
              Connect with investors, pitch your vision, and raise the capital you need.
            </p>
            <Link
              to="/signup"
              className="bg-black text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-300 hover:text-gray-900 hover:border-black hover:border-1 transition duration-300 inline-flex items-center justify-center w-full sm:w-auto"
            >
              Try MicroVest free <span className="ml-2">→</span>
            </Link>
          </div>

          {/* Image Section */}
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
              <img
                src={heroImage}
                alt="Mobile phone with financial data"
                className="w-full h-auto rounded-lg shadow-xl object-cover transform scale-100 md:scale-125 transition-transform duration-300 ease-in-out"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HeroSection01;