import React from "react";
import { Link } from "react-router-dom";

function Footer() {
    return (
        
        <div className="bg-black w-full h-96 flex flex-col items-center justify-center text-center text-white p-6">
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Try MicroVest today
            </h1>

            <div className="text-lg md:text-xl leading-relaxed space-y mb-8">
                <div>Get started for free.</div>
                <div>Realize your dreams.</div>
                <div>Gain Business ownership</div>
            </div>

            <Link 
                to="/consultant" 
                className="border border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition duration-300 flex items-center justify-center"
            >
                Sign Up Now <span className="ml-2">→</span> {/* ml-2: Margin left for the arrow */}
            </Link>
        </div>
    );
}

export default Footer;