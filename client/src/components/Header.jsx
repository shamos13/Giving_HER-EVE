const Header = () => {
    return (
        <header className="sticky top-0 bg-white shadow z-100">
            <div className="mx-auto flex justify-between items-center py-4 px-6 md:px-20 lg:px-32">
                <img src="logo.svg" alt="Logo" className="h-6 w-auto object-contain" />
                <ul className="hidden md:flex space-x-8 text-black">
                    <a href="#home" className="hover:text-purple-950">Home</a>
                    <a href="#events" className="hover:text-purple-950">Events</a>
                    <a href="#aboutUs" className="hover:text-purple-950">About Us</a>
                    <a href="#contactUs" className="hover:text-purple-950">Contact Us</a>
                </ul>
                <button className="hidden md:block bg-purple-700 hover:bg-purple-900 text-white px-8 py-2 rounded-full ">Donate</button>
            </div>
        </header>
    )
}

export default Header;