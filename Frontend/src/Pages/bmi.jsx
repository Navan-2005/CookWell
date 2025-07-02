import { useState } from 'react';

export default function BMI() {
  const [selectedGender, setSelectedGender] = useState('male');

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0 flex">
        {/* Left side - broccoli image */}
        <div className="w-1/3 h-full">
          <img 
            src="https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
            alt="Fresh broccoli" 
            className="w-full h-full object-cover opacity-70"
          />
        </div>
        
        {/* Right side - pizza image */}
        <div className="w-2/3 h-full">
          <img 
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
            alt="Delicious pizza" 
            className="w-full h-full object-cover opacity-60"
          />
        </div>
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center text-white">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-sm font-light tracking-[0.3em] text-gray-300 mb-4">
            SIMPLE
          </h1>
          <h2 className="text-5xl md:text-7xl font-bold tracking-wider mb-8">
            PERSONALISED
           
          </h2>
          <h2 className="text-5xl md:text-7xl font-bold tracking-wider mb-8">
            DIET
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-md mx-auto">
            Find out how much weight you'll lose with our diet
          </p>
        </div>

        {/* Gender Selection */}
        <div className="mb-8">
          <div className="flex items-center justify-center bg-gray-800 rounded-full p-2 border-2 border-green-500">
            <button
              onClick={() => setSelectedGender('male')}
              className={`flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 ${
                selectedGender === 'male' 
                  ? 'bg-white text-gray-800' 
                  : 'bg-transparent text-white hover:bg-gray-700'
              }`}
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M9 9C10.29 9 11.5 9.41 12.47 10.11L17.58 5H13V3H21V11H19V6.41L13.89 11.5C14.59 12.5 15 13.7 15 15C15 18.31 12.31 21 9 21S3 18.31 3 15 5.69 9 9 9M9 11C6.79 11 5 12.79 5 15S6.79 19 9 19 13 17.21 13 15 11.21 11 9 11Z"/>
              </svg>
            </button>
            
            <div className="w-px h-12 bg-gray-600 mx-4"></div>
            
            <button
              onClick={() => setSelectedGender('female')}
              className={`flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 ${
                selectedGender === 'female' 
                  ? 'bg-white text-gray-800' 
                  : 'bg-transparent text-white hover:bg-gray-700'
              }`}
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M12 4C9.21 4 7 6.21 7 9C7 11.79 9.21 14 12 14C14.79 14 17 11.79 17 9C17 6.21 14.79 4 12 4M12 6C13.68 6 15 7.32 15 9C15 10.68 13.68 12 12 12C10.32 12 9 10.68 9 9C9 7.32 10.32 6 12 6M21 21L19 19H13V17H19L21 15V21M11 16H13V19H15V21H13V22H11V21H9V19H11V16Z"/>
              </svg>
            </button>
          </div>
          
          <div className="flex justify-between items-center mt-4 px-4">
            <span className="text-sm text-gray-300">Male</span>
            <span className="text-sm text-gray-300">Female</span>
          </div>
        </div>

        {/* CTA Button */}
        <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-12 rounded-full text-lg tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mb-12">
          CHOOSE YOUR GENDER
        </button>

        {/* Disclaimer */}
        <div className="max-w-4xl mx-auto text-xs text-gray-400 space-y-2">
          <p>
            *Results vary depending on your starting point, goals, and effort.
            <br />
            The average participant can expect to lose 1-2 lbs/week.
          </p>
          <br />
          <p>© 2025 BMIFun. All rights reserved.</p>
          <p className="leading-relaxed">
            *Statements regarding your profile and the results of our quiz have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure or prevent any disease. You should consult with a medical professional before starting any diet or weight loss program.
          </p>
        </div>
      </div>
    </div>
  );
}