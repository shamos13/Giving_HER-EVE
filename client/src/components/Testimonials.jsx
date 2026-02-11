import { useEffect, useState } from "react";
import { fetchTestimonials, isRecoverableApiError } from "../services/api";
import { getResponsiveImage } from "../utils/image";

const FALLBACK_TESTIMONIALS = [
    {
        id: "fallback-testimonial-1",
        quote:
            "Giving Her E.V.E helped our community access safe spaces and education resources we never thought possible.",
        name: "Amara Keita",
        role: "Community Partner",
        avatar:
            "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
];

const Testimonials = ({ compact = false }) => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [useFallbackTestimonials, setUseFallbackTestimonials] = useState(false);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            setError(null);
            setUseFallbackTestimonials(false);
            try {
                const data = await fetchTestimonials();
                if (cancelled) return;
                setTestimonials(Array.isArray(data) ? data : []);
            } catch (err) {
                if (!cancelled) {
                    const recoverable = isRecoverableApiError(err);
                    setTestimonials(recoverable ? FALLBACK_TESTIMONIALS : []);
                    setUseFallbackTestimonials(recoverable);
                    setError(recoverable ? null : "Unable to load testimonials right now.");
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

    const featured = testimonials[0] ?? null;
    const featuredAvatar = featured
        ? getResponsiveImage(featured.avatar, {
            widths: [40, 80, 120],
            sizes: "40px",
            aspectRatio: 1,
        })
        : { src: "", srcSet: undefined, sizes: undefined };

    return (
        <section
            className={`relative isolate overflow-hidden bg-white px-6 lg:px-8 ${compact ? "py-14 sm:py-18" : "py-24 sm:py-32"}`}
        >
            <div
                className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,var(--color-indigo-100),white)] opacity-20" />
            <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl ring-1 shadow-indigo-600/10 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
            <div className="mx-auto max-w-2xl lg:max-w-4xl">
                <img
                    alt=""
                    src="logo.svg"
                    className="mx-auto h-12"
                    loading="lazy"
                    decoding="async"
                    width={180}
                    height={48}
                />

                {loading && <p className={`${compact ? "mt-7" : "mt-10"} text-center text-sm text-gray-500`}>Loading testimonials...</p>}
                {error && <p className={`${compact ? "mt-7" : "mt-10"} text-center text-sm text-rose-600`}>{error}</p>}
                {!loading && useFallbackTestimonials && (
                    <p className={`${compact ? "mt-7" : "mt-10"} text-center text-sm text-amber-600`}>
                        Live testimonials are temporarily unavailable. Showing fallback testimonial.
                    </p>
                )}

                {featured && (
                    <figure className={compact ? "mt-7" : "mt-10"}>
                        <blockquote className="text-center text-xl/8 font-semibold text-gray-900 sm:text-2xl/9">
                            <p>
                                {featured.quote}
                            </p>
                        </blockquote>
                        <figcaption className={compact ? "mt-7" : "mt-10"}>
                            <img
                                alt={featured.name}
                                src={featuredAvatar.src}
                                srcSet={featuredAvatar.srcSet}
                                sizes={featuredAvatar.sizes}
                                className="mx-auto size-10 rounded-full"
                                loading="lazy"
                                decoding="async"
                                width={80}
                                height={80}
                            />
                            <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                                <div className="font-semibold text-gray-900">{featured.name}</div>
                                <svg width={3} height={3} viewBox="0 0 2 2" aria-hidden="true" className="fill-gray-900">
                                    <circle r={1} cx={1} cy={1} />
                                </svg>
                                <div className="text-gray-600">{featured.role}</div>
                            </div>
                        </figcaption>
                    </figure>
                )}

                {!loading && !featured && !error && (
                    <p className={`${compact ? "mt-7" : "mt-10"} text-center text-sm text-gray-500`}>No testimonials available yet.</p>
                )}
            </div>
        </section>
    )
}
export default Testimonials;
