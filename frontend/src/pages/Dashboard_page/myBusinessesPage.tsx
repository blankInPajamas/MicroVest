import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, BarChart3, FileText } from 'lucide-react';
import { useUser } from '../../context/UserContext';

interface Business {
  id: number;
  title: string;
  category: string;
  location: string;
  funding_goal: number;
  current_funding: number;
  backers: number;
  image?: string;
}

export default function MyBusinessesPage() {
  const { user } = useUser();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Helper function to construct proper image URL
  const getBusinessImageUrl = (image?: string) => {
    if (!image) return '/placeholder.svg';
    // If already a full URL, return as is
    if (image.startsWith('http')) return image;
    // If it's a relative path, prepend the backend media URL
    if (image.startsWith('/media/')) {
      return `http://localhost:8000${image}`;
    }
    // If it's just a filename or path without /media/, prepend the full media URL
    return `http://localhost:8000/media/${image.replace(/^media\//, '')}`;
  };

  useEffect(() => {
    const fetchBusinesses = async () => {
      if (!user.isAuthenticated || !user.authToken) {
        setError('Please log in to view your businesses.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:8000/api/my-businesses/', {
          headers: {
            'Authorization': `Bearer ${user.authToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            setError('Authentication failed. Please log in again.');
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return;
        }
        
        const data = await response.json();
        setBusinesses(data);
      } catch (e) {
        console.error('Error fetching businesses:', e);
        setError('Could not load your businesses. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBusinesses();
  }, [user.isAuthenticated, user.authToken]);

  const handleEdit = (id: number) => navigate(`/edit-business/${id}`);
  
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this business?')) return;
    
    if (!user.authToken) {
      alert('Please log in to delete businesses.');
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8000/api/businesses/${id}/delete/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.authToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete business');
      }
      
      setBusinesses(businesses.filter(b => b.id !== id));
    } catch (e) {
      console.error('Error deleting business:', e);
      alert('Failed to delete business. Please try again.');
    }
  };
  
  const handlePitchNew = () => navigate('/pitch');

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  const calculateProgress = (current: number, goal: number) => Math.min((current / goal) * 100, 100);

  // Show loading state while user context is loading
  if (user.loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  // Show error if not authenticated
  if (!user.isAuthenticated) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">
          Please log in to view your businesses.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Businesses</h1>
        <button
          onClick={handlePitchNew}
          className="inline-flex items-center gap-2 bg-gray-900 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <PlusCircle size={18} />
          Pitch New Idea
        </button>
      </div>

      {loading && <div className="text-center text-gray-500">Loading your businesses...</div>}
      {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {businesses.map(business => {
          const progress = calculateProgress(business.current_funding, business.funding_goal);
          return (
            <div key={business.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col group">
              <div className="h-56 bg-gray-100">
                <img 
                  src={getBusinessImageUrl(business.image)} 
                  alt={business.title} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
              </div>
              <div className="p-5 flex-grow flex flex-col">
                <h2 className="text-xl font-bold text-gray-900 mb-1 truncate">{business.title}</h2>
                <p className="text-sm text-gray-500 mb-4">{business.category} • {business.location}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-gray-600">Raised</span>
                    <span className="text-gray-900">{formatCurrency(business.current_funding)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{progress.toFixed(0)}%</span>
                    <span>Goal: {formatCurrency(business.funding_goal)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                  <div>
                    <p className="font-bold text-lg text-gray-900">{business.backers || 0}</p>
                    <p className="text-xs text-gray-500">Investors</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => navigate(`/businesses/${business.id}/logs`)} 
                      className="p-2 rounded-full text-gray-500 hover:bg-blue-100 hover:text-blue-600 transition-colors" 
                      title="View Logs"
                    >
                      <FileText size={18} />
                    </button>
                    <button 
                      onClick={() => navigate(`/business/${business.id}/fund-statistics`)} 
                      className="p-2 rounded-full text-gray-500 hover:bg-green-100 hover:text-green-600 transition-colors" 
                      title="Fund Statistics"
                    >
                      <BarChart3 size={18} />
                    </button>
                    <button onClick={() => handleEdit(business.id)} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(business.id)} className="p-2 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors">
                      <Trash2 size={18} />
                    </button>
                    <button onClick={() => navigate(`/businesses/${business.id}/logs/create`)} className="p-2 rounded-full text-gray-500 hover:bg-blue-100 hover:text-blue-600 transition-colors" title="Create Log">
                      📝
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        {businesses.length === 0 && !loading && (
          <div className="md:col-span-2 xl:col-span-3 text-center py-12 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700">You haven't pitched any businesses yet.</h3>
            <p className="text-gray-500 mt-1">Click the button above to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}