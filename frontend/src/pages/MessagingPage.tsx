import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header2";
import { MessageCircle, Search, UserPlus, Send, Check, X, Users, Plus } from "lucide-react";

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  user_type: string;
  email: string;
}

interface FriendRequest {
  id: number;
  from_user: User;
  to_user: User;
  status: string;
  created_at: string;
}

interface Conversation {
  id: number;
  participants: User[];
  last_message?: {
    content: string;
    sender: string;
    created_at: string;
  };
  unread_count: number;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: number;
  content: string;
  sender: User;
  is_read: boolean;
  created_at: string;
}

export default function MessagingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'conversations' | 'friends' | 'friendRequests' | 'search'>('conversations');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sentFriendRequests, setSentFriendRequests] = useState<number[]>([]);
  const [showFriendsModal, setShowFriendsModal] = useState(false);

  useEffect(() => {
    fetchConversations();
    fetchFriends();
    fetchFriendRequests();
  }, []);

  // Fetch all users when search tab is active
  useEffect(() => {
    if (activeTab === 'search') {
      searchUsers('');
    }
  }, [activeTab]);

  // Populate sent friend requests
  useEffect(() => {
    const sentRequests = friendRequests
      .filter(req => req.status === 'pending' && req.from_user.id.toString() === getCurrentUserId())
      .map(req => req.to_user.id);
    console.log('Sent friend requests:', sentRequests);
    console.log('All friend requests:', friendRequests);
    setSentFriendRequests(sentRequests);
  }, [friendRequests]);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8000/api/messaging/conversations/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchFriends = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8000/api/messaging/friends/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFriends(data);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8000/api/messaging/friend-requests/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFriendRequests(data);
      }
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  const searchUsers = async (query: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8000/api/messaging/users/search/?q=${query}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const sendFriendRequest = async (userId: number) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8000/api/messaging/friend-requests/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ to_user: userId }),
      });
      if (response.ok) {
        alert('Friend request sent successfully!');
        setSearchQuery('');
        setSearchResults([]);
        setSentFriendRequests([...sentFriendRequests, userId]);
        // Refresh friend requests to update the list
        fetchFriendRequests();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to send friend request');
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Failed to send friend request');
    }
  };

  const handleFriendRequest = async (requestId: number, action: 'accept' | 'reject') => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8000/api/messaging/friend-requests/${requestId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });
      if (response.ok) {
        alert(action === 'accept' ? 'Friend request accepted!' : 'Friend request rejected.');
        fetchFriendRequests();
        fetchFriends(); // Refresh friends list
        if (action === 'accept') {
          fetchConversations();
        }
      }
    } catch (error) {
      console.error('Error handling friend request:', error);
    }
  };

  const fetchMessages = async (conversationId: number) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8000/api/messaging/conversations/${conversationId}/messages/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8000/api/messaging/conversations/${selectedConversation.id}/messages/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newMessage }),
      });
      if (response.ok) {
        setNewMessage('');
        fetchMessages(selectedConversation.id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.id);
  };

  const getCurrentUserId = () => {
    const userId = localStorage.getItem('userId');
    console.log('Current user ID from localStorage:', userId);
    return userId;
  };

  const getOtherParticipant = (conversation: Conversation) => {
    const currentUserId = getCurrentUserId();
    return conversation.participants.find(p => p.id.toString() !== currentUserId);
  };

  const hasSentFriendRequest = (userId: number) => {
    return sentFriendRequests.includes(userId);
  };

  const isFriend = (userId: number) => {
    return friends.some(friend => friend.id === userId);
  };

  // This check can be useful if the page is accessed directly without auth
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 flex bg-white">
      {/* Left Panel - Sidebar */}
      <div className="w-1/4 border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-bold">Messages</h1>
          <button onClick={() => setShowFriendsModal(true)} className="p-2 rounded-full hover:bg-gray-100">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => {
            const otherUser = getOtherParticipant(conversation);
            return (
              <div
                key={conversation.id}
                onClick={() => handleConversationSelect(conversation)}
                className={`flex items-center p-3 cursor-pointer border-l-4 ${
                  selectedConversation?.id === conversation.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-transparent hover:bg-gray-50'
                }`}
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0 mr-3 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {otherUser?.first_name?.[0] || otherUser?.username?.[0]}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-sm">{otherUser?.first_name || otherUser?.username}</p>
                    <p className="text-xs text-gray-500">
                      {conversation.last_message ? new Date(conversation.last_message.created_at).toLocaleDateString() : ''}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.last_message?.content || 'No messages yet'}
                  </p>
                </div>
                {conversation.unread_count > 0 && (
                   <div className="w-2 h-2 rounded-full bg-blue-500 ml-2"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Panel - Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center">
               <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 mr-3 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {getOtherParticipant(selectedConversation)?.first_name?.[0] || getOtherParticipant(selectedConversation)?.username?.[0]}
                  </span>
                </div>
              <div>
                <h2 className="font-semibold">{getOtherParticipant(selectedConversation)?.first_name || getOtherParticipant(selectedConversation)?.username}</h2>
                <p className="text-xs text-green-500">Online</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
              <div className="space-y-4">
                 {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-end gap-2 ${
                      message.sender.id.toString() === getCurrentUserId() ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center">
                       <span className="text-sm font-bold text-white">{message.sender.first_name?.[0] || message.sender.username?.[0]}</span>
                    </div>
                    <div
                      className={`max-w-md px-4 py-2 rounded-lg ${
                        message.sender.id.toString() === getCurrentUserId()
                          ? 'bg-black text-white rounded-br-none'
                          : 'bg-white text-black border border-gray-200 rounded-bl-none'
                      }`}
                    >
                      <p>{message.content}</p>
                       <p className="text-xs opacity-75 mt-1 text-right">
                        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="w-full pr-12 pl-4 py-3 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-black text-white rounded-full hover:bg-gray-800"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700">Select a conversation</h2>
              <p className="text-gray-500">Choose a conversation from the sidebar to start messaging.</p>
            </div>
          </div>
        )}
      </div>

      {/* Friends Modal */}
      {showFriendsModal && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col" style={{height: '70vh'}}>
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold">Friends & Community</h2>
              <button onClick={() => setShowFriendsModal(false)} className="p-2 rounded-full hover:bg-gray-100 text-2xl leading-none">&times;</button>
            </div>
            
            <div className="p-4">
               <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('friends')}
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === 'friends'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Friends
                  </button>
                  <button
                    onClick={() => setActiveTab('friendRequests')}
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === 'friendRequests'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Requests
                  </button>
                  <button
                    onClick={() => setActiveTab('search')}
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === 'search'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Find People
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'friends' && (
                  <div>
                    <h3 className="text-md font-semibold text-gray-800 mb-4">Your Friends ({friends.length})</h3>
                    <div className="space-y-2">
                      {friends.length > 0 ? (
                        friends.map((friend) => (
                          <div key={friend.id} className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 mr-3 flex items-center justify-center">
                                <span className="text-md font-bold text-white">{friend.first_name?.[0] || friend.username[0]}</span>
                              </div>
                              <div>
                                <p className="text-black font-medium">{friend.first_name || friend.username}</p>
                                <p className="text-gray-500 text-sm">{friend.user_type}</p>
                              </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                              <MessageCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center">No friends yet. Find people to connect!</p>
                      )}
                    </div>
                  </div>
              )}
              {activeTab === 'friendRequests' && (
                  <div>
                    {/* Incoming Requests */}
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-gray-800 mb-3">Incoming Requests</h4>
                      {friendRequests.filter(req => req.status === 'pending' && req.to_user.id.toString() === getCurrentUserId()).length > 0 ? (
                        <div className="space-y-3">
                        {friendRequests
                          .filter(req => req.status === 'pending' && req.to_user.id.toString() === getCurrentUserId())
                          .map((request) => (
                            <div key={request.id} className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                              <div className="flex items-center">
                                 <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 mr-3 flex items-center justify-center">
                                  <span className="text-md font-bold text-white">{request.from_user.first_name?.[0] || request.from_user.username[0]}</span>
                                </div>
                                <div>
                                  <p className="text-black font-medium">{request.from_user.first_name || request.from_user.username}</p>
                                  <p className="text-gray-500 text-sm">{request.from_user.user_type}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleFriendRequest(request.id, 'accept')}
                                  className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleFriendRequest(request.id, 'reject')}
                                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
                                >
                                  Decline
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (<p className="text-gray-500 text-center text-sm">No incoming friend requests</p>)}
                    </div>

                    {/* Outgoing Requests */}
                    <div>
                      <h4 className="text-md font-medium text-gray-800 mb-3">Sent Requests</h4>
                       {friendRequests.filter(req => req.status === 'pending' && req.from_user.id.toString() === getCurrentUserId()).length > 0 ? (
                        <div className="space-y-3">
                          {friendRequests
                            .filter(req => req.status === 'pending' && req.from_user.id.toString() === getCurrentUserId())
                            .map((request) => (
                              <div key={request.id} className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                                 <div className="flex items-center">
                                   <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 mr-3 flex items-center justify-center">
                                    <span className="text-md font-bold text-white">{request.to_user.first_name?.[0] || request.to_user.username[0]}</span>
                                  </div>
                                  <div>
                                    <p className="text-black font-medium">{request.to_user.first_name || request.to_user.username}</p>
                                    <p className="text-gray-500 text-sm">{request.to_user.user_type}</p>
                                  </div>
                                </div>
                                <span className="text-sm text-gray-500">Pending</span>
                              </div>
                            ))}
                        </div>
                      ) : (<p className="text-gray-500 text-center text-sm">No sent friend requests</p>)}
                    </div>
                  </div>
              )}
              {activeTab === 'search' && (
                  <div>
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search by name or username..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          searchUsers(e.target.value);
                        }}
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      {searchResults.length > 0 ? (
                        searchResults.map((user) => (
                          <div key={user.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                            <div className="flex items-center">
                               <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 mr-3 flex items-center justify-center">
                                <span className="text-md font-bold text-white">{user.first_name?.[0] || user.username[0]}</span>
                              </div>
                              <div>
                                <p className="text-black font-medium">{user.first_name || user.username}</p>
                                <p className="text-gray-500 text-sm">{user.user_type}</p>
                              </div>
                            </div>
                            {isFriend(user.id) ? (
                              <span className="text-sm text-green-600">Friends</span>
                            ) : hasSentFriendRequest(user.id) ? (
                              <button
                                disabled
                                className="px-3 py-1 bg-gray-200 text-gray-500 rounded-md text-sm cursor-not-allowed"
                              >
                                Sent
                              </button>
                            ) : (
                              <button
                                onClick={() => sendFriendRequest(user.id)}
                                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                              >
                                Add Friend
                              </button>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center">No users found.</p>
                      )}
                    </div>
                  </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 