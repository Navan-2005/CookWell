// src/pages/RecipeDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function RecipeDetails() {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        setLoading(true);
        
        // First, try to get the recipe from favorites
        const favoritesResponse = await axios.post(`${import.meta.env.VITE_API_URL}/user/getfavourites`, {
          userId: user._id
        });
        
        const favoriteRecipe = favoritesResponse.data.response?.find(
          fav => fav.recipeId === recipeId || fav._id === recipeId
        );

        console.log('favoriteRecipe : ', favoriteRecipe);
        
        if (favoriteRecipe) {
          setRecipe(favoriteRecipe);
          setIsFavorite(true);
        } else {
          // If not in favorites, fetch from main recipes API
          // You'll need to replace this with your actual recipe API endpoint
          const recipeResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/recipes/${recipeId}`);
          setRecipe(recipeResponse.data);
          setIsFavorite(false);
        }
        
        setError(null);
      } catch (error) {
        console.error('Error fetching recipe details:', error);
        setError('Failed to load recipe details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user && recipeId) {
      fetchRecipeDetails();
    }
  }, [recipeId, user]);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        // Remove from favorites
        await axios.post(`${import.meta.env.VITE_API_URL}/user/removefavorite`, {
          userId: user._id,
          recipeId: recipe.recipeId || recipe._id
        });
        setIsFavorite(false);
      } else {
        // Add to favorites
        await axios.post(`${import.meta.env.VITE_API_URL}/user/addfavorite`, {
          userId: user._id,
          recipeId: recipe._id,
          recipe: recipe
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading recipe...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Recipe not found.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
        >
          ← Back
        </button>
        
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold mb-4 flex-1">{recipe.title}</h1>
          
          <button
            onClick={toggleFavorite}
            className={`ml-4 px-4 py-2 rounded-lg transition-colors ${
              isFavorite
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            {isFavorite ? '❤️ Favorited' : '🤍 Add to Favorites'}
          </button>
        </div>
        
        {recipe.savedAt && (
          <p className="text-gray-500 text-sm mb-4">
            Saved on {new Date(recipe.savedAt).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Recipe Image */}
      {recipe.image && (
        <div className="mb-8">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ingredients */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-green-600">Ingredients</h2>
          <div className="space-y-2">
            {recipe.ingredients?.map((ingredient, index) => (
              <div key={index} className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">•</span>
                <span className="text-gray-700 dark:text-gray-300">
                  {ingredient.replace(/^\*\s*/, '')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">Instructions</h2>
          <div className="space-y-4">
            {recipe.steps?.map((step, index) => (
              <div key={index} className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1 flex-shrink-0">
                  {index + 1}
                </span>
                <div className="text-gray-700 dark:text-gray-300">
                  {step.replace(/^\d+\.\s*\*?\s*/, '').replace(/^\*\s*/, '')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recipe Info */}
      <div className="mt-8 bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Recipe Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {recipe.ingredients?.length || 0}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Ingredients</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {recipe.steps?.length || 0}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Steps</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {isFavorite ? '❤️' : '🤍'}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              {isFavorite ? 'Favorited' : 'Not Favorited'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}