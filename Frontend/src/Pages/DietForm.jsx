import React, { useState } from 'react';
import { Calendar, Scale, Ruler, Activity, Target, Sparkles, Leaf, LoaderCircle, ChevronDown, ChevronUp, FileText, Calculator, Apple, TrendingUp, AlertCircle } from 'lucide-react';

const DietForm = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: '',
    goal: '',
    diet: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [dietPlan, setDietPlan] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Sending form data:', formData);
      
      const response = await fetch('http://localhost:3000/ai/get-diet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({user:formData}),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to generate diet plan: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Received data:', data);
      
      // Handle different possible response formats
      if (data.dietPlan) {
        setDietPlan(data.dietPlan);
      } else if (data.plan) {
        setDietPlan(data.plan);
      } else if (data.message) {
        setDietPlan(data.message);
      } else if (typeof data === 'string') {
        setDietPlan(data);
      } else {
        console.error('Unexpected response format:', data);
        setDietPlan(JSON.stringify(data, null, 2));
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formFields = [
    { name: 'age', label: 'Age', type: 'number', icon: Calendar, placeholder: 'Enter your age' },
    { name: 'gender', label: 'Gender', type: 'select', icon: Calendar, options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' }
    ]},
    { name: 'height', label: 'Height (cm)', type: 'number', icon: Ruler, placeholder: 'Enter height in cm' },
    { name: 'weight', label: 'Weight (kg)', type: 'number', icon: Scale, placeholder: 'Enter weight in kg' },
    { name: 'activityLevel', label: 'Activity Level', type: 'select', icon: Activity, options: [
      { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
      { value: 'light', label: 'Lightly active (light exercise 1-3 days/week)' },
      { value: 'moderate', label: 'Moderately active (3-5 days/week)' },
      { value: 'active', label: 'Very active (6-7 days/week)' },
      { value: 'extra', label: 'Extra active (twice/day, physical job)' }
    ]},
    { name: 'goal', label: 'Primary Goal', type: 'select', icon: Target, options: [
      { value: 'lose', label: 'Lose Weight' },
      { value: 'maintain', label: 'Maintain Weight' },
      { value: 'gain', label: 'Gain Muscle' }
    ]},
    { name: 'diet', label: 'Diet Preference', type: 'select', icon: Leaf, options: [
      { value: 'non-vegetarian', label: 'Non-vegetarian' },
      { value: 'vegetarian', label: 'Vegetarian' },
      { value: 'vegan', label: 'Vegan' }
    ]}
  ];

  const isFormValid = Object.values(formData).every(value => value !== '');

  // Enhanced Diet Plan Display Component
  const DietPlanDisplay = ({ plan }) => {
    const [expandedSections, setExpandedSections] = useState({});

    const toggleSection = (section) => {
      setExpandedSections(prev => ({
        ...prev,
        [section]: !prev[section]
      }));
    };

    const parseContent = (text) => {
      if (!text) return [];
      
      const textStr = typeof text === 'string' ? text : JSON.stringify(text, null, 2);
      const lines = textStr.split('\n');
      const sections = [];
      let currentSection = null;
      
      lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        
        // Check for main headers (## or numbered sections)
        if (trimmedLine.match(/^##\s+\d+\.\s+/) || trimmedLine.match(/^##\s+[A-Z]/)) {
          if (currentSection) {
            sections.push(currentSection);
          }
          currentSection = {
            title: trimmedLine.replace(/^##\s*\d*\.\s*/, '').replace(/^##\s*/, ''),
            content: [],
            type: 'main'
          };
        }
        // Check for sub-headers (###)
        else if (trimmedLine.startsWith('###')) {
          if (currentSection) {
            currentSection.content.push({
              type: 'subheader',
              text: trimmedLine.replace(/^###\s*/, '')
            });
          }
        }
        // Check for day headers (Day X:)
        else if (trimmedLine.match(/^Day\s+\d+:/)) {
          if (currentSection) {
            currentSection.content.push({
              type: 'day',
              text: trimmedLine
            });
          }
        }
        // Check for meal headers (Breakfast:, Lunch:, etc.)
        else if (trimmedLine.match(/^\*\s+\*\*(Breakfast|Lunch|Dinner|Snack|Mid-Morning|Afternoon|Evening)/)) {
          if (currentSection) {
            currentSection.content.push({
              type: 'meal',
              text: trimmedLine.replace(/^\*\s+/, '').replace(/\*\*/g, '')
            });
          }
        }
        // Check for bullet points
        else if (trimmedLine.startsWith('*') && trimmedLine.length > 1) {
          if (currentSection) {
            currentSection.content.push({
              type: 'bullet',
              text: trimmedLine.replace(/^\*\s*/, '')
            });
          }
        }
        // Check for numbered lists
        else if (trimmedLine.match(/^\d+\.\s+/)) {
          if (currentSection) {
            currentSection.content.push({
              type: 'numbered',
              text: trimmedLine
            });
          }
        }
        // Regular text
        else if (trimmedLine.length > 0) {
          if (currentSection) {
            currentSection.content.push({
              type: 'text',
              text: trimmedLine
            });
          }
        }
      });
      
      if (currentSection) {
        sections.push(currentSection);
      }
      
      return sections;
    };

    const renderContent = (contentItem) => {
      switch (contentItem.type) {
        case 'subheader':
          return (
            <h4 className="text-lg font-semibold text-white mt-4 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              {contentItem.text}
            </h4>
          );
        case 'day':
          return (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg my-3">
              <h5 className="font-bold text-green-800 text-lg">{contentItem.text}</h5>
            </div>
          );
        case 'meal':
          return (
            <div className="bg-orange-50 p-3 rounded-lg my-2 border-l-4 border-orange-400">
              <h6 className="font-semibold text-orange-800">{contentItem.text}</h6>
            </div>
          );
        case 'bullet':
          return (
            <div className="ml-4 my-1 flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">{contentItem.text}</span>
            </div>
          );
        case 'numbered':
          return (
            <div className="ml-4 my-1 text-gray-700">{contentItem.text}</div>
          );
        case 'text':
          return (
            <p className="text-gray-700 my-2 leading-relaxed">{contentItem.text}</p>
          );
        default:
          return <p className="text-gray-700 my-2">{contentItem.text}</p>;
      }
    };

    const getSectionIcon = (title) => {
      if (title.toLowerCase().includes('disclaimer')) return AlertCircle;
      if (title.toLowerCase().includes('nutritional analysis')) return Calculator;
      if (title.toLowerCase().includes('meal plan')) return Apple;
      if (title.toLowerCase().includes('supplementation')) return FileText;
      if (title.toLowerCase().includes('lifestyle')) return Activity;
      if (title.toLowerCase().includes('progress')) return TrendingUp;
      return FileText;
    };

    const sections = parseContent(plan);

    return (
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Your Personalized Diet Plan</h1>
              <p className="text-lg text-white/90 mt-1">Scientifically crafted for your unique goals</p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">7</div>
              <div className="text-sm text-white/80">Days Planned</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">Custom</div>
              <div className="text-sm text-white/80">Nutrition</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">Balanced</div>
              <div className="text-sm text-white/80">Macros</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">Goal-Based</div>
              <div className="text-sm text-white/80">Approach</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-gray-50 border-b border-gray-200 p-4">
          <div className="flex flex-wrap gap-2">
            {sections.map((section, index) => (
              <button
                key={index}
                onClick={() => toggleSection(index)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  expandedSections[index] 
                    ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300' 
                    : 'bg-white text-white border-2 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {sections.map((section, index) => {
            const IconComponent = getSectionIcon(section.title);
            return (
              <div key={index} className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <button
                  onClick={() => toggleSection(index)}
                  className={`w-full p-6 flex items-center justify-between transition-all duration-300 ${
                    expandedSections[index] 
                      ? 'bg-gradient-to-r from-indigo-50 to-blue-50 border-b-2 border-indigo-200' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${
                      expandedSections[index] 
                        ? 'bg-indigo-100 text-indigo-600' 
                        : 'bg-white text-gray-600'
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-amber-300 text-left">{section.title}</h2>
                  </div>
                  <div className={`transform transition-transform duration-300 ${
                    expandedSections[index] ? 'rotate-180' : ''
                  }`}>
                    <ChevronDown className="w-6 h-6 text-gray-600" />
                  </div>
                </button>
                
                {expandedSections[index] && (
                  <div className="p-6 bg-white">
                    <div className="prose prose-sm max-w-none">
                      {section.content.map((item, contentIndex) => (
                        <div key={contentIndex}>
                          {renderContent(item)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-t-2 border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setDietPlan(null)}
              className="flex-1 py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Create New Plan
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 py-4 px-6 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Print Plan
            </button>
            <button
              onClick={() => {
                const element = document.querySelector('.prose');
                if (element) {
                  navigator.clipboard.writeText(element.textContent);
                  // You could add a toast notification here
                }
              }}
              className="flex-1 py-4 px-6 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Copy Text
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Test button to simulate backend response
  const testWithSampleData = () => {
    const sampleDietPlan = `**MEDICAL DISCLAIMER:**
The information provided in this personalized diet plan is for educational and informational purposes only and is not intended as medical advice.

---

## 1. NUTRITIONAL ANALYSIS

Based on your user profile:
* Age: 20 years
* Gender: Male
* Height: 170 cm
* Weight: 60 kg
* Activity Level: Moderately Active
* Primary Goal: Slim to fit
* Diet Preference: Vegetarian

### A. Basal Metabolic Rate (BMR) Calculation

Using the Mifflin-St Jeor Equation for males:
BMR = (10 * weight in kg) + (6.25 * height in cm) - (5 * age in years) + 5
**BMR = 1567.5 kcal**

### B. Total Daily Energy Expenditure (TDEE)

**TDEE = 2430 kcal**

## 2. PERSONALIZED 7-DAY MEAL PLAN

### Day 1: High Protein & Fiber Focus

* **Breakfast: Protein-Packed Berry Oat Bowl**
  * 1/2 cup Rolled Oats
  * 1.5 cups Unsweetened Almond Milk
  * 1 scoop Vegan Protein Powder
  * 1/2 cup Mixed Berries
  * Nutritional Info: 480 kcal | 35g protein | 60g carbs | 18g fats

* **Lunch: Chickpea & Spinach Curry with Brown Rice**
  * 1 cup Cooked Brown Rice
  * 1 can Chickpeas
  * 2 cups Fresh Spinach
  * Nutritional Info: 650 kcal | 22g protein | 95g carbs | 20g fats

### Day 2: Lentil Power

* **Breakfast:** Whole Wheat Toast with Avocado
* **Lunch:** Hearty Lentil Soup with Whole Wheat Roll
* **Dinner:** Veggie & Bean Burrito Bowl`;

    setDietPlan(sampleDietPlan);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-2xl">
          <LoaderCircle className="w-20 h-20 text-indigo-600 animate-spin mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Creating Your Perfect Diet Plan</h2>
          <p className="text-gray-600 mb-4">Our AI is analyzing your profile and crafting a personalized nutrition plan...</p>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4">
        <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6 bg-gray-50 p-3 rounded-lg">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => {
                setError(null);
                setDietPlan(null);
              }}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 font-semibold"
            >
              Try Again
            </button>
            <button
              onClick={testWithSampleData}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 font-semibold"
            >
              Test with Sample Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Diet Plan Display
  if (dietPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
        <DietPlanDisplay plan={dietPlan} />
      </div>
    );
  }

  // Form Display
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
      <div className="max-w-2xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Personalized Diet Plan</h1>
              <p className="text-indigo-100 mt-1">Tell us about yourself to get a customized nutrition plan</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="flex items-center justify-between text-sm text-gray-800 mb-3">
            <span className="font-medium">Form Progress</span>
            <span className="font-bold text-indigo-600">
              {Math.round(((Object.values(formData).filter(v => v !== '').length) / 7) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out shadow-inner"
              style={{ width: `${((Object.values(formData).filter(v => v !== '').length) / 7) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formFields.map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.name} className="space-y-2">
                  <label className="block text-gray-800 font-semibold flex items-center gap-2">
                    <Icon className="w-4 h-4 text-indigo-600" />
                    {field.label}
                  </label>
                  
                  {field.type === 'select' ? (
                    <select
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 hover:border-gray-400 text-gray-900 shadow-sm"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 hover:border-gray-400 text-gray-900 placeholder-gray-500 shadow-sm"
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-6 space-y-4">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                isFormValid 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white hover:shadow-xl' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isFormValid ? (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Generate My Diet Plan
                </span>
              ) : (
                'Complete All Fields'
              )}
            </button>
            
            {/* Test button for debugging */}
            <button
              onClick={testWithSampleData}
              className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 text-sm font-medium"
            >
              Test with Sample Data (Debug)
            </button>
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-700 bg-green-50 p-3 rounded-lg border border-green-200">
              🔒 Your information is secure and will only be used to create your personalized plan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietForm;