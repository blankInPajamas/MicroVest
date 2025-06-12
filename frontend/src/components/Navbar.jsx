import React from "react";
import { Link } from 'react-router-dom'; // Import Link

function Navbar() {
    return(
        <>
            <nav className="w-full bg-white h-18 border-b-1 flex justify-between items-center px-9">
                <div className="text-3xl">
        
                    <Link to="/" className="text-gray-900 hover:text-gray-700 transition duration-300">
                        MicroVest
                    </Link>
                </div>
                <div className="">
                    <Link
                        to="/login"
                        className="border-1 rounded-sm px-4 py-2 mr-4 hover:bg-black hover:text-white transition duration-300"
                    >
                        Log in
                    </Link>

                    <Link
                        to="/signup"
                        className="border-1 rounded-sm px-4 py-2 hover:bg-black hover:text-white transition duration-300"
                    >
                        Sign up
                    </Link>
                </div>
            </nav>
        </>
    );
}

export default Navbar;