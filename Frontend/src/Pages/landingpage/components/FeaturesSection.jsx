import React from 'react';
import { FaSearch, FaHeart, FaClock, FaUsers, FaUtensils, FaGlobe, FaStar, FaBook, FaCamera, FaShare, FaLeaf, FaAward } from "react-icons/fa";

const FeatureCard = ({ icon, title, description }) => (
    <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20 shadow-xl'>
        <div className='text-green-400 text-4xl mb-4 flex justify-center'>{icon}</div>
        <h3 className='text-white text-xl font-semibold mb-3'>{title}</h3>
        <p className='text-gray-300'>{description}</p>
    </div>
);

const FeaturesSection = () => (
    <section className='py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 w-full'>
        <div className='w-full px-4 md:px-8 lg:px-12 xl:px-16'>
            <div className='text-center mb-16'>
                <h2 className='text-4xl md:text-5xl font-bold text-white mb-4'>
                    Why Choose FlavorVerse?
                </h2>
                <p className='text-xl text-gray-300 max-w-3xl mx-auto'>
                    Discover what makes our platform the ultimate destination for food lovers
                </p>
            </div>
            
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto'>
                <FeatureCard 
                    icon={<FaSearch />}
                    title="Easy Discovery"
                    description="Find recipes by cuisine, ingredients, or dietary preferences with our advanced search"
                />
                <FeatureCard 
                    icon={<FaHeart />}
                    title="Save Favorites"
                    description="Create your personal cookbook by saving recipes you love for quick access"
                />
                <FeatureCard 
                    icon={<FaClock />}
                    title="Quick & Easy"
                    description="Filter recipes by cooking time to find the perfect dish for any occasion"
                />
                <FeatureCard 
                    icon={<FaUsers />}
                    title="Community"
                    description="Join a vibrant community of food lovers sharing tips and experiences"
                />
                <FeatureCard 
                    icon={<FaHeart />}
                    title="Healthy Options"
                    description="Explore nutritious recipes that don't compromise on taste or satisfaction"
                />
                <FeatureCard 
                    icon={<FaSearch />}
                    title="Global Cuisine"
                    description="Travel the world through flavors with authentic recipes from every continent"
                />
            </div>
        </div>
    </section>
);

// Export both components
export { FeaturesSection, FeatureCard };
export default FeaturesSection;