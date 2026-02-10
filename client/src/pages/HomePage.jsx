import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Testimonials from "../components/Testimonials.jsx";
import SuccessStories from "../components/SuccessStories.jsx";
import header_img from "../assets/header_img.png"
import Community from "../components/Community.jsx";
import bg_image from "../assets/Image.png"

import {Plus, GraduationCap, Heart, ArrowLeft, ArrowRight} from "lucide-react";
import Steps from "../components/Steps.jsx";
import Team from "../components/Team.jsx";
import Hero from "../components/Hero.jsx";
import { motion } from "framer-motion";
import {useEffect, useState} from "react";
import { Link } from "react-router";

const HERO_SLIDES = [
    {
        image: "/hero.png",
        headline: "Giving Her",
        highlight: "E . V . E ,",
        subline: "Equality, Voice & Empowerment",
        blurb: "Every helping hand brings heartfelt change, creating ripples of hope and compassion. Each act of kindness lifts lives, inspiring others and uniting us in a shared journey toward a brighter, more compassionate world."
    },
    {
        image: "https://res.cloudinary.com/dlxil9dpo/image/upload/v1758014542/1_suxmxr.avif",
        headline: "Hands Together",
        highlight: "Hearts Aligned",
        subline: "Community Powered Giving",
        blurb: "Your generosity fuels programs that nourish, protect, and uplift women every day."
    },
    {
        image: "https://res.cloudinary.com/dlxil9dpo/image/upload/v1758014537/2_wbwtmj.avif",
        headline: "Small Gifts",
        highlight: "Big Impact",
        subline: "Hope In Every Contribution",
        blurb: "Each act of kindness lifts lives and inspires others to join a brighter, more compassionate world."
    },
    {
        image: "https://res.cloudinary.com/dlxil9dpo/image/upload/v1758014542/3_oy5jmv.avif",
        headline: "Empower Her",
        highlight: "Future",
        subline: "Support Education & Health",
        blurb: "Provide school kits, healthcare, and safe spaces so girls can thrive and lead."
    }
];

const HeroSection = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 15000);
        return () => clearInterval(id);
    }, []);

    const goTo = (index) => setCurrent((index + HERO_SLIDES.length) % HERO_SLIDES.length);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden mb-12 md:mb-20">
            {/* Background Carousel */}
            <div className="absolute inset-0">
                {HERO_SLIDES.map((slide, index) => (
                    <motion.div
                        key={slide.image}
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: current === index ? 1 : 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{
                            backgroundImage: `url(${slide.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                        }}
                    />
                ))}
            </div>
            {/* Responsive Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#6A0DAD]/70 from-40%"/>

            {/* Content */}
            <div className="relative z-10 max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto flex flex-col items-center justify-center text-center text-white">
                <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 text-balance font-playfair"
                >
                    {HERO_SLIDES[current].headline} <span className="font-playball">{HERO_SLIDES[current].highlight}</span>
                </motion.h1>
                <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                    className="text-2xl sm:text-3xl lg:text-7xl font-playball mt-2 md:mt-4"
                >
                    {HERO_SLIDES[current].subline}
                </motion.h2>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                    className="mt-4 md:mt-6 max-w-xl text-gray-300 text-sm sm:text-base lg:text-lg px-4"
                >
                    {HERO_SLIDES[current].blurb}
                </motion.p>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                    className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4"
                >
                    <Link
                        to="/donate"
                        className="bg-[#F036DC] hover:bg-yellow-500 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 text-center"
                    >
                        Donate Now
                    </Link>
                    <Link
                        to="/about"
                        className="border border-white text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:bg-white hover:text-purple-600 text-center"
                    >
                        Learn More
                    </Link>
                </motion.div>
            </div>

            {/* Carousel Navigation */}
            <div className="absolute bottom-12 md:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
                <button
                    aria-label="Previous slide"
                    className="p-2 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm transition"
                    onClick={() => goTo(current - 1)}
                >
                    <ArrowLeft className="h-5 w-5"/>
                </button>
                <div className="flex gap-2">
                    {HERO_SLIDES.map((_, index) => (
                        <button
                            key={index}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`h-2.5 rounded-full transition-all duration-300 ${current === index ? "w-8 bg-white" : "w-2.5 bg-white/50"}`}
                            onClick={() => goTo(index)}
                        />
                    ))}
                </div>
                <button
                    aria-label="Next slide"
                    className="p-2 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm transition"
                    onClick={() => goTo(current + 1)}
                >
                    <ArrowRight className="h-5 w-5"/>
                </button>
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
                <Link
                    to="/about"
                    className="bg-[#F036DC] text-white px-6 py-2 rounded-full font-semibold flex items-center justify-center transition-all duration-300 hover:scale-105"
                >
                    Learn About Our Work <ArrowRight className="ml-2 h-5 w-5"/>
                </Link>
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
                    <Link
                        to="/about"
                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-full py-2 px-5 w-fit transition-all duration-300 hover:scale-105"
                    >
                        Learn more
                    </Link>
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
                    <Link
                        to="/donate"
                        className="bg-[#F036DC] hover:bg-yellow-500 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 text-center"
                    >
                        Donate Now
                    </Link>
                    <Link
                        to="/contact"
                        className="border border-white text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:bg-white hover:text-purple-600 text-center"
                    >
                        Contact Us
                    </Link>
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
