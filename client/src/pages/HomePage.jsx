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
import Hero from "../components/Hero.jsx";
import { motion } from "framer-motion";

const HeroSection = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden mb-12 md:mb-20">
            {/* Background Image with Overlay */}
            <div >
                <img
                    src="/hero.png"
                    alt="Hero background"
                    className="absolute inset-0 w-full h-full  object-cover md:object-center"
                />
            </div>
            {/* Responsive Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#6A0DAD]/70 from-40%"/>

            {/* Content */}
            <div className="relative z-10 max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto flex flex-col items-center justify-center  text-center text-white">
                <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 text-balance font-playfair"
                >
                    Giving Her <span className="font-playball">E . V . E ,</span>
                </motion.h1>
                <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                    className="text-2xl sm:text-3xl lg:text-7xl font-playball mt-2 md:mt-4"
                >
                    Equality, Voice & Empowerment
                </motion.h2>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                    className="mt-4 md:mt-6 max-w-xl text-gray-300 text-sm sm:text-base lg:text-lg px-4"
                >
                    Every helping hand brings heartfelt change, creating ripples of hope and compassion.
                    Each act of kindness lifts lives, inspiring others and uniting us in a shared journey toward
                    a brighter, more compassionate world.
                </motion.p>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                    className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4"
                >
                    <button
                        className="bg-[#F036DC] hover:bg-yellow-500 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105">
                        Donate Now
                    </button>
                    <button className="border border-white text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:bg-white hover:text-purple-600">
                        Learn More
                    </button>
                </motion.div>
            </div>

            {/* Right Side Icon */}
            <motion.div 
                className="absolute -top-2 -right-1 z-10 hidden lg:block"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            >
                <img
                    src="hand_heart.png"
                    alt="Hand Heart Icon"
                    className="top-0 w-40 h-40"
                />
            </motion.div>
            <motion.div 
                className="absolute -bottom-6 right-10 z-10 hidden lg:block"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
            >
                <img
                    src="donation_bottle.png"
                    alt="Donation Bottle"
                    className=" w-40 h-40"
                />
            </motion.div>
        </section>
    );

}

