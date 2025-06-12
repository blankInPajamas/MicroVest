import { useState } from "react"

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  // Dummy notifications data - replace with API
  const notifications = [
    {
      id: 1,
      type: "investment",
      title: "New Investment Opportunity",
      message: "TechStart Solutions is seeking ৳50,00,000 funding",
      timestamp: "2024-01-15T10:30:00Z",
      read: false,
    },
    {
      id: 2,
      type: "message",
      title: "New Message",
      message: "Sarah Ahmed sent you a message",
      timestamp: "2024-01-15T09:15:00Z",
      read: false,
    },
    {
      id: 3,
      type: "update",
      title: "Portfolio Update",
      message: "GreenEnergy Ventures Q4 report is available",
      timestamp: "2024-01-14T16:45:00Z",
      read: true,
    },
  ]

  const unreadCount = notifications.filter((n) => !n.read).length

  const formatNotificationTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications)
    setShowProfileMenu(false)
  }

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu)
    setShowNotifications(false)
  }

  const handleNavigation = (path) => {
    console.log(`Navigate to: ${path}`)
    // TODO: Implement navigation
  }

  return (
    <div className="messaging-header">
      <div className="header-content">
        {/* Logo Section - Leftmost */}
        <div className="logo-section">
          <div className="logo-icon">
            <svg className="trending-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h1 className="brand-title">MicroVest</h1>
        </div>

        {/* Center Navigation */}
        <div className="center-nav">
          <button className="nav-button" onClick={() => handleNavigation("/browse-businesses")}>
            Browse Businesses
          </button>
          <button className="nav-button" onClick={() => handleNavigation("/consultants")}>
            Look for Consultants
          </button>
          <button className="nav-button" onClick={() => handleNavigation("/dashboard")}>
            Dashboard
          </button>
        </div>

        {/* Right Actions */}
        <div className="right-actions">
          {/* Pitch Idea Button */}
          <button className="pitch-button" onClick={() => handleNavigation("/pitch-idea")}>
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Pitch Idea
          </button>

          {/* Messages Icon */}
          <button className="header-icon-button active" onClick={() => handleNavigation("/messages")}>
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>

          {/* Notifications - Bell Icon */}
          <div className="notification-container">
            <button className="header-icon-button" onClick={handleNotificationClick}>
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                {/* Bell body */}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.5 17.5a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5c0-1.5.5-3 2-4.5V9a4 4 0 0 1 8 0v4c1.5 1.5 2 3 2 4.5Z"
                />
                {/* Bell clapper */}
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21h3" />
              </svg>
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="dropdown-header">
                  <h3>Notifications</h3>
                  <button className="mark-all-read">Mark all as read</button>
                </div>
                <div className="notifications-list">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`notification-item ${!notification.read ? "unread" : ""}`}>
                      <div className="notification-icon">
                        {notification.type === "investment" && (
                          <svg className="small-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                            />
                          </svg>
                        )}
                        {notification.type === "message" && (
                          <svg className="small-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                        )}
                        {notification.type === "update" && (
                          <svg className="small-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="notification-content">
                        <h4 className="notification-title">{notification.title}</h4>
                        <p className="notification-message">{notification.message}</p>
                        <span className="notification-time">{formatNotificationTime(notification.timestamp)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="dropdown-footer">
                  <button className="view-all-button">View All Notifications</button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="profile-container">
            <button className="profile-button" onClick={handleProfileClick}>
              <div className="profile-avatar">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="profile-dropdown">
                <button className="dropdown-item" onClick={() => handleNavigation("/profile")}>
                  <svg className="small-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  My Profile
                </button>
                <button className="dropdown-item logout" onClick={() => handleNavigation("/logout")}>
                  <svg className="small-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
