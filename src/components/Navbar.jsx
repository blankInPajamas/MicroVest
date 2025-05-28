import React from "react";
import { Link } from "react-router-dom";

function Navbar()
{
    return(
        <>
            <nav className="w-full h-18 border-b flex justify-between items-center px-9">
                <div className="text-3xl">
                    MicroVest
                </div>
                <div className="">
                    <Link to="/login">
                        <button className="border rounded-sm px-4 py-2 mr-4 hover:bg-black hover:text-white transition duration-300">Log in</button>
                    </Link>

                    <Link to="/signup">
                        <button className="border rounded-sm px-4 py-2 hover:bg-black hover:text-white transition duration-300">Sign up</button>
                    </Link>
                </div>
            </nav>
        </>
    );
}

export default Navbar;