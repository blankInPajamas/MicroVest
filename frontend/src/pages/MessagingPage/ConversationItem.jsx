"use client"

export default function ConversationItem({ conversation, isSelected, onClick }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 48) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className={`conversation-item ${isSelected ? "active" : ""}`} onClick={onClick}>
      <div className="conversation-avatar">
        <div className="avatar-circle">{conversation.avatar}</div>
        {conversation.online && <div className="online-indicator"></div>}
      </div>
      <div className="conversation-content">
        <div className="conversation-header">
          <h3 className="conversation-name">{conversation.name}</h3>
          <span className="conversation-time">{formatTime(conversation.timestamp)}</span>
        </div>
        <div className="conversation-preview">
          <p className="last-message">{conversation.lastMessage}</p>
          {conversation.unread > 0 && <span className="unread-badge">{conversation.unread}</span>}
        </div>
        <div className="conversation-meta">
          <span className="user-type-badge">
            {conversation.type === "investor" ? "💼 Investor" : "🚀 Entrepreneur"}
          </span>
          {conversation.industry && <span className="industry-tag">{conversation.industry}</span>}
          {conversation.portfolio && <span className="portfolio-tag">{conversation.portfolio}</span>}
        </div>
      </div>
    </div>
  )
}
