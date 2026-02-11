import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import bg_image from "../assets/Image.webp"
import DeferredMount from "../components/DeferredMount.jsx";

import {Plus, GraduationCap, Heart, Check, ArrowLeft, ArrowRight} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Suspense, lazy, useEffect, useState } from "react";
import { Link } from "react-router";
import { getResponsiveImage } from "../utils/image";
import { fetchActiveCampaigns, isRecoverableApiError } from "../services/api";
import { FALLBACK_CAMPAIGNS } from "../data/fallbackCampaigns";

const SuccessStories = lazy(() => import("../components/SuccessStories.jsx"));
const Steps = lazy(() => import("../components/Steps.jsx"));
const Testimonials = lazy(() => import("../components/Testimonials.jsx"));
const Team = lazy(() => import("../components/Team.jsx"));

const HERO_SLIDES = [
    {
        image: "/hero.webp",
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

const formatCurrency = (amount = 0) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(amount);

const CampaignCardProgressBar = ({ raised, goal }) => {
    const percentage = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

    return (
        <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span className="font-semibold text-gray-900">
                    {formatCurrency(raised)}{" "}
                    <span className="font-normal text-gray-500">
                        raised of {formatCurrency(goal)} goal
                    </span>
                </span>
                <span className="text-gray-500">{percentage}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-[#7F19E6] rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

const HeroSection = () => {
    const [current, setCurrent] = useState(0);
    const currentSlideImage = getResponsiveImage(HERO_SLIDES[current].image, {
        widths: [640, 960, 1280, 1600, 1920],
        aspectRatio: 16 / 9,
        sizes: "100vw",
    });

    useEffect(() => {
        const id = setInterval(() => {
            setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 15000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const nextSlide = HERO_SLIDES[(current + 1) % HERO_SLIDES.length];
        if (!nextSlide?.image) return;
        const nextSlideImage = getResponsiveImage(nextSlide.image, {
            widths: [640, 960, 1280, 1600],
            aspectRatio: 16 / 9,
            sizes: "100vw",
        });
        const preloadImage = new window.Image();
        preloadImage.src = nextSlideImage.src;
    }, [current]);

    const goTo = (index) => setCurrent((index + HERO_SLIDES.length) % HERO_SLIDES.length);

    return (
        <section className="relative min-h-[78vh] md:min-h-[86vh] flex items-center justify-center overflow-hidden mb-8 md:mb-12">
            {/* Background Carousel */}
            <div className="absolute inset-0">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={HERO_SLIDES[current].image}
                        src={currentSlideImage.src}
                        srcSet={currentSlideImage.srcSet}
                        sizes={currentSlideImage.sizes}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full object-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        loading={current === 0 ? "eager" : "lazy"}
                        fetchPriority={current === 0 ? "high" : "auto"}
                        decoding="async"
                    />
                </AnimatePresence>
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
                    loading="lazy"
                    decoding="async"
                    width={160}
                    height={160}
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
                    loading="lazy"
                    decoding="async"
                    width={160}
                    height={160}
                />
            </motion.div>
        </section>
    );

}

const CharityService = () => {
    return (
        <section className="relative px-4 sm:px-6 md:px-20 py-10 md:py-14 bg-white w-full bg-gray-300">
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
                <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-6 max-w-none">
                    {/*Service Cards*/}
                    <motion.div 
                        className="bg-purple-700 text-white p-5 md:p-6 rounded-lg shadow-lg relative overflow-hidden min-h-[180px] md:min-h-[220px]"
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
                        className="relative bg-white border border-gray-200 p-5 md:p-6 rounded-lg shadow-lg"
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
                        className="bg-white border border-gray-200 p-5 md:p-6 rounded-lg shadow-lg relative overflow-hidden"
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
                    loading="lazy"
                    decoding="async"
                    width={120}
                    height={120}
                />
            </motion.div>
            {/* Button */}
            <motion.div 
                className="flex items-center justify-center mt-6 md:mt-8"
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

const CampaignHighlights = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [useFallbackCampaigns, setUseFallbackCampaigns] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function loadCampaigns() {
            setLoading(true);
            setError(null);
            setUseFallbackCampaigns(false);
            try {
                const data = await fetchActiveCampaigns();
                if (cancelled) return;
                setCampaigns(Array.isArray(data) ? data.slice(0, 3) : []);
            } catch (err) {
                if (!cancelled) {
                    const recoverable = isRecoverableApiError(err);
                    setCampaigns(recoverable ? FALLBACK_CAMPAIGNS.slice(0, 3) : []);
                    setUseFallbackCampaigns(recoverable);
                    setError(recoverable ? null : "Unable to load campaign highlights right now.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void loadCampaigns();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <section className="bg-[#F7F6F8] py-10 md:py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-sm font-semibold text-[#F036DC] mb-4"
                >
                    Our Campaign
                </motion.p>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.05 }}
                    viewport={{ once: true }}
                    className="max-w-xl text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight font-playfair"
                >
                    Giving Help To Those Who Need It
                </motion.h2>

                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {loading &&
                        Array.from({ length: 3 }, (_, index) => (
                            <div key={`campaign-skeleton-${index}`} className="rounded-3xl bg-white p-6 shadow-sm animate-pulse">
                                <div className="aspect-[16/10] rounded-2xl bg-gray-200" />
                                <div className="mt-5 h-5 w-4/5 rounded bg-gray-200" />
                                <div className="mt-3 h-5 w-3/5 rounded bg-gray-200" />
                                <div className="mt-8 h-8 w-full rounded bg-gray-200" />
                                <div className="mt-5 h-12 w-full rounded-xl bg-gray-200" />
                            </div>
                        ))}

                    {!loading &&
                        campaigns.map((campaign, index) => {
                            const image = getResponsiveImage(campaign.image, {
                                widths: [360, 520, 760, 980],
                                aspectRatio: 16 / 10,
                                sizes: "(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw",
                            });

                            return (
                                <motion.div
                                    key={campaign.id}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.45, delay: index * 0.08 }}
                                    viewport={{ once: true }}
                                >
                                    <Link
                                        to={`/campaigns/${campaign.id}`}
                                        className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group border border-gray-100"
                                    >
                                        <div className="relative w-full aspect-[16/10] overflow-hidden">
                                            <img
                                                src={image.src}
                                                srcSet={image.srcSet}
                                                sizes={image.sizes}
                                                alt={campaign.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                loading="lazy"
                                                decoding="async"
                                                width={980}
                                                height={612}
                                            />
                                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                                                <span className="text-[#7F19E6] font-bold text-[10px] uppercase tracking-wider">
                                                    {campaign.category}
                                                </span>
                                            </div>
                                            {campaign.label && (
                                                <span className="absolute top-4 right-4 rounded-full bg-[#F7B500] text-[10px] font-bold text-[#4A2A00] px-3 py-1 shadow-sm uppercase tracking-wide">
                                                    {campaign.label}
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-6 flex flex-col gap-4">
                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#7F19E6] transition-colors">
                                                {campaign.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 line-clamp-2">
                                                {campaign.shortDescription}
                                            </p>
                                            <CampaignCardProgressBar raised={campaign.raised} goal={campaign.goal} />
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto text-xs">
                                                <span className="text-gray-500">{campaign.location}</span>
                                                <span className="inline-flex items-center gap-1 text-[#7F19E6] font-semibold">
                                                    View details
                                                    <ArrowRight className="h-3 w-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                </div>

                {!loading && Boolean(error) && (
                    <p className="mt-6 text-sm text-rose-600">{error}</p>
                )}

                {!loading && useFallbackCampaigns && (
                    <p className="mt-2 text-sm text-amber-600">
                        Live campaign data is temporarily unavailable. Showing fallback campaigns.
                    </p>
                )}

                {!loading && campaigns.length === 0 && !error && (
                    <p className="mt-6 text-sm text-gray-600">Campaign highlights will appear here soon.</p>
                )}

                <div className="mt-8 flex justify-center lg:justify-end">
                    <Link
                        to="/campaigns"
                        className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#6A0DAD] hover:text-[#F036DC]"
                    >
                        View all campaigns
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

const WHO_WE_ARE_POINTS = [
    "Support women and girls in urgent need",
    "Build safe spaces for learning and healing",
    "Create lasting impact through community-led programs",
    "Grow a compassionate network of changemakers",
];

const WHO_WE_ARE_PRIMARY_FALLBACK = "https://res.cloudinary.com/dlxil9dpo/image/upload/v1758014550/5_wtvump.avif";
const WHO_WE_ARE_SECONDARY_FALLBACK = "https://res.cloudinary.com/dlxil9dpo/image/upload/v1758014542/1_suxmxr.avif";
const WHO_WE_ARE_PRIMARY_IMAGE_SOURCES = [
    "/who-we-are-1.jpg",
    "/who-we-are-1.jpeg",
    "/who-we-are-1.png",
    "/who-we-are-1.webp",
    "/who-we-are-1.avif",
    WHO_WE_ARE_PRIMARY_FALLBACK,
];
const WHO_WE_ARE_SECONDARY_IMAGE_SOURCES = [
    "/who-we-are-2.jpg",
    "/who-we-are-2.jpeg",
    "/who-we-are-2.png",
    "/who-we-are-2.webp",
    "/who-we-are-2.avif",
    WHO_WE_ARE_SECONDARY_FALLBACK,
];

const WHO_WE_ARE_SECTION_MOTION = {
    hidden: { opacity: 0, y: 18 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.55,
            ease: "easeOut",
            staggerChildren: 0.1,
        },
    },
};

const WHO_WE_ARE_ITEM_MOTION = {
    hidden: { opacity: 0, y: 14 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: "easeOut" },
    },
};

const AboutUs = ()=>{
    const reduceMotion = useReducedMotion();
    const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
    const [secondaryImageIndex, setSecondaryImageIndex] = useState(0);
    const primaryImage = WHO_WE_ARE_PRIMARY_IMAGE_SOURCES[Math.min(primaryImageIndex, WHO_WE_ARE_PRIMARY_IMAGE_SOURCES.length - 1)];
    const secondaryImage = WHO_WE_ARE_SECONDARY_IMAGE_SOURCES[Math.min(secondaryImageIndex, WHO_WE_ARE_SECONDARY_IMAGE_SOURCES.length - 1)];

    return (
        <section className="relative bg-white py-8 md:py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-8 lg:grid-cols-[1.02fr_1fr] items-center">
                <motion.div
                    className="relative pb-0 md:pb-14"
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <motion.div
                        className="relative overflow-hidden rounded-3xl shadow-[0_22px_60px_-28px_rgba(106,13,173,0.45)]"
                        animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
                        transition={reduceMotion ? undefined : { duration: 6.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
                    >
                        <img
                            src={primaryImage}
                            alt="Giving Her E.V.E volunteers supporting students"
                            className="w-full aspect-[4/3] object-cover object-center"
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                            width={1200}
                            height={900}
                            onError={() =>
                                setPrimaryImageIndex((currentIndex) =>
                                    Math.min(currentIndex + 1, WHO_WE_ARE_PRIMARY_IMAGE_SOURCES.length - 1),
                                )
                            }
                        />
                    </motion.div>
                    <motion.div
                        className="absolute -top-5 -left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#6A0DAD] text-white shadow-lg md:h-14 md:w-14"
                        animate={reduceMotion ? undefined : { y: [0, -4, 0], rotate: [0, 4, 0] }}
                        transition={reduceMotion ? undefined : { duration: 4.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
                    >
                        <Heart className="h-5 w-5 md:h-6 md:w-6" />
                    </motion.div>
                    <motion.div
                        className="mt-4 ml-auto w-[62%] overflow-hidden rounded-2xl border-4 border-white shadow-xl md:absolute md:-bottom-6 md:right-2 md:mt-0 md:w-[52%]"
                        animate={reduceMotion ? undefined : { y: [0, 5, 0] }}
                        transition={reduceMotion ? undefined : { duration: 5.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
                    >
                        <img
                            src={secondaryImage}
                            alt="Giving Her E.V.E team member speaking to a community group"
                            className="w-full aspect-[4/3] object-cover object-center"
                            loading="lazy"
                            decoding="async"
                            width={760}
                            height={570}
                            onError={() =>
                                setSecondaryImageIndex((currentIndex) =>
                                    Math.min(currentIndex + 1, WHO_WE_ARE_SECONDARY_IMAGE_SOURCES.length - 1),
                                )
                            }
                        />
                    </motion.div>
                </motion.div>

                <motion.div
                    className="lg:pl-5"
                    variants={WHO_WE_ARE_SECTION_MOTION}
                    whileInView="show"
                    initial="hidden"
                    transition={{ delayChildren: 0.1 }}
                    viewport={{ once: true }}
                >
                    <motion.p variants={WHO_WE_ARE_ITEM_MOTION} className="text-sm font-semibold text-[#6A0DAD] mb-3">Who we are</motion.p>
                    <motion.h2 variants={WHO_WE_ARE_ITEM_MOTION} className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                        We're a Non-Profit Charity & NGO Organization
                    </motion.h2>
                    <motion.div variants={WHO_WE_ARE_ITEM_MOTION} className="mt-4 h-1 w-20 rounded-full bg-[#F036DC]" />
                    <motion.p variants={WHO_WE_ARE_ITEM_MOTION} className="mt-5 text-base text-gray-600 leading-relaxed max-w-xl">
                        Giving Her E.V.E exists to restore dignity, opportunity, and hope for women and girls through
                        practical support in health, education, and community empowerment.
                    </motion.p>
                    <motion.ul variants={WHO_WE_ARE_ITEM_MOTION} className="mt-6 space-y-2.5">
                        {WHO_WE_ARE_POINTS.map((point) => (
                            <motion.li
                                key={point}
                                className="flex items-start gap-3 text-gray-700"
                                variants={WHO_WE_ARE_ITEM_MOTION}
                            >
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F036DC]/10 text-[#F036DC]">
                                    <Check className="h-3.5 w-3.5" />
                                </span>
                                <span className="text-sm sm:text-base font-medium">{point}</span>
                            </motion.li>
                        ))}
                    </motion.ul>
                    <motion.div variants={WHO_WE_ARE_ITEM_MOTION}>
                        <Link
                            to="/about"
                            className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#F036DC] px-7 py-3 text-white font-semibold transition-all duration-300 hover:bg-[#6A0DAD] hover:scale-105"
                        >
                            About Us
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

const CallToAction = ()=>{
    return(
        <section className="relative py-10 md:py-14 bg-[#6A0DAD] text-white mb-6 md:mb-8">
            <div className="absolute z-0 inset-0 overflow-hidden">
                <img
                    src={bg_image}
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full object-cover opacity-50"
                    loading="lazy"
                    decoding="async"
                    width={1920}
                    height={1080}
                />
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

const SectionFallback = () => (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="h-44 rounded-2xl bg-slate-100 animate-pulse" />
    </section>
);

const HomePage = () => {
    return (
        <div className="min-h-screen">
            <Header/>
            <HeroSection/>
            <CharityService/>
            <AboutUs/>
            <DeferredMount fallback={<SectionFallback />}>
                <Suspense fallback={<SectionFallback />}>
                    <SuccessStories compact />
                </Suspense>
            </DeferredMount>
            <DeferredMount fallback={<SectionFallback />}>
                <Suspense fallback={<SectionFallback />}>
                    <Steps/>
                </Suspense>
            </DeferredMount>
            <CampaignHighlights/>
            <DeferredMount fallback={<SectionFallback />}>
                <Suspense fallback={<SectionFallback />}>
                    <Testimonials compact />
                </Suspense>
            </DeferredMount>
            <CallToAction/>
            <DeferredMount fallback={<SectionFallback />}>
                <Suspense fallback={<SectionFallback />}>
                    <Team compact />
                </Suspense>
            </DeferredMount>
            <Footer/>
        </div>
    )
}

export default HomePage;
