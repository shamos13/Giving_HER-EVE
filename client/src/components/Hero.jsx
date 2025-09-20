import React from 'react';
import hero from '../assets/hero.png'
const HeroSection = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('/hero.png')`
                }}
            />

            {/* Purple Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/70 via-purple-800/60 to-pink-600/50" />

            {/* Decorative Hand Heart - Top Right (Desktop Only) */}
            <div className="absolute top-8 right-8 hidden lg:block">
                <img
                    src="/hand_heart.png"
                    alt="Hand heart decoration"
                    className="w-24 h-24 object-contain opacity-90"
                />
            </div>

            {/* Decorative Donation Bottle - Bottom Right (Desktop Only) */}
            <div className="absolute bottom-8 right-8 hidden lg:block">
                <img
                    src="/donation_bottle.png"
                    alt="Donation bottle decoration"
                    className="w-32 h-32 object-contain opacity-80"
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-center text-white px-6 sm:px-8 lg:px-12 max-w-4xl mx-auto">
                {/* Main Heading */}
                <h1 className="font-playfair text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 leading-tight">
                    Giving Her{' '}
                    <span className="font-playball text-yellow-300 relative">
            E.V.E
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-yellow-300 rounded-full"></div>
          </span>
                    ,
                </h1>

                {/* Subheading */}
                <h2 className="text-2xl sm:text-3xl lg:text-5xl font-playfair font-semibold mb-8 text-purple-100">
                    Equality, Voice & Empowerment
                </h2>

                {/* Description Paragraph */}
                <p className="text-lg sm:text-xl lg:text-2xl mb-12 max-w-xl mx-auto leading-relaxed text-gray-100 font-light">
                    Empowering women through education, resources, and community support to create lasting change in their lives and communities.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    {/* Primary Button - Donate Now */}
                    <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-yellow-400 hover:to-yellow-500 text-white hover:text-gray-900 font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg min-w-[200px]">
                        Donate Now
                    </button>

                    {/* Secondary Button - Learn More */}
                    <button className="border-2 border-white text-white hover:bg-white hover:text-purple-800 font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 min-w-[200px]">
                        Learn More
                    </button>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block">
                <div className="animate-bounce">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;