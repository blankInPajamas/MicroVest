import React from "react";
import { Link } from "react-router-dom";

function HeroSection02()
{
    return(
        <>
            <section className="flex items-center justify-center min-h-[30rem] bg-black text-white px-6 py-12">
                <div className="container mx-auto text-center max-w-4xl">
                    <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                        The <span className="text-white">one-stop hub</span> for investors and small business owners
                    </h2>
                    <p className="text-lg md:text-xl text-gray-300 mb-10">
                        Get started with investing easily without any hassle. Diversify your portfolio while helping small business owners launch their dreams.
                    </p>
                    <Link to="/dummy" className="bg-white w-50 text-black px-8 py-3 rounded-lg text-lg font-semibold hover:w-50 hover:bg-black hover:text-white hover:border-1 hover:border-white transition duration-300 flex items-center mx-auto">
                        Try MicroVest <span className="ml-2">→</span>
                    </Link>
                </div>
            </section>
        </>
    );
}

export default HeroSection02;