import {Link, useLocation} from "react-router";
import {useState} from "react";
import {Menu, X} from "lucide-react";

const Header = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        {name: "Home", path: "/"},
        {name: "Contact", path: "/contact"},
        {name: "Donation", path: "/donate"},
        {name: "About", path: "/about"},
        {name: "Events", path: "/events"}
    ];

    const isActive = (path) => location.pathname === path;
    return (
        <nav className="sticky top-0 shadow-lg bg-white shadow z-100">
            {/* Main Navigation */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <div>
                        <Link to="/">
                            <img
                                src="amos.svg"
                                alt="Logo"
                                className="h-8 w-auto object-contain"
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block items-center space-x-8">
                            {navLinks.map((link) => (
                                <Link key={link.name}
                                      to={link.path}
                                      className={`font-medium transition-smooth hover:text-[#6A0DAD] ${
                                          isActive(link.path)
                                              ? 'text-[#6A0DAD] border-b-2 border-[#6A0DAD] pb-1'
                                              : 'text-gray-800'
                                      }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                    </div>
                    <div className="hidden md:block">
                        <Link to="/donate"
                              className="bg-[#F036DC] hover:bg-purple-900 text-white px-8 py-2 rounded-full">Donate
                        </Link>
                    </div>
                    {/* Mobile Menu button*/}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 rounded-md text-gray-800 hover:text-[#232027] transition-smooth"
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
                    </button>
                </div>



            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="lg:hidden border-t border-[#cccccc] bg-[#FAFAFA]">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`block px-3 py-2 rounded-md text-base font-medium transition-smooth ${
                                isActive(link.path)
                                ? 'text-[#6A0DAD] bg-[#F7ECFB]'
                                : 'text-[#637081] hover:text-[#232027] hover:bg-[#ECF3F8]'    
                            }`}>
                                {link.name}
                            </Link>
                        ))}
                        <div className="pt-2">
                            <Link to="/donate" onClick={()=>setIsMenuOpen(!isMenuOpen)}
                                  className="bg-[#F036DC] hover:bg-purple-900 text-white px-8 py-2 rounded-full">Donate
                            </Link>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </nav>
    )
}

export default Header;