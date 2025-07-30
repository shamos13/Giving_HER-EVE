import robi from "../assets/team-member-1.jpg"
import nelson from "../assets/team-member-2.jpg"
import joy from "../assets/team-member-3.jpg"
import wankio from "../assets/team-member-4.jpg"
import amos from "../assets/team-member-5.jpg"
const teamMembers = [
    {
        id: 1,
        name: "Patience Mandela",
        position: "C.E.O / Founder",
        image: robi,
        linkedinUrl: "#"
    },
    {
        id: 2,
        name: "Nelson Mandela",
        position: "Treasurer & Chairman",
        image: nelson,
        linkedinUrl: "#"
    },
    {
        id: 3,
        name: "Joylois Kwatuha",
        position: "Project Manager",
        image: joy
        ,
        linkedinUrl: "#"
    },
    {
        id: 4,
        name: "Precious Chacha",
        position: "Secretary & Administrator",
        image: wankio,
        linkedinUrl: "#"
    },
    {
        id: 5,
        name: "Amos Kwatuha",
        position: "Technical Advisor",
        image: amos,
        linkedinUrl: "#"
    },
    {
        id: 6,
        name: 'Beverly Chacha',
        position: "Social Media Strategist",
        image: "head.png",
        linkedinUrl: "#"
    }


];

const Team = ()=>{
    return(
        <section className="max-w-7xl mx-auto px-6 py-16">
            {/* Header */}
            <div className="flex justify-between items-start mb-16">
                <div>
                    <div className="text-[#F036DC] font-bold text-sm tracking-wider uppercase mb-4">
                        TEAM
                    </div>
                    <h2 className="text-4xl lg:text-2xl font-bold text-foreground leading-tight max-w-3xl">
                        Meet Our Inspiring Force Behind the Mission
                    </h2>
                </div>
            </div>
            {/* Team  Scrollable */}
            <div className="overflow-x-auto pb-4">
               <div className="flex gap-8 w-max">
                {teamMembers.map((member,index) => (
                    <div key={member.id} className="bg-card rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 w-64">
                        {/* Member Image */}
                        <div className="w-full aspect-[4/5] mb-6 overflow-hidden rounded-xl">
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Member Info */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-bold text-foreground mb-2">
                                    {member.name}
                                </h3>
                                <p className="text-team-muted">
                                    {member.position}
                                </p>
                            </div>

                            {/* LinkedIn Button */}
                            <button
                                className={`text-white rounded-full px-8 py-3 font-semibold transition-all duration-300 transform hover:scale-105 w-auto ${
                                    index === 1 || index === 3 || index === 5 ? "bg-purple-500" : "bg-[#F036DC]"
                                }`}
                            >
                                LinkedIn
                            </button>
                        </div>
                    </div>
                ))}
               </div>
            </div>
        </section>
    )
}

export default Team;