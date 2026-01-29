import {Link, useLocation} from "react-router";
import {useState} from "react";
import {Menu, X} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        {name: "Home", path: "/"},
        {name: "Events", path: "/#"},
        {name: "Donation", path: "/donate"},
        {name: "About", path: "/about"},
        {name: "Contact", path: "/contact"},
        // Temporary quick access link to the admin dashboard until routes are protected
        {name: "Dashboard", path: "/dashboard"}
    ];

    const isActive = (path) => location.pathname === path;
    return (
        <nav className="sticky top-0 shadow-lg bg-white shadow z-100">
            {/* Main Navigation */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-3 md:py-4">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link to="/">
                            <img
                                src="amos.svg"
                                alt="Logo"
                                className="h-6 md:h-8 w-auto object-contain"
                            />
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <motion.div 
                        className="hidden md:flex items-center space-x-6 lg:space-x-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                            {navLinks.map((link, index) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                                >
                                    <Link 
                                        to={link.path}
                                        className={`font-medium transition-all duration-300 hover:text-[#6A0DAD] ${
                                            isActive(link.path)
                                                ? 'text-[#6A0DAD] border-b-2 border-[#6A0DAD] pb-1'
                                                : 'text-gray-800'
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                    </motion.div>
                    <motion.div 
                        className="hidden md:block"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Link to="/donate"
                              className="bg-[#F036DC] hover:bg-purple-900 text-white px-6 lg:px-8 py-2 rounded-full transition-all duration-300 hover:scale-105">Donate
                        </Link>
                    </motion.div>
                    {/* Mobile Menu button*/}
                    <motion.button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-md text-gray-800 hover:text-[#232027] transition-all duration-300 hover:bg-gray-100"
                        aria-label="Toggle Menu"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <motion.div
                            animate={{ rotate: isMenuOpen ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {isMenuOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
                        </motion.div>
                    </motion.button>
                </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        className="md:hidden border-t border-[#cccccc] bg-[#FAFAFA]"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div 
                            className="px-2 pt-2 pb-3 space-y-1"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            {navLinks.map((link, index) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                                >
                                    <Link
                                        to={link.path}
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                                            isActive(link.path)
                                            ? 'text-[#6A0DAD] bg-[#F7ECFB]'
                                            : 'text-[#637081] hover:text-[#232027] hover:bg-[#ECF3F8]'    
                                        }`}>
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                            <motion.div 
                                className="pt-2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.4 }}
                            >
                                <Link to="/donate" onClick={()=>setIsMenuOpen(!isMenuOpen)}
                                      className="bg-[#F036DC] hover:bg-purple-900 text-white px-8 py-2 rounded-full transition-all duration-300 hover:scale-105">Donate
                                </Link>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            </div>
        </nav>
    )
}

export default Header;