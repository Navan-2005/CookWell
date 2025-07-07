import React,{useEffect,useState} from 'react'
import { Banner1, Banner2, Banner3, Banner4, Banner5 } from "../../../assets/landingpageimages/images";
import { useNavigate } from 'react-router-dom';

const images = [Banner1, Banner2, Banner3, Banner4, Banner5];


const Header = ({ title, image, type }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

const navigate=useNavigate();


    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => 
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className='w-full h-screen relative overflow-hidden'>
            <div className='absolute inset-0'>
                {images.map((img, index) => (
                    <img 
                        key={index}
                        src={img}
                        alt={`Hero Image ${index + 1}`}
                        className={`w-full h-full object-cover transition-opacity duration-1000 ${
                            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{ position: 'absolute', top: 0, left: 0 }}
                    />
                ))}
            </div>

            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent'></div>
            
            <div className='absolute inset-0 flex flex-col items-center justify-center px-6 md:px-20 lg:px-32 text-center'>
                <h1 className='text-white text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight'>
                    {title}
                </h1>
                {type && (
                    <div className='max-w-4xl mx-auto'>
                        <p className='text-lg md:text-xl lg:text-2xl text-green-400 bg-black/60 backdrop-blur-sm px-8 py-6 rounded-2xl border border-green-400/30 shadow-2xl'>
                            Welcome to FooDeefy, your passport to culinary adventures!
                            <br className='hidden md:block' /> 
                            Discover a treasure trove of delectable recipes from around the globe.
                        </p>
                        <button onClick={() => navigate('/chat')}  className='mt-8 bg-gradient-to-r from-green-400 to-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-green-500 hover:to-green-700 transition-all duration-300 hover:scale-105 shadow-2xl'>
                            Start Exploring
                        </button>
                    </div>
                )}
            </div>

            <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2'>
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentImageIndex ? 'bg-green-400' : 'bg-white/50'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Header