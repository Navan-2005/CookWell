import React, { useState } from 'react';
import { Heart, Users, Share2, Star, Clock, ChefHat } from 'lucide-react';

const CommunityPage = () => {
  const allRecipes = {
    "Navan": [
      {
        id: 1,
        name: "Mysore Masala Dosa",
        author: "Navan",
        likes: 24,
        time: "30 mins",
        difficulty: "Medium",
        isLiked: false,
        tags: ["South Indian", "Breakfast", "Vegetarian"]
      },
      {
        id: 3,
        name: "Rava Upma",
        author: "Navan",
        likes: 12,
        time: "15 mins",
        difficulty: "Easy",
        isLiked: false,
        tags: ["South Indian", "Breakfast", "Quick"]
      },
      {
        id: 5,
        name: "Chole Bhature",
        author: "Navan",
        likes: 27,
        time: "60 mins",
        difficulty: "Hard",
        isLiked: false,
        tags: ["North Indian", "Lunch", "Vegetarian"]
      },
      {
        id: 7,
        name: "Bisi Bele Bath",
        author: "Navan",
        likes: 19,
        time: "50 mins",
        difficulty: "Medium",
        isLiked: true,
        tags: ["South Indian", "Lunch", "Traditional"]
      }
    ],
    "Samanvi": [
      {
        id: 2,
        name: "Butter Chicken Curry",
        author: "Samanvi",
        likes: 18,
        time: "45 mins",
        difficulty: "Easy",
        isLiked: true,
        tags: ["North Indian", "Dinner", "Non-Veg"]
      },
      {
        id: 4,
        name: "Paneer Tikka Masala",
        author: "Samanvi",
        likes: 31,
        time: "40 mins",
        difficulty: "Medium",
        isLiked: true,
        tags: ["North Indian", "Vegetarian", "Dinner"]
      },
      {
        id: 6,
        name: "Sambar Rice",
        author: "Samanvi",
        likes: 15,
        time: "35 mins",
        difficulty: "Easy",
        isLiked: false,
        tags: ["South Indian", "Lunch", "Comfort Food"]
      },
      {
        id: 8,
        name: "Hyderabadi Biryani",
        author: "Samanvi",
        likes: 42,
        time: "90 mins",
        difficulty: "Hard",
        isLiked: true,
        tags: ["South Indian", "Dinner", "Non-Veg", "Special"]
      }
    ]
  };

  const [selectedPerson, setSelectedPerson] = useState('Navan');
  const [recipes, setRecipes] = useState(allRecipes[selectedPerson]);
  const [newRecipe, setNewRecipe] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('Navan');

  const handlePersonSelect = (person) => {
    setSelectedPerson(person);
    setRecipes(allRecipes[person]);
  };

  const handleLike = (id) => {
    const updatedRecipes = recipes.map(recipe => 
      recipe.id === id 
        ? { ...recipe, isLiked: !recipe.isLiked, likes: recipe.isLiked ? recipe.likes - 1 : recipe.likes + 1 }
        : recipe
    );
    setRecipes(updatedRecipes);
    allRecipes[selectedPerson] = updatedRecipes;
  };

  const handleAddRecipe = () => {
    if (newRecipe.trim()) {
      const newId = Math.max(...Object.values(allRecipes).flat().map(r => r.id)) + 1;
      const newRecipeObj = {
        id: newId,
        name: newRecipe,
        author: selectedAuthor,
        likes: 0,
        time: "-- mins",
        difficulty: "Medium",
        isLiked: false,
        tags: ["New Recipe"]
      };
      
      if (selectedAuthor === selectedPerson) {
        const updatedRecipes = [...recipes, newRecipeObj];
        setRecipes(updatedRecipes);
        allRecipes[selectedPerson] = updatedRecipes;
      } else {
        allRecipes[selectedAuthor] = [...allRecipes[selectedAuthor], newRecipeObj];
      }
      setNewRecipe('');
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'text-emerald-400';
      case 'Medium': return 'text-amber-400';
      case 'Hard': return 'text-rose-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ChefHat className="w-8 h-8 text-orange-400" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
                Recipe Community
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-slate-300">
                <Users className="w-5 h-5" />
                <span className="text-sm">2 Active Members</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar - Contacts */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-slate-100">
                <Users className="w-5 h-5 mr-2 text-blue-400" />
                Community Members
              </h2>
              <div className="space-y-3">
                <div 
                  onClick={() => handlePersonSelect('Navan')}
                  className={`flex items-center space-x-3 rounded-lg px-4 py-3 transition-all duration-200 cursor-pointer border ${
                    selectedPerson === 'Navan' 
                      ? 'bg-blue-600/20 border-blue-500/50 hover:bg-blue-600/30' 
                      : 'bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                    N
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-100">Navan</p>
                    <p className="text-xs text-slate-400">
                      {allRecipes['Navan'].length} favorites
                    </p>
                  </div>
                </div>
                <div 
                  onClick={() => handlePersonSelect('Samanvi')}
                  className={`flex items-center space-x-3 rounded-lg px-4 py-3 transition-all duration-200 cursor-pointer border ${
                    selectedPerson === 'Samanvi' 
                      ? 'bg-pink-600/20 border-pink-500/50 hover:bg-pink-600/30' 
                      : 'bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                    S
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-100">Samanvi</p>
                    <p className="text-xs text-slate-400">
                      {allRecipes['Samanvi'].length} favorites
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1">
            {/* Add Recipe Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 mb-8 shadow-xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center text-slate-100">
                <Share2 className="w-6 h-6 mr-3 text-emerald-400" />
                Share Your Favorite Recipe
              </h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <select 
                    value={selectedAuthor} 
                    onChange={(e) => setSelectedAuthor(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer min-w-[120px]"
                  >
                    <option value="Navan">Navan</option>
                    <option value="Samanvi">Samanvi</option>
                  </select>
                </div>
                <input
                  type="text"
                  value={newRecipe}
                  onChange={(e) => setNewRecipe(e.target.value)}
                  placeholder="Enter your favorite recipe name..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-5 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                />
                <button
                  onClick={handleAddRecipe}
                  className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25 text-white"
                >
                  Share Recipe
                </button>
              </div>
            </div>

            {/* Favorites Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                  {selectedPerson}'s Favorite Recipes
                </h3>
                <div className="flex items-center space-x-2 bg-slate-800 border border-slate-700 rounded-full px-4 py-2">
                  <div className={`w-3 h-3 rounded-full ${selectedPerson === 'Navan' ? 'bg-blue-500' : 'bg-pink-500'}`}></div>
                  <span className="text-sm text-slate-300">{recipes.length} recipes</span>
                </div>
              </div>
              <p className="text-slate-400 text-lg">
                Discover {selectedPerson === 'Navan' ? 'his' : 'her'} collection of delicious recipes
              </p>
            </div>

            {/* Recipe Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:bg-slate-800 hover:border-slate-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${
                        recipe.author === 'Navan' 
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                          : 'bg-gradient-to-br from-pink-500 to-rose-600'
                      }`}>
                        {recipe.author[0]}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-100">{recipe.author}</span>
                        <p className="text-xs text-slate-500">Recipe Creator</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleLike(recipe.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-200 transform hover:scale-110 ${
                        recipe.isLiked 
                          ? 'text-rose-400 bg-rose-500/10 hover:bg-rose-500/20' 
                          : 'text-slate-500 hover:text-rose-400 hover:bg-rose-500/10'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${recipe.isLiked ? 'fill-current' : ''}`} />
                      <span className="text-sm font-medium">{recipe.likes}</span>
                    </button>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 text-slate-100 leading-tight">{recipe.name}</h3>
                  
                  <div className="flex items-center space-x-6 mb-4">
                    <div className="flex items-center space-x-2 text-slate-300">
                      <Clock className="w-5 h-5 text-blue-400" />
                      <span className="text-sm font-medium">{recipe.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-amber-400" />
                      <span className={`text-sm font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                        {recipe.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-slate-800 border border-slate-700 text-xs font-medium rounded-full text-slate-300 hover:bg-slate-700 hover:border-slate-600 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;