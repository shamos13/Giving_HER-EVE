import Header from "../components/Header.jsx";

const Donation = () => {
    return (
        <div className="min-h-screen bg-[#A06DAD]">
            <Header />
            {/* hero section*/}
            <section className="py-20 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Make a Difference Today</h1>
                </div>
            </section>
        </div>
    )
}

export default Donation;