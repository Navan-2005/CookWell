import React, { useState, useRef, useEffect } from 'react';
import { Search, Mic, MicOff, Upload, Camera, ArrowLeft, Send, Bot, User, ChefHat, Clock, Users, Star, Sparkles, Image, Zap } from 'lucide-react';

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
  
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateRecipeSearch = async (query) => {
    const recipes = [
      { 
        name: "Creamy Pasta Carbonara", 
        time: "20 mins", 
        difficulty: "Easy", 
        servings: 4,
        rating: 4.8,
        ingredients: ["spaghetti", "eggs", "pancetta", "parmesan", "black pepper"],
        description: "A classic Italian pasta dish with creamy egg sauce and crispy pancetta."
      },
      { 
        name: "Spicy Chicken Curry", 
        time: "45 mins", 
        difficulty: "Medium", 
        servings: 6,
        rating: 4.6,
        ingredients: ["chicken thighs", "coconut milk", "curry powder", "onions", "garlic", "ginger"],
        description: "Rich and aromatic curry with tender chicken in a spiced coconut sauce."
      },
      { 
        name: "Decadent Chocolate Cake", 
        time: "1 hour", 
        difficulty: "Hard", 
        servings: 8,
        rating: 4.9,
        ingredients: ["dark chocolate", "butter", "sugar", "eggs", "flour", "cocoa powder"],
        description: "Moist and rich chocolate cake perfect for special occasions."
      },
      { 
        name: "Fresh Greek Salad", 
        time: "15 mins", 
        difficulty: "Easy", 
        servings: 4,
        rating: 4.5,
        ingredients: ["tomatoes", "cucumber", "red onion", "feta cheese", "olives", "olive oil"],
        description: "Light and refreshing Mediterranean salad with fresh vegetables."
      },
      { 
        name: "Beef Stir Fry", 
        time: "25 mins", 
        difficulty: "Medium", 
        servings: 4,
        rating: 4.7,
        ingredients: ["beef strips", "mixed vegetables", "soy sauce", "garlic", "ginger", "sesame oil"],
        description: "Quick and healthy stir fry with tender beef and crisp vegetables."
      },
      { 
        name: "Mushroom Risotto", 
        time: "35 mins", 
        difficulty: "Medium", 
        servings: 4,
        rating: 4.4,
        ingredients: ["arborio rice", "mushrooms", "white wine", "parmesan", "butter", "onions"],
        description: "Creamy Italian rice dish with earthy mushrooms and rich cheese."
      }
    ];
    
    const filteredRecipes = recipes.filter(recipe => 
      recipe.name.toLowerCase().includes(query.toLowerCase()) ||
      recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(query.toLowerCase())) ||
      recipe.description.toLowerCase().includes(query.toLowerCase())
    );
    
    return filteredRecipes.length > 0 ? filteredRecipes : recipes.slice(0, 3);
  };

  const simulateImageAnalysis = async (imageFile) => {
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const possibleIngredients = [
      "fresh tomatoes", "red onions", "garlic cloves", "chicken breast", "ground beef", 
      "pasta", "mozzarella cheese", "fresh basil", "mixed vegetables", "whole wheat bread", 
      "eggs", "milk", "flour", "bell peppers", "mushrooms", "spinach", "carrots"
    ];
    
    const detectedIngredients = possibleIngredients.slice(0, Math.floor(Math.random() * 4) + 3);
    return detectedIngredients;
  };

  const handleSearch = async (query = searchQuery) => {
    if (!query.trim()) return;
    
    const userMessage = { type: 'user', content: query, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const recipes = await simulateRecipeSearch(query);
      const botMessage = {
        type: 'bot',
        content: `🍳 Found ${recipes.length} delicious recipes for "${query}" :`,
        recipes: recipes,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    } catch (error) {
      const errorMessage = {
        type: 'bot',
        content: '😅 Oops! Something went wrong while searching. Please try again.',
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
    
    try {
      const ingredients = await simulateImageAnalysis(imageFile);
      const recipes = await simulateRecipeSearch(ingredients.join(' '));
      
      const botMessage = {
        type: 'bot',
        content: `🔍 I can see ${ingredients.join(', ')} in your image! Here are some perfect recipe matches :`,
        recipes: recipes,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    } catch (error) {
      const errorMessage = {
        type: 'bot',
        content: '😅 I couldn\'t analyze the image properly. Please try uploading another one!',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
    
    setUploadedImage(null);
    setImageFile(null);
  };

  const RecipeCard = ({ recipe }) => (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-xl text-gray-800 leading-tight">{recipe.name}</h3>
        <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
          <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
          <span className="text-sm font-medium text-yellow-700">{recipe.rating}</span>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4 text-sm leading-relaxed">{recipe.description}</p>
      
      <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          <span>{recipe.time}</span>
        </div>
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-1" />
          <span>{recipe.servings} servings</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
          recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {recipe.difficulty}
        </span>
      </div>
      
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Key Ingredients:</p>
        <div className="flex flex-wrap gap-2">
          {recipe.ingredients.slice(0, 4).map((ingredient, index) => (
            <span key={index} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
              {ingredient}
            </span>
          ))}
          {recipe.ingredients.length > 4 && (
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
              +{recipe.ingredients.length - 4} more
            </span>
          )}
        </div>
      </div>
      
      <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center">
        <ChefHat className="w-4 h-4 mr-2" />
        View Full Recipe
      </button>
    </div>
  );

  if (currentPage === 'search') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full">
                  <ChefHat className="w-8 h-8 text-white" />
                </div>
                <Sparkles className="w-6 h-6 text-yellow-500 ml-2" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                Recipe ChatBot Assistant
              </h1>
              <p className="text-gray-600 text-lg">Discover amazing recipes through conversation, voice, or images</p>
            </div>

            {/* Chat Container */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white/50 to-white/30">
                {chatMessages.map((message, index) => (
                  <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
                        : 'bg-white/90 text-gray-800 shadow-md border border-gray-100'
                    }`}>
                      <div className="flex items-center mb-2">
                        {message.type === 'user' ? (
                          <User className="w-4 h-4 mr-2" />
                        ) : (
                          <Bot className="w-4 h-4 mr-2 text-orange-500" />
                        )}
                        <span className="text-xs opacity-75">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="leading-relaxed">{message.content}</p>
                      {message.image && (
                        <img src={message.image} alt="Uploaded" className="mt-3 max-w-full h-32 object-cover rounded-lg border-2 border-white/20" />
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Recipe Results */}
                {chatMessages.map((message, index) => (
                  message.recipes && (
                    <div key={`recipes-${index}`} className="grid gap-4 md:grid-cols-2 mt-4">
                      {message.recipes.map((recipe, recipeIndex) => (
                        <RecipeCard key={recipeIndex} recipe={recipe} />
                      ))}
                    </div>
                  )
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/90 px-4 py-3 rounded-2xl shadow-md border border-gray-100">
                      <div className="flex items-center">
                        <Bot className="w-4 h-4 mr-2 text-orange-500" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-600">Searching recipes...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 bg-white/90 backdrop-blur-sm border-t border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Ask me about any recipe... (e.g., 'pasta dishes', 'healthy breakfast', 'quick dinner')"
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-lg text-gray-900 bg-white/50 backdrop-blur-sm"
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
                    className="px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl transition-all duration-200 font-medium shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                
                {isListening && (
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center text-red-500 bg-red-50 px-4 py-2 rounded-full">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center mb-8">
              <button
                onClick={() => setCurrentPage('search')}
                className="mr-4 p-3 hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-sm"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full mr-4">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    AI Recipe Vision
                  </h1>
                  <p className="text-gray-600 text-lg">Upload your food images for instant recipe magic ✨</p>
                </div>
              </div>
            </div>

            {/* Upload Area */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
              <div 
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
                  dragActive 
                    ? 'border-purple-500 bg-purple-50' 
                    : uploadedImage 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
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
                        className="max-w-full h-80 object-cover rounded-2xl shadow-lg border-4 border-white"
                      />
                      <div className="absolute top-2 right-2 bg-green-500 text-white p-2 rounded-full">
                        <Camera className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-green-700">Perfect! Image uploaded successfully</h3>
                      <p className="text-gray-600">Your delicious image is ready for AI analysis</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                        <Upload className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute top-0 right-1/2 transform translate-x-6 -translate-y-2">
                        <Sparkles className="w-6 h-6 text-yellow-500" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-gray-800">Drop your food image here</h3>
                      <p className="text-gray-600 text-lg">
                        Or click to browse your delicious photos
                      </p>
                      <div className="flex justify-center space-x-4 text-sm text-gray-500">
                        <span className="bg-gray-100 px-3 py-1 rounded-full">JPG</span>
                        <span className="bg-gray-100 px-3 py-1 rounded-full">PNG</span>
                        <span className="bg-gray-100 px-3 py-1 rounded-full">WEBP</span>
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
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
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
              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Smart Recognition</h3>
                <p className="text-sm text-gray-600">AI identifies ingredients from your photos</p>
              </div>
              
              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChefHat className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Perfect Matches</h3>
                <p className="text-sm text-gray-600">Get recipes that match your ingredients</p>
              </div>
              
              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Instant Results</h3>
                <p className="text-sm text-gray-600">Fast AI analysis with detailed suggestions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default RecipeSearchApp;