const Community = ()=>{
    return (
        <div className="relative w-full py-20  overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute h-full inset-0 z-0 ">
                <img
                    src="community.webp"
                    alt="Smiling Girl"
                    className="w-full h-full object-content aspect-3/2"
                    loading="lazy"
                    decoding="async"
                    width={1920}
                    height={1080}
                />
                {/* Gradient */}
                <div className="absolute inset-0 bg-linear-to-r from-[#6A0DAD]/60 via-[#6A0DAD]/60 "/>
            </div>

            {/* Text Header*/}
            <div className="relative mx-auto max-w-2xl flex flex-col items-center  px-6 py-16">
                <p className="text-3xl md:text-2xl font-bold tracking-wide text-white mb-4 text-center mb-6 ">
                    Join Our Community of Donors and Volunteers:
                    <span className="block"> Be Part of Positive Change in the World</span>
                </p>
                <h1 className="text-6xl font-extrabold text-white mb-6">154,891 +</h1>
                <p className="text-gray-300 mb-6 ">Join the many who already support Our Mission</p>
                {/* CTA Button */}
                <button
                    className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold">Join
                    Our Community
                </button>
            </div>
            <div className="absolute top-0 left-10 z-10 hidden lg:block">
                <img
                    src="group_love.png"
                    alt="Hand Heart Icon"
                    className="w-auto h-48"
                    loading="lazy"
                    decoding="async"
                    width={192}
                    height={192}
                />
            </div>
            <div className="absolute bottom-0 left-20 z-10 hidden lg:block">
                <img
                    src="group_m.png"
                    alt="Hand Heart Icon"
                    className="w-full h-48"
                    loading="lazy"
                    decoding="async"
                    width={192}
                    height={192}
                />
            </div>
        </div>
    )
}

export default Community;
