"use client"
import { useState } from "react"
import Navbar from "../../components/navbar"
import Footer from "../../components/footer"
import {
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Plus,
  Filter,
  Search,
  Building,
  Calendar,
  Target,
} from "lucide-react"

// Mock data
const portfolioData = {
  totalInvested: 125000,
  currentValue: 142500,
  totalReturn: 17500,
  returnPercentage: 14.0,
  activeInvestments: 12,
  completedInvestments: 8,
}

const recentInvestments = [
  {
    id: 1,
    company: "TechStart Solutions",
    amount: 5000,
    date: "2024-01-15",
    status: "Active",
    return: 12.5,
    category: "Technology",
  },
  {
    id: 2,
    company: "GreenEnergy Co",
    amount: 8000,
    date: "2024-01-10",
    status: "Active",
    return: 8.3,
    category: "Clean Energy",
  },
  {
    id: 3,
    company: "HealthTech Innovations",
    amount: 3500,
    date: "2024-01-05",
    status: "Completed",
    return: 22.1,
    category: "Healthcare",
  },
]

const opportunities = [
  {
    id: 1,
    company: "AI Robotics Inc",
    description: "Revolutionary AI-powered robotics for manufacturing",
    fundingGoal: 500000,
    currentFunding: 325000,
    minInvestment: 1000,
    expectedReturn: "15-25%",
    timeframe: "24 months",
    category: "AI/Robotics",
    riskLevel: "Medium",
  },
  {
    id: 2,
    company: "Sustainable Foods",
    description: "Plant-based protein alternatives for global market",
    fundingGoal: 250000,
    currentFunding: 180000,
    minInvestment: 500,
    expectedReturn: "12-18%",
    timeframe: "18 months",
    category: "Food Tech",
    riskLevel: "Low",
  },
]

export default function InvestorDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar userType="investor" userName="John Doe" userEmail="john@example.com" />

      <main className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Investment Dashboard</h1>
                <p className="text-gray-600">Welcome back, John! Here's your portfolio overview.</p>
              </div>
              <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                New Investment
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "overview", name: "Overview", icon: BarChart3 },
                { id: "investments", name: "My Investments", icon: TrendingUp },
                { id: "opportunities", name: "Opportunities", icon: Target },
                { id: "analytics", name: "Analytics", icon: PieChart },
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
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Invested"
                  value={`$${portfolioData.totalInvested.toLocaleString()}`}
                  icon={DollarSign}
                  isPositive={false}
                />
                <StatCard
                  title="Current Value"
                  value={`$${portfolioData.currentValue.toLocaleString()}`}
                  change={`+${portfolioData.returnPercentage}%`}
                  icon={TrendingUp}
                />
                <StatCard
                  title="Total Return"
                  value={`$${portfolioData.totalReturn.toLocaleString()}`}
                  change={`+${portfolioData.returnPercentage}%`}
                  icon={ArrowUpRight}
                />
                <StatCard
                  title="Active Investments"
                  value={portfolioData.activeInvestments}
                  icon={PieChart}
                  isPositive={false}
                />
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Investments</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Return
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentInvestments.map((investment) => (
                        <tr key={investment.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{investment.company}</div>
                              <div className="text-sm text-gray-500">{investment.category}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${investment.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(investment.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                investment.status === "Active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {investment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                            +{investment.return}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-black hover:text-gray-700 flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Opportunities Tab */}
          {activeTab === "opportunities" && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search opportunities..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
                      />
                    </div>
                  </div>
                  <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </button>
                </div>
              </div>

              {/* Opportunities Grid */}
              <div className="grid gap-6">
                {opportunities.map((opportunity) => (
                  <div key={opportunity.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{opportunity.company}</h3>
                        <p className="text-gray-600 mt-1">{opportunity.description}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          opportunity.riskLevel === "Low"
                            ? "bg-green-100 text-green-800"
                            : opportunity.riskLevel === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {opportunity.riskLevel} Risk
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Funding Goal</p>
                        <p className="font-semibold">${opportunity.fundingGoal.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Current Funding</p>
                        <p className="font-semibold">${opportunity.currentFunding.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Min Investment</p>
                        <p className="font-semibold">${opportunity.minInvestment.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Expected Return</p>
                        <p className="font-semibold text-green-600">{opportunity.expectedReturn}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{Math.round((opportunity.currentFunding / opportunity.fundingGoal) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-black h-2 rounded-full"
                          style={{ width: `${(opportunity.currentFunding / opportunity.fundingGoal) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Building className="w-4 h-4 mr-1" />
                          {opportunity.category}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {opportunity.timeframe}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
                          Learn More
                        </button>
                        <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 text-sm">
                          Invest Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other tabs content would go here */}
          {activeTab === "investments" && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">My Investments</h3>
              <p className="text-gray-600">Detailed view of all your investments will be displayed here.</p>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Analytics</h3>
              <p className="text-gray-600">Advanced analytics and performance metrics will be displayed here.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
