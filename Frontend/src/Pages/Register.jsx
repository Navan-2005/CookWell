// src/pages/Register.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { setUser } from '../redux/slices/userslice';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = async(e) => {
    e.preventDefault();
    const response=await axios.post('http://localhost:3000/user/register',{username,email,password});
    if(response.status===200)
      {localStorage.setItem('token',response.data.token);
        dispatch(setUser(response.data.user));
        console.log(response.data.user);
        navigate('/');}
    dispatch(registerUser({ username, email, password }));
    toast({
          title: "Account created successfully",
          description: "Welcome to our platform!",
        });
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      {/* {error && <p className="mb-4 text-red-600">{error}</p>} */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        <button
          type="submit"
          // disabled={loading}
          className="w-full h-12 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
        > submit
          {/* {loading ? 'Registering...' : 'Register'} */}
        </button>
      </form>
    </div>
  );
}