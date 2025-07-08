import React, { useState,useEffect } from 'react';
import { User, Scale, Ruler, Utensils } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function ProfilePage() {
  const {user}=useSelector(state=>state.user);
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    dietType: ''
  });

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [savedProfile, setSavedProfile] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    dietType: ''
  });

  const getprofile=async()=>{
    try {
      const response=await axios.post('http://localhost:3000/user/profile',{
        userId:user._id
      })
      console.log('response : ',response.data.user);
    } catch (error) {
      
    }
  }

  useEffect(()=>{
    getprofile();
  })

  const handleSaveProfile = () => {
    // Validate all required fields
    const newErrors = {};
    Object.keys(profile).forEach(key => {
      if (!profile[key]) {
        newErrors[key] = 'This field is required';
      }
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setSavedProfile({...profile});
    setIsEditing(false);
    console.log('Profile saved:', profile);
    alert('Profile saved successfully!');
  };

  const handleUpdateProfile = () => {
    setIsEditing(true);
    alert('Update mode enabled! You can now edit your profile.');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Text-only validation for name
    if (name === 'name') {
      const textOnlyRegex = /^[a-zA-Z\s]*$/;
      if (!textOnlyRegex.test(value)) {
        setErrors(prev => ({
          ...prev,
          name: 'Name should contain only letters and spaces'
        }));
        return;
      } else {
        setErrors(prev => ({
          ...prev,
          name: ''
        }));
      }
    }
    
    // Number validation for age, height, weight
    if (['age', 'height', 'weight'].includes(name)) {
      const numberRegex = /^\d*\.?\d*$/;
      if (!numberRegex.test(value)) {
        setErrors(prev => ({
          ...prev,
          [name]: 'Please enter numbers only'
        }));
        return;
      } else {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
    
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };



  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-center mb-8">
            <User className="w-12 h-12 text-blue-400 mr-4" />
            <h1 className="text-3xl font-bold text-white">User Profile</h1>
          </div>

          <div className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                disabled={!isEditing && savedProfile.name}
                className={`w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 ${
                  !isEditing && savedProfile.name ? 'bg-gray-800 cursor-not-allowed' : 'bg-gray-700'
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
            </div>

            {/* Age Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Age
              </label>
              <input
                type="text"
                name="age"
                value={profile.age}
                onChange={handleInputChange}
                disabled={!isEditing && savedProfile.age}
                className={`w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 ${
                  !isEditing && savedProfile.age ? 'bg-gray-800 cursor-not-allowed' : 'bg-gray-700'
                }`}
                placeholder="Enter your age"
              />
              {errors.age && <p className="mt-1 text-sm text-red-400">{errors.age}</p>}
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={profile.gender}
                onChange={handleInputChange}
                disabled={!isEditing && savedProfile.gender}
                className={`w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white ${
                  !isEditing && savedProfile.gender ? 'bg-gray-800 cursor-not-allowed' : 'bg-gray-700'
                }`}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
              {errors.gender && <p className="mt-1 text-sm text-red-400">{errors.gender}</p>}
            </div>

            {/* Height Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Ruler className="inline w-4 h-4 mr-1" />
                Height (cm)
              </label>
              <input
                type="text"
                name="height"
                value={profile.height}
                onChange={handleInputChange}
                disabled={!isEditing && savedProfile.height}
                className={`w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 ${
                  !isEditing && savedProfile.height ? 'bg-gray-800 cursor-not-allowed' : 'bg-gray-700'
                }`}
                placeholder="Enter your height in cm"
              />
              {errors.height && <p className="mt-1 text-sm text-red-400">{errors.height}</p>}
            </div>

            {/* Weight Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Scale className="inline w-4 h-4 mr-1" />
                Weight (kg)
              </label>
              <input
                type="text"
                name="weight"
                value={profile.weight}
                onChange={handleInputChange}
                disabled={!isEditing && savedProfile.weight}
                className={`w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 ${
                  !isEditing && savedProfile.weight ? 'bg-gray-800 cursor-not-allowed' : 'bg-gray-700'
                }`}
                placeholder="Enter your weight in kg"
              />
              {errors.weight && <p className="mt-1 text-sm text-red-400">{errors.weight}</p>}
            </div>

            {/* Diet Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Utensils className="inline w-4 h-4 mr-1" />
                Diet Preference
              </label>
              <select
                name="dietType"
                value={profile.dietType}
                onChange={handleInputChange}
                disabled={!isEditing && savedProfile.dietType}
                className={`w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white ${
                  !isEditing && savedProfile.dietType ? 'bg-gray-800 cursor-not-allowed' : 'bg-gray-700'
                }`}
              >
                <option value="">Select Diet Type</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="mixed">Mixed</option>
              </select>
              {errors.dietType && <p className="mt-1 text-sm text-red-400">{errors.dietType}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 justify-center pt-6">
              {(!savedProfile.name || isEditing) && (
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Save Profile
                </button>
              )}
              
              {savedProfile.name && !isEditing && (
                <button
                  type="button"
                  onClick={handleUpdateProfile}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Update Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}