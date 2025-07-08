
import React, { useState, useEffect } from 'react';
import { HiMenuAlt3 } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaSearch, FaHeart, FaClock, FaUsers } from "react-icons/fa";

// Mock banner images - replace with your actual images
const Banner1 = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";
const Banner2 = "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2081&q=80";
const Banner3 = "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80";
const Banner4 = "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2087&q=80";
const Banner5 = "https://images.unsplash.com/photo-1563379091339-03246963d96c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";

const images = [Banner1, Banner2, Banner3, Banner4, Banner5];

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
            <nav className='flex w-full py-4 md:py-6 px-4 md:px-8 lg:px-12 xl:px-16 items-center justify-between'>
                <a href="/" className='flex items-center justify-center text-white text-xl lg:text-2xl cursor-pointer font-bold hover:scale-105 transition-transform'>
                    <div className='w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mr-3'>
                        <span className='text-white font-bold text-lg'>F</span>
                    </div>
                    FooD<span className='text-green-400'>eefy</span>
                </a>

                <ul className='hidden lg:flex text-white gap-8 xl:gap-12 text-lg'>
                    <li>
                        <a href="/" className='hover:text-green-400 transition-colors relative group'>
                            Home
                            <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full'></span>
                        </a>
                    </li>
                    <li>
                        <a href="/diet" className='hover:text-green-400 transition-colors relative group'>
                            Diet plan
                            <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full'></span>
                        </a>
                    </li>
                    <li>
                        <a href="/favorites" className='hover:text-green-400 transition-colors relative group'>
                            Favorites
                            <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full'></span>
                        </a>
                    </li>
                    <li>
                        <a href="/community" className='hover:text-green-400 transition-colors relative group'>
                            Community
                            <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full'></span>
                        </a>
                    </li>
                    <li>
                        <a href="/groceries" className='hover:text-green-400 transition-colors relative group'>
                            Groceries
                            <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full'></span>
                        </a>
                    </li>
                </ul>

                <div className='hidden lg:flex items-center gap-4'>
                    <button className='text-white hover:text-green-400 transition-colors'>
                        <FaSearch size={20} />
                    </button>
                    <button onClick={()=> navigate('/login')} className='bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-2 rounded-full hover:from-green-500 hover:to-green-700 transition-all duration-300 hover:scale-105 shadow-lg'>
                        Sign In
                    </button>
                </div>

                <button className='block lg:hidden text-white text-2xl'
                    onClick={() => setOpen(prev => !prev)}>
                    {open ? <AiOutlineClose /> : <HiMenuAlt3 />}
                </button>
            </nav>
            
            <div className={`${open ? "flex" : "hidden"} bg-black/95 backdrop-blur-sm flex-col w-full px-4 md:px-8 pt-6 pb-8 text-white gap-6 text-lg lg:hidden`}>
                <a href="/" className='hover:text-green-400 transition-colors'>Home</a>
                <a href="/#recipes" className='hover:text-green-400 transition-colors'>Explore</a>
                <a href="/favorites" className='hover:text-green-400 transition-colors'>Favorites</a>
                <a href="/about" className='hover:text-green-400 transition-colors'>About</a>
            </div>
        </header>
    );
};

export default Navbar;