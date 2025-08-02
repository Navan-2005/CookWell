import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Groceries = (props) => {
  const [groceryList, setGroceryList] = useState([]);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchGroceryList = async () => {
      try {
        const response = await axios.post( `${import.meta.env.VITE_API_URL}/user/allgrocery`, {
          userId: user._id,
        });
        setGroceryList(response.data.groceryList || []);
      } catch (error) {
        console.error('Error fetching grocery list:', error);
      }
    };

    if (user?._id) {
      fetchGroceryList();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white">
      <div className="container mx-auto px-8 py-12 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            🛒 Grocery List
          </h1>
          <p className="text-blue-300 text-lg">
            {groceryList.length > 0 ? `${groceryList.length} items in your list` : 'Your grocery list'}
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-[#1E293B]/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700 p-8">
          {groceryList.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">🥕</div>
              <p className="text-blue-300 text-xl mb-4">Your grocery list is empty</p>
              <p className="text-slate-400">Add some items to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {groceryList.map((item, index) => (
                <div
                  key={index}
                  className="group bg-[#334155] hover:bg-[#475569] transition-all duration-300 p-6 rounded-xl shadow-lg border border-slate-600 hover:border-blue-400 hover:shadow-blue-500/20 cursor-pointer transform hover:scale-105"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="capitalize text-xl font-semibold text-blue-100 group-hover:text-white transition-colors">
                      {item.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-400">Qty</span>
                      <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full font-medium text-sm">
                        {item.quantity}
                      </span>
                    </div>
                  </div>
                  
                  {/* Optional: Add category or notes if available */}
                  {item.category && (
                    <div className="mt-3 pt-3 border-t border-slate-600">
                      <span className="text-xs text-slate-400 uppercase tracking-wide">
                        {item.category}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {groceryList.length > 0 && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-6 bg-[#334155]/50 backdrop-blur-sm rounded-full px-6 py-3 border border-slate-600">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm text-slate-300">Total Items: {groceryList.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-sm text-slate-300">
                  Total Quantity: {groceryList.reduce((sum, item) => sum + parseInt(item.quantity || 0), 0)}
                </span>
              </div>
            </div>
            <div>
                <div>
                  <span className="text-sm text-slate-300">Add Groceries to your list         </span>
                  <span className="text-sm text-slate-300"><a href="/grocery">click here </a></span>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Groceries;