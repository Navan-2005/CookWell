import React from "react";
import backgroundImage from '../Pages/background.jpg'; // adjust the path as needed

function LandingPage() {
  return (
    <div
      className="h-screen w-full bg-cover bg-center relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full flex justify-between items-center px-6 py-4 text-white z-10">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <span className="text-green-400">FooD</span>eefy
        </div>
        {/* Menu (optional or hidden on small screens) */}
        <div className="hidden md:flex space-x-6 text-lg">
          <a href="#" className="hover:text-green-400">Home</a>
          <a href="#" className="hover:text-green-400">About</a>
          <a href="#" className="hover:text-green-400">Services</a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center h-full text-center text-white px-4 z-10 relative">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Taste the World with <br />
          <span className="text-green-400">FooDeefy!</span>
        </h1>
        <p className="text-lg md:text-xl max-w-xl mb-8">
          Welcome to FooDefy, your passport to culinary adventures! <br />
          Discover a treasure trove of delectable recipes from around the globe.
        </p>

        {/* Centered Buttons */}
        <div className="flex space-x-4">
          <button className="bg-white k px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition">
            Sign In
          </button>
          <button className="border border-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-black transition">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;