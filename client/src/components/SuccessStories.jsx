import React from "react";
import { ArrowRight } from "lucide-react";

// Reusable StoryCard component
const StoryCard = React.memo(({ imgSrc, title, subtitle, aspect, flexGrow }) => (
    <div className={`relative group overflow-hidden rounded-lg ${aspect} ${flexGrow}`}>
        {/* Blurred placeholder */}
        <img
            src={`${imgSrc.replace("/upload/", "/upload/f_auto,q_auto:low,w_50,h_50,c_fill/")}`}
            alt="blur placeholder"
            className="absolute inset-0 w-full h-full object-cover blur-lg scale-110"
            loading="lazy"
        />

        {/* Optimized main image */}
        <img
            src={`${imgSrc.replace("/upload/", "/upload/f_auto,q_auto,w_800,h_600,c_fill/")}`}
            alt={title}
            className="relative w-full h-full object-cover transition-opacity duration-700 opacity-90 group-hover:opacity-100"
            loading="lazy"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black transition-all duration-500"></div>

        {/* Text Content */}
        <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-xl md:text-2xl font-bold mb-1">{title}</h3>
            <p className="text-gray-200 text-sm mb-2">{subtitle}</p>
            <button className="flex items-center text-yellow-400 hover:text-yellow-300 transition-colors text-sm font-medium">
                Know more
                <ArrowRight className="ml-1 w-4 h-4" />
            </button>
        </div>
    </div>
));

const SuccessStories = () => {
    const stories = [
        {
            imgSrc:
                "https://res.cloudinary.com/dlxil9dpo/image/upload/v1758014537/2_wbwtmj.avif",
            title: "Empowering Smiles",
            subtitle: "A story of hope and education",
            aspect: "aspect-[3/4]",
        },
        {
            imgSrc:
                "https://res.cloudinary.com/dlxil9dpo/image/upload/v1758014542/1_suxmxr.avif",
            title: "New Beginnings",
            subtitle: "Her story, her strength",
            aspect: "aspect-square",
        },
        {
            imgSrc:
                "https://res.cloudinary.com/dlxil9dpo/image/upload/v1758014542/3_oy5jmv.avif",
            title: "Breaking Barriers",
            subtitle: "Together we rise",
            aspect: "aspect-square",
        },
        {
            imgSrc:
                "https://res.cloudinary.com/dlxil9dpo/image/upload/v1758014549/4_qcb19a.avif",
            title: "Education for All",
            subtitle: "Dreams taking flight",
            aspect: "aspect-[4/3]",
            flexGrow: "flex-1"
        },
        {
            imgSrc:
                "https://res.cloudinary.com/dlxil9dpo/image/upload/v1758014550/5_wtvump.avif",
            title: "Courage and Community",
            subtitle: "From despair to determination",
            aspect: "aspect-[3/2]",

        },
    ];

    return (
        <section className="px-6 md:px-8 py-20 w-full bg-gray-100 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <h2 className="inline-block text-sm lg:text-xl tracking-wide text-white bg-purple-700 px-4 py-2 rounded mb-3">
                    Success Stories
                </h2>
                <h1 className="font-bold text-2xl md:text-3xl mb-3 text-gray-900">
                    By You, It's Happened
                </h1>
                <p className="text-gray-600 max-w-2xl mb-10">
                    Because of your support, women once overlooked now stand with
                    confidence and hope. Each story here is a testament to the power of
                    compassion—changing lives, one woman at a time.
                </p>

                {/* Optimized Responsive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4">
                    {/* Left Column */}
                    <div className="col-span-1 md:col-span-3 lg:col-span-4">
                        <StoryCard {...stories[0]} />
                    </div>

                    {/* Middle Column */}
                    <div className="col-span-1 md:col-span-3 lg:col-span-4 flex flex-col gap-4">
                        <StoryCard {...stories[1]} />
                        <StoryCard {...stories[2]} />
                    </div>

                    {/* Right Column */}
                    <div className="col-span-1 md:col-span-6 lg:col-span-4 flex flex-col gap-4">
                        <StoryCard {...stories[3]} />
                        <StoryCard {...stories[4]} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SuccessStories;
