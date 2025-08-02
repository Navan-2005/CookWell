
import React, { useState, useRef, useEffect } from 'react';
import { Search, Mic, MicOff, Upload, Camera, ArrowLeft, Send, Bot, User, ChefHat, Clock, Users, Star, Sparkles, Image, Zap, Save, LogIn } from 'lucide-react';
import axios from 'axios';

const RecipeSearchApp = () => {
  const [currentPage, setCurrentPage] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      type: 'bot',
      content: "👋 Hi there! I'm your Recipe Assistant. I can help you find delicious recipes using text, voice, or even images! What would you like to cook today?",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  const [user, setUser] = useState(null); // Mock user state

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        handleSearch(transcript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      setVoiceSupported(true);
    }
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const toggleVoiceInput = () => {
    if (!voiceSupported) return;
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Create FormData for upload
      const formData = new FormData();
      formData.append('image', file);
      
      try {
        const res = await axios.post("http://localhost:5001/detect", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log('Ingredients : ', res.data.ingredients);
        
        const recipe = await axios.post(`${import.meta.env.VITE_API_URL}/ai/generate-recipe`, {
          ingredients: res.data.ingredients
        });
         
        console.log('Recipe : ', recipe.data.recipe);
        
        setCurrentRecipe(recipe.data.recipe);
        
        // Add success message to chat
        const successMessage = {
          type: 'bot',
          content: `🔍 Successfully analyzed your image! Found ingredients: ${res.data.ingredients.join(', ')}`,
          recipe: recipe.data.recipe,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, successMessage]);
        
      } catch (error) {
        console.error("Upload failed:", error.response?.data || error.message);
        
        // Add error message to chat
        const errorMessage = {
          type: 'bot',
          content: '😅 Sorry, I couldn\'t analyze the image. Please try again with a clearer food image.',
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, errorMessage]);
      }
    } else {
      alert('Please select a valid image file');
    }
  };

  // Helper function to parse recipe text into structured format
  const parseRecipe = (recipeText) => {
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
      userId: user?._id,
      title,
      ingredients,
      steps,
      image: '',
      rawText: recipeText
    };
  };

  const handleSaveRecipe = async (recipeText) => {
    if (!recipeText) {
      alert('No recipe to save');
      return;
    }

    if (!user) {
      alert('Please login to save recipes');
      return;
    }

    try {
      // Parse the recipe into structured format
      const parsedRecipe = parseRecipe(recipeText);
      console.log('Parsed recipe:', parsedRecipe);
      
      // Send save request to backend
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/saverecipe`, parsedRecipe);
      
      console.log('Save response:', response.data);
      alert('Recipe saved successfully!');
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Failed to save recipe. Please try again.');
    }
  };

  const handleSearch = async (query = searchQuery) => {
    if (!query.trim()) return;
    
    const userMessage = { type: 'user', content: query, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    try {
      // Call backend API to get recipe
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/ai/get-recipe`, {
        prompt: query
      });

      const recipeText = response.data.recipe;
      console.log('Recipe from backend:', recipeText);
      
      // Store current recipe for potential saving
      setCurrentRecipe(recipeText);
      
      const botMessage = {
        type: 'bot',
        content: `🍳 Here's a delicious recipe for "${query}":`,
        recipe: recipeText,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    } catch (error) {
      console.error('Error fetching recipe:', error);
      const errorMessage = {
        type: 'bot',
        content: '😅 Oops! Something went wrong while getting your recipe. Please try again.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
    
    setSearchQuery('');
  };

  const handleImageSearch = async () => {
    if (!imageFile) return;
    
    const userMessage = { 
      type: 'user', 
      content: 'Uploaded an image for recipe analysis 📸',
      image: uploadedImage,
      timestamp: new Date() 
    };
    setChatMessages(prev => [...prev, userMessage]);
    setCurrentPage('search');
    setIsTyping(true);
    
    // try {
    //   // For now, we'll use a simple prompt for image analysis
    //   const imageAnalysisPrompt = "Give me a recipe based on common ingredients like chicken, vegetables, and pasta";
      
    //   const response = await axios.post('http://localhost:3000/ai/generate-recipe', {
    //     ingredients:ingredients
    //   });

    //   const recipeText = response.data.recipe;
    //   setCurrentRecipe(recipeText);
      
    //   const botMessage = {
    //     type: 'bot',
    //     content: `🔍 Based on your image, here's a perfect recipe suggestion:`,
    //     recipe: recipeText,
    //     timestamp: new Date()
    //   };
      
    //   setChatMessages(prev => [...prev, botMessage]);
    //   setIsTyping(false);
    // } catch (error) {
    //   console.error('Error analyzing image:', error);
    //   const errorMessage = {
    //     type: 'bot',
    //     content: '😅 I couldn\'t analyze the image properly. Please try uploading another one!',
    //     timestamp: new Date()
    //   };
    //   setChatMessages(prev => [...prev, errorMessage]);
    //   setIsTyping(false);
    // }
    
    setUploadedImage(null);
    setImageFile(null);
  };

  const RecipeDisplay = ({ recipe, onSave }) => {
    const lines = recipe.split('\n');
    const title = lines[0].trim();
    
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-700 hover:border-orange-500 mt-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-xl text-white leading-tight">{title}</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onSave(recipe)}
              className="flex items-center text-sm bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save size={14} className="mr-1" />
              Save Recipe
            </button>
          </div>
        </div>
        
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed font-sans">
            {recipe}
          </pre>
        </div>
        
        <button className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center">
          <ChefHat className="w-4 h-4 mr-2" />
          View Full Recipe Details
        </button>
      </div>
    );
  };

  if (currentPage === 'search') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full">
                  <ChefHat className="w-8 h-8 text-white" />
                </div>
                <Sparkles className="w-6 h-6 text-yellow-400 ml-2" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
                Recipe ChatBot Assistant
              </h1>
              <p className="text-gray-300 text-lg">Discover amazing recipes through conversation, voice, or images</p>
            </div>

            {/* Chat Container */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-700">
              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-900/80 to-gray-800/80">
                {chatMessages.map((message, index) => (
                  <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
                        : 'bg-gray-700/80 text-gray-100 shadow-md border border-gray-600'
                    }`}>
                      <div className="flex items-center mb-2">
                        {message.type === 'user' ? (
                          <User className="w-4 h-4 mr-2" />
                        ) : (
                          <Bot className="w-4 h-4 mr-2 text-orange-400" />
                        )}
                        <span className="text-xs opacity-75">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="leading-relaxed">{message.content}</p>
                      {message.image && (
                        <img src={message.image} alt="Uploaded" className="mt-3 max-w-full h-32 object-cover rounded-lg border-2 border-gray-600" />
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Recipe Display */}
                {chatMessages.map((message, index) => (
                  message.recipe && (
                    <div key={`recipe-${index}`} className="max-w-full">
                      <RecipeDisplay 
                        recipe={message.recipe} 
                        onSave={handleSaveRecipe}
                      />
                    </div>
                  )
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-700/80 px-4 py-3 rounded-2xl shadow-md border border-gray-600">
                      <div className="flex items-center">
                        <Bot className="w-4 h-4 mr-2 text-orange-400" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-300">Getting your recipe...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 bg-gray-800/90 backdrop-blur-sm border-t border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Ask me about any recipe... (e.g., 'pasta dishes', 'healthy breakfast', 'quick dinner')"
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-600 rounded-xl focus:border-orange-500 focus:outline-none text-lg text-white bg-gray-700/80 backdrop-blur-sm placeholder-gray-400"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  
                  {voiceSupported && (
                    <button
                      onClick={toggleVoiceInput}
                      className={`p-4 rounded-xl transition-all duration-200 ${
                        isListening 
                          ? 'bg-red-500 text-white shadow-lg animate-pulse' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg'
                      }`}
                      title="Voice Search"
                    >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                  )}
                  
                  <button
                    onClick={() => setCurrentPage('image')}
                    className="p-4 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-xl transition-all duration-200 shadow-lg"
                    title="Upload Image"
                  >
                    <Image className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => handleSearch()}
                    disabled={!searchQuery.trim()}
                    className="px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl transition-all duration-200 font-medium shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                
                {isListening && (
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center text-red-400 bg-red-900/30 px-4 py-2 rounded-full border border-red-600">
                      <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse mr-2"></div>
                      <Zap className="w-4 h-4 mr-1" />
                      Listening for your recipe request...
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'image') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center mb-8">
              <button
                onClick={() => setCurrentPage('search')}
                className="mr-4 p-3 hover:bg-gray-800/50 rounded-xl transition-all duration-200 backdrop-blur-sm"
              >
                <ArrowLeft className="w-6 h-6 text-gray-300" />
              </button>
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full mr-4">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    AI Recipe Vision
                  </h1>
                  <p className="text-gray-300 text-lg">Upload your food images for instant recipe magic ✨</p>
                </div>
              </div>
            </div>

            {/* Upload Area */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-700">
              <div 
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
                  dragActive 
                    ? 'border-purple-400 bg-purple-900/30' 
                    : uploadedImage 
                      ? 'border-green-400 bg-green-900/30' 
                      : 'border-gray-500 hover:border-purple-400 hover:bg-purple-900/20'
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {uploadedImage ? (
                  <div className="space-y-6">
                    <div className="relative inline-block">
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded" 
                        className="max-w-full h-80 object-cover rounded-2xl shadow-lg border-4 border-gray-600"
                      />
                      <div className="absolute top-2 right-2 bg-green-500 text-white p-2 rounded-full">
                        <Camera className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-green-400">Perfect! Image uploaded successfully</h3>
                      <p className="text-gray-300">Your delicious image is ready for AI analysis</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                        <Upload className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute top-0 right-1/2 transform translate-x-6 -translate-y-2">
                        <Sparkles className="w-6 h-6 text-yellow-400" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-white">Drop your food image here</h3>
                      <p className="text-gray-300 text-lg">
                        Or click to browse your delicious photos
                      </p>
                      <div className="flex justify-center space-x-4 text-sm text-gray-400">
                        <span className="bg-gray-700 px-3 py-1 rounded-full">JPG</span>
                        <span className="bg-gray-700 px-3 py-1 rounded-full">PNG</span>
                        <span className="bg-gray-700 px-3 py-1 rounded-full">WEBP</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {uploadedImage && (
                <div className="mt-8 flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      setUploadedImage(null);
                      setImageFile(null);
                    }}
                    className="px-8 py-4 border-2 border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-all duration-200 font-medium"
                  >
                    Remove Image
                  </button>
                  <button
                    onClick={handleImageSearch}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all duration-200 font-medium flex items-center shadow-lg"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Analyze & Find Recipes
                  </button>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700">
                <div className="w-12 h-12 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-bold text-white mb-2">Smart Recognition</h3>
                <p className="text-sm text-gray-300">AI identifies ingredients from your photos</p>
              </div>
              
              <div className="text-center p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700">
                <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChefHat className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-bold text-white mb-2">Perfect Matches</h3>
                <p className="text-sm text-gray-300">Get recipes that match your ingredients</p>
              </div>
              
              <div className="text-center p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700">
                <div className="w-12 h-12 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-bold text-white mb-2">Instant Results</h3>
                <p className="text-sm text-gray-300">Fast AI analysis with detailed suggestions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default RecipeSearchApp;