"use client"
import { useState } from "react"
import Navbar from "../../components/navbar"
import Footer from "../../components/footer"
import {
  Home,
  Layers,
  Users,
  FileText,
  Monitor,
  Plus,
  Calendar as CalendarIcon,
} from "lucide-react"

const overviewCards = [
  { label: "Funds Raised Today", value: "$2,500" },
  { label: "Active Investors", value: "12" },
  { label: "Total Capital Raised", value: "$15,000" },
]

const activeItems = [
  { project: "Project Alpha", goal: "$50,000", raised: 60, investors: 25 },
  { project: "Project Beta", goal: "$100,000", raised: 30, investors: 10 },
]

const schedule = [
  { title: "Investor Meeting", time: "10:00 AM - 11:00 AM" },
  { title: "Team Check-in", time: "2:00 PM - 3:00 PM" },
  { title: "Pitch Deck Review", time: "4:00 PM - 5:00 PM" },
]

function Sidebar({ active = "Overview" }) {
  const nav = [
    { label: "Overview", icon: Home },
    { label: "Funding Stages", icon: Layers },
    { label: "Team", icon: Users },
    { label: "Documentation", icon: FileText },
    { label: "Pitch Deck", icon: Monitor },
  ]
  return (
    <aside className="hidden md:flex flex-col w-72 min-h-full bg-white py-8 px-6 gap-3 shadow-[2px_0_20px_rgba(0,0,0,0.08)]">
      <div className="mb-8 font-bold text-xl flex items-center gap-2">
        <span className="w-2 h-2 bg-black rounded-full mr-2" /> Microvest
      </div>
      {nav.map((item) => (
        <button
          key={item.label}
          className={`flex items-center gap-4 px-5 py-3 rounded-xl text-base font-medium transition-colors ${
            active === item.label
              ? "bg-gray-100 text-black"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <item.icon className="w-6 h-6" />
          {item.label}
        </button>
      ))}
    </aside>
  )
}

function CalendarWidget() {
  // Simple static July 2024 calendar for demo
  const days = ["S", "M", "T", "W", "T", "F", "S"]
  const dates = Array(31)
    .fill(0)
    .map((_, i) => i + 1)
  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="font-bold text-lg">July 2024</span>
        <CalendarIcon className="w-5 h-5 text-gray-400" />
      </div>
      <div className="grid grid-cols-7 text-sm text-gray-400 mb-2">
        {days.map((d) => (
          <div key={d} className="text-center font-medium">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array(5).fill(null).map((_, i) => <div key={i}></div>)}
        {dates.map((d) => (
          <div
            key={d}
            className={`w-10 h-10 flex items-center justify-center rounded-full text-base font-medium ${
              d === 5 ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  )
}

function ScheduleWidget() {
  return (
    <div className="bg-white rounded-xl border p-4">
      <div className="font-semibold mb-3">Schedule</div>
      <ul className="space-y-2">
        {schedule.map((item) => (
          <li key={item.title}>
            <div className="font-medium text-sm text-gray-900">{item.title}</div>
            <div className="text-xs text-gray-500">{item.time}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function InvestorDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar userType="investor" userName="John Doe" userEmail="john@example.com" />
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar active="Overview" />
        {/* Main Content */}
        <main className="flex-1 flex flex-col lg:flex-row gap-8 max-w-full">
          {/* Center Main Area */}
          <section className="flex-1 px-6 py-8 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
              <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
              <div className="flex gap-4">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:bg-blue-700 transition">Create Project</button>
                <button className="bg-gray-100 text-gray-900 px-6 py-3 rounded-full font-semibold shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:bg-gray-200 transition">View Project</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              {overviewCards.map((card) => (
                <div key={card.label} className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-8 flex flex-col items-center">
                  <div className="text-sm text-gray-500 mb-4">{card.label}</div>
                  <div className="text-5xl font-bold text-gray-900">{card.value}</div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-8 mb-10 flex items-center justify-between">
              <div className="font-semibold text-xl">Promotional Card</div>
              <div className="font-bold text-2xl text-gray-900">Get started with Microvest</div>
            </div>
            <div>
              <div className="font-semibold text-xl mb-4">Active Items</div>
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-0 overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500">
                      <th className="px-8 py-4">Project</th>
                      <th className="px-8 py-4">Funding Goal</th>
                      <th className="px-8 py-4">Raised</th>
                      <th className="px-8 py-4">Investors</th>
                    </tr>
                  </thead>
                  <tbody className="text-base">
                    {activeItems.map((item) => (
                      <tr key={item.project} className="border-t">
                        <td className="px-8 py-6 font-medium text-gray-900">{item.project}</td>
                        <td className="px-8 py-6 text-blue-700 font-semibold">{item.goal}</td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-40 h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-3 rounded-full bg-blue-600" style={{ width: `${item.raised}%` }}></div>
                            </div>
                            <span className="text-gray-700 font-semibold">{item.raised}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-gray-700">{item.investors}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
          {/* Right Pane */}
          <aside className="w-full lg:w-96 flex-shrink-0 px-6 py-8">
            <CalendarWidget />
          </aside>
        </main>
      </div>
      <Footer />
    </div>
  )
}
