import { useEffect, useState } from 'react';
import { DollarSign, User, Building2, Calendar, BarChart3 } from 'lucide-react';
import { useUser } from '../../context/UserContext';

interface Distribution {
  id: number;
  user_name: string;
  user_full_name: string;
  amount_distributed: number;
  formatted_amount: string;
  distribution_percentage: number;
  distributed_at: string;
  log: number;
  investment: number;
}

export default function ProfitDistributionsDashboard() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [asOwner, setAsOwner] = useState<Distribution[]>([]);
  const [asInvestor, setAsInvestor] = useState<Distribution[]>([]);
  const [tab, setTab] = useState<'owner' | 'investor'>('owner');

  useEffect(() => {
    const fetchDistributions = async () => {
      if (!user.isAuthenticated || !user.authToken) {
        setError('Please log in to view profit distributions.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:8000/api/logs/profit-distributions/dashboard/', {
          headers: { 
            'Authorization': `Bearer ${user.authToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!res.ok) {
          if (res.status === 401) {
            setError('Authentication failed. Please log in again.');
          } else {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return;
        }
        
        const data = await res.json();
        setAsOwner(data.as_owner || []);
        setAsInvestor(data.as_investor || []);
      } catch (e) {
        console.error('Error fetching distributions:', e);
        setError('Could not load profit distributions. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (user.isAuthenticated && user.authToken) {
      fetchDistributions();
    } else if (!user.loading) {
      setError('Please log in to view profit distributions.');
      setLoading(false);
    }
  }, [user.authToken, user.isAuthenticated, user.loading]);

  // Show loading state while user context is loading
  if (user.loading) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4">
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  // Show error if not authenticated
  if (!user.isAuthenticated) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4">
        <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">
          Please log in to view profit distributions.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex items-center gap-3 mb-8">
        <BarChart3 className="w-8 h-8 text-green-700" />
        <h1 className="text-3xl font-bold text-gray-900">Profit Distributions Dashboard</h1>
      </div>
      <div className="mb-6 flex gap-2">
        <button
          className={`px-4 py-2 rounded-lg font-semibold ${tab === 'owner' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          onClick={() => setTab('owner')}
        >
          As Owner
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold ${tab === 'investor' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          onClick={() => setTab('investor')}
        >
          As Investor
        </button>
      </div>
      {loading && <div className="text-center text-gray-500">Loading distributions...</div>}
      {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investor</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(tab === 'owner' ? asOwner : asInvestor).length === 0 ? (
                <tr><td colSpan={4} className="text-center text-gray-500 py-4">No distributions found.</td></tr>
              ) : (
                (tab === 'owner' ? asOwner : asInvestor).map((dist, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2 whitespace-nowrap flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      {dist.user_full_name || dist.user_name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap font-medium text-green-700">{dist.formatted_amount}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{dist.distribution_percentage.toFixed(2)}%</td>
                    <td className="px-4 py-2 whitespace-nowrap flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(dist.distributed_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 