import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  MessageSquare, 
  Briefcase, 
  TrendingUp, 
  Users, 
  Target, 
  BarChart, 
  DollarSign, 
  FileText, 
  Video, 
  Image as ImageIcon,
  Eye,
  Share2,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Calendar,
  MapPin,
  Building2,
  Award,
  ChartBar,
  LogIn,
  Bot,
  Trash2
} from "lucide-react";
import Footer from "../../components/footer";
import { useUser } from "../../context/UserContext";
import Notification from '../../components/Notification';
import AIChatPopup from '../../components/AIChatPopup';

interface BusinessData {
  id: number;
  title: string;
  entrepreneur_name?: string;
  entrepreneur_full_name?: string;
  entrepreneur_user_id?: number;
  tagline: string;
  description: string;
  category: string;
  location: string;
  funding_goal: number;
  current_funding: number;
  backers: number;
  min_investment: number;
  team_size: number;
  website: string;
  social_media: string;
  business_plan: string;
  financial_projections: string;
  market_analysis: string;
  competitive_advantage: string;
  use_of_funds: string;
  founding_year: number;
  industry_experience: string;
  key_achievements: string;
  target_market_size: string;
  revenue_model: string;
  growth_metrics: string;
  images: Array<{ image_url: string; order: number }>;
  videos: Array<{ title: string; thumbnail_url: string; video_file_url: string; duration: string }>;
  documents: Array<{ name: string; file_url: string; size: string }>;
  user: number | string;
  deadline: string;
  user_investment_amount: number;
  user_investment_percentage: number;
}

