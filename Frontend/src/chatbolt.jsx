import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, MicOff, Upload, Clock, Users, Star, ChefHat, Send, Bot, User, Camera, X, Heart, Bookmark } from 'lucide-react';

const RecipeChatBot = () => {
  const [currentPage, setCurrentPage] = useState('chat');
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm your Recipe Assistant. Ask me about any dish you'd like to cook, or try voice search!",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const messagesEndRef = useRef(null);

  // Mock recipe database
  const recipeDatabase = [
    {
      id: 1,
      title: "Classic Spaghetti Carbonara",
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop",
      cookTime: "20 min",
      servings: 4,
      rating: 4.8,
      difficulty: "Medium",
      cuisine: "Italian",
      ingredients: [
        "400g spaghetti pasta",
        "200g pancetta or guanciale",
        "4 large egg yolks",
        "100g Pecorino Romano cheese",
        "Fresh black pepper",
        "Salt to taste"
      ],
      instructions: [
        "Bring a large pot of salted water to boil and cook spaghetti according to package directions",
        "While pasta cooks, cut pancetta into small cubes and cook in a large pan until crispy",
        "In a bowl, whisk together egg yolks, grated cheese, and black pepper",
        "Drain pasta, reserving 1 cup pasta water",
        "Add hot pasta to pan with pancetta, remove from heat",
        "Quickly mix in egg mixture, adding pasta water gradually until creamy",
        "Serve immediately with extra cheese and pepper"
      ],
      description: "A classic Roman pasta dish with a silky, creamy sauce made from eggs, cheese, and crispy pancetta.",
      tags: ["pasta", "italian", "quick", "dinner"]
    },
    {
      id: 2,
      title: "Chicken Tikka Masala",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
      cookTime: "45 min",
      servings: 6,
      rating: 4.7,
      difficulty: "Medium",
      cuisine: "Indian",
      ingredients: [
        "1kg chicken breast, cubed",
        "400ml coconut milk",
        "400g canned tomatoes",
        "2 large onions, diced",
        "4 cloves garlic, minced",
        "2 tbsp garam masala",
        "1 tbsp ginger paste",
        "2 tsp cumin",
        "1 tsp turmeric",
        "1 tsp paprika",
        "Salt and pepper",
        "Fresh cilantro",
        "Basmati rice for serving"
      ],
      instructions: [
        "Marinate chicken with yogurt, half the spices, and salt for 30 minutes",
        "Cook marinated chicken in a pan until golden, set aside",
        "Sauté onions until golden, add garlic and ginger",
        "Add remaining spices and cook until fragrant",
        "Add tomatoes and simmer for 10 minutes",
        "Stir in coconut milk and cooked chicken",
        "Simmer for 15-20 minutes until sauce thickens",
        "Garnish with cilantro and serve with rice"
      ],
      description: "Tender chicken in a rich, creamy tomato-based curry with aromatic Indian spices.",
      tags: ["chicken", "curry", "indian", "spicy", "dinner"]
    },
    {
      id: 3,
      title: "Chocolate Chip Cookies",
      image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop",
      cookTime: "25 min",
      servings: 24,
      rating: 4.9,
      difficulty: "Easy",
      cuisine: "American",
      ingredients: [
        "2¼ cups all-purpose flour",
        "1 cup unsalted butter, softened",
        "¾ cup brown sugar",
        "½ cup granulated sugar",
        "2 large eggs",
        "2 tsp vanilla extract",
        "1 tsp baking soda",
        "1 tsp salt",
        "2 cups chocolate chips"
      ],
      instructions: [
        "Preheat oven to 375°F (190°C)",
        "Cream together butter and both sugars until fluffy",
        "Beat in eggs and vanilla extract",
        "In separate bowl, whisk together flour, baking soda, and salt",
        "Gradually mix dry ingredients into wet ingredients",
        "Fold in chocolate chips",
        "Drop rounded tablespoons of dough onto baking sheets",
        "Bake for 9-11 minutes until golden brown",
        "Cool on baking sheet for 5 minutes before transferring"
      ],
      description: "Soft, chewy cookies loaded with chocolate chips - a timeless favorite for all ages.",
      tags: ["cookies", "dessert", "chocolate", "baking", "sweet"]
    },
    {
      id: 4,
      title: "Avocado Toast",
      image: "https://images.unsplash.com/photo-1541519227354-08ea5b76cd61?w=400&h=300&fit=crop",
      cookTime: "10 min",
      servings: 2,
      rating: 4.5,
      difficulty: "Easy",
      cuisine: "Modern",
      ingredients: [
        "2 slices sourdough bread",
        "1 ripe avocado",
        "1 lemon (juiced)",
        "2 eggs (optional)",
        "Cherry tomatoes",
        "Red pepper flakes",
        "Salt and pepper",
        "Extra virgin olive oil"
      ],
      instructions: [
        "Toast bread slices until golden brown",
        "Mash avocado with lemon juice, salt, and pepper",
        "Spread avocado mixture on toast",
        "Top with sliced cherry tomatoes",
        "If using eggs, fry or poach them",
        "Place egg on top of avocado toast",
        "Drizzle with olive oil and sprinkle red pepper flakes",
        "Serve immediately"
      ],
      description: "A healthy and delicious breakfast or snack with creamy avocado on crispy toast.",
      tags: ["breakfast", "healthy", "avocado", "quick", "vegetarian"]
    }
  ];

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
        handleSendMessage(transcript);
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const findRecipes = (query) => {
    const searchTerms = query.toLowerCase().split(' ');
    return recipeDatabase.filter(recipe => {
      const searchableText = [
        recipe.title,
        recipe.description,
        recipe.cuisine,
        ...recipe.ingredients,
        ...recipe.tags
      ].join(' ').toLowerCase();

      return searchTerms.some(term => searchableText.includes(term));
    });
  };

  const generateBotResponse = (userMessage) => {
    const foundRecipes = findRecipes(userMessage);
    
    if (foundRecipes.length > 0) {
      return {
        type: 'recipes',
        content: I found ${foundRecipes.length} recipe${foundRecipes.length > 1 ? 's' : ''} for you!,
        recipes: foundRecipes.slice(0, 3) // Show max 3 recipes
      };
    } else {
      const suggestions = [
        "Try searching for 'pasta', 'chicken', 'cookies', or 'breakfast'",
        "I can help you find recipes by ingredients like 'tomato', 'cheese', or 'chocolate'",
        "Ask me about specific cuisines like 'Italian', 'Indian', or 'American' dishes"
      ];
      
      return {
        type: 'text',
        content: I couldn't find any recipes matching "${userMessage}". ${suggestions[Math.floor(Math.random() * suggestions.length)]}
      };
    }
  };

  const handleSendMessage = async (message = searchQuery) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setSearchQuery('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(message);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        ...botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    if (!uploadedImage) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: 'I uploaded a food image for analysis',
      image: uploadedImage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentPage('chat');
    setIsTyping(true);

    setTimeout(() => {
      // Mock image analysis - in real app, this would use AI/ML
      const randomRecipe = recipeDatabase[Math.floor(Math.random() * recipeDatabase.length)];
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: Based on your image, I think you might be interested in this recipe!,
        recipes: [randomRecipe],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      setUploadedImage(null);
    }, 2000);
  };

  const RecipeCard = ({ recipe, isExpanded = false }) => (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="relative">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 flex space-x-2">
          <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
            <Heart className="h-4 w-4 text-red-500" />
          </button>
          <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
            <Bookmark className="h-4 w-4 text-blue-500" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full">
            {recipe.cuisine}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{recipe.title}</h3>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">{recipe.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {recipe.cookTime}
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {recipe.servings}
            </div>
            <div className="flex items-center">
              <ChefHat className="h-4 w-4 mr-1" />
              {recipe.difficulty}
            </div>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
            <span className="text-sm text-gray-600 font-medium">{recipe.rating}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients:</h4>
          <div className="flex flex-wrap gap-1">
            {recipe.ingredients.slice(0, 4).map((ingredient, index) => (
              <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                {ingredient.split(',')[0]}
              </span>
            ))}
            {recipe.ingredients.length > 4 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{recipe.ingredients.length - 4} more
              </span>
            )}
          </div>
        </div>
        
        <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-lg transition-all duration-300 font-medium">
          View Full Recipe
        </button>
      </div>
    </div>
  );

  const ChatInterface = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl mr-3">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">RecipeBot</h1>
                <p className="text-sm text-gray-500">Your AI Cooking Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentPage('upload')}
              className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <Camera className="h-4 w-4 mr-2" />
              Upload Image
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6 mb-24">
          {messages.map((message) => (
            <div key={message.id} className={flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}}>
              <div className={flex items-start space-x-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}}>
                <div className={p-2 rounded-full ${message.type === 'user' ? 'bg-blue-500' : 'bg-gradient-to-r from-orange-500 to-red-500'}}>
                  {message.type === 'user' ? 
                    <User className="h-4 w-4 text-white" /> : 
                    <Bot className="h-4 w-4 text-white" />
                  }
                </div>
                
                <div className={rounded-2xl px-4 py-3 ${message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-white shadow-md border border-gray-100'}}>
                  {message.image && (
                    <img src={message.image} alt="Uploaded food" className="w-48 h-32 object-cover rounded-lg mb-3" />
                  )}
                  
                  <p className={${message.type === 'user' ? 'text-white' : 'text-gray-800'} mb-2}>
                    {message.content}
                  </p>
                  
                  {message.recipes && (
                    <div className="mt-4 space-y-4">
                      {message.recipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                      ))}
                    </div>
                  )}
                  
                  <div className={text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-400'}}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white rounded-2xl px-4 py-3 shadow-md border border-gray-100">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <textarea
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about any recipe... (e.g., 'How to make pasta?')"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows="1"
                />
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors ${isListening ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
              </div>
              
              <button
                onClick={() => handleSendMessage()}
                disabled={!searchQuery.trim()}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            
            {isListening && (
              <div className="mt-3 text-center">
                <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-full">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                  Listening for your recipe request...
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const UploadPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <button
            onClick={() => setCurrentPage('chat')}
            className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors mx-auto"
          >
            <X className="h-4 w-4 mr-2" />
            Back to Chat
          </button>
          <div className="flex items-center justify-center mb-4">
            <Camera className="h-8 w-8 text-purple-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">Food Image Analysis</h1>
          </div>
          <p className="text-gray-600">Upload a photo of your food and I'll suggest recipes!</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!uploadedImage ? (
            <div className="border-2 border-dashed border-purple-300 rounded-xl p-12 text-center hover:border-purple-400 transition-colors">
              <Upload className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Drop your food image here</h3>
              <p className="text-gray-500 mb-6">or click to browse from your device</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105"
              >
                Choose Image
              </label>
            </div>
          ) : (
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <img
                  src={uploadedImage}
                  alt="Uploaded food"
                  className="max-w-full h-64 object-cover rounded-xl shadow-lg"
                />
                <button
                  onClick={() => setUploadedImage(null)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={analyzeImage}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 mr-4"
                >
                  Analyze & Get Recipes
                </button>
                
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="file-upload-new"
                  />
                  <label
                    htmlFor="file-upload-new"
                    className="inline-block px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg cursor-pointer transition-colors"
                  >
                    Choose Different Image
                  </label>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Supported formats: JPG, PNG, GIF • Max size: 10MB</p>
          </div>
        </div>
      </div>
    </div>
  );

  return currentPage === 'chat' ? <ChatInterface /> : <UploadPage />;
};

export default RecipeChatBot;