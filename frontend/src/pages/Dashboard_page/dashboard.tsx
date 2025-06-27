"use client"

import { useState, useEffect } from "react"
import { useNavigate, Navigate } from "react-router-dom"
import EntrepreneurDashboard from './entrepreneurDash'

import {
  BarChart3,
  DollarSign,
  TrendingUp,
  User,
  Wallet,
  Building2,
  Target,
  ArrowUpRight,
  Settings,
  Home,
  Briefcase,
  LogOut
} from "lucide-react"
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Bar, BarChart, Tooltip } from "recharts"

import Footer from '../../components/footer';

// Define user state interface
interface UserState {
  isAuthenticated: boolean;
  authToken: string | null;
  userType: 'investor' | 'entrepreneur' | null;
  username: string | null;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
}

// Sample data (keep as is)
const investmentData = [
  { month: "Jan", value: 1200 },
  { month: "Feb", value: 1800 },
  { month: "Mar", value: 2400 },
  { month: "Apr", value: 3200 },
  { month: "May", value: 2800 },
  { month: "Jun", value: 3600 },
]

const ventureData = [
  { month: "Jan", revenue: 5000, expenses: 3000 },
  { month: "Feb", revenue: 7500, expenses: 4200 },
  { month: "Mar", revenue: 9200, expenses: 5100 },
  { month: "Apr", revenue: 11800, expenses: 6300 },
  { month: "May", revenue: 10500, expenses: 5800 },
  { month: "Jun", revenue: 14200, expenses: 7200 },
]

const portfolioData = [
  { name: "Tech Startups", value: 45, color: "#10b981" },
  { name: "Healthcare", value: 25, color: "#3b82f6" },
  { name: "Fintech", value: 20, color: "#8b5cf6" },
  { name: "E-commerce", value: 10, color: "#f59e0b" },
]

