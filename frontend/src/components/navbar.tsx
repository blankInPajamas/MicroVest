import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Briefcase, MessageSquare, Bell, User as UserIcon, LogOut, Plus, TrendingUp } from 'lucide-react';

// Define TypeScript interfaces for our data structures
interface Notification {
  id: number;
  type: 'investment';
  investorName: string;
  amount: number;
  businessName: string;
  read: boolean;
}

const Navbar: React.FC = () => {
    const { user, logout } = useUser();
    const navigate = useNavigate();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Refs for the notification popup and the button that opens it
    const notificationsRef = useRef<HTMLDivElement>(null);
    const notificationButtonRef = useRef<HTMLButtonElement>(null);

    // Mock fetching notifications
    useEffect(() => {
        const fetchNotifications = () => {
            // In a real app, you would fetch this from your API
            const mockNotifications: Notification[] = [
                { id: 1, type: 'investment', investorName: 'John Doe', amount: 500, businessName: 'Eco-Friendly Eats', read: false },
                { id: 2, type: 'investment', investorName: 'Jane Smith', amount: 1200, businessName: 'Tech Innovators Inc.', read: true },
                { id: 3, type: 'investment', investorName: 'Sam Wilson', amount: 750, businessName: 'GreenScape Solutions', read: false },
            ];
            setNotifications(mockNotifications);
        };

        fetchNotifications();
    }, []);

    // Close notifications popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                notificationsRef.current &&
                !notificationsRef.current.contains(event.target as Node) &&
                notificationButtonRef.current &&
                !notificationButtonRef.current.contains(event.target as Node)
            ) {
                setIsNotificationsOpen(false);
            }
        };

        if (isNotificationsOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isNotificationsOpen]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Show loading state while authentication is being determined
    if (user.loading) {
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
                    <div className="text-gray-400">Loading...</div>
                </div>
            </nav>
        );
    }

    // The loading check is handled by MainLayout, but this is an extra guard.
    if (!user.isAuthenticated) {
        return null;
    }

    const isInvestor = user.userType === 'investor';
    const unreadNotificationsCount = notifications.filter(n => !n.read).length;

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
                    
                    {/* Notifications Area */}
                    <div className="relative">
                        <button
                            ref={notificationButtonRef}
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className="relative p-2 rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
                        >
                            <Bell size={20} />
                            {unreadNotificationsCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                    {unreadNotificationsCount}
                                </span>
                            )}
                        </button>

                        {/* Notifications Popup */}
                        {isNotificationsOpen && (
                            <div 
                                ref={notificationsRef} 
                                className="absolute right-0 mt-2 w-80 bg-white text-black rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50"
                                style={{ top: '100%' }}
                            >
                                <div className="p-4 font-bold border-b border-gray-200 bg-gray-50">Notifications</div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length > 0 ? notifications.map(notification => (
                                        <div key={notification.id} className={`p-4 border-b border-gray-100 text-sm hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}>
                                            <p>
                                                <span className="font-bold">{notification.investorName}</span> invested <span className="font-bold">${notification.amount}</span> in your business <span className="font-bold">{notification.businessName}</span>.
                                            </p>
                                        </div>
                                    )) : (
                                        <div className="p-4 text-center text-gray-500">No new notifications</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    
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
