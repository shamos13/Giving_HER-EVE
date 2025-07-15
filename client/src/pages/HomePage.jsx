import Header from "../components/Header.jsx";
import {Plus, GraduationCap} from "lucide-react";

const HeroSection = () => {
    return (
        <section className="relative w-full h-screen bg-[#6A0DAD] flex flex-col lg:flex-row  text-white overflow-hidden mb-20 ">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="header_img.png"
                    alt="Smiling Girl"
                    className="w-1/2 h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-l from-[#6A0DAD]  via-purple-900"/>
            </div>

            {/* Content */}
            <div
                className="relative z-10 mx-auto -mt-50 mr-30 flex flex-col items-center justify-center  text-center  px-6 py-16 -mt-0 lg:-mt-50 ">
                <h1 className="text-4xl lg:text-7xl font-playfair font-bold tracking-wide">
                    Giving Her <span className="font-playball">E . V . E ,</span>
                </h1>
                <h2 className="text-3xl lg:text-7xl font-playball mt-4">
                    Equality, Voice & Empowerment
                </h2>
                <p className="mt-6 max-w-xl text-gray-300 text-base lg:text-lg">
                    Every helping hand brings heartfelt change, creating ripples of hope and compassion.
                    Each act of kindness lifts lives, inspiring others and uniting us in a shared journey toward
                    a brighter, more compassionate world.
                </p>
                <div className="mt-8 flex gap-4">
                    <button
                        className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold">
                        Watch Video
                    </button>
                    <button className="border border-white text-white px-6 py-2 rounded-full font-semibold">
                        Donate Now
                    </button>
                </div>
            </div>

            {/* Right Side Icon */}
            <div className="absolute -top-2 -right-1 z-10 hidden lg:block">
                <img
                    src="hand_heart.png"
                    alt="Hand Heart Icon"
                    className="top-0 w-40 h-40"
                />
            </div>
            <div className="absolute -bottom-6 right-10 z-10 hidden lg:block">
                <img
                    src="donation_bottle.png"
                    alt="Donation Bottle"
                    className=" w-40 h-40"
                />
            </div>
        </section>
    );

}

const CharityService = () =>{
    return(
        <section className="absolute px-20 mx-auto bg-white w-full h-auto">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-sm lg:text-xl font-bold tracking-wide text-purple-600 mb-6">CHARITY SERVICE</h2>
                <h1 className="font-bold text-2xl mb-2">For Her. With Her. Always</h1>
                <p className="text-gray-600">We believe in a world where every woman is seen, supported, and empowered—with love leading every step we take.</p>
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8 max-w-none">
                    {/*Service Cards*/}
                    <div className="bg-purple-700 text-white p-8 rounded-lg  shadow-lg relative overflow-hidden min-h-[250px]">
                        <h3 className="text-2xl font-bold mb-4">Menstrual Health</h3>
                        <p className="text-purple-100 leading-relaxed">
                            Providing free menstrual kits, health education, and support for girls and women in
                            underserved communities.
                        </p>
                        <div className="absolute bottom-0 right-6 opacity-20">
                            <Plus size={68} className="text-white"/>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 p-8 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold text-black mb-4">Food and Clothing Drive</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Delivering essential nourishment and clothing to women and girls in need — because survival
                            shouldn't be a struggle.
                        </p>
                    </div>
                    <div className="bg-white border border-gray-200 p-8 rounded-lg shadow-lg relative overflow-hidden">
                        <h3 className="text-2xl font-bold text-black mb-4">School Kits</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Providing stationery, uniforms, and hope — because every girl deserves a chance to succeed.
                        </p>
                        <div className="absolute bottom-4 right-4 opacity-20">
                            <GraduationCap size={48} className="text-gray-400"/>
                        </div>
                    </div>

                </div>
            </div>
            {/* Right Side Icon */}
            <div className="absolute top-0 right-0 z-10 hidden lg:block">
                <img
                    src="flower.png"
                    alt="Hand Heart Icon"
                    className="top-0 w-30 h-30"
                />
            </div>
        </section>
    )
}

const AboutUs = ()=>{
    return(
        <section></section>
    )
}

const HomePage = () => {
    return (
        <div>
            <Header/>
            <HeroSection/>
            <CharityService/>
        </div>
    )
}

export default HomePage;