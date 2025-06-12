"use client"

import Message from "./Message"

export default function MessageList({ messages, messagesEndRef }) {
  return (
    <div className="messages-list">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}
