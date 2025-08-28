import { ArrowRight } from "lucide-react";

const SuccessStories = () => {
    return (
        <section className="px-6 md:px-8 py-20 w-full bg-gray-100">
            <div className="max-w-7xl mx-auto">
                <h2 className="inline-block text-sm lg:text-xl tracking-wide text-white bg-purple-700 px-4 py-2 rounded mb-3">
                    Success Stories
                </h2>
                <h1 className="font-bold text-2xl mb-2">By You, It's Happened</h1>
                <p className="text-gray-600 max-w-2xl mb-6">
                    Because of your support, women once overlooked now stand with
                    confidence and hope. Each story here is a testament to the power of
                    compassion—changing lives, one woman at a time.
                </p>

                {/* Responsive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4">
                    {/* Left column */}
                    <div className="col-span-1 md:col-span-3 lg:col-span-4 relative group overflow-hidden rounded-lg">
                        <div className="w-full aspect-[3/4] bg-gradient-to-br from-gray-800 to-gray-900 relative">
                            <img
                                src="2.avif"
                                alt="Happy children"
                                className="w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 text-white">
                                <h3 className="text-2xl font-bold mb-2">Title</h3>
                                <p className="text-gray-200 mb-4">Subtext</p>
                                <button className="flex items-center text-red-400 hover:text-red-300 transition-colors font-medium">
                                    Know more
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Middle Columns */}
                    <div className="col-span-1 md:col-span-3 lg:col-span-4 flex flex-col gap-4">
                        <div className="relative group overflow-hidden rounded-lg aspect-square">
                            <div className="w-full h-full bg-gradient-to-br from-[#6A0DAD] to-red-600 relative">
                                <img
                                    src="1.avif"
                                    alt="Smiling woman"
                                    className="w-full h-full object-cover opacity-90"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h3 className="text-xl font-bold mb-1">Title</h3>
                                    <p className="text-gray-200 text-sm mb-2">Subtext</p>
                                    <button className="flex items-center text-red-400 hover:text-red-300 transition-colors text-sm font-medium">
                                        Know more
                                        <ArrowRight className="ml-1 w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="relative group overflow-hidden rounded-lg aspect-square">
                            <div className="w-full h-full bg-gradient-to-br from-orange-600 to-red-600 relative">
                                <img
                                    src="3.avif"
                                    alt="Smiling woman"
                                    className="w-full h-full object-cover opacity-90"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h3 className="text-xl font-bold mb-1">Title</h3>
                                    <p className="text-gray-200 text-sm mb-2">Subtext</p>
                                    <button className="flex items-center text-red-400 hover:text-red-300 transition-colors text-sm font-medium">
                                        Know more
                                        <ArrowRight className="ml-1 w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="col-span-1 md:col-span-6 lg:col-span-4 flex flex-col gap-4">
                        <div className="relative group overflow-hidden rounded-lg aspect-[4/3] flex-1">
                            <div className="w-full h-full bg-gradient-to-br from-orange-600 to-red-600 relative">
                                <img
                                    src="4.avif"
                                    alt="Smiling woman"
                                    className="w-full h-full object-cover opacity-90"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h3 className="text-xl font-bold mb-1">Title</h3>
                                    <p className="text-gray-200 text-sm mb-2">Subtext</p>
                                    <button className="flex items-center text-red-400 hover:text-red-300 transition-colors text-sm font-medium">
                                        Know more
                                        <ArrowRight className="ml-1 w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="relative group overflow-hidden rounded-lg aspect-[3/2]">
                            <div className="w-full h-full bg-gradient-to-br from-orange-600 to-red-600 relative">
                                <img
                                    src="5.avif"
                                    alt="Smiling woman"
                                    className="w-full h-full object-cover opacity-90"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h3 className="text-xl font-bold mb-1">Title</h3>
                                    <p className="text-gray-200 text-sm mb-2">Subtext</p>
                                    <button className="flex items-center text-red-400 hover:text-red-300 transition-colors text-sm font-medium">
                                        Know more
                                        <ArrowRight className="ml-1 w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SuccessStories;
