// src/pages/Favorites.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

export default function Favorites() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.user);

  // Fixed useEffect - removed async from useEffect callback
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user || !user._id) {
        setLoading(false);
        setError('User not found. Please login again.');
        return;
      }

      try {
        setLoading(true);
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/getfavourites`, {
          userId: user._id
        });
        
        console.log('response : ', response.data.response);
        setFavorites(response.data.response || []);
        setError(null);
      } catch (error) {
        console.log('Error fetching favorites : ', error);
        setError('Failed to fetch favorites. Please try again.');
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]); // Added dependency array

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-xl text-gray-600 dark:text-gray-300">Loading your favorite recipes...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Your Favorite Recipes
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover and revisit the recipes that make your taste buds dance
          </p>
        </div>
        
        {/* Stats Bar */}
        {favorites.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex justify-center items-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{favorites.length}</div>
                <div className="text-gray-600 dark:text-gray-300">Favorite Recipes</div>
              </div>
              <div className="h-12 w-px bg-gray-200 dark:bg-gray-600"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {favorites.reduce((total, recipe) => total + (recipe.ingredients?.length || 0), 0)}
                </div>
                <div className="text-gray-600 dark:text-gray-300">Total Ingredients</div>
              </div>
              <div className="h-12 w-px bg-gray-200 dark:bg-gray-600"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {favorites.reduce((total, recipe) => total + (recipe.steps?.length || 0), 0)}
                </div>
                <div className="text-gray-600 dark:text-gray-300">Total Steps</div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg mb-8 shadow-md">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold">Oops! Something went wrong</h3>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {favorites.length === 0 && !loading && !error && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                No favorite recipes yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Start building your collection of amazing recipes by exploring our recipe library
              </p>
              <Link 
                to="/recipe" 
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Discover Recipes
              </Link>
            </div>
          </div>
        )}

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {favorites.map((recipe) => (
            <Link
              key={recipe._id}
              to={`/recipe/${recipe.recipeId || recipe._id}`}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
            >
              {/* Recipe Image */}
              <div className="relative overflow-hidden">
                <img
                  src={recipe.image || '/placeholder.jpg'}
                  alt={recipe.title}
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Favorite Badge */}
                <div className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 shadow-lg">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>

                {/* Recipe Stats Overlay */}
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center bg-white/90 rounded-full px-3 py-1">
                      <svg className="w-4 h-4 text-green-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-800">
                        {recipe.ingredients?.length || 0} ingredients
                      </span>
                    </div>
                    <div className="flex items-center bg-white/90 rounded-full px-3 py-1">
                      <svg className="w-4 h-4 text-blue-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-800">
                        {recipe.steps?.length || 0} steps
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recipe Content */}
              <div className="p-6">
                <h3 className="font-bold text-xl mb-3 text-gray-800 dark:text-gray-200 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
                  {recipe.title}
                </h3>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">
                      {new Date(recipe.savedAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-orange-600">
                    <span className="text-sm font-semibold">View Recipe</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(((recipe.ingredients?.length || 0) / 20) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Back to Top Button */}
        {favorites.length > 6 && (
          <div className="fixed bottom-8 right-8">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}