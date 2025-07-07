import React from 'react'
import Header from './components/Header'
import FeaturesSection from './components/FeaturesSection';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

//import Recipes from '../components/Recipes'


const Landing = () => {
    return (
        <div className='w-full min-h-screen'>
            <Navbar />
            <Header
                title={
                    <span>
                        Taste the Food with
                        <br /> 
                        <span className='text-green-400'>FooDeefy!</span>
                    </span>
                }
                type='home'
            />
            <FeaturesSection />
            <Footer />
        </div>
    );
};


export default Landing