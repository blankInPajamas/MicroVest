import React from "react";
import heroImage from "../../assets/landing_hero_section.png";

function HeroSection01()
{
    return(
        <>
            <section className="flex items-center justify-center min-h-[40rem] bg-gray-100">
                <div className="container mx-w-6xl px-6 py-12 flex flex-col md:flex-row items-center justify-between">
                    <div className="text-left md:w-1/2 md:pr-12 mb-10 md:mb-0">
                        <h2 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
                        Empowering small businesses to grow
                        </h2>
                        <p className="text-lg text-gray-700 mb-8">
                        Connect with investors, pitch your vision, and raise the capital you need.
                        </p>
                        <button className="bg-black text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-300 hover:text-gray-900 hover:border-black hover:border-1 transition duration-300 flex items-center">
                        Try MicroVest free <span className="ml-2">→</span>
                        </button>
                    </div>
                    <div className="md:w-1/2 flex justify-center md:justify-end">
                        <div className="relative w-full max-w-lg">
                        <img
                            src={heroImage}
                            alt="Mobile phone with financial data"
                            className="w-full h-auto rounded-lg shadow-xl object-cover  scale-150"
                        />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default HeroSection01;