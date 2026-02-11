import {useEffect, useState} from "react";
import { Link } from "react-router";
import {Users, Mail, MapPin, MessageCircle, Phone, Send, Heart} from "lucide-react";
import Header from "../components/Header.jsx";
import {Input} from "@headlessui/react";
import FAQs from "../components/FAQs.jsx";
import NewsLetter from "../components/NewsLetter.jsx";
import Footer from "../components/Footer.jsx";
import { fetchOrganization, isServerUnreachable } from "../services/api";

const fallbackOrganization = {
    address: "Nairobi, Kenya",
    phone: "+254 792 496622",
    email: "info@givinghereve.org",
};

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone:'',
        subject: "",
        inquiry_type: "",
        message: "",
    });
    const [organization, setOrganization] = useState(null);
    const [orgLoading, setOrgLoading] = useState(false);
    const [orgError, setOrgError] = useState(null);
    const [useFallbackOrganization, setUseFallbackOrganization] = useState(false);

    useEffect(() => {
        let cancelled = false;
        async function loadOrganization() {
            setOrgLoading(true);
            setOrgError(null);
            setUseFallbackOrganization(false);
            try {
                const data = await fetchOrganization();
                if (!cancelled) {
                    if (data && Object.keys(data).length > 0) {
                        setOrganization(data);
                    } else {
                        setOrganization(null);
                    }
                }
            } catch (err) {
                if (!cancelled) {
                    setOrgError(err instanceof Error ? err.message : "Failed to load contact info");
                    if (isServerUnreachable(err)) {
                        setUseFallbackOrganization(true);
                    }
                }
            } finally {
                if (!cancelled) {
                    setOrgLoading(false);
                }
            }
        }
        void loadOrganization();
        return () => {
            cancelled = true;
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Message sent successfully!');
        // Handle form submission here
    };

    const org = organization && Object.keys(organization).length > 0
        ? organization
        : useFallbackOrganization
            ? fallbackOrganization
            : {};

    const contactInfo = [
        {
            icon: <MapPin className="h-6 w-6"/>,
            title:"Our location",
            details:[org.address || "Not available", "East Africa"],
            description: "Visit Us or Meet Us in the field"
        },
        {
            icon: <Phone className="h-6 w-6"/>,
            title:"Phone",
            details:[org.phone || "Not available"],
            description: "Call us during business hours for immediate assistance"
        },
        {
            icon: <Mail className="h-6 w-6"/>,
            title:"Email",
            details:[org.email || "Not available"],
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
                    {orgLoading && (
                        <p className="mt-3 text-sm text-slate-500">Loading contact info...</p>
                    )}
                    {orgError && (
                        <p className="mt-3 text-sm text-rose-600">Error: {orgError}</p>
                    )}
                    {!orgLoading && useFallbackOrganization && (
                        <p className="mt-2 text-sm text-amber-600">Server unreachable. Showing offline fallback contact details.</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {contactInfo.map((info, index) => (

                        <div key={index} className="text-[#232027] rounded-lg border border-0 shadow-sm text-center">
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
            <section className="py-20 bg-[#ECF3F8]" id="contact-form">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-lg p-8">
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-[#232027] mb-6"> Send Us A message</h3>
                                        <form className="space-y-6">
                                            {/* Name and Email */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2"
                                                           htmlFor="name"> Full Name <span
                                                        className="text-red-500">*</span></label>
                                                    <input
                                                        type="text"
                                                        id="fullName"
                                                        name="fullName"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="email"
                                                           className="block text-sm font-medium text-gray-700 mb-2">
                                                        Email Address <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                                    />
                                                </div>
                                            </div>

                                                {/* Phone and Inquiry type Row */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label htmlFor="phone"
                                                               className="block text-sm font-medium text-gray-700 mb-2">
                                                            Phone Number
                                                        </label>
                                                        <input
                                                            type="tel"
                                                            id="phone"
                                                            name="phone"
                                                            value={formData.phone}
                                                            onChange={handleInputChange}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label htmlFor="inquiryType"
                                                               className="block text-sm font-medium text-gray-700 mb-2">
                                                            Inquiry Type
                                                        </label>
                                                        <select
                                                            id="inquiryType"
                                                            name="inquiryType"
                                                            value={formData.inquiry_type}
                                                            onChange={handleInputChange}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white"
                                                        >
                                                            <option value="">Select inquiry type</option>
                                                            {inquiryTypes.map((type) => (
                                                                <option key={type.value} value={type.value}>{type.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                            </div>
                                            {/* Subject */}
                                            <div>
                                                <label htmlFor="subject"
                                                       className="block text-sm font-medium text-gray-700 mb-2">
                                                    Subject <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="subject"
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                                />
                                            </div>

                                            {/* Message */}
                                            <div>
                                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Message <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    id="message"
                                                    name="message"
                                                    rows="6"
                                                    value={formData.message}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="Tell us how we can help you..."
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                                                />
                                            </div>

                                            {/* Submit Button */}
                                            <button
                                                onClick={handleSubmit}
                                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
                                            >
                                                Send Message
                                                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                                            </button>
                                        </form>
                                </div>
                            </div>

                        </div>
                        <div className="space-y-6">
                            {/* Join Our Team */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Join Our Team</h3>
                                <p className="text-gray-600 mb-4 text-sm">
                                    Ready to volunteer? Apply now and start making a difference.
                                </p>
                                <Link
                                    to="/contact#contact-form"
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200 inline-flex items-center justify-center"
                                >
                                    Volunteer Application
                                </Link>
                            </div>

                            {/* Make a Donation */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Heart className="w-8 h-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Make a Donation</h3>
                                <p className="text-gray-600 mb-4 text-sm">
                                    Support our programs with a secure online donation.
                                </p>
                                <Link
                                    to="/donate"
                                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-4 rounded-lg transition-colors duration-200 inline-flex items-center justify-center"
                                >
                                    Donate Now
                                </Link>
                            </div>

                            {/* Emergency Contact */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Emergency Contact</h3>
                                <p className="text-gray-600 mb-4 text-sm">
                                    For urgent matters or emergencies related to our beneficiaries:
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                        <a
                                            href="tel:+254 792 496622"
                                            className="text-gray-700 font-medium hover:text-purple-600 transition-colors"
                                        >
                                            +254 792 496622
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                        <a
                                            href="mailto:emergency@givinghereve.org"
                                            className="text-gray-700 font-medium break-all hover:text-purple-600 transition-colors"
                                        >
                                            emergency@givinghereve.org
                                        </a>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
            <FAQs/>
            <NewsLetter/>
            <Footer/>
        </div>
    )
}

export default Contact;
