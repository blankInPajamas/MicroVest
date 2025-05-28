import React from "react";

function Navbar()
{
    return(
        <>
            <nav className="w-full h-18 border-b-1 flex justify-between items-center px-9">
                <div className="text-3xl">
                    MicroVest
                </div>
                <div className="">
                    <button className="border-1 rounded-sm px-4 py-2 mr-4 hover:bg-black hover:text-white transition duration-300">Log in</button>
                    <button className="border-1 rounded-sm px-4 py-2 hover:bg-black hover:text-white transition duration-300">Sign up</button>
                </div>
            </nav>
        </>
    );
}

export default Navbar;