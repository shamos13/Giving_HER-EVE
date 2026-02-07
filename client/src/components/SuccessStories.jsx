import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { fetchStories } from "../services/api";
import { IMPACT_STORIES_FALLBACK } from "../data/impactStories";

const cloudinaryTransform = (src, transform) => {
    if (!src) return src;
    return src.includes("/upload/") ? src.replace("/upload/", `/upload/${transform}/`) : src;
};

const StoryCard = React.memo(({ imgSrc, title, subtitle, aspect, flexGrow, storyId }) => (
    <div className={`relative group overflow-hidden rounded-lg ${aspect} ${flexGrow || ""}`}>
        <img
            src={cloudinaryTransform(imgSrc, "f_auto,q_auto:low,w_50,h_50,c_fill")}
            alt="blur placeholder"
            className="absolute inset-0 w-full h-full object-cover blur-lg scale-110"
            loading="lazy"
        />

        <img
            src={cloudinaryTransform(imgSrc, "f_auto,q_auto,w_800,h_600,c_fill")}
            alt={title}
            className="relative w-full h-full object-cover transition-opacity duration-700 opacity-90 group-hover:opacity-100"
            loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black transition-all duration-500"></div>

        <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-xl md:text-2xl font-bold mb-1">{title}</h3>
            <p className="text-gray-200 text-sm mb-2">{subtitle}</p>
            <Link
                to={`/impact/${storyId}`}
                className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors text-sm font-medium"
            >
                Read more
                <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
        </div>
    </div>
));

const layoutAspects = ["aspect-[3/4]", "aspect-square", "aspect-square", "aspect-[4/3]", "aspect-[3/2]"];

const SuccessStories = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchStories();
                if (cancelled) return;
                setStories(data);
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Failed to load stories");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }
        void load();
        return () => {
            cancelled = true;
        };
    }, []);

    const displayed = useMemo(() => {
        const base = stories.length > 0 ? stories : IMPACT_STORIES_FALLBACK;
        return base.slice(0, 5).map((story, index) => ({
            imgSrc: story.imageUrl,
            title: story.title,
            subtitle: story.excerpt,
            aspect: layoutAspects[index] || "aspect-square",
            flexGrow: index === 3 ? "flex-1" : "",
            storyId: story.id,
        }));
    }, [stories]);

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
                    compassion-changing lives, one woman at a time.
                </p>
                {loading && <p className="text-sm text-gray-500">Loading stories...</p>}
                {error && <p className="text-sm text-rose-600">Error: {error}</p>}

                <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4">
                    {displayed[0] && (
                        <div className="col-span-1 md:col-span-3 lg:col-span-4">
                            <StoryCard {...displayed[0]} />
                        </div>
                    )}

                    {(displayed[1] || displayed[2]) && (
                        <div className="col-span-1 md:col-span-3 lg:col-span-4 flex flex-col gap-4">
                            {displayed[1] && <StoryCard {...displayed[1]} />}
                            {displayed[2] && <StoryCard {...displayed[2]} />}
                        </div>
                    )}

                    {(displayed[3] || displayed[4]) && (
                        <div className="col-span-1 md:col-span-6 lg:col-span-4 flex flex-col gap-4">
                            {displayed[3] && <StoryCard {...displayed[3]} />}
                            {displayed[4] && <StoryCard {...displayed[4]} />}
                        </div>
                    )}
                </div>

                {!loading && displayed.length === 0 && (
                    <p className="text-sm text-gray-500">No stories published yet.</p>
                )}
            </div>
        </section>
    );
};

export default SuccessStories;
