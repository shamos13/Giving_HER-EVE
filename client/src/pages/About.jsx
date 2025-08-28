import {Heart, Users, Target, Eye, Award, Globe} from "lucide-react";
import Header from "../components/Header.jsx";
import Team from "../components/Team.jsx";
import Footer from "../components/Footer.jsx";
import bg_image from "../assets/Image.png";

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
            <section className="py-20 bg-purple-800">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance text-white/90"> About Giving Her E.V.E </h1>
                    <p className="text-xl text-white/90 text-balance">Empowering women and girls through Equality, Voice, and Empowerment </p>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#232027] mb-6"> Our Story </h2>
                            <div className="space-y-4 text-[#637081] leading-relaxed">
                                <p>
                                    Giving Her E.V.E was born from a simple but powerful realization: when women and
                                    girls
                                    are empowered with basic necessities and opportunities, entire communities flourish.
                                </p>
                                <p>
                                    Founded in 2019 in Nairobi, Kenya, our organization began by addressing one of the
                                    most
                                    fundamental barriers to girls' education – menstrual health. We quickly realized
                                    that
                                    supporting women and girls required a holistic approach.
                                </p>
                                <p>
                                    Today, we work across multiple communities in East Africa, providing not just
                                    menstrual
                                    health kits, but also food support, educational resources, and community empowerment
                                    programs. Our approach is community-driven, culturally sensitive, and focused on
                                    sustainable impact.
                                </p>
                                <p>
                                    Every woman and girl we support becomes an advocate for change in her own community,
                                    creating a ripple effect of empowerment that extends far beyond our direct reach.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                src="about.jpeg"
                                alt="Team Photo"
                                className="rounded-2xl shadow-elegant w-full h-96 object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission, Vision and Values */}
            <section className="py-20 bg-[#ECF3F8]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 ">
                        {/* Mission */}
                        <div className="border border-0 shadow-lg rounded-lg bg-white">
                            <div className="p-8 text-center">
                                <Target className="h-12 w-12 text-[#6A0DAD] mx-auto mb-6"/>
                                <h3 className="text-2xl font-bold text-[#232027] mb-4"> Our Mission</h3>
                                <p className="text-[#637081] leading-relaxed">
                                    To support vulnerable women and girls in underserved communities by providing
                                    essential
                                    resources, education, and empowerment opportunities that enable them to thrive and
                                    transform their communities.
                                </p>
                            </div>
                        </div>

                        {/* Vision */}
                        <div className="border border-0 shadow-md rounded-lg bg-white">
                            <div className="p-8 text-center ">
                                <Eye className="h-12 w-12 text-[#6A0DAD] mx-auto mb-6"/>
                                <h3 className="text-2xl font-bold text-[#232027] mb-4"> Our Vision</h3>
                                <p className="text-[#637081] leading-relaxed">
                                    A world where every woman and girl has equal access to opportunities, resources, and
                                    the power to shape their own future and contribute meaningfully to their communities.
                                </p>
                            </div>
                        </div>

                        {/* Values */}
                        <div className="border border-0 shadow-md rounded-lg bg-white">
                            <div className="p-8 text-center">
                                <Award className="h-12 w-12 text-[#6A0DAD] mx-auto mb-6"/>
                                <h3 className="text-2xl font-bold text-[#232027] mb-4"> Our Values</h3>
                                <p className="text-[#637081] leading-relaxed">
                                    To support vulnerable women and girls in underserved communities by providing
                                    essential
                                    resources, education, and empowerment opportunities that enable them to thrive and
                                    transform their communities.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values Detailed */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#232027] mb-4">E.V.E Our Core Values</h2>
                        <p className="text-xl text-[#637081] max-w-2xl mx-auto text-balance">
                            The foundation of our work lies in three fundamental principles that guide every program and initiative.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="border border-0 shadow-md rounded-lg bg-white">
                                <div className="p-8 text-center">
                                    <div className="text-[#6A0DAD]">
                                        {value.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#232027] mb-4"> {value.title}</h3>
                                    <p className="text-[#637081] leading-relaxed"> {value.description}</p>
                                </div>

                            </div>

                                ))};
                    </div>
                </div>
            </section>
            <Team/>

            {/* Impact Preview */}
            <section className="relative py-20 bg-[#6A0DAD] text-white">

                <div className="absolute z-0 inset-0 bg-cover bg-center bg-no-repeat opacity-35"
                     style={{backgroundImage: `url(${bg_image})`}}>

                </div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Globe className="h-16 w-16 mx-auto mb-6 text-[#FFD700]"/>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance"> Our Reach </h2>
                    <p className="text-xl text-white/90 mb-8 text-balance">
                        From humble beginnings in one community, we now support women and girls across 15 communities
                        in East Africa, with plans to expand our reach even further.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-[#FFD700] mb-2">15</div>
                            <div className="text-sm text-white/80">Communities</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-[#FFD700] mb-2">2500</div>
                            <div className="text-sm text-white/80">Lives Impacted</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-[#FFD700] mb-2">50+</div>
                            <div className="text-sm text-white/80">Volunteers</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-[#FFD700] mb-2">5</div>
                            <div className="text-sm text-white/80">Year Active</div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer/>
        </div>
    );
}

export default About;