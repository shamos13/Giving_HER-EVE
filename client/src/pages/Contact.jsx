import {useState} from "react";
import {Clock, Mail, MapPin, MessageCircle, Phone} from "lucide-react";
import Header from "../components/Header.jsx";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone:'',
        subject: "",
        inquiry_type: "",
        message: "",
    });

    const contactInfo = [
        {
            icon: <MapPin className="h-6 w-6"/>,
            title:"Our location",
            details:["Nairobi, Kenya", "East Africa"],
            description: "Visit Us or Meet Us in the field"
        },
        {
            icon: <Phone className="h-6 w-6"/>,
            title:"Phone",
            details:["+254 792 496622", "+254 706 129245"],
            description: "Call us during business hours for immediate assistance"
        },
        {
            icon: <Mail className="h-6 w-6"/>,
            title:"Email",
            details:["info@givinghereve.org"],
            description: "Send us an email and we'll respond within 24 hours"
        },
        /* {
            icon: <Clock className="h-6 w-6"/>,
            title:"Office Hours",
            details:["Monday - Friday: 8AM - 6PM", "Saturday: 9AM - 2PM"],
            description: "We are always available for your queries"
        } */
    ];

    const inquiryTypes = [
        { value: "general", label: "General Information" },
        { value: "volunteer", label: "Volunteer Opportunities" },
        { value: "donate", label: "Donation & Support" },
        { value: "partnership", label: "Partnership Opportunities" },
        { value: "media", label: "Media & Press Inquiries" },
        { value: "beneficiary", label: "Program Beneficiary" },
        { value: "other", label: "Other" }
    ];

    const faqs = [
        {
            question: "How can I apply for your programs?",
            answer: "You can apply through our community partners, visit our outreach centers, or contact us directly. We assess each application based on need and program availability."
        },
        {
            question: "Do you accept international volunteers?",
            answer: "Yes! We welcome volunteers from around the world. International volunteers will need to arrange their own accommodation and ensure they have proper documentation to volunteer in Kenya."
        },
        {
            question: "How do I know my donation is being used effectively?",
            answer: "We provide quarterly impact reports to all donors, showing exactly how funds are being used and the outcomes achieved. 85% of donations go directly to programs."
        },
        {
            question: "Can organizations partner with you?",
            answer: "Absolutely! We partner with NGOs, corporations, educational institutions, and government agencies. Contact us to discuss partnership opportunities."
        }
    ];

    return(
        <div className="min-h-screen bg-[#FAFAFA]">
            <Header/>

            {/* Hero Section*/}
            <section className="py-20 bg-purple-800 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <MessageCircle className="h-16 w-16 mx-auto mb-6 text-[#FFD700]"/>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance"> Get In Touch</h1>
                    <p className="text-xl text-white/90 text-balance">
                        We'd love to hear from you! Whether you have questions, want to get involved,
                        or need support, we're here to help.
                    </p>
                </div>
            </section>

            {/* Contact information */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#232027] mb-4"> Contact Information</h2>
                        <p className="text-xl text-[#637081] max-w-2xl mx-auto text-balance">
                            Multiple ways to reach us - choose what works best for you.
                        </p>
                    </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {contactInfo.map((info, index) => (

                        <div key={index} className="text-[#232027] srounded-lg border border-0 shadow-sm text-center">
                            <div className="p-6 ">
                                <div className="text-[#6A0DAD] mb-4">
                                    {info.icon}
                                </div>
                                <h3 className="text-lg font-bold text-[#232027] mb-3">{info.title}</h3>
                                <div className="space-y-1 mb-3">
                                    {info.details.map((detail, detailIndex) => (
                                        <p key={detailIndex} className="text-[#232027] font-medium text-sm">
                                            {detail}
                                        </p>
                                    ))}
                                </div>
                                <p className="text-[#637081] text-xs leading-relaxed">
                                    {info.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                </div>
            </section>

            {/* Contact form & Quick Actions */}
            <section className="py-20 bg-[#ECF3F8]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    </div>
                </div>
            </section>
        </div>
    )
}

export default Contact;