import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Testimonials from "../components/Testimonials.jsx";
import SuccessStories from "../components/SuccessStories.jsx";
import header_img from "../assets/header_img.png"
import Community from "../components/Community.jsx";
import bg_image from "../assets/Image.png"

import {Plus, GraduationCap, Heart, ArrowRight} from "lucide-react";
import Steps from "../components/Steps.jsx";
import Team from "../components/Team.jsx";

const HeroSection = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden mb-20">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat md:w-1/2 sm:w-full"
                style={{backgroundImage: `url(${header_img})`}}
                />
            {/* Gradient */}
            <div className="absolute inset-0 bg-linear-to-l from-[#6A0DAD] from-50%"/>

            {/* Content */}
            <div className="relative z-10 max-w-7xl sm:px-6 lg:px-8 mx-auto flex flex-col items-center justify-center  text-center text-white ">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance font-playfair">
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
                        className="bg-[#F036DC] hover:bg-yellow-500 text-white px-6 py-2 rounded-full font-semibold">
                        Donate Now
                    </button>
                    <button className="border border-white text-white px-6 py-2 rounded-full font-semibold">
                        Learn More
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

const CharityService = () => {
    return (
        <section className="relative px-6 md:px-20 py-20 bg-white w-full bg-gray-300">
        <div className="max-w-7xl mx-auto">
                <h2 className="text-sm lg:text-xl font-bold tracking-wide text-[#F036DC] mb-6">CHARITY SERVICE</h2>
                <h1 className="font-bold text-2xl mb-2">For Her. With Her. Always</h1>
                <p className="text-gray-600 max-w-2xl">We believe in a world where every woman is seen, supported, and empowered—with love leading every step we take.</p>
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8 max-w-none">
                    {/*Service Cards*/}
                    <div className="bg-purple-700 text-white p-8 rounded-lg  shadow-lg relative overflow-hidden min-h-[250px] ">
                        <h3 className="text-2xl font-bold mb-4">Menstrual Health</h3>
                        <p className="text-purple-100 leading-relaxed">
                            Providing free menstrual kits, health education, and support for girls and women in
                            underserved communities.
                        </p>
                        <div className="absolute bottom-0 right-6 opacity-20">
                            <Plus size={68} className="text-white"/>
                        </div>
                    </div>
                    <div className="relative bg-white border border-gray-200 p-8 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold text-black mb-4">Food and Clothing Drive</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Delivering essential nourishment and clothing to women and girls in need — because survival
                            shouldn't be a struggle.
                        </p>
                        <div className="absolute bottom-3 right-6 opacity-20">
                            <Heart className="h-8 w-8"/>
                        </div>

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
            {/* Button */}
            <div className="flex items-center justify-center mt-10">
                <button className="bg-[#F036DC] text-white px-6 py-2 rounded-full font-semibold flex items-center justify-center">
                    Learn About Our Work <ArrowRight className="ml-2 h-5 w-5"/></button>
            </div>
        </section>
    )
}

const AboutUs = ()=>{
    return (
        <section className="relative w-full py-0 mb-20">
            <div className="flex flex-col md:flex-row bg-[#6A0DAD] h-80 md:min-h-[502px] overflow-hidden">

                {/* Left: Image */}
                <div className="w-full md:w-1/2 h-full">
                    <img
                        src="vector.png"
                        alt="Smiling Girl"
                        className="w-full object-cover aspect-3/2"
                    />
                </div>

                {/* Right: Content */}
                <div className="relative w-full md:w-1/2 h-full flex flex-col justify-center px-6 md:px-12 text-white">
                    <h3 className="uppercase text-sm tracking-wider font-semibold text-white mb-2 text-purple-600">
                        About Us
                    </h3>
                    <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                        Committed to Compassion and Community
                    </h2>
                    <p className="text-purple-200 text-base leading-relaxed max-w-xl mb-6">
                        At the heart of our organization is a deep commitment to compassion and community.
                        We believe that every individual deserves respect, support, and the opportunity to thrive.
                        Our mission is to provide inclusive services that cater to the diverse needs of people from all
                        walks of life.
                    </p>
                    <button
                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-full py-2 px-5 w-fit">
                        Learn more
                    </button>
                    <div className="absolute bottom-0 -left-10 hidden lg:block">
                        <img
                            src="gift.png"
                            alt="Hand Heart Icon"
                            className="top-0 w-20 h-20"
                        />
                    </div>

                </div>
            </div>
            <div className="absolute top-0 -right-1 hidden lg:block">
                <img
                    src="calendar.png"
                    alt="Hand Heart Icon"
                    className="top-0 w-40 h-40"
                />
            </div>
            <div className="absolute bottom-3 right-10  hidden lg:block">
                <img
                    src="cupcake.png"
                    alt="Cup Cake"
                    className=" w-20 h-20"
                />
            </div>

        </section>

    )
}

const CallToAction = ()=>{
    return(
        <section className="relative py-20 bg-[#6A0DAD] text-white mb-10">
            <div className="absolute z-0 inset-0 bg-cover bg-center bg-no-repeat opacity-50"
                 style={{backgroundImage: `url(${bg_image})`}}>

            </div>
            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
                    Be Part of the Change
                </h2>
                <p className="text-xl mb-8 text-balance">
                    Your support creates lasting impact. Join us in empowering women and transforming communities
                    across East Africa.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        className="bg-[#F036DC] hover:bg-yellow-500 text-white px-6 py-2 rounded-full font-semibold">
                        Donate Now
                    </button>
                    <button className="border border-white text-white px-6 py-2 rounded-full font-semibold">
                        Contact Us
                    </button>
                </div>
            </div>
        </section>
    )
}

const HomePage = () => {
    return (
        <div className="min-h-screen">
            <Header/>
            <HeroSection/>
            <CharityService/>
            <SuccessStories/>
            <Steps/>
            <Community/>
            <Testimonials/>
            <CallToAction/>
            <Team/>
            <Footer/>
        </div>
    )
}

export default HomePage;