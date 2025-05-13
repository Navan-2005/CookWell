import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Mic, Star, BookOpen, Trash } from 'lucide-react';
import axios from 'axios';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I assist you today?', timestamp: new Date() }
  ]);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeView, setActiveView] = useState('chat'); // 'chat' or 'saved'
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startListening = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
  
    recognition.onstart = () => {
      console.log("Voice recognition started. Speak into the mic.");
    };
  
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      console.log("Recognized:", transcript);
  
      if (transcript) {
        setInput(transcript);
        handleSend(transcript);
      }
    };
  
    recognition.onspeechend = () => {
      console.log("Speech ended");
      recognition.stop();
    };
  
    recognition.onerror = (event) => {
      console.error("Recognition error:", event.error);
    };
  
    recognition.onend = () => {
      console.log("Recognition ended");
    };
  
    recognition.start();
  };
  
  const handleSaveRecipe = async () => {
    if (!currentRecipe) {
      alert('No recipe to save');
      return;
    }

    try {
      // Attempt to parse the recipe into structured format
      const parsedRecipe = parseRecipe(currentRecipe);

      // Send save request to backend
      await axios.post('/api/favorites', parsedRecipe);

      alert('Recipe saved successfully!');
      setCurrentRecipe(null);
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Failed to save recipe. Please try again.');
    }
  };

  // Helper function to parse recipe text into structured format
  const parseRecipe = (recipeText) => {
    // Basic parsing - this might need to be more sophisticated
    const lines = recipeText.split('\n');
    
    // Assume first line is title
    const title = lines[0].trim();
    
    // Find ingredients section
    const ingredientsStart = lines.findIndex(line => 
      line.toLowerCase().includes('ingredients') || line.toLowerCase().includes('ingredient')
    );
    
    // Find steps/instructions section
    const stepsStart = lines.findIndex(line => 
      line.toLowerCase().includes('instructions') || 
      line.toLowerCase().includes('steps') || 
      line.toLowerCase().includes('method')
    );

    // Extract ingredients
    const ingredients = ingredientsStart !== -1 && stepsStart !== -1
      ? lines.slice(ingredientsStart + 1, stepsStart)
        .filter(line => line.trim() !== '')
        .map(line => line.trim())
      : [];

    // Extract steps
    const steps = stepsStart !== -1
      ? lines.slice(stepsStart + 1)
        .filter(line => line.trim() !== '')
        .map(line => line.trim())
      : [];

    return {
      title,
      ingredients,
      steps,
      image: '', // You might want to add image generation or upload logic
      source: 'chatbot'
    };
  };

  const handleSend = async (msgText = input) => {
    if (!msgText.trim()) return;

    const userMsg = {
      sender: 'user',
      text: msgText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/ai/get-recipe', {
        prompt: msgText
      });

      const botMsg = {
        sender: 'bot',
        text: response.data.recipe,
        timestamp: new Date(),
        type: 'recipe'
      };
      console.log(response.data.recipe);
      
      // Store current recipe for potential saving
      setCurrentRecipe(response.data.recipe);
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg = {
        sender: 'bot',
        text: 'Sorry, I encountered an error processing your request.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMsg]);
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const renderChatView = () => (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
      {messages.map((msg, i) => (
        <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`flex ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              msg.sender === 'user' ? 'bg-blue-500 ml-2' : 'bg-gray-300 mr-2'
            }`}>
              {msg.sender === 'user' ? <User size={16} color="white" /> : <Bot size={16} color="white" />}
            </div>
            <div className={`px-3 py-2 rounded-lg max-w-xs ${
              msg.sender === 'user'
                ? 'bg-blue-500 text-white rounded-br-none'
                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
            }`}>
              <p className="text-sm">{msg.text}</p>
              {msg.type === 'recipe' && (
                <div className="mt-2 flex space-x-2">
                  <button 
                    onClick={handleSaveRecipe}
                    className="flex items-center text-sm bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    <Star size={14} className="mr-1" /> Save Recipe
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="flex flex-row items-end">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-300 mr-2">
              <Bot size={16} color="white" />
            </div>
            <div className="px-3 py-2 rounded-lg bg-white border border-gray-200 rounded-bl-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg h-96 md:h-120 bg-white rounded-lg shadow-md flex flex-col">
        <div className="p-3 bg-blue-500 text-white flex items-center justify-between">
          <div className="flex items-center">
            <Bot className="mr-2" size={20} />
            <h1 className="text-lg font-medium">Chat Assistant</h1>
          </div>
        </div>

        {renderChatView()}

        <div className="p-3 border-t border-gray-200">
          <div className="flex">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
              className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-gray-800 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type or speak your message..."
              disabled={isLoading}
            />
            <button
              onClick={startListening}
              disabled={isLoading}
              className={`px-3 py-2 bg-gray-200 border-l border-gray-300 hover:bg-gray-300 transition ${
                isListening ? 'text-red-500' : 'text-gray-600'
              }`}
              title="Speak"
            >
              <Mic size={18} />
            </button>
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;