import React, { useState } from "react";

const ChatPanel = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  if (!user) {
    return <div className="flex-1 flex items-center justify-center text-gray-500">Select a user to start chatting</div>;
  }

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { from: "me", text: input }]);
    setInput("");
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b p-4 bg-white shadow">
        <h2 className="text-lg font-semibold">{user.username}</h2>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-xs p-2 rounded ${
              msg.from === "me" ? "ml-auto bg-blue-100" : "mr-auto bg-gray-200"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message"
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Share
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
