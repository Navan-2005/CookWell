import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
// import Button from "./Button"

const Footer = () => {
    return (
        <footer className="text-white py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <div className="max-w-7xl mx-auto px-6 md:px-20 lg:px-32">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="lg:col-span-2">
                        <div className="flex items-center mb-6">
                            <div className='w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mr-3'>
                                <span className='text-white font-bold text-lg'>F</span>
                            </div>
                            <p className="font-bold text-2xl">
                                Flavor<span className="text-green-400">Verse</span>
                            </p>
                        </div>
                        <p className="text-gray-300 text-lg mb-6 max-w-md">
                            Your passport to culinary adventures. Discover, cook, and share amazing recipes from around the world.
                        </p>
                        <div className="flex gap-4">
                            <a href='#' className='bg-blue-600 p-3 rounded-full text-white hover:bg-blue-700 transition-colors hover:scale-110 transform'>
                                <FaFacebook size={20} />
                            </a>
                            <a href='#' className='bg-pink-600 p-3 rounded-full text-white hover:bg-pink-700 transition-colors hover:scale-110 transform'>
                                <FaInstagram size={20} />
                            </a>
                            <a href='#' className='bg-blue-400 p-3 rounded-full text-white hover:bg-blue-500 transition-colors hover:scale-110 transform'>
                                <FaTwitter size={20} />
                            </a>
                            <a href='#' className='bg-red-600 p-3 rounded-full text-white hover:bg-red-700 transition-colors hover:scale-110 transform'>
                                <FaYoutube size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-lg mb-6 text-green-400">QUICK LINKS</h4>
                        <div className="flex flex-col space-y-3">
                            <a href='#' className='text-gray-300 hover:text-green-400 transition-colors'>Home</a>
                            <a href='#' className='text-gray-300 hover:text-green-400 transition-colors'>About</a>
                            <a href='#' className='text-gray-300 hover:text-green-400 transition-colors'>Recipes</a>
                            <a href='#' className='text-gray-300 hover:text-green-400 transition-colors'>Contact</a>
                            <a href='#' className='text-gray-300 hover:text-green-400 transition-colors'>Chefs</a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-lg mb-6 text-green-400">LEGAL</h4>
                        <div className='flex flex-col space-y-3'>
                            <a href='#' className='text-gray-300 hover:text-green-400 transition-colors'>Terms & Conditions</a>
                            <a href='#' className='text-gray-300 hover:text-green-400 transition-colors'>Privacy Policy</a>
                            <a href='#' className='text-gray-300 hover:text-green-400 transition-colors'>Cookie Policy</a>
                            <a href='#' className='text-gray-300 hover:text-green-400 transition-colors'>License Agreement</a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center">
                    <p className="text-gray-400">© 2024 FlavorVerse. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer