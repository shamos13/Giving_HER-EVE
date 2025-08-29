import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';
import robi from "../assets/team-member-1.jpg"
import nelson from "../assets/team-member-2.jpg"
import joy from "../assets/team-member-3.jpg"
import wankio from "../assets/team-member-4.jpg"
import amos from "../assets/team-member-5.jpg"


const DevotedTeamSection = () => {
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
        <a
            href={href}
            className="w-8 h-8 rounded-full bg-purple-100 hover:bg-purple-200 flex items-center justify-center transition-colors duration-200"
        >
            <Icon size={16} className="text-purple-600" />
        </a>
    );

    const TeamMemberCard = ({ member }) => (
        <div className="bg-white rounded-xl border-2 border-purple-300 p-6 shadow-lg hover:shadow-xl hover:border-purple-400 transition-all duration-300 group">
            <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 md:w-32 md:h-32 mb-4 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold text-xl">' + member.name.split(' ').map(n => n[0]).join('') + '</div>';
                        }}
                    />
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {member.name}
                </h3>

                <p className="text-gray-600 text-sm mb-4">
                    {member.role}
                </p>

                <div className="flex space-x-3">
                    <SocialIcon Icon={Instagram} />
                    <SocialIcon Icon={Twitter} />
                    <SocialIcon Icon={Linkedin} />
                    <SocialIcon Icon={Facebook} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    Meet Our{' '}
                    <span className="relative">
            Devoted
            <span className="absolute bottom-1 left-0 w-full h-3 bg-yellow-300 -z-10"></span>
          </span>
                    {' '}Team
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                    They are the driving force of our mission, infusing their European heritage and
                    global experience into our philanthropic endeavors.
                </p>
            </div>

            {/* Team Grid - Horizontally Scrollable Container */}
            <div className="mb-12">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-gray-100 pb-4">
                    <div className="flex space-x-6 min-w-max px-2">
                        {teamMembers.map((member) => (
                            <div key={member.id} className="flex-shrink-0 w-72 sm:w-80">
                                <TeamMemberCard member={member} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll Indicator */}
                {teamMembers.length > 3 && (
                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-500 flex items-center justify-center space-x-2">
                            <span>←</span>
                            <span>Scroll horizontally to see more team members</span>
                            <span>→</span>
                        </p>
                    </div>
                )}
            </div>


        </div>
    );
};

export default DevotedTeamSection;