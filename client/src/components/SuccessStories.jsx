import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { fetchStories, isRecoverableApiError } from "../services/api";
import { IMPACT_STORIES_FALLBACK } from "../data/impactStories";
import { getResponsiveImage, isCloudinaryUrl, transformCloudinaryUrl } from "../utils/image";

const StoryCard = React.memo(({ imgSrc, title, subtitle, aspect, flexGrow, storyId }) => {
    const image = getResponsiveImage(imgSrc, {
        widths: [360, 560, 760, 980],
        aspectRatio: 4 / 3,
        sizes: "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw",
    });
    const blurPlaceholder = isCloudinaryUrl(imgSrc)
        ? transformCloudinaryUrl(imgSrc, "f_auto,q_auto:low,w_80,h_60,c_fill,e_blur:500")
        : "";

    return (
        <div className={`relative group overflow-hidden rounded-lg ${aspect} ${flexGrow || ""}`}>
            <img
                src={blurPlaceholder || image.src}
                alt="blur placeholder"
                className="absolute inset-0 w-full h-full object-cover blur-lg scale-110"
                loading="lazy"
                decoding="async"
            />

            <img
                src={image.src}
                srcSet={image.srcSet}
                sizes={image.sizes}
                alt={title}
                className="relative w-full h-full object-cover transition-opacity duration-700 opacity-90 group-hover:opacity-100"
                loading="lazy"
                decoding="async"
                width={980}
                height={735}
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
    );
});

const layoutAspects = ["aspect-[3/4]", "aspect-square", "aspect-square", "aspect-[4/3]", "aspect-[3/2]"];

const SuccessStories = ({ compact = false }) => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [useFallbackStories, setUseFallbackStories] = useState(false);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            setError(null);
            setUseFallbackStories(false);
            try {
                const data = await fetchStories();
                if (cancelled) return;
                setStories(Array.isArray(data) ? data : []);
            } catch (err) {
                if (!cancelled) {
                    const recoverable = isRecoverableApiError(err);
                    setError(recoverable ? null : "Unable to load stories right now.");
                    setUseFallbackStories(recoverable);
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
        const base = stories.length > 0
          ? stories
          : useFallbackStories
            ? IMPACT_STORIES_FALLBACK
            : [];
        return base.slice(0, 5).map((story, index) => ({
            imgSrc: story.imageUrl,
            title: story.title,
            subtitle: story.excerpt,
            aspect: layoutAspects[index] || "aspect-square",
            flexGrow: index === 3 ? "flex-1" : "",
            storyId: story.id,
        }));
    }, [stories, useFallbackStories]);

    return (
        <section className={`px-6 md:px-8 w-full bg-gray-100 overflow-hidden ${compact ? "py-12 md:py-14" : "py-20"}`}>
            <div className="max-w-7xl mx-auto">
                <h2 className="inline-block text-sm lg:text-xl tracking-wide text-white bg-purple-700 px-4 py-2 rounded mb-3">
                    Success Stories
                </h2>
                <h1 className="font-bold text-2xl md:text-3xl mb-3 text-gray-900">
                    By You, It's Happened
                </h1>
                <p className={`text-gray-600 max-w-2xl ${compact ? "mb-7" : "mb-10"}`}>
                    Because of your support, women once overlooked now stand with
                    confidence and hope. Each story here is a testament to the power of
                    compassion-changing lives, one woman at a time.
                </p>
                {loading && <p className="text-sm text-gray-500">Loading stories...</p>}
                {error && <p className="text-sm text-rose-600">{error}</p>}
                {!loading && useFallbackStories && (
                    <p className="text-sm text-amber-600">Live stories are temporarily unavailable. Showing fallback stories.</p>
                )}

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
