import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target, 
  BarChart3, 
  Calendar,
  Eye,
  Building,
  Coins,
  Percent,
  Activity
} from 'lucide-react';
import { 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useUser } from '../../context/UserContext';
import Footer from '../../components/footer';

interface InvestmentStatistics {
  summary: {
    total_invested: number;
    total_returns: number;
    current_fund: number;
    portfolio_value: number;
    active_investments: number;
    completed_investments: number;
    total_investments: number;
    overall_roi_percentage: number;
  };
  profit_history: Array<{
    id: number;
    business_title: string;
    business_id: number;
    amount_received: number;
    distribution_percentage: number;
    distributed_at: string;
    log_month: string;
    log_year: number;
  }>;
  investment_breakdown: Array<{
    business_id: number;
    business_title: string;
    business_category: string;
    amount_invested: number;
    share_percentage: number;
    total_returns: number;
    roi_percentage: number;
    invested_at: string;
    is_active: boolean;
  }>;
  chart_data: Array<{
    month: string;
    profit: number;
  }>;
  monthwise_data: Array<{
    month: string;
    revenue: number;
    expense: number;
    profit: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function InvestmentStatisticsPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [stats, setStats] = useState<InvestmentStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  useEffect(() => {
    const fetchStatistics = async () => {
      if (!user.isAuthenticated || !user.authToken) {
        setError('Please log in to view your investment statistics.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:8000/api/investments-tracking/investor-statistics/', {
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
        setStats(data);
      } catch (e) {
        setError("Failed to fetch investment statistics: " + (e instanceof Error ? e.message : 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [user.isAuthenticated, user.authToken]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage.toFixed(1)}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{`Month: ${label}`}</p>
          {payload.map((entry: any, idx: number) => (
            <p key={idx} className={`text-sm ${entry.dataKey === 'profit' ? 'text-green-600' : entry.dataKey === 'revenue' ? 'text-blue-600' : 'text-red-600'}`}>{`${entry.name}: ${formatCurrency(entry.value)}`}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Show loading state while user context is loading
  if (user.loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="text-center text-gray-500 py-20">Loading...</div>
      </div>
    );
  }

  // Show error if not authenticated
  if (!user.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg max-w-md mx-auto mt-20">
          Please log in to view your investment statistics.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Investment Statistics</h1>
            </div>
            <button
              onClick={() => navigate('/my-investments')}
              className="inline-flex items-center gap-2 bg-gray-900 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Eye size={18} />
              View Investments
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="text-center text-gray-500 py-20">
            Loading your investment statistics...
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg max-w-md mx-auto">
            {error}
          </div>
        )}

        {stats && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Invested */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Coins className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-500">Total Invested</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {formatCurrency(stats.summary.total_invested)}
                </div>
                <div className="text-sm text-gray-600">Across all businesses</div>
              </div>

              {/* Total Returns */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-500">Total Returns</span>
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatCurrency(stats.summary.total_returns)}
                </div>
                <div className="text-sm text-gray-600">Profit distributions</div>
              </div>

              {/* Portfolio Value */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-500">Portfolio Value</span>
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {formatCurrency(stats.summary.portfolio_value)}
                </div>
                <div className="text-sm text-gray-600">Total value</div>
              </div>

              {/* Overall ROI */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <Percent className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-sm text-gray-500">Overall ROI</span>
                </div>
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {formatPercentage(stats.summary.overall_roi_percentage)}
                </div>
                <div className="text-sm text-gray-600">Return on investment</div>
              </div>
            </div>

            {/* Investment Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Active Investments */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-yellow-100 rounded-xl">
                    <Activity className="w-6 h-6 text-yellow-600" />
                  </div>
                  <span className="text-sm text-gray-500">Active</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stats.summary.active_investments}
                </div>
                <div className="text-sm text-gray-600">Still funding</div>
              </div>

              {/* Completed Investments */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-500">Completed</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stats.summary.completed_investments}
                </div>
                <div className="text-sm text-gray-600">Fully funded</div>
              </div>

              {/* Current Fund */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-500">Available Fund</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {formatCurrency(stats.summary.current_fund)}
                </div>
                <div className="text-sm text-gray-600">Ready to invest</div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-6">
              {/* Chart Type Toggle */}
              <div className="flex items-center justify-end mb-2">
                <button
                  className={`px-3 py-1 rounded-l border ${chartType === 'bar' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-600'} font-semibold`}
                  onClick={() => setChartType('bar')}
                >
                  Bar Chart
                </button>
                <button
                  className={`px-3 py-1 rounded-r border-l-0 border ${chartType === 'line' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-600'} font-semibold`}
                  onClick={() => setChartType('line')}
                >
                  Line Chart
                </button>
              </div>
              {/* Monthwise Chart */}
              {stats.monthwise_data.length > 0 && chartType === 'bar' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthwise Revenue, Expense & Profit (Bar)</h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <ReBarChart data={stats.monthwise_data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                      <YAxis tickFormatter={(value) => `$${value}`} tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="revenue" fill="#2563eb" name="Revenue" />
                      <Bar dataKey="expense" fill="#ef4444" name="Expense" />
                      <Bar dataKey="profit" fill="#10B981" name="Profit" />
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
              )}
              {stats.monthwise_data.length > 0 && chartType === 'line' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthwise Revenue, Expense & Profit (Line)</h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={stats.monthwise_data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                      <YAxis tickFormatter={(value) => `$${value}`} tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#2563eb" name="Revenue" strokeWidth={2} />
                      <Line type="monotone" dataKey="expense" stroke="#ef4444" name="Expense" strokeWidth={2} />
                      <Line type="monotone" dataKey="profit" stroke="#10B981" name="Profit" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Investment Distribution Pie Chart */}
            {stats.investment_breakdown.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Investment Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.investment_breakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ business_title, amount_invested }) => 
                        `${business_title}: ${formatCurrency(amount_invested)}`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount_invested"
                    >
                      {stats.investment_breakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => [formatCurrency(value), 'Amount Invested']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Investment Breakdown Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Investment Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Business
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invested
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Returns
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ROI
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Share
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.investment_breakdown.map((investment, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <Building className="h-5 w-5 text-gray-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                                   onClick={() => navigate(`/business/${investment.business_id}`)}>
                                {investment.business_title}
                              </div>
                              <div className="text-sm text-gray-500">{investment.business_category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(investment.amount_invested)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          {formatCurrency(investment.total_returns)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span className={investment.roi_percentage >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {formatPercentage(investment.roi_percentage)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatPercentage(investment.share_percentage)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            investment.is_active 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {investment.is_active ? 'Active' : 'Completed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Profit Distributions */}
            {stats.profit_history.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Profit Distributions</h3>
                <div className="space-y-4">
                  {stats.profit_history.map((profit, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                               onClick={() => navigate(`/business/${profit.business_id}`)}>
                            {profit.business_title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {profit.log_month} {profit.log_year} • {formatPercentage(profit.distribution_percentage)} share
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-green-600">
                          {formatCurrency(profit.amount_received)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(profit.distributed_at)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="h-24" />
      <Footer />
    </div>
  );
} 