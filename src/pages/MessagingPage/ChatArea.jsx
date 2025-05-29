import React from "react"

import { useEffect, useRef } from "react"
import MessageList from "./MessageList"
import MessageInput from "./MessageInput"
import ChatHeader from "./ChatHeader"

export default function ChatArea({ selectedChat, messages, onSendMessage }) {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (!selectedChat) {
    return (
      <div className="chat-area">
        <div className="no-chat-selected">
          <div className="no-chat-content">
            <div className="no-chat-icon">
              <svg className="large-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="no-chat-title">Select a conversation</h3>
            <p className="no-chat-description">
              Choose a conversation from the sidebar to start messaging with investors and entrepreneurs.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-area">
      <ChatHeader selectedChat={selectedChat} />

      <div className="messages-container">
        <MessageList messages={messages} messagesEndRef={messagesEndRef} />
      </div>

      <MessageInput onSendMessage={onSendMessage} />
    </div>
  )
}
