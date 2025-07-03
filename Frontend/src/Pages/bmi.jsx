import { useState } from 'react';

<<<<<<< HEAD
export default function BMICalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');

  const calculateBMI = () => {
    if (weight && height) {
      const weightNum = parseFloat(weight);
      const heightNum = parseFloat(height);
      
      if (weightNum > 0 && heightNum > 0) {
        // Calculate BMI: weight (kg) / height (m)²
        const bmiValue = weightNum / (heightNum * heightNum);
        setBmi(bmiValue.toFixed(1));
        
        // Determine category
        if (bmiValue < 18.5) {
          setCategory('Underweight');
        } else if (bmiValue >= 18.5 && bmiValue < 25) {
          setCategory('Normal weight');
        } else if (bmiValue >= 25 && bmiValue < 30) {
          setCategory('Overweight');
        } else {
          setCategory('Obese');
        }
      }
    }
  };

  const reset = () => {
    setWeight('');
    setHeight('');
    setBmi(null);
    setCategory('');
  };

  const getCategoryColor = () => {
    switch (category) {
      case 'Underweight':
        return 'text-blue-600';
      case 'Normal weight':
        return 'text-green-600';
      case 'Overweight':
        return 'text-orange-600';
      case 'Obese':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };
=======
export default function BMI() {
  const [selectedGender, setSelectedGender] = useState('male');
>>>>>>> 6ad258c2c49f402f1a457477df959b421a0a257c

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        BMI Calculator
      </h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weight (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter your weight"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Height (m)
          </label>
          <input
            type="number"
            step="0.01"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Enter your height (e.g., 1.75)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
<<<<<<< HEAD
        
        <div className="flex space-x-3">
          <button
            onClick={calculateBMI}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          >
            Calculate BMI
          </button>
          <button
            onClick={reset}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
          >
            Reset
          </button>
=======
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
>>>>>>> 6ad258c2c49f402f1a457477df959b421a0a257c
        </div>
      </div>
      
      {bmi && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Result:</h2>
          <p className="text-2xl font-bold text-blue-600 mb-1">
            BMI: {bmi}
          </p>
          <p className={`text-lg font-medium ${getCategoryColor()}`}>
            Category: {category}
          </p>
          
          <div className="mt-4 text-sm text-gray-600">
            <h3 className="font-medium mb-2">BMI Categories:</h3>
            <ul className="space-y-1">
              <li className="text-blue-600">Underweight: Below 18.5</li>
              <li className="text-green-600">Normal weight: 18.5 - 24.9</li>
              <li className="text-orange-600">Overweight: 25 - 29.9</li>
              <li className="text-red-600">Obese: 30 and above</li>
            </ul>
          </div>
        </div>
<<<<<<< HEAD
      )}
=======

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
>>>>>>> 6ad258c2c49f402f1a457477df959b421a0a257c
    </div>
  );
}