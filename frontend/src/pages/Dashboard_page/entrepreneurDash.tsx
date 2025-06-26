"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  TrendingUp,
  DollarSign,
  Users,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Edit,
  Share,
  MessageSquare,
  Target,
  Building,
  Eye,
  Download,
  FileText,
  Calendar,
} from "lucide-react"

interface Business {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  funding_goal: number;
  current_funding: number;
  backers: number;
  image?: string;
  created_at: string;
  entrepreneur_name: string;
}

interface Investment {
  id: number;
  user_name: string;
  user_full_name: string;
  amount: number;
  invested_at: string;
  business_title: string;
}

interface Log {
  id: number;
  title: string;
  content: string;
  created_at: string;
  business_title: string;
}

interface DashboardStats {
  total_businesses: number;
  total_funding_raised: number;
  total_investors: number;
  total_profit_generated: number;
  recent_investments: Investment[];
  recent_logs: Log[];
}

export default function EntrepreneurDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [businesses, setBusinesses] = useState<Business[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      setError(null)
      try {
        const token = localStorage.getItem('authToken')
        if (!token) {
          throw new Error('No authentication token found')
        }

        // Fetch user's businesses
        const businessesRes = await fetch('http://localhost:8000/api/my-businesses/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!businessesRes.ok) {
          throw new Error('Failed to fetch businesses')
        }

        const businessesData = await businessesRes.json()
        setBusinesses(businessesData)

        // Calculate dashboard stats from businesses data
        const totalFunding = businessesData.reduce((sum: number, business: Business) => sum + business.current_funding, 0)
        const totalInvestors = businessesData.reduce((sum: number, business: Business) => sum + (business.backers || 0), 0)
        
        // Fetch recent investments (last 5)
        const investmentsRes = await fetch('http://localhost:8000/api/investments/recent/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        let recentInvestments: Investment[] = []
        if (investmentsRes.ok) {
          const investmentsData = await investmentsRes.json()
          recentInvestments = investmentsData.slice(0, 5)
        }

        // Fetch recent logs (last 5)
        const logsRes = await fetch('http://localhost:8000/api/logs/recent/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        let recentLogs: Log[] = []
        if (logsRes.ok) {
          const logsData = await logsRes.json()
          recentLogs = logsData.slice(0, 5)
        }

        // Calculate total profit generated from logs
        const logsForProfitRes = await fetch('http://localhost:8000/api/logs/my-businesses/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        let totalProfit = 0
        if (logsForProfitRes.ok) {
          const logsData = await logsForProfitRes.json()
          totalProfit = logsData.reduce((sum: number, log: any) => sum + (log.profit_generated || 0), 0)
        }

        setStats({
          total_businesses: businessesData.length,
          total_funding_raised: totalFunding,
          total_investors: totalInvestors,
          total_profit_generated: totalProfit,
          recent_investments: recentInvestments,
          recent_logs: recentLogs
        })

      } catch (e) {
        console.error('Error fetching dashboard data:', e)
        setError(e instanceof Error ? e.message : 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const StatCard = ({ title, value, change, icon: Icon, isPositive = true }: any) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 ${isPositive ? "text-green-600" : "text-red-600"}`}>
              {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span className="text-sm font-medium ml-1">{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${isPositive ? "bg-green-100" : "bg-gray-100"}`}>
          <Icon className={`w-6 h-6 ${isPositive ? "text-green-600" : "text-gray-600"}`} />
        </div>
      </div>
    </div>
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { 
      style: "currency", 
      currency: "USD", 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 mt-2">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="font-semibold">Error loading dashboard</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Entrepreneur Dashboard</h1>
                <p className="text-gray-600">Manage your businesses and track your progress.</p>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => navigate('/pitch')}
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Business
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "overview", name: "Overview", icon: BarChart3 },
                { id: "businesses", name: "My Businesses", icon: Building },
                { id: "investors", name: "Investors", icon: Users },
                { id: "analytics", name: "Analytics", icon: TrendingUp },
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-black text-black"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.name}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Businesses"
                  value={stats?.total_businesses || 0}
                  icon={Building}
                />
                <StatCard
                  title="Total Funding Raised"
                  value={formatCurrency(stats?.total_funding_raised || 0)}
                  icon={DollarSign}
                />
                <StatCard 
                  title="Total Investors" 
                  value={stats?.total_investors || 0} 
                  icon={Users} 
                />
                <StatCard
                  title="Total Profit Generated"
                  value={formatCurrency(stats?.total_profit_generated || 0)}
                  icon={TrendingUp}
                />
              </div>

              {/* Recent Businesses */}
              {businesses.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Businesses</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {businesses.slice(0, 3).map((business) => (
                      <div key={business.id} className="p-6 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center">
                            <Building className="w-6 h-6 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{business.title}</p>
                            <p className="text-sm text-gray-500">{business.category} • {business.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(business.current_funding)}</p>
                          <p className="text-sm text-gray-500">{business.backers || 0} investors</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-6 border-t border-gray-200">
                    <button 
                      onClick={() => navigate('/my-businesses')}
                      className="w-full text-center text-sm text-gray-600 hover:text-gray-900"
                    >
                      View All Businesses
                    </button>
                  </div>
                </div>
              )}

              {/* Recent Investors */}
              {stats?.recent_investments && stats.recent_investments.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Investors</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {stats.recent_investments.map((investment) => (
                      <div key={investment.id} className="p-6 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{investment.user_full_name || investment.user_name}</p>
                            <p className="text-sm text-gray-500">{formatDate(investment.invested_at)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(investment.amount)}</p>
                          <p className="text-sm text-gray-500">{investment.business_title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Logs */}
              {stats?.recent_logs && stats.recent_logs.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Updates</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {stats.recent_logs.map((log) => (
                      <div key={log.id} className="p-6">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-full bg-blue-100">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{log.title}</h4>
                            <p className="text-gray-600 mt-1 line-clamp-2">{log.content}</p>
                            <p className="text-sm text-gray-500 mt-2">{formatDate(log.created_at)} • {log.business_title}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {businesses.length === 0 && (
                <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <Building className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No businesses yet</h3>
                  <p className="text-gray-500 mb-6">Start your entrepreneurial journey by creating your first business.</p>
                  <button
                    onClick={() => navigate('/pitch')}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={20} />
                    Create First Business
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Businesses Tab */}
          {activeTab === "businesses" && (
            <div className="space-y-6">
              {businesses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {businesses.map((business) => (
                    <div key={business.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      <div className="h-48 bg-gray-100">
                        <img 
                          src={business.image || '/placeholder.svg'} 
                          alt={business.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{business.title}</h3>
                        <p className="text-sm text-gray-500 mb-4">{business.category} • {business.location}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Raised</span>
                            <span className="font-semibold">{formatCurrency(business.current_funding)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${Math.min((business.current_funding / business.funding_goal) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{Math.round((business.current_funding / business.funding_goal) * 100)}%</span>
                            <span>Goal: {formatCurrency(business.funding_goal)}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-bold text-lg text-gray-900">{business.backers || 0}</p>
                            <p className="text-xs text-gray-500">Investors</p>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => navigate(`/businesses/${business.id}/logs`)}
                              className="p-2 rounded-full text-gray-500 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                              title="View Logs"
                            >
                              <FileText size={16} />
                            </button>
                            <button 
                              onClick={() => navigate(`/edit-business/${business.id}`)}
                              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                              title="Edit Business"
                            >
                              <Edit size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <Building className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No businesses yet</h3>
                  <p className="text-gray-500 mb-6">Create your first business to get started.</p>
                  <button
                    onClick={() => navigate('/pitch')}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={20} />
                    Create Business
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Investors Tab */}
          {activeTab === "investors" && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Investor Management</h3>
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  <Download className="w-4 h-4 mr-2" />
                  Export List
                </button>
              </div>
              <p className="text-gray-600">View and manage all investors across your businesses.</p>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Analytics</h3>
              <p className="text-gray-600">Detailed analytics about your business performance and investor behavior.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
