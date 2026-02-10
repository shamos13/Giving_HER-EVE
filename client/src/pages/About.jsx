import {Heart, Users, Target, Eye, Award, Globe} from "lucide-react";
import Header from "../components/Header.jsx";
import Team from "../components/Team.jsx";
import Footer from "../components/Footer.jsx";
import bg_image from "../assets/Image.png";
import TeamAbout from "../components/TeamAbout.jsx";
import { motion } from "framer-motion";

const About = () =>{
    const values = [
        {
            icon: <Heart className="h-8 w-8"/>,
            title:"Equality",
            description: "We believe every woman and girl deserves equal opportunities, regardless of their circumstances or background."
        },
        {
            icon: <Users className="h-8 w-8" />,
            title: "Voice",
            description: "Amplifying the voices of women and girls, ensuring they are heard and their needs are addressed."
        },
        {
            icon: <Target className="h-8 w-8" />,
            title: "Empowerment",
            description: "Building capacity and confidence through education, resources, and supportive community networks."
        }
    ]

    const milestones = [
        {
            title: "Foundation Laid",
            bullets: [
                "Organization founded",
                "First batch of recyclable menstrual kits distributed",
                "Pilot education workshops conducted in 3 remote villages"
            ]
        },
        {
            title: "Scaling Reach",
            accent: true,
            bullets: [
                "1,000+ girls and women reached with products",
                "Menstrual health curriculum co-developed with local educators",
                "First partnerships with local NGOs and community health workers"
            ]
        },
        {
            title: "Community Ownership",
            bullets: [
                "Local ambassadors trained to lead education sessions",
                "Establishment of small community-run production/distribution hubs",
                "Over 80% of served communities report reduced stigma"
            ]
        },
        {
            title: "Regional Impact",
            accent: true,
            bullets: [
                "Expanded into 3 new regions",
                "Introduction of mobile education units",
                "Hosted first regional menstrual health summit"
            ]
        },
        {
            title: "Systemic Change",
            bullets: [
                "Advocating for menstrual health policy inclusion",
                "Scaling sustainable production models across borders",
                "Impacted 100,000+ menstruators and counting"
            ]
        }
    ];

    return(
        <div className="min-h-screen bg-[#FAFAFA]">
            <Header/>

            {/* Hero Section */}
            <section className="py-12 md:py-20 bg-purple-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 text-balance text-white/90"
                    > 
                        About Giving Her E.V.E 
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                        className="text-lg md:text-xl text-white/90 text-balance"
                    >
                        Empowering women and girls through Equality, Voice, and Empowerment 
                    </motion.p>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-12 md:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            viewport={{ once: true, margin: "-50px" }}
                        >
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#232027] mb-4 md:mb-6"> Our Story </h2>
                            <div className="space-y-3 md:space-y-4 text-[#637081] leading-relaxed text-sm md:text-base">
                                <p>
                                    What began as a conversation about dignity and sustainability in a small community has grown into a movement. We started by listening—to mothers, daughters, teachers,
                                    and health workers in remote villages.
                                    They told us that periods were not just a biological process, but a barrier.
                                </p>
                                <p>
                                    Armed with recyclable products, educational tools,
                                    and an unshakable belief that menstruation should
                                    never be a source of shame or missed opportunity, we began small. One kit. One session. One girl at a time.
                                </p>
                                <p>
                                    Over the years, we've witnessed more than just improved health. We've seen girls return to school,
                                    communities open up dialogue, and women take leadership roles in reshaping menstrual norms.
                                    With every partnership, every workshop, and every product distributed, we move closer to our vision of menstrual equity and environmental responsibility.
                                </p>
                                <p>
                                    Our journey is far from over — but every step forward is taken together,
                                    hand-in-hand with the communities we serve.
                                </p>
                            </div>
                        </motion.div>
                        <motion.div 
                            className="relative"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                            viewport={{ once: true, margin: "-50px" }}
                        >
                            <img
                                src="about.avif"
                                alt="Team Photo"
                                className="rounded-2xl shadow-elegant w-full h-80 md:h-96 object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Mission, Vision and Values */}
            <section className="py-12 md:py-20 bg-[#ECF3F8]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
                        {/* Mission */}
                        <motion.div 
                            className="border border-0 shadow-lg rounded-lg bg-white"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <div className="p-6 md:p-8 text-center">
                                <Target className="h-10 w-10 md:h-12 md:w-12 text-[#6A0DAD] mx-auto mb-4 md:mb-6"/>
                                <h3 className="text-xl md:text-2xl font-bold text-[#232027] mb-3 md:mb-4"> Our Mission</h3>
                                <p className="text-[#637081] leading-relaxed text-sm md:text-base">
                                    To empower vulnerable women and girls in remote communities
                                    through access to sustainable menstrual health products and education,
                                    breaking taboos and ensuring dignity, health, and opportunity for every woman and girl.
                                </p>
                            </div>
                        </motion.div>

                        {/* Vision */}
                        <motion.div 
                            className="border border-0 shadow-md rounded-lg bg-white"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="p-6 md:p-8 text-center">
                                <Eye className="h-10 w-10 md:h-12 md:w-12 text-[#6A0DAD] mx-auto mb-4 md:mb-6"/>
                                <h3 className="text-xl md:text-2xl font-bold text-[#232027] mb-3 md:mb-4"> Our Vision</h3>
                                <p className="text-[#637081] leading-relaxed text-sm md:text-base">
                                    A world where no woman or girl is held back by her period
                                    — where menstrual health is understood, embraced, and
                                    supported with eco-friendly solutions and inclusive education, everywhere.
                                </p>
                            </div>
                        </motion.div>

                        {/* Values */}
                        <motion.div 
                            className="border border-0 shadow-md rounded-lg bg-white md:col-span-2 lg:col-span-1"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="p-6 md:p-8 text-center">
                                <Award className="h-10 w-10 md:h-12 md:w-12 text-[#6A0DAD] mx-auto mb-4 md:mb-6"/>
                                <h3 className="text-xl md:text-2xl font-bold text-[#232027] mb-3 md:mb-4"> Our Values</h3>
                                <p className="text-[#637081] leading-relaxed text-sm md:text-base">
                                    To support vulnerable women and girls in underserved communities by providing
                                    essential
                                    resources, education, and empowerment opportunities that enable them to thrive and
                                    transform their communities.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Core Values Detailed */}
            <section className="py-12 md:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        className="text-center mb-12 md:mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#232027] mb-3 md:mb-4">E.V.E Our Core Values</h2>
                        <p className="text-lg md:text-xl text-[#637081] max-w-2xl mx-auto text-balance">
                            The foundation of our work lies in three fundamental principles that guide every program and initiative.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {values.map((value, index) => (
                            <motion.div 
                                key={index} 
                                className="border border-0 shadow-md rounded-lg bg-white"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className="p-6 md:p-8 text-center">
                                    <div className="text-[#6A0DAD] mb-4">
                                        {value.icon}
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-[#232027] mb-3 md:mb-4"> {value.title}</h3>
                                    <p className="text-[#637081] leading-relaxed text-sm md:text-base"> {value.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            <TeamAbout/>

            {/* Milestones */}
            <section className="relative py-12 md:py-20 bg-[#F6F2FB] overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-16 -right-10 h-48 w-48 rounded-full bg-[#EADDFB] blur-3xl opacity-70"/>
                    <div className="absolute -bottom-14 -left-8 h-52 w-52 rounded-full bg-[#F3E7FF] blur-3xl opacity-70"/>
                </div>
                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-10 md:mb-14"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#6A0DAD] mb-3">
                            Milestones
                        </p>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1B0D29] mb-3">
                            Our Progress in Motion
                        </h2>
                        <p className="text-sm sm:text-base text-[#637081] max-w-2xl mx-auto">
                            A living timeline of growth, partnership, and community-led impact across East Africa.
                        </p>
                    </motion.div>

                    <div className="relative">
                        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#C9B1F5] via-[#6A0DAD] to-[#C9B1F5]"/>
                        <div className="space-y-10 md:space-y-14">
                            {milestones.map((milestone, index) => {
                                const isLeft = index % 2 === 0;
                                return (
                                    <div
                                        key={milestone.title}
                                        className={`relative flex ${isLeft ? "md:justify-start" : "md:justify-end"}`}
                                    >
                                        <div className="absolute left-4 md:left-1/2 top-6 h-3.5 w-3.5 rounded-full bg-[#6A0DAD] ring-4 ring-white shadow-md"/>
                                        <motion.div
                                            className={`ml-10 md:ml-0 md:w-[calc(50%-2.5rem)] ${
                                                isLeft ? "md:pr-12" : "md:pl-12"
                                            }`}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.05 }}
                                            viewport={{ once: true, margin: "-60px" }}
                                        >
                                            <div className="rounded-2xl bg-white/90 border border-white shadow-lg backdrop-blur p-6 md:p-7">
                                                <p className="text-[11px] uppercase tracking-[0.3em] text-[#6A0DAD] font-semibold mb-3">
                                                    Milestone {String(index + 1).padStart(2, "0")}
                                                </p>
                                                <h3 className="text-lg md:text-xl font-semibold text-[#1B0D29] mb-3">
                                                    {milestone.accent ? (
                                                        <span className="text-[#6A0DAD] italic">{milestone.title}</span>
                                                    ) : (
                                                        milestone.title
                                                    )}
                                                </h3>
                                                <ul className="space-y-2 text-sm md:text-base text-[#4B5363]">
                                                    {milestone.bullets.map((item) => (
                                                        <li key={item} className="flex items-start gap-2">
                                                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#6A0DAD]"/>
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </motion.div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Preview */}
            <section className="relative py-12 md:py-20 bg-[#6A0DAD] text-white">

                <div className="absolute z-0 inset-0 bg-cover bg-center bg-no-repeat opacity-35"
                     style={{backgroundImage: `url(${bg_image})`}}>

                </div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <Globe className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 md:mb-6 text-[#FFD700]"/>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-balance"> Our Reach </h2>
                        <p className="text-lg md:text-xl text-white/90 mb-6 md:mb-8 text-balance">
                            From humble beginnings in one community, we now support women and girls across 15 communities
                            in East Africa, with plans to expand our reach even further.
                        </p>
                    </motion.div>
                    <motion.div 
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="text-2xl md:text-3xl font-bold text-[#FFD700] mb-2">15</div>
                            <div className="text-xs md:text-sm text-white/80">Communities</div>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="text-2xl md:text-3xl font-bold text-[#FFD700] mb-2">2500</div>
                            <div className="text-xs md:text-sm text-white/80">Lives Impacted</div>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="text-2xl md:text-3xl font-bold text-[#FFD700] mb-2">50+</div>
                            <div className="text-xs md:text-sm text-white/80">Volunteers</div>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="text-2xl md:text-3xl font-bold text-[#FFD700] mb-2">5</div>
                            <div className="text-xs md:text-sm text-white/80">Year Active</div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <Footer/>
        </div>
    );
}

export default About;
