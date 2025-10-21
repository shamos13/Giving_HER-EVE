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
        { year: "2019", event: "Giving Her E.V.E founded with a mission to support 100 women" },
        { year: "2020", event: "Distributed first 500 menstrual health kits in Kibera" },
        { year: "2021", event: "Expanded to 5 communities, supporting over 1,000 women and girls" },
        { year: "2022", event: "Launched education support program, providing 800 school kits" },
        { year: "2023", event: "Reached 15 communities, impacting 2,000+ lives" },
        { year: "2024", event: "Supporting 2,500+ women and girls across East Africa" }
    ];

    return(
        <div className="min-h-screen bg-[#FAFAFA]">
            <Header/>

            {/* Hero Section */}
            <section className="py-12 md:py-20 bg-purple-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 text-balance text-white/90"
                    > 
                        About Giving Her E.V.E 
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
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
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
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
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
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