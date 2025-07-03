import { useState } from 'react';
import { User, Mail, Ruler, Weight, Calendar } from 'lucide-react';

<<<<<<< HEAD
export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    height: '',
    weight: '',
    age: ''
=======
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const dietaryOptions = ['vegetarian',  'dairy-free'];

export default function Profile() {
  const { token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    dietaryPreferences: [],
    allergies: [],
    
    fitnessGoals: '',
>>>>>>> 6ad258c2c49f402f1a457477df959b421a0a257c
  });
  const [isEditing, setIsEditing] = useState(true);
  const [errors, setErrors] = useState({});

<<<<<<< HEAD
  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
=======
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    async function fetchProfile() {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData({
          username: response.data.username,
          email: response.data.email,
          dietaryPreferences: response.data.dietaryPreferences || [],
          allergies: response.data.allergies || [],
          fitnessGoals: response.data.fitnessGoals || '',
        });
      } catch (e) {
        setMessage('Failed to load profile info');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [token, navigate]);

  // Handlers
  const toggleArrayValue = (field, value) => {
    setProfileData((prev) => {
      const arr = prev[field];
      if (arr.includes(value)) {
        return { ...prev, [field]: arr.filter((v) => v !== value) };
      }
      return { ...prev, [field]: [...arr, value] };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await axios.put(
        `${API_URL}/users/me`,
        {
          dietaryPreferences: profileData.dietaryPreferences,
          allergies: profileData.allergies,
          fitnessGoals: profileData.fitnessGoals,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage('Profile saved successfully!');
    } catch (e) {
      setMessage('Failed to save profile.');
    } finally {
      setSaving(false);
>>>>>>> 6ad258c2c49f402f1a457477df959b421a0a257c
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!profile.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!profile.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!profile.height) {
      newErrors.height = 'Height is required';
    } else if (parseFloat(profile.height) <= 0) {
      newErrors.height = 'Height must be greater than 0';
    }
    
    if (!profile.weight) {
      newErrors.weight = 'Weight is required';
    } else if (parseFloat(profile.weight) <= 0) {
      newErrors.weight = 'Weight must be greater than 0';
    }
    
    if (!profile.age) {
      newErrors.age = 'Age is required';
    } else if (parseInt(profile.age) <= 0 || parseInt(profile.age) > 150) {
      newErrors.age = 'Please enter a valid age';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const calculateBMI = () => {
    if (profile.weight && profile.height) {
      const weightNum = parseFloat(profile.weight);
      const heightNum = parseFloat(profile.height);
      const bmi = weightNum / (heightNum * heightNum);
      return bmi.toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const bmi = calculateBMI();

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">
          {profile.name || 'Your Profile'}
        </h1>
        {profile.email && (
          <p className="text-gray-600 mt-2">{profile.email}</p>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Edit Profile Information
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 mr-2" />
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Ruler className="w-4 h-4 mr-2" />
                Height (meters)
              </label>
              <input
                type="number"
                step="0.01"
                value={profile.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                placeholder="e.g., 1.75"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.height ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.height && (
                <p className="text-red-500 text-sm mt-1">{errors.height}</p>
              )}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Weight className="w-4 h-4 mr-2" />
                Weight (kg)
              </label>
              <input
                type="number"
                value={profile.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                placeholder="Enter your weight"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.weight ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.weight && (
                <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                Age
              </label>
              <input
                type="number"
                value={profile.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="Enter your age"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.age ? 'border-red-500' : 'border-gray-300'
                } md:w-48`}
              />
              {errors.age && (
                <p className="text-red-500 text-sm mt-1">{errors.age}</p>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
            >
              Save Profile
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Profile Information
            </h2>
            <button
              onClick={handleEdit}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
            >
              Edit Profile
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-md">
                <User className="w-5 h-5 text-gray-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{profile.name}</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-md">
                <Mail className="w-5 h-5 text-gray-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-md">
                <Calendar className="w-5 h-5 text-gray-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="font-medium">{profile.age} years</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-md">
                <Ruler className="w-5 h-5 text-gray-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Height</p>
                  <p className="font-medium">{profile.height} m</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-md">
                <Weight className="w-5 h-5 text-gray-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Weight</p>
                  <p className="font-medium">{profile.weight} kg</p>
                </div>
              </div>

              {bmi && (
                <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">Health Stats</h3>
                  <p className="text-blue-700">
                    <span className="font-medium">BMI:</span> {bmi}
                  </p>
                  <p className="text-blue-700">
                    <span className="font-medium">Category:</span> {getBMICategory(parseFloat(bmi))}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}