const CharityService = () => {
    return (
        <section className="relative px-4 sm:px-6 md:px-20 py-12 md:py-20 bg-white w-full bg-gray-300">
        <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-xs sm:text-sm lg:text-xl font-bold tracking-wide text-[#F036DC] mb-4 md:mb-6">CHARITY SERVICE</h2>
                    <h1 className="font-bold text-xl sm:text-2xl mb-2">For Her. With Her. Always</h1>
                    <p className="text-gray-600 max-w-2xl text-sm sm:text-base">We believe in a world where every woman is seen, supported, and empowered—with love leading every step we take.</p>
                </motion.div>
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8 max-w-none">
                    {/*Service Cards*/}
                    <motion.div 
                        className="bg-purple-700 text-white p-6 md:p-8 rounded-lg shadow-lg relative overflow-hidden min-h-[200px] md:min-h-[250px]"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Menstrual Health</h3>
                        <p className="text-purple-100 leading-relaxed text-sm md:text-base">
                            Providing free menstrual kits, health education, and support for girls and women in
                            underserved communities.
                        </p>
                        <div className="absolute bottom-0 right-4 md:right-6 opacity-20">
                            <Plus size={48} className="text-white md:w-16 md:h-16"/>
                        </div>
                    </motion.div>
                    <motion.div 
                        className="relative bg-white border border-gray-200 p-6 md:p-8 rounded-lg shadow-lg"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <h3 className="text-xl md:text-2xl font-bold text-black mb-3 md:mb-4">Food and Clothing Drive</h3>
                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                            Delivering essential nourishment and clothing to women and girls in need — because survival
                            shouldn't be a struggle.
                        </p>
                        <div className="absolute bottom-3 right-4 md:right-6 opacity-20">
                            <Heart className="h-6 w-6 md:h-8 md:w-8"/>
                        </div>
                    </motion.div>
                    <motion.div 
                        className="bg-white border border-gray-200 p-6 md:p-8 rounded-lg shadow-lg relative overflow-hidden"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <h3 className="text-xl md:text-2xl font-bold text-black mb-3 md:mb-4">School Kits</h3>
                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                            Providing stationery, uniforms, and hope — because every girl deserves a chance to succeed.
                        </p>
                        <div className="absolute bottom-4 right-4 opacity-20">
                            <GraduationCap size={36} className="text-gray-400 md:w-12 md:h-12"/>
                        </div>
                    </motion.div>
                </div>
            </div>
            {/* Right Side Icon */}
            <motion.div 
                className="absolute top-0 right-0 z-10 hidden lg:block"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
            >
                <img
                    src="flower.png"
                    alt="Hand Heart Icon"
                    className="top-0 w-30 h-30"
                />
            </motion.div>
            {/* Button */}
            <motion.div 
                className="flex items-center justify-center mt-8 md:mt-10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
            >
                <button className="bg-[#F036DC] text-white px-6 py-2 rounded-full font-semibold flex items-center justify-center transition-all duration-300 hover:scale-105">
                    Learn About Our Work <ArrowRight className="ml-2 h-5 w-5"/></button>
            </motion.div>
        </section>
    )
}

const AboutUs = ()=>{
    return (
        <section className="relative w-full py-0 mb-12 md:mb-20">
            <div className="flex flex-col md:flex-row bg-[#6A0DAD] h-80 md:min-h-[502px] overflow-hidden">

                {/* Left: Image */}
                <motion.div 
                    className="w-full md:w-1/2 h-full"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <img
                        src="vector.png"
                        alt="Smiling Girl"
                        className="w-full object-cover aspect-3/2"
                    />
                </motion.div>

                {/* Right: Content */}
                <motion.div 
                    className="relative w-full md:w-1/2 h-full flex flex-col justify-center px-4 sm:px-6 md:px-12 text-white"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    <h3 className="uppercase text-xs sm:text-sm tracking-wider font-semibold text-white mb-2 text-purple-600">
                        About Us
                    </h3>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-3 md:mb-4">
                        Committed to Compassion and Community
                    </h2>
                    <p className="text-purple-200 text-sm sm:text-base leading-relaxed max-w-xl mb-4 md:mb-6">
                        At the heart of our organization is a deep commitment to compassion and community.
                        We believe that every individual deserves respect, support, and the opportunity to thrive.
                        Our mission is to provide inclusive services that cater to the diverse needs of people from all
                        walks of life.
                    </p>
                    <button
                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-full py-2 px-5 w-fit transition-all duration-300 hover:scale-105">
                        Learn more
                    </button>
                    <motion.div 
                        className="absolute bottom-0 -left-10 hidden lg:block"
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <img
                            src="gift.png"
                            alt="Hand Heart Icon"
                            className="top-0 w-20 h-20"
                        />
                    </motion.div>
                </motion.div>
            </div>
            <motion.div 
                className="absolute top-0 -right-1 hidden lg:block"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
            >
                <img
                    src="calendar.png"
                    alt="Hand Heart Icon"
                    className="top-0 w-40 h-40"
                />
            </motion.div>
            <motion.div 
                className="absolute bottom-3 right-10  hidden lg:block"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                viewport={{ once: true }}
            >
                <img
                    src="cupcake.png"
                    alt="Cup Cake"
                    className=" w-20 h-20"
                />
            </motion.div>
        </section>
    )
}

const CallToAction = ()=>{
    return(
        <section className="relative py-12 md:py-20 bg-[#6A0DAD] text-white mb-8 md:mb-10">
            <div className="absolute z-0 inset-0 bg-cover bg-center bg-no-repeat opacity-50"
                 style={{backgroundImage: `url(${bg_image})`}}>

            </div>
            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.h2 
                    className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-balance"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    Be Part of the Change
                </motion.h2>
                <motion.p 
                    className="text-lg md:text-xl mb-6 md:mb-8 text-balance"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    Your support creates lasting impact. Join us in empowering women and transforming communities
                    across East Africa.
                </motion.p>
                <motion.div 
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    <button
                        className="bg-[#F036DC] hover:bg-yellow-500 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105">
                        Donate Now
                    </button>
                    <button className="border border-white text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:bg-white hover:text-purple-600">
                        Contact Us
                    </button>
                </motion.div>
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