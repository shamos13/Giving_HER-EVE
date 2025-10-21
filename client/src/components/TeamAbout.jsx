import { useState } from "react";
import { FaInstagram, FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";
import { motion } from "framer-motion";
import robi from "../assets/team-member-1.jpg"
import nelson from "../assets/team-member-2.jpg"
import joy from "../assets/team-member-3.jpg"
import wankio from "../assets/team-member-4.jpg"
import amos from "../assets/team-member-5.jpg"

const teamMembers = [
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
        image: "4.avif"
    },
    {
        name: "Amos Kwatuha",
        role: "Technical Advisor",
        image: amos
    }
];

export default function TeamAbout() {
    const [currentPage, setCurrentPage] = useState(0);

    const handlePrev = () => {
        setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
    };

    const handleNext = () => {
        setCurrentPage((prev) => (prev < 1 ? prev + 1 : prev));
    };

    return (
        <section className="max-w-7xl mx-auto py-12 md:py-16 px-4 sm:px-6 text-center">
            {/* Heading */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <motion.h2 
                    className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    Meet Our <motion.span 
                        className="relative inline-block"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        Devoted
                        <motion.span 
                            className="absolute left-0 bottom-0 w-full h-2 bg-yellow-300 -z-10"
                            initial={{ width: 0 }}
                            whileInView={{ width: "100%" }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            viewport={{ once: true }}
                        ></motion.span>
                    </motion.span> Team
                </motion.h2>
                <motion.p 
                    className="text-gray-600 max-w-2xl mx-auto mb-8 md:mb-12 text-sm sm:text-base"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    They are the backbone of our mission, combining compassion, expertise, and dedication to empower women and girls with equality, voice, and empowerment across underserved communities.
                </motion.p>
            </motion.div>

            {/* Horizontal Scrollable Team */}
            <motion.div 
                className="flex items-center gap-6 md:gap-8 overflow-x-auto pb-4 scrollbar-hide"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
            >
                {teamMembers.map((member, index) => (
                    <motion.div
                        key={index}
                        className="min-w-[250px] sm:min-w-[300px] bg-purple-50 rounded-xl shadow-md border border-purple-300 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        whileInView={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ 
                            y: -10, 
                            scale: 1.02,
                            transition: { duration: 0.3 }
                        }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-64 md:h-72 object-cover"
                            />
                        </motion.div>
                        <motion.div 
                            className="p-4 md:p-6 bg-white"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <motion.h3 
                                className="text-base md:text-lg font-semibold mb-2"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                {member.name}
                            </motion.h3>
                            <motion.p 
                                className="text-gray-500 mb-4 text-sm md:text-base"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                {member.role}
                            </motion.p>
                            <motion.div 
                                className="flex justify-center gap-3 md:gap-4 text-purple-600 text-lg md:text-xl"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.2, rotate: 5 }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FaInstagram className="hover:text-pink-500 cursor-pointer transition-colors duration-300" />
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.2, rotate: 5 }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FaTwitter className="hover:text-blue-400 cursor-pointer transition-colors duration-300" />
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.2, rotate: 5 }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FaLinkedin className="hover:text-blue-600 cursor-pointer transition-colors duration-300" />
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.2, rotate: 5 }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FaFacebook className="hover:text-blue-500 cursor-pointer transition-colors duration-300" />
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
