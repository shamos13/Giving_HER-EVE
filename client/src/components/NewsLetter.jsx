import bg_image from "../assets/Image.png";

const NewsLetter = () => {
    return(
        <section className="relative mt-10 py-20 bg-[#6A0DAD] text-white">
            <div className="absolute z-0 inset-0 bg-cover bg-center bg-no-repeat opacity-30"
                 style={{backgroundImage: `url(${bg_image})`}}>
            </div>

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
                    Stay Connected
                </h2>
                <p className="text-xl mb-8 text-white/90 text-balance">
                    Subscribe to our newsletter for updates on our programs, success stories, and ways to get involved.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                    <div className="flex space-x-2">
                        <label htmlFor="email-address" className="sr-only">
                            Email address
                        </label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            required
                            placeholder="Enter your email"
                            autoComplete="email"
                            className="w-80 h-10  rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-white/60 focus:outline-2 focus:-outline-offset-2 focus:white sm:text-sm/6"
                        />
                        <button
                            type="submit"
                            className="flex-none rounded-md bg-yellow-400 px-3.5 py-2.5 text-sm font-semibold text-black shadow-xs hover:bg-yellow-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-700"
                        >
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
};

export default NewsLetter;