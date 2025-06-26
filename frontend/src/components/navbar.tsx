import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Briefcase, MessageSquare, Bell, User as UserIcon, LogOut, Plus, TrendingUp } from 'lucide-react';

const Navbar: React.FC = () => {
    const { user, logout } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // The loading check is handled by MainLayout, but this is an extra guard.
    if (!user.isAuthenticated) {
        return null;
    }

    const isInvestor = user.userType === 'investor';

    return (
        <nav className="bg-black text-white shadow-md">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <div className="flex items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="bg-white p-1.5 rounded-md">
                            <TrendingUp className="h-5 w-5 text-black" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Microvest</span>
                    </Link>
                </div>

                <div className="hidden md:flex items-center space-x-6">
                    {isInvestor ? (
                         <Link to="/catalogue" className="hover:text-gray-300">Browse Businesses</Link>
                    ) : (
                        <>
                            <Link to="/my-businesses" className="hover:text-gray-300">My Businesses</Link>
                            <Link to="/catalogue" className="hover:text-gray-300">Browse Businesses</Link>
                        </>
                    )}
                    <Link to="/profit-distributions" className="hover:text-gray-300">Profit Distributions</Link>
                    <Link to="/consultants" className="hover:text-gray-300">Look for Consultants</Link>
                    <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
                </div>

                <div className="flex items-center space-x-4">
                    {isInvestor ? (
                         <button onClick={() => navigate('/add-funds')} className="bg-white text-black font-semibold px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-200">
                            <Plus size={18} />
                            <span>Add Funds</span>
                        </button>
                    ) : (
                        <button onClick={() => navigate('/pitch')} className="bg-white text-black font-semibold px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-200">
                            <Plus size={18} />
                            <span>Pitch Idea</span>
                        </button>
                    )}
                   
                    <Link to="/messages" className="relative p-2 rounded-full hover:bg-gray-800">
                        <MessageSquare size={20} />
                    </Link>
                    <button className="relative p-2 rounded-full hover:bg-gray-800">
                        <Bell size={20} />
                        <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-black"></span>
                    </button>
                    
                    <Link to="/profile" className="p-2 rounded-full hover:bg-gray-800">
                        <UserIcon size={20} />
                    </Link>

                    <button onClick={handleLogout} title="Logout" className="p-2 rounded-full hover:bg-gray-800">
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