type ActiveSection = "overview" | "investments" | "analytics" | "profile"

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<ActiveSection>("overview");
  const [user, setUser] = useState<UserState>({
    isAuthenticated: false,
    authToken: null,
    userType: null,
    username: null,
    email: null,
    first_name: null,
    last_name: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Load user data from localStorage on component mount
  useEffect(() => {
    const storedAuthToken = localStorage.getItem('authToken');
    const storedUserType = localStorage.getItem('userType') as 'investor' | 'entrepreneur' | null;
    const storedUsername = localStorage.getItem('username');
    const storedEmail = localStorage.getItem('email');
    const storedFirstName = localStorage.getItem('first_name');
    const storedLastName = localStorage.getItem('last_name');

    console.log('Dashboard: Checking localStorage:', {
      storedAuthToken,
      storedUserType,
      storedUsername,
      storedEmail,
      storedFirstName,
      storedLastName
    });

    if (storedAuthToken && storedUsername) {
      console.log('Dashboard: Setting user as authenticated');
      setUser({
        isAuthenticated: true,
        authToken: storedAuthToken,
        userType: storedUserType || 'investor',
        username: storedUsername,
        email: storedEmail || '',
        first_name: storedFirstName || '',
        last_name: storedLastName || '',
      });
    } else {
      console.log('Dashboard: Missing required data, user not authenticated');
    }
    
    setIsLoading(false);
  }, []);

  const userType = user.userType || "investor";

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

    // Reset user state
    setUser({
      isAuthenticated: false,
      authToken: null,
      userType: null,
      username: null,
      email: null,
      first_name: null,
      last_name: null,
    });

    navigate('/login');
  };

  const handleLoginNav = () => {
    navigate('/login');
  };

  const handleSignUpNav = () => {
    navigate('/signup');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoading && !user.isAuthenticated) {
    console.log('Dashboard: Redirecting to login - user not authenticated');
    return <Navigate to="/login" replace />;
  }

  // If user is entrepreneur, render the entrepreneur dashboard
  if (userType === "entrepreneur") {
    return (
      <div className="flex-1 bg-gray-50">
        <EntrepreneurDashboard />
      </div>
    );
  }

  // Otherwise, render the investor dashboard (existing code)
  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "investments", label: "My Investments", icon: Briefcase },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "profile", label: "Profile Settings", icon: Settings },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">
          Welcome back, <span className="font-semibold">{user.first_name || user.username || 'User'}</span>! Here's what's happening with your {userType === "investor" ? "investments" : "ventures"}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userType === "investor" ? (
          <>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Invested</p>
                  <p className="text-2xl font-bold text-gray-900">$24,500</p>
                </div>
                <Wallet className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600">+12.5%</span>
                <span className="text-gray-500 ml-1">this month</span>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Returns</p>
                  <p className="text-2xl font-bold text-gray-900">$3,240</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600">+8.2%</span>
                <span className="text-gray-500 ml-1">ROI</span>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Active Investments</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-gray-500">Across 4 sectors</span>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Avg. Monthly Return</p>
                  <p className="text-2xl font-bold text-gray-900">$540</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600">+15.3%</span>
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Raised</p>
                  <p className="text-2xl font-bold text-gray-900">$180K</p>
                </div>
                <Building2 className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600">+25%</span>
                <span className="text-gray-500 ml-1">this quarter</span>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">$14.2K</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600">+18.5%</span>
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Active Ventures</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-gray-500">2 profitable</span>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Investors</p>
                  <p className="text-2xl font-bold text-gray-900">47</p>
                </div>
                <User className="h-8 w-8 text-purple-600" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600">+6</span>
                <span className="text-gray-500 ml-1">this month</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
          <p className="text-gray-600 text-sm mt-1">
            {userType === "investor"
              ? "Your investment performance over the last 6 months"
              : "Your business performance over the last 6 months"}
          </p>
        </div>
        <div className="p-6">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={
                  userType === "investor"
                    ? investmentData
                    : ventureData.map((d) => ({ month: d.month, value: d.revenue }))
                }
              >
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )

  const renderInvestments = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {userType === "investor" ? "My Investments" : "My Ventures"}
        </h2>
        <p className="text-gray-600">
          {userType === "investor"
            ? "Track and manage your investment portfolio"
            : "Monitor and manage your business ventures"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {userType === "investor" ? "Active Investments" : "Active Ventures"}
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              {userType === "investor" ? "Your current investment portfolio" : "Your current business ventures"}
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {userType === "investor" ? (
                <>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">TechFlow Solutions</p>
                        <p className="text-sm text-gray-600">Invested: $5,000</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">+$420</p>
                      <p className="text-sm text-gray-600">8.4% return</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">HealthTech Innovations</p>
                        <p className="text-sm text-gray-600">Invested: $3,500</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">+$280</p>
                      <p className="text-sm text-gray-600">8.0% return</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">EcoGreen Energy</p>
                        <p className="text-sm text-gray-600">Invested: $2,000</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-600">-$120</p>
                      <p className="text-sm text-gray-600">-6.0% return</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">TechFlow Solutions</span>
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full border border-green-200">
                        Active
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-emerald-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>$75K raised of $100K goal</span>
                      <span>75%</span>
                    </div>
                  </div>
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">AI Marketing Platform</span>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                        Funding
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-emerald-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>$22.5K raised of $50K goal</span>
                      <span>45%</span>
                    </div>
                  </div>
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">Green Energy Solutions</span>
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
                        Planning
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-emerald-600 h-2 rounded-full" style={{ width: "10%" }}></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>$3K raised of $30K goal</span>
                      <span>10%</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {userType === "investor" ? "Portfolio Distribution" : "Venture Performance"}
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              {userType === "investor" ? "Your investment allocation across sectors" : "Revenue and expense tracking"}
            </p>
          </div>
          <div className="p-6">
            {userType === "investor" ? (
              <div className="space-y-4">
                {portfolioData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-gray-900">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ventureData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#10b981" />
                    <Bar dataKey="expenses" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h2>
        <p className="text-gray-600">Detailed insights and performance metrics</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-gray-900" />
            <h3 className="text-lg font-semibold text-gray-900">
              {userType === "investor" ? "Investment Analytics" : "Business Analytics"}
            </h3>
          </div>
          <p className="text-gray-600 text-sm mt-1">
            {userType === "investor"
              ? "Track your investment performance over time"
              : "Monitor your business growth and trends"}
          </p>
        </div>
        <div className="p-6">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={
                  userType === "investor"
                    ? investmentData
                    : ventureData.map((d) => ({ month: d.month, value: d.revenue }))
                }
              >
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )

  const renderProfile = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h2>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          <p className="text-gray-600 text-sm mt-1">Update your personal details and preferences</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 text-xl font-semibold">
              {(user.first_name || user.username || '').charAt(0).toUpperCase()}
              {(user.last_name || '').charAt(0).toUpperCase()}
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">{user.first_name || user.username || 'User'} {user.last_name || ''}</h3>
              <p className="text-gray-600">{userType === "investor" ? "Active Investor" : "Entrepreneur"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{user.email || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Location</label>
                <p className="text-gray-900">New York, US</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">User Type</label>
                <p className="text-gray-900 capitalize">{userType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Member Since</label>
                <p className="text-gray-900">January 2024</p>
              </div>
              {userType === "investor" ? (
                <div>
                  <label className="text-sm font-medium text-gray-700">Risk Level</label>
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200 ml-2">
                    Moderate
                  </span>
                </div>
              ) : (
                <div>
                  <label className="text-sm font-medium text-gray-700">Success Rate</label>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full border border-green-200 ml-2">
                    85%
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
              Save Changes
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return renderOverview()
      case "investments":
        return renderInvestments()
      case "analytics":
        return renderAnalytics()
      case "profile":
        return renderProfile()
      default:
        return renderOverview()
    }
  }

  return (
    <div className="flex-1 bg-gray-50">
        <div className="flex">
            <aside className="w-96 p-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="font-bold text-lg mb-4">Navigation</h3>
                    <nav className="space-y-2">
                        {sidebarItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id as ActiveSection)}
                                className={`w-full flex items-center px-4 py-2 text-left text-sm font-medium rounded-md transition-colors ${
                                    activeSection === item.id
                                    ? "bg-gray-900 text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
                    <h3 className="font-bold text-lg mb-4">Personal Details</h3>
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-gray-700 text-white flex items-center justify-center text-xl font-bold mr-4">
                            {user.first_name?.[0] || 'A'}
                        </div>
                        <div>
                            <p className="font-semibold">{user.first_name} {user.last_name}</p>
                            <p className="text-sm text-gray-500">Entrepreneur</p>
                        </div>
                    </div>
                    <div className="space-y-2 text-sm">
                        <p><strong>Member Since:</strong> Jan 2024</p>
                        <p><strong>Location:</strong> New York, US</p>
                        <p><strong>Ventures:</strong> 3 Active</p>
                        <p><strong>Success Rate:</strong> <span className="text-green-600 font-semibold">85%</span></p>
                    </div>
                </div>
            </aside>
            <main className="flex-1 p-8">
                {renderContent()}
            </main>
        </div>
        <Footer />
    </div>
  )
}