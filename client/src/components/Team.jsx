import React, { useState } from 'react';
import {Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';
import { motion } from 'framer-motion';
import robi from "../assets/team-member-1.jpg"
import nelson from "../assets/team-member-2.jpg"
import joy from "../assets/team-member-3.jpg"
import wankio from "../assets/team-member-4.jpg"
import amos from "../assets/team-member-5.jpg"


const Team = () => {
    const [currentPage, setCurrentPage] = useState(0);

    const teamMembers = [
        {
            id: 1,
            name: "Patience Chacha Mandela",
            role: "Founder / C.E.O",
            image: robi
        },
        {
            id: 2,
            name: "Nelson Kimani Mandela",
            role: "Treasurer & Chairman",
            image: nelson
        },
        {
            id: 3,
            name: "Joylois Kwatuha",
            role: "Project Manager",
            image: joy
        },
        {
            id: 4,
            name: "Precious Chacha",
            role: "Secretary & Administrator",
            image: wankio
        },
        {
            id: 5,
            name: "Beverly Chacha",
            role: "Social Media Strategist",
            image: "4.avif"
        },
        {
            id: 6,
            name: "Amos Kwatuha",
            role: "Technical Advisor",
            image: amos
        },

    ];


    const SocialIcon = ({ Icon, href = "#" }) => (
        <motion.a
            href={href}
            className="w-8 h-8 rounded-full bg-purple-100 hover:bg-purple-200 flex items-center justify-center transition-colors duration-200"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
        >
            <Icon size={16} className="text-purple-600" />
        </motion.a>
    );

    const TeamMemberCard = ({ member, index }) => (
        <motion.div 
            className="bg-white rounded-xl border-2 border-purple-300 p-6 shadow-lg hover:shadow-xl hover:border-purple-400 transition-all duration-300 group"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ 
                y: -10, 
                scale: 1.02,
                transition: { duration: 0.3 }
            }}
        >
            <div className="flex flex-col items-center text-center">
                <motion.div 
                    className="w-24 h-24 md:w-32 md:h-32 mb-4 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                >
                    <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold text-xl">' + member.name.split(' ').map(n => n[0]).join('') + '</div>';
                        }}
                    />
                </motion.div>

                <motion.h3 
                    className="text-lg font-semibold text-gray-800 mb-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    viewport={{ once: true }}
                >
                    {member.name}
                </motion.h3>

                <motion.p 
                    className="text-gray-600 text-sm mb-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    viewport={{ once: true }}
                >
                    {member.role}
                </motion.p>

                <motion.div 
                    className="flex space-x-3"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    viewport={{ once: true }}
                >
                    <SocialIcon Icon={Instagram} />
                    <SocialIcon Icon={Twitter} />
                    <SocialIcon Icon={Linkedin} />
                    <SocialIcon Icon={Facebook} />
                </motion.div>
            </div>
        </motion.div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <motion.div 
                className="text-center mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <motion.h2 
                    className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    Meet Our{' '}
                    <motion.span 
                        className="relative"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        Devoted
                        <motion.span 
                            className="absolute bottom-1 left-0 w-full h-3 bg-yellow-300 -z-10"
                            initial={{ width: 0 }}
                            whileInView={{ width: "100%" }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            viewport={{ once: true }}
                        ></motion.span>
                    </motion.span>
                    {' '}Team
                </motion.h2>
                <motion.p 
                    className="text-gray-600 max-w-2xl mx-auto text-lg"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    Behind Giving Her E.V.E is a team of passionate individuals who believe in equality, voice, and empowerment.
                    Together, we bring skills, compassion, and vision to transform communities one girl at a time.
                </motion.p>
            </motion.div>

            {/* Team Grid - Horizontally Scrollable Container */}
            <motion.div 
                className="mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
            >
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-gray-100 pb-4">
                    <div className="flex space-x-6 min-w-max px-2">
                        {teamMembers.map((member, index) => (
                            <div key={member.id} className="flex-shrink-0 w-72 sm:w-80">
                                <TeamMemberCard member={member} index={index} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll Indicator */}
                {teamMembers.length > 3 && (
                    <motion.div 
                        className="text-center mt-4"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <motion.p 
                            className="text-sm text-gray-500 flex items-center justify-center space-x-2"
                            animate={{ 
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <motion.span
                                animate={{ x: [-5, 5, -5] }}
                                transition={{ 
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >←</motion.span>
                            <span>Scroll horizontally to see more team members</span>
                            <motion.span
                                animate={{ x: [5, -5, 5] }}
                                transition={{ 
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >→</motion.span>
                        </motion.p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default Team;