import React from 'react';

const HeroSection = () => {
  return (
    <div className="relative w-full h-screen flex">
      {/* Left side - Girl image */}
      <div className="w-1/2 h-full relative">
        <img 
          src="/api/placeholder/800/800" 
          alt="Smiling young African girl" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Right side - Purple overlay with content */}
      <div className="w-1/2 h-full bg-gradient-to-br from-purple-700 to-purple-900 relative flex flex-col justify-center items-center px-12 py-16">
        
        {/* Hand-heart graphic in top-right corner */}
        <div className="absolute top-8 right-8">
          <svg 
            width="120" 
            height="120" 
            viewBox="0 0 120 120" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-white/30"
          >
            {/* Hand outline */}
            <path 
              d="M45 30C45 25 48 22 52 22C56 22 59 25 59 30V45M59 30C59 25 62 22 66 22C70 22 73 25 73 30V45M73 30C73 25 76 22 80 22C84 22 87 25 87 30V50M87 35C87 30 90 27 94 27C98 27 101 30 101 35V60C101 75 95 85 80 95L52 95C42 95 35 85 35 75V50C35 40 40 35 45 35V30Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              fill="none"
            />
            {/* Heart shape */}
            <path 
              d="M60 50C60 45 65 40 70 40C75 40 80 45 80 50C80 45 85 40 90 40C95 40 100 45 100 50C100 60 80 75 75 80C70 75 50 60 50 50C50 45 55 40 60 40C65 40 70 45 70 50Z" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              fill="none"
            />
          </svg>
        </div>

        {/* Main content */}
        <div className="text-center max-w-lg space-y-6">
          {/* Main heading */}
          <h1 className="text-6xl font-bold font-serif text-white leading-tight">
            Giving Her{' '}
            <span className="italic">E.V.E</span>,
          </h1>
          
          {/* Subheading */}
          <h2 className="text-4xl font-light italic text-white/90 leading-relaxed">
            Equality, Voice & Empowerment
          </h2>
          
          {/* Mission text */}
          <p className="text-sm text-gray-300 leading-relaxed px-4 max-w-md mx-auto">
            Every helping hand brings heartfelt change, creating ripples of hope and compassion. Each act of kindness lifts lives, inspiring others and uniting us in a shared journey toward a brighter, more compassionate world.
          </p>
          
          {/* Call-to-action buttons */}
          <div className="flex gap-4 justify-center mt-8">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-8 py-3 rounded-full transition-colors duration-200">
              Watch Video
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-purple-900 font-medium px-8 py-3 rounded-full transition-colors duration-200">
              Donate Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;