import { useState } from "react";
import { FaInstagram, FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";
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
        <section className="max-w-7xl mx-auto py-16 px-6 text-center">
            {/* Heading */}
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Meet Our <span className="relative inline-block">Devoted
          <span className="absolute left-0 bottom-0 w-full h-2 bg-yellow-300 -z-10"></span>
        </span> Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-12">
                They are the backbone of our mission, combining compassion, expertise, and dedication to empower women and girls with equality, voice, and empowerment across underserved communities.
            </p>

            {/* Horizontal Scrollable Team */}
            <div className="flex  items-center gap-8 overflow-x-auto pb-4  scrollbar-hide">
                {teamMembers.map((member, index) => (
                    <div
                        key={index}
                        className="min-w-[250px] sm:min-w-[300px] bg-purple-50 rounded-xl shadow-md border border-purple-300 hover:shadow-lg transition flex flex-col overflow-hidden"
                    >
                        <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-72 object-cover"
                        />
                        <div className="p-6 bg-white">
                            <h3 className="text-lg font-semibold">{member.name}</h3>
                            <p className="text-gray-500 mb-4">{member.role}</p>
                            <div className="flex justify-center gap-4 text-purple-600 text-xl">
                                <FaInstagram className="hover:text-pink-500 cursor-pointer" />
                                <FaTwitter className="hover:text-blue-400 cursor-pointer" />
                                <FaLinkedin className="hover:text-blue-600 cursor-pointer" />
                                <FaFacebook className="hover:text-blue-500 cursor-pointer" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>


        </section>
    );
}