interface NotificationState {
  isVisible: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

type ActiveSection = "overview" | "financials" | "market" | "team" | "documents" | "videos";

export default function BusinessDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [activeSection, setActiveSection] = useState<ActiveSection>("overview");
  const [isInvesting, setIsInvesting] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    isVisible: false,
    type: 'info',
    title: '',
    message: ''
  });
  const [isSaved, setIsSaved] = useState(false);
  const [aiChatOpen, setAIChatOpen] = useState(false);

  const currentUserId = localStorage.getItem('userId');
  const isOwner = businessData && currentUserId && businessData.user.toString() === currentUserId;
  const isEntrepreneur = user.userType === 'entrepreneur';

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get authentication token
        const token = localStorage.getItem('authToken');
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        
        // Add authorization header if token exists
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`http://localhost:8000/api/businesses/${id}/`, {
          headers: headers
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched business detail data:', data);
        setBusinessData(data);
        setInvestmentAmount(data.min_investment.toString());
      } catch (e) {
        setError("Failed to fetch business details: " + (e instanceof Error ? e.message : 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBusinessDetails();
    }
  }, [id]);

  useEffect(() => {
    // Fetch saved state for this business
    const fetchSaved = async () => {
      const token = localStorage.getItem('authToken');
      if (!token || !id) return;
      try {
        const response = await fetch('http://localhost:8000/api/saved-businesses/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setIsSaved(data.some((item: any) => item.business.id === parseInt(id)));
        }
      } catch (e) { /* ignore */ }
    };
    fetchSaved();
  }, [id]);

  const calculateDaysLeft = (deadline: string) => {
    const deadLineDate = new Date(deadline);
    const now = new Date();
    const diffTime = deadLineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const calculateProgress = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const nextImage = () => {
    if (businessData && businessData.images && businessData.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % businessData.images.length);
    }
  };

  const prevImage = () => {
    if (businessData && businessData.images && businessData.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + businessData.images.length) % businessData.images.length);
    }
  };

  const showNotification = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    setNotification({
      isVisible: true,
      type,
      title,
      message
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  const handleDelete = async () => {
    if (!businessData) return;

    const confirmed = window.confirm(`Are you sure you want to delete "${businessData.title}"? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:8000/api/businesses/${businessData.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        showNotification('success', 'Business Deleted', `${businessData.title} has been successfully deleted.`);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        const errorData = await response.json();
        showNotification('error', 'Delete Failed', errorData.message || 'Failed to delete business. Please try again.');
      }
    } catch (error) {
      showNotification('error', 'Delete Failed', 'An error occurred while deleting the business. Please try again.');
    }
  };

  const handleMessageEntrepreneur = () => {
    if (!businessData?.entrepreneur_user_id) {
      showNotification('error', 'Error', 'Entrepreneur information not available.');
      return;
    }
    
    // Navigate to messaging page with the entrepreneur
    navigate(`/messages?user=${businessData.entrepreneur_user_id}`);
  };

  const handleInvest = async () => {
    if (!businessData) return;

    const amount = parseFloat(investmentAmount);
    if (isNaN(amount) || amount <= 0) {
      showNotification('error', 'Invalid Amount', 'Please enter a positive investment amount.');
      return;
    }

    const remainingGoal = businessData.funding_goal - businessData.current_funding;
    if (amount > remainingGoal) {
      showNotification('error', 'Amount Exceeds Goal', `Your investment of ${formatCurrency(amount)} exceeds the remaining funding goal of ${formatCurrency(remainingGoal)}. Please invest ${formatCurrency(remainingGoal)} or less.`);
      setInvestmentAmount(remainingGoal.toString());
      return;
    }

    showNotification('info', 'Processing Investment', `Submitting investment of ${formatCurrency(amount)} for ${businessData.title}...`);

    setIsInvesting(true);
    try {
      const response = await fetch('http://localhost:8000/api/invest/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          business_id: businessData.id,
          investment_amount: amount,
        }),
      });

        if (!response.ok) {
            const errorData = await response.json();
            
            if (errorData.code === 'token_not_valid' || errorData.detail?.includes('expired')) {
                showNotification('error', 'Session Expired', 'Your session has expired. Please log in again.');
                localStorage.removeItem('authToken');
                localStorage.removeItem('userId');
                navigate('/login');
                return;
            }
            
            console.error("Investment failed:", errorData);
            showNotification('error', 'Investment Failed', `Investment failed: ${errorData.message || errorData.detail || JSON.stringify(errorData)}`);
            return;
        }

        let updatedBusiness: any = {};
        if (response.status === 200 || response.status === 201) {
            try {
                updatedBusiness = await response.json();
            } catch (jsonError) {
                console.error("Error parsing successful response JSON:", jsonError);
                showNotification('warning', 'Partial Success', "Investment succeeded but there was an issue receiving confirmation data. Please refresh.");
                // Refresh business data to get updated investment info
                const refreshResponse = await fetch(`http://localhost:8000/api/businesses/${businessData.id}/`, {
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                  }
                });
                if (refreshResponse.ok) {
                    const refreshedData = await refreshResponse.json();
                    setBusinessData(refreshedData);
                }
                return;
            }
        } else if (response.status === 204) {
            console.log("Investment successful, no content returned.");
            // Refresh business data to get updated investment info
            const refreshResponse = await fetch(`http://localhost:8000/api/businesses/${businessData.id}/`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
              }
            });
            if (refreshResponse.ok) {
                const refreshedData = await refreshResponse.json();
                setBusinessData(refreshedData);
            }
            showNotification('success', 'Investment Successful', `Investment of ${formatCurrency(amount)} successful! Thank you for backing ${businessData.title}!`);
            return;
        } else {
            console.warn("Unexpected successful response status:", response.status);
            showNotification('warning', 'Unexpected Response', "Investment completed with an unexpected server response. Please refresh the page.");
            return;
        }

        console.log("Investment successful:", updatedBusiness);

        // Refresh business data to get updated investment info
        const refreshResponse = await fetch(`http://localhost:8000/api/businesses/${businessData.id}/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        if (refreshResponse.ok) {
            const refreshedData = await refreshResponse.json();
            setBusinessData(refreshedData);
        } else {
            // Fallback to updating with response data
            setBusinessData(prevData => prevData ? {
                ...prevData,
                current_funding: updatedBusiness.current_funding,
                backers: updatedBusiness.backers,
            } : null);
        }

        showNotification('success', 'Investment Successful', `Investment of ${formatCurrency(amount)} successful! Thank you for backing ${businessData.title}!`);

    } catch (error) {
        console.error("Network or unexpected error during investment:", error);
        showNotification('error', 'Network Error', "An error occurred while processing your investment. Please try again.");
    } finally {
        setIsInvesting(false);
        setInvestmentAmount('');
    }
  };

  const handleToggleSave = async () => {
    const token = localStorage.getItem('authToken');
    if (!token || !id) {
      showNotification('error', 'Login Required', 'Please log in to save businesses.');
      return;
    }
    try {
      const method = isSaved ? 'DELETE' : 'POST';
      const response = await fetch(`http://localhost:8000/api/businesses/${id}/toggle-save/`, {
        method,
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok || response.status === 201) {
        setIsSaved(!isSaved);
      } else {
        showNotification('error', 'Error', 'Could not update saved status.');
      }
    } catch (e) {
      showNotification('error', 'Error', 'Could not update saved status.');
    }
  };

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "financials", label: "Financials", icon: DollarSign },
    { id: "market", label: "Market Analysis", icon: Target },
    { id: "team", label: "Team & Achievements", icon: Users },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "videos", label: "Videos", icon: Video },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">About the Business</h3>
        <p className="text-gray-600 leading-relaxed">{businessData?.description || "No description available."}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Facts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {businessData?.founding_year && (
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Founded</p>
                <p className="font-medium text-gray-900">{businessData.founding_year}</p>
              </div>
            </div>
          )}
          {businessData?.location && (
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-900">{businessData.location}</p>
              </div>
            </div>
          )}
          {businessData?.category && (
            <div className="flex items-center space-x-3">
              <Building2 className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium text-gray-900">{businessData.category}</p>
              </div>
            </div>
          )}
          {businessData?.team_size && (
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Team Size</p>
                <p className="font-medium text-gray-900">{businessData.team_size} members</p>
              </div>
            </div>
          )}
          {businessData?.website && (
            <div className="flex items-center space-x-3">
              <ExternalLink className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Website</p>
                <a href={businessData.website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
                  Visit Website
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderFinancials = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Financial Projections</h3>
        <p className="text-gray-600 leading-relaxed">{businessData?.financial_projections || "Financial projections not available."}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Use of Funds</h3>
        <p className="text-gray-600 leading-relaxed">{businessData?.use_of_funds || "Use of funds information not available."}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Revenue Model</h3>
        <p className="text-gray-600 leading-relaxed">{businessData?.revenue_model || "Revenue model information not available."}</p>
      </div>
    </div>
  );

  const renderMarket = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Market Analysis</h3>
        <p className="text-gray-600 leading-relaxed">{businessData?.market_analysis || "Market analysis not available."}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Target Market Size</h3>
        <p className="text-gray-600 leading-relaxed">{businessData?.target_market_size || "Target market size information not available."}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Competitive Advantage</h3>
        <p className="text-gray-600 leading-relaxed">{businessData?.competitive_advantage || "Competitive advantage information not available."}</p>
      </div>
    </div>
  );

  const renderTeam = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Industry Experience</h3>
        <p className="text-gray-600 leading-relaxed">{businessData?.industry_experience || "Industry experience information not available."}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Achievements</h3>
        <p className="text-gray-600 leading-relaxed">{businessData?.key_achievements || "Key achievements not available."}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Growth Metrics</h3>
        <p className="text-gray-600 leading-relaxed">{businessData?.growth_metrics || "Growth metrics not available."}</p>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Documents</h3>
        {businessData?.documents && businessData.documents.length > 0 ? (
          <div className="space-y-3">
            {businessData.documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    <p className="text-sm text-gray-500">{doc.size}</p>
                  </div>
                </div>
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No documents available.</p>
        )}
      </div>
    </div>
  );

  const renderVideos = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Videos</h3>
        {businessData?.videos && businessData.videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {businessData.videos.map((video, index) => (
              <div key={index} className="space-y-3">
                <h4 className="font-medium text-gray-900">{video.title}</h4>
                {video.video_file_url && (
                  <video
                    controls
                    className="w-full rounded-lg"
                    poster={video.thumbnail_url}
                  >
                    <source src={video.video_file_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                <p className="text-sm text-gray-500">Duration: {video.duration}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No videos available.</p>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return renderOverview();
      case "financials":
        return renderFinancials();
      case "market":
        return renderMarket();
      case "team":
        return renderTeam();
      case "documents":
        return renderDocuments();
      case "videos":
        return renderVideos();
      default:
        return renderOverview();
    }
  };

  if (loading) return <div className="flex-1 bg-gray-50 flex items-center justify-center p-8"><p>Loading...</p></div>;
  if (error) return <div className="flex-1 bg-gray-50 flex items-center justify-center p-8"><p className="text-red-500">{error}</p></div>;
  if (!businessData) return <div className="flex-1 bg-gray-50 flex items-center justify-center p-8"><p>No business data found.</p></div>;

  const { title, tagline, funding_goal, current_funding, backers, min_investment, entrepreneur_full_name, images, deadline } = businessData;
  const progress = calculateProgress(current_funding, funding_goal);
  const daysLeft = deadline ? calculateDaysLeft(deadline) : 'N/A';

  return (
    <div className="flex-1 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft size={16} /> Back to opportunities
          </button>
          <button
            className="ml-auto"
            title={isSaved ? 'Unsave Business' : 'Save Business'}
            onClick={handleToggleSave}
          >
            {isSaved ? (
              <BookmarkCheck className="w-7 h-7 text-emerald-600 fill-emerald-600" />
            ) : (
              <Bookmark className="w-7 h-7 text-gray-700 hover:text-emerald-600" />
            )}
          </button>
        </div>
        <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
        <p className="text-lg text-gray-500 mt-2">{tagline}</p>
        
        {/* Active indicator for fully funded businesses */}
        {current_funding === funding_goal && (
          <div className="mt-4 flex items-center gap-2">
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Active Business
            </div>
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-80 flex-shrink-0">
            <div className="space-y-6">
              {/* Investment Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span className="font-bold text-lg text-blue-600">{formatCurrency(current_funding)}</span>
                    <span className="text-gray-500">raised of {formatCurrency(funding_goal)}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center mb-6">
                  <div>
                    <p className="font-bold text-2xl text-gray-900">{backers}</p>
                    <p className="text-sm text-gray-500">Investors</p>
                  </div>
                  <div>
                    <p className="font-bold text-2xl text-orange-600">{formatCurrency(funding_goal - current_funding)}</p>
                    <p className="text-sm text-gray-500">Remaining</p>
                  </div>
                </div>

                {/* User Investment Information */}
                {businessData.user_investment_amount > 0 && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Your Investment</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Amount Invested:</span>
                        <span className="font-semibold text-blue-900">{formatCurrency(businessData.user_investment_amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Your Share:</span>
                        <span className="font-semibold text-blue-900">{businessData.user_investment_percentage}%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Investment Actions for Investors */}
                {!isOwner && !isEntrepreneur && user.isAuthenticated && businessData.user_investment_amount > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-lg mb-4">Investment Actions</h3>
                    <div className="space-y-3">
                      <button 
                        onClick={() => navigate(`/businesses/${businessData.id}/logs`)}
                        disabled={businessData.current_funding !== businessData.funding_goal}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          businessData.current_funding === businessData.funding_goal
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <FileText className="h-4 w-4" />
                        View Logs
                      </button>
                      <button 
                        onClick={() => navigate(`/business/${businessData.id}/fund-statistics`)}
                        disabled={businessData.current_funding !== businessData.funding_goal}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          businessData.current_funding === businessData.funding_goal
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <BarChart className="h-4 w-4" />
                        Statistics
                      </button>
                    </div>
                    {businessData.current_funding !== businessData.funding_goal && (
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Logs and statistics will be available once the business is fully funded
                      </p>
                    )}
                  </div>
                )}

                {isOwner ? (
                  <div className="space-y-4">
                    <div className="text-center bg-gray-100 text-gray-700 py-3 px-4 rounded-lg text-sm">You are the owner of this business.</div>
                    <button 
                      onClick={() => navigate(`/business/${businessData.id}/fund-statistics`)}
                      className="w-full bg-gray-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-900 transition-colors"
                    >
                      View Investors
                    </button>
                  </div>
                ) : isEntrepreneur ? (
                  <div className="space-y-4">
                    <div className="text-center bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-blue-800 mb-3">Connect with the business owner</p>
                      <button 
                        onClick={() => navigate(`/messages?user=${businessData.user}`)}
                        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Message Owner
                      </button>
                    </div>
                  </div>
                ) : !user.isAuthenticated ? (
                  <div className="space-y-4">
                    <div className="text-center bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <LogIn className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-blue-800 mb-3">Sign in to invest in this business</p>
                      <button 
                        onClick={() => navigate('/login')}
                        className="w-full bg-gray-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-900 transition-colors"
                      >
                        Sign In to Invest
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="investment-amount" className="sr-only">Investment Amount</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          name="investment-amount"
                          id="investment-amount"
                          className="w-full pl-7 pr-12 py-3 px-4 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
                          value={investmentAmount}
                          onChange={(e) => setInvestmentAmount(e.target.value)}
                          min={min_investment}
                          placeholder={formatCurrency(min_investment)}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm" id="price-currency">USD</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={handleInvest}
                      disabled={parseFloat(investmentAmount) < min_investment || current_funding === funding_goal}
                      className={`w-full font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        current_funding === funding_goal
                          ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                          : businessData.user_investment_amount > 0 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'bg-gray-800 text-white hover:bg-gray-900'
                      }`}
                    >
                      {current_funding === funding_goal 
                        ? 'Fully Funded' 
                        : businessData.user_investment_amount > 0 
                          ? 'Invest More' 
                          : 'Invest Now'
                      }
                    </button>
                  </div>
                )}
                <p className="text-center text-sm text-gray-500 mt-2">Minimum investment: {formatCurrency(min_investment)}</p>
              </div>

              {/* Entrepreneur Information */}
              {businessData.entrepreneur_full_name && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-lg mb-4">Entrepreneur</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-semibold text-sm">
                          {businessData.entrepreneur_full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{businessData.entrepreneur_full_name}</p>
                        <p className="text-sm text-gray-500">Business Owner</p>
                      </div>
                    </div>
                    {businessData.entrepreneur_user_id && !isOwner && (
                      <button 
                        onClick={handleMessageEntrepreneur}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Message Entrepreneur
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-lg mb-4">Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => navigate('/consultants')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    <Users className="h-4 w-4" />
                    Consult Expert
                  </button>
                  <button 
                    onClick={() => setAIChatOpen(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    <Bot className="h-4 w-4" />
                    Talk with AI
                  </button>
                  {businessData.website && (
                    <a 
                      href={businessData.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Visit Website
                    </a>
                  )}
                  {isOwner && (
                    <button 
                      onClick={handleDelete}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Business
                    </button>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="space-y-8">
              {/* Image Gallery */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {images.length > 0 ? (
                  <div className="relative h-96">
                    <img src={images[currentImageIndex].image_url} alt={`${title} gallery image ${currentImageIndex + 1}`} className="w-full h-full object-cover" />
                    {images.length > 1 && (
                      <>
                        <button onClick={prevImage} className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"><ChevronLeft /></button>
                        <button onClick={nextImage} className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"><ChevronRight /></button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="h-96 bg-gray-100 flex items-center justify-center text-gray-400"><ImageIcon size={48} /></div>
                )}
              </div>

              {/* Navigation Tabs */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-6 px-6" aria-label="Tabs">
                    {sidebarItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id as ActiveSection)}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                          activeSection === item.id
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <item.icon className="w-4 h-4 inline mr-2" />
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </div>
                <div className="p-6">
                  {renderContent()}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="h-24" />
      <Footer />
      <Notification
        isVisible={notification.isVisible}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={hideNotification}
      />
      
      {/* AI Chat Popup */}
      <AIChatPopup
        isOpen={aiChatOpen}
        onClose={() => setAIChatOpen(false)}
        businessData={businessData || undefined}
      />
    </div>
  );
} 