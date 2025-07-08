import React, { useState ,useRef} from 'react';
import { Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useGSAP } from '@gsap/react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useSelector } from 'react-redux';
import Groceries from './Groceries';

const GroceryListApp = () => {
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState('fruits');
  const [panelOpen,setPanel]=useState(false);
  const {user}=useSelector(state=>state.user);
  const panelRef = useRef(null)
  const navigate = useNavigate();
  const groceryItems = {
    fruits: [
      { id: 1, name: 'Apple', price: 120, unit: 'kg' },
      { id: 2, name: 'Banana', price: 60, unit: 'dozen' },
      { id: 3, name: 'Orange', price: 80, unit: 'kg' },
      { id: 4, name: 'Mango', price: 150, unit: 'kg' },
      { id: 5, name: 'Grapes', price: 100, unit: 'kg' },
      { id: 6, name: 'Pomegranate', price: 200, unit: 'kg' },
      { id: 7, name: 'Papaya', price: 40, unit: 'kg' },
      { id: 8, name: 'Pineapple', price: 50, unit: 'piece' },
      { id: 9, name: 'Watermelon', price: 30, unit: 'kg' },
      { id: 10, name: 'Muskmelon', price: 35, unit: 'kg' },
      { id: 11, name: 'Guava', price: 70, unit: 'kg' },
      { id: 12, name: 'Coconut', price: 25, unit: 'piece' },
      { id: 13, name: 'Kiwi', price: 300, unit: 'kg' },
      { id: 14, name: 'Dragon Fruit', price: 400, unit: 'kg' },
      { id: 15, name: 'Avocado', price: 250, unit: 'kg' },
      { id: 16, name: 'Strawberry', price: 180, unit: 'kg' },
      { id: 17, name: 'Blueberry', price: 500, unit: 'kg' },
      { id: 18, name: 'Custard Apple', price: 120, unit: 'kg' },
      { id: 19, name: 'Jackfruit', price: 60, unit: 'kg' },
      { id: 20, name: 'Lychee', price: 180, unit: 'kg' },
    ],
    vegetables: [
      { id: 21, name: 'Tomato', price: 40, unit: 'kg' },
      { id: 22, name: 'Onion', price: 30, unit: 'kg' },
      { id: 23, name: 'Potato', price: 25, unit: 'kg' },
      { id: 24, name: 'Carrot', price: 60, unit: 'kg' },
      { id: 25, name: 'Broccoli', price: 80, unit: 'kg' },
      { id: 26, name: 'Spinach', price: 20, unit: 'bunch' },
      { id: 27, name: 'Cauliflower', price: 40, unit: 'kg' },
      { id: 28, name: 'Cabbage', price: 35, unit: 'kg' },
      { id: 29, name: 'Bell Pepper', price: 120, unit: 'kg' },
      { id: 30, name: 'Cucumber', price: 45, unit: 'kg' },
      { id: 31, name: 'Eggplant', price: 50, unit: 'kg' },
      { id: 32, name: 'Okra', price: 60, unit: 'kg' },
      { id: 33, name: 'Green Beans', price: 80, unit: 'kg' },
      { id: 34, name: 'Peas', price: 100, unit: 'kg' },
      { id: 35, name: 'Radish', price: 30, unit: 'kg' },
      { id: 36, name: 'Beetroot', price: 55, unit: 'kg' },
      { id: 37, name: 'Sweet Potato', price: 45, unit: 'kg' },
      { id: 38, name: 'Ginger', price: 200, unit: 'kg' },
      { id: 39, name: 'Garlic', price: 300, unit: 'kg' },
      { id: 40, name: 'Green Chili', price: 150, unit: 'kg' },
      { id: 41, name: 'Coriander', price: 40, unit: 'bunch' },
      { id: 42, name: 'Mint', price: 30, unit: 'bunch' },
      { id: 43, name: 'Fenugreek', price: 35, unit: 'bunch' },
      { id: 44, name: 'Mushroom', price: 180, unit: 'kg' },
      { id: 45, name: 'Zucchini', price: 90, unit: 'kg' },
    ],
    others: [
      { id: 46, name: 'Rice', price: 50, unit: 'kg' },
      { id: 47, name: 'Wheat Flour', price: 45, unit: 'kg' },
      { id: 48, name: 'Cooking Oil', price: 180, unit: 'liter' },
      { id: 49, name: 'Sugar', price: 40, unit: 'kg' },
      { id: 50, name: 'Salt', price: 20, unit: 'kg' },
      { id: 51, name: 'Milk', price: 60, unit: 'liter' },
      { id: 52, name: 'Yogurt', price: 70, unit: 'kg' },
      { id: 53, name: 'Paneer', price: 300, unit: 'kg' },
      { id: 54, name: 'Butter', price: 450, unit: 'kg' },
      { id: 55, name: 'Cheese', price: 400, unit: 'kg' },
      { id: 56, name: 'Eggs', price: 6, unit: 'piece' },
      { id: 57, name: 'Chicken', price: 200, unit: 'kg' },
      { id: 58, name: 'Fish', price: 250, unit: 'kg' },
      { id: 59, name: 'Mutton', price: 600, unit: 'kg' },
      { id: 60, name: 'Lentils (Dal)', price: 120, unit: 'kg' },
      { id: 61, name: 'Chickpeas', price: 80, unit: 'kg' },
      { id: 62, name: 'Kidney Beans', price: 160, unit: 'kg' },
      { id: 63, name: 'Black Beans', price: 140, unit: 'kg' },
      { id: 64, name: 'Basmati Rice', price: 120, unit: 'kg' },
      { id: 65, name: 'Brown Rice', price: 90, unit: 'kg' },
      { id: 66, name: 'Oats', price: 80, unit: 'kg' },
      { id: 67, name: 'Quinoa', price: 400, unit: 'kg' },
      { id: 68, name: 'Pasta', price: 100, unit: 'kg' },
      { id: 69, name: 'Bread', price: 30, unit: 'loaf' },
      { id: 70, name: 'Biscuits', price: 50, unit: 'pack' },
      { id: 71, name: 'Tea', price: 300, unit: 'kg' },
      { id: 72, name: 'Coffee', price: 400, unit: 'kg' },
      { id: 73, name: 'Honey', price: 250, unit: 'kg' },
      { id: 74, name: 'Almonds', price: 700, unit: 'kg' },
      { id: 75, name: 'Cashews', price: 800, unit: 'kg' },
    ],
  };

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(cartItem =>
        cartItem.id === itemId
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      ));
    } else {
      setCart(cart.filter(cartItem => cartItem.id !== itemId));
    }
  };

  const deleteFromCart = (itemId) => {
    setCart(cart.filter(cartItem => cartItem.id !== itemId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const addtocart=async()=>{
    console.log('Cart : ',cart);
    try {
      const response=await axios.post('http://localhost:3000/user/updategrocery',{
        grocery:cart,
        userId:user._id
      });
      console.log('response : ',response.data);
    } catch (error) {
      console.log('Error in adding to cart : ',error.message);
    }
  }

  useGSAP(function () {
        if (panelOpen) {
            gsap.to(panelRef.current, {
                height: '90%',
                padding: 0
                // opacity:1
            })
            // gsap.to(panelCloseRef.current, {
            //     opacity: 1
            // })
        } else {
            gsap.to(panelRef.current, {
                height: '0%',
                padding: 0
                // opacity:0
            })
            // gsap.to(panelCloseRef.current, {
            //     opacity: 0
            // })
        }
    }, [ panelOpen ])

  const renderItems = (items) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 hover:shadow-xl hover:border-blue-500 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-white">{item.name}</h3>
              {/* <span className="text-lg font-bold text-green-400">₹{item.price}</span> */}
            </div>
            {/* <p className="text-sm text-gray-400 mb-3">per {item.unit}</p> */}
            <button
              onClick={() => addToCart(item)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Plus size={16} />
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">🛒 Grocery Store</h1>
            <div onClick={()=>navigate('/groceries')} className="hover:cursor-pointer transform-border flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg">
              <ShoppingCart size={22} />
              <span className="font-semibold">your cart</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Products Section */}
          <div className="lg:col-span-3">
            {/* Category Tabs */}
            <div className="flex space-x-1 mb-6 bg-gray-800 p-1 rounded-lg border border-gray-700">
              {Object.keys(groceryItems).map(category => (
                <button
                  key={category}
                  onClick={() => setActiveTab(category)}
                  className={`flex-1 py-3 px-6 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white mb-6 capitalize flex items-center gap-2">
                <span className="text-blue-400">
                  {activeTab === 'fruits' ? '🍎' : activeTab === 'vegetables' ? '🥬' : '🛍'}
                </span>
                {activeTab}
              </h2>
              {renderItems(groceryItems[activeTab])}
            </div>
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 sticky top-4 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <ShoppingCart size={20} className="text-blue-400" />
                Shopping Cart
              </h2>
              
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-gray-400">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-md border border-gray-600">
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{item.name}</h4>
                          <p className="text-sm text-gray-400">₹{item.price} per {item.unit}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 text-red-400 hover:bg-red-600 hover:text-white rounded transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-medium text-white">{item.quantity}</span>
                          <button
                            onClick={() => addToCart(item)}
                            className="p-1 text-green-400 hover:bg-green-600 hover:text-white rounded transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                          <button
                            onClick={() => deleteFromCart(item.id)}
                            className="p-1 text-red-400 hover:bg-red-600 hover:text-white rounded ml-2 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-600 pt-6">
                    <div className="bg-gradient-to-r from-green-600 to-blue-600 p-4 rounded-lg mb-4 flex flex-col">
                      <button className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-white">Total Quantity: {getCartItemCount()}</span>
                        {/* <span className="text-2xl font-bold text-white">  {getCartItemCount()}</span> */}
                      </button>
                      <button onClick={()=>addtocart()} className="flex justify-between mt-2 items-center">
                        <span className="flex justify-center ml-6 text-lg font-semibold text-white">Add To Cart</span>
                        {/* <span className="text-2xl font-bold text-white">  {getCartItemCount()}</span> */}
                      </button>
                    </div>

                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroceryListApp;