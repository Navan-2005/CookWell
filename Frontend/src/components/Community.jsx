import React, { useState, useEffect, useRef } from "react";
import { Search, Send, Users, MessageCircle, Phone, Video, MoreVertical, Smile } from "lucide-react";
import axios from "axios";

// Mock data for demonstration
const mockUsers = [
  { _id: "1", username: "Alice Johnson", email: "alice@example.com", status: "online", avatar: "AJ", lastSeen: "2 min ago" },
  { _id: "2", username: "Bob Smith", email: "bob@example.com", status: "offline", avatar: "BS", lastSeen: "1 hour ago" },
  { _id: "3", username: "Charlie Brown", email: "charlie@example.com", status: "online", avatar: "CB", lastSeen: "just now" },
  { _id: "4", username: "Diana Prince", email: "diana@example.com", status: "away", avatar: "DP", lastSeen: "5 min ago" },
  { _id: "5", username: "Ethan Hunt", email: "ethan@example.com", status: "online", avatar: "EH", lastSeen: "1 min ago" },
];

const Sidebar = ({ users, onUserSelect, selectedUser, searchTerm, setSearchTerm }) => {
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  // const getallusers=async()=>{
  //   const res = await axios.post("http://localhost:3000/user/getallusers");
  //   const data = res.data.users;
  //   setUsers(data);
  // }

  // useEffect(() => {
  //   getallusers();
  // }, []);

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Community
          </h2>
          <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-medium">
            {users.length} users
          </span>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.map(user => (
          <div
            key={user._id}
            className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-all duration-200 ${
              selectedUser?._id === user._id ? 'bg-blue-50 border-r-2 border-r-blue-500' : ''
            }`}
            onClick={() => onUserSelect(user)}
          >
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {user.avatar}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(user.status)} rounded-full border-2 border-white`}></div>
              </div>
              
              {/* User Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{user.username}</p>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                <p className="text-xs text-gray-400">{user.lastSeen}</p>
              </div>
            </div>
          </div>
        ))}
        
        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ChatPanel = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Sample messages for demonstration
  useEffect(() => {
    if (user) {
      const sampleMessages = [
        { from: "them", text: "Hey there! How are you doing?", timestamp: "10:30 AM" },
        { from: "me", text: "I'm doing great, thanks! How about you?", timestamp: "10:32 AM" },
        { from: "them", text: "Pretty good! Working on some exciting projects.", timestamp: "10:35 AM" },
      ];
      setMessages(sampleMessages);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Welcome to Community Chat</h3>
          <p className="text-gray-500 max-w-sm">
            Select a user from the sidebar to start a conversation and connect with your community.
          </p>
        </div>
      </div>
    );
  }

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = {
      from: "me",
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Header */}
      <div className="border-b border-gray-200 p-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                {user.avatar}
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white`}></div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{user.username}</h2>
              <p className="text-sm text-green-600">Online</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
              msg.from === "me"
                ? "bg-blue-600 text-white rounded-br-sm"
                : "bg-white text-gray-900 rounded-bl-sm shadow-sm border border-gray-200"
            }`}>
              <p className="text-sm">{msg.text}</p>
              <p className={`text-xs mt-1 ${
                msg.from === "me" ? "text-blue-100" : "text-gray-500"
              }`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-end space-x-2">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <Smile className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${user.username}...`}
              className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all"
              rows="1"
              style={{ maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`p-2 rounded-full transition-all ${
              input.trim()
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

function Community() {
  const [users, setUsers] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Simulate API call
  useEffect(() => {
    // Replace this with your actual API call
    const fetchUsers = async () => {
      const res = await axios.post("http://localhost:3000/user/getallusers");
      const data = res.data.users;
      console.log(data);
      
      setUsers(data);
    };
    fetchUsers();
    
    // Using mock data for now
    // setUsers(mockUsers);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        users={users} 
        onUserSelect={setSelectedUser} 
        selectedUser={selectedUser}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <ChatPanel user={selectedUser} />
    </div>
  );
}

export default Community;