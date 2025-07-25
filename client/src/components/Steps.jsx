const processSteps = [
    {
        step: "1",
        title: "Community Outreach",
        description:
            "We engage directly with women, girls, and local leaders in underserved communities to understand their unique needs and challenges."
    },
    {
        step: "2",
        title: "Needs Assessment",
        description:
            "We assess urgent necessities such as menstrual hygiene, nutrition, clothing, and school materials through on-ground surveys and partnerships."
    },
    {
        step: "3",
        title: "Resource Mobilization",
        description:
            "Through donations, volunteers, and local partnerships, we gather and prepare kits and supplies tailored to each community's needs."
    },
    {
        step: "4",
        title: "Empowerment & Impact",
        description:
            "We deliver resources, provide education, and empower women and girls — while continuously measuring impact and building lasting change."
    }
];


const Steps = () => {
    return (
    <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How We Work</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                    Our community-centered approach ensures sustainable impact and local ownership of programs.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {processSteps.map((step, index) => (
                    <div key={index} className="border-0 shadow-soft  rounded-lg border  shadow-sm">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-[#6A0DAD] rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                                {step.step}
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
    )
}

export default Steps;