import { useEffect, useMemo, useState } from "react";
import { FaInstagram, FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";
import { motion, useReducedMotion } from "framer-motion";
import robi from "../assets/team-member-1.jpg"
import nelson from "../assets/team-member-2.jpg"
import joy from "../assets/team-member-3.jpg"
import wankio from "../assets/team-member-4.jpg"
import amos from "../assets/team-member-5.jpg"
import { fetchTeam, isRecoverableApiError } from "../services/api"

const FALLBACK_TEAM_MEMBERS = [
    {
        name: "Patience Chacha Mandela",
        role: "Founder / C.E.O",
        image: robi
    },
    {
        name: "Nelson Kimani Mandela",
        role: "Treasurer & Chairman",
        image: nelson
    },
    {
        name: "Joylois Kwatuha",
        role: "Project Manager",
        image: joy
    },
    {
        name: "Precious Chacha",
        role: "Secretary & Administrator",
        image: wankio
    },
    {
        name: "Beverly Chacha",
        role: "Social Media Strategist",
        image: amos
    },
    {
        name: "Amos Kwatuha",
        role: "Technical Advisor",
        image: amos
    }
];

function applyCloudinaryTransform(url, transform) {
    if (typeof url !== "string" || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
        return url;
    }
    return url.replace("/upload/", `/upload/${transform}/`);
}

function getTeamImageVariants(url) {
    if (typeof url !== "string" || !url.trim()) {
        return { src: "", srcSet: undefined, sizes: undefined };
    }

    const trimmed = url.trim();
    if (!trimmed.includes("res.cloudinary.com") || !trimmed.includes("/upload/")) {
        return { src: trimmed, srcSet: undefined, sizes: undefined };
    }

    const build = (size) =>
        applyCloudinaryTransform(trimmed, `c_fill,g_auto,h_${size},w_${size},f_auto,q_auto`);

    return {
        src: build(480),
        srcSet: `${build(320)} 320w, ${build(480)} 480w, ${build(640)} 640w`,
        sizes: "(max-width: 640px) 250px, 300px",
    };
}

export default function TeamAbout({ compact = false }) {
    const reduceMotion = useReducedMotion();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [teamMembersData, setTeamMembersData] = useState([]);
    const [useFallbackMembers, setUseFallbackMembers] = useState(false);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            setError(null);
            setUseFallbackMembers(false);
            try {
                const data = await fetchTeam();
                if (cancelled) return;
                setTeamMembersData(Array.isArray(data) ? data : []);
            } catch (err) {
                if (!cancelled) {
                    const recoverable = isRecoverableApiError(err);
                    setTeamMembersData([]);
                    setError(recoverable ? null : "Unable to load team members right now.");
                    setUseFallbackMembers(recoverable);
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

    const teamMembers = useMemo(() => {
        const liveMembers = teamMembersData.map((member, index) => ({
            name: member.name || `Team Member ${index + 1}`,
            role: member.role || "Team Member",
            ...getTeamImageVariants(member.photo || ""),
        }));
        if (liveMembers.length > 0) return liveMembers;
        return useFallbackMembers
            ? FALLBACK_TEAM_MEMBERS.map((member) => ({ ...member, src: member.image, srcSet: undefined, sizes: undefined }))
            : [];
    }, [teamMembersData, useFallbackMembers]);

    return (
        <section className={`max-w-7xl mx-auto px-4 sm:px-6 text-center ${compact ? "py-10 md:py-12" : "py-12 md:py-16"}`}>
            {/* Heading */}
            <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={reduceMotion ? undefined : { duration: 0.45, ease: "easeOut" }}
                viewport={{ once: true }}
            >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                    Meet Our <span className="relative inline-block">
                        Devoted
                        <span className="absolute left-0 bottom-0 w-full h-2 bg-yellow-300 -z-10"></span>
                    </span> Team
                </h2>
                <p className={`text-gray-600 max-w-2xl mx-auto text-sm sm:text-base ${compact ? "mb-6 md:mb-8" : "mb-8 md:mb-12"}`}>
                    They are the backbone of our mission, combining compassion, expertise, and dedication to empower women and girls with equality, voice, and empowerment across underserved communities.
                </p>
            </motion.div>

            {/* Horizontal Scrollable Team */}
            {loading && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                    Loading team members...
                </div>
            )}
            {!loading && error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-6 text-sm text-rose-600">
                    Unable to load team members right now.
                </div>
            )}
            {!loading && useFallbackMembers && (
                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    Live team data is temporarily unavailable. Showing fallback team members.
                </div>
            )}
            {!loading && !error && teamMembers.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                    Team members coming soon.
                </div>
            )}
            <div className={`flex items-center overflow-x-auto pb-4 scrollbar-hide ${compact ? "gap-5 md:gap-6" : "gap-6 md:gap-8"}`}>
                {!loading && teamMembers.map((member, index) => (
                    <motion.div
                        key={index}
                        className={`group bg-purple-50 rounded-xl shadow-md border border-purple-300 hover:shadow-lg transition-[transform,box-shadow] duration-200 flex flex-col overflow-hidden ${compact ? "min-w-[230px] sm:min-w-[260px]" : "min-w-[250px] sm:min-w-[300px]"}`}
                        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                        transition={
                            reduceMotion
                                ? undefined
                                : { duration: 0.35, delay: Math.min(index * 0.05, 0.2), ease: "easeOut" }
                        }
                        viewport={{ once: true, amount: 0.25 }}
                        whileHover={reduceMotion ? undefined : { y: -4 }}
                    >
                        <div className="overflow-hidden">
                            <img
                                src={member.src}
                                srcSet={member.srcSet}
                                sizes={member.sizes}
                                alt={member.name}
                                loading="lazy"
                                decoding="async"
                                width={480}
                                height={480}
                                className={`w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] ${compact ? "h-56 md:h-64" : "h-64 md:h-72"}`}
                            />
                        </div>
                        <div className="p-4 md:p-6 bg-white">
                            <h3 className="text-base md:text-lg font-semibold mb-2">
                                {member.name}
                            </h3>
                            <p className="text-gray-500 mb-4 text-sm md:text-base">
                                {member.role}
                            </p>
                            <div className="flex justify-center gap-3 md:gap-4 text-purple-600 text-lg md:text-xl">
                                <div className="transition-transform duration-150 hover:scale-110 active:scale-95">
                                    <FaInstagram className="hover:text-pink-500 cursor-pointer transition-colors duration-300" />
                                </div>
                                <div className="transition-transform duration-150 hover:scale-110 active:scale-95">
                                    <FaTwitter className="hover:text-blue-400 cursor-pointer transition-colors duration-300" />
                                </div>
                                <div className="transition-transform duration-150 hover:scale-110 active:scale-95">
                                    <FaLinkedin className="hover:text-blue-600 cursor-pointer transition-colors duration-300" />
                                </div>
                                <div className="transition-transform duration-150 hover:scale-110 active:scale-95">
                                    <FaFacebook className="hover:text-blue-500 cursor-pointer transition-colors duration-300" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
