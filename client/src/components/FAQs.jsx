import React, { useState } from 'react';

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState(null);

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

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="py-20 bg-gradient-to-br from-purple-100 to-pink-100 py-16 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Quick answers to common questions. Don't see yours? Contact us directly.
                    </p>
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full text-left p-6 hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center"
                            >
                                <h2 className="text-xl font-semibold text-gray-800 pr-4">
                                    {faq.question}
                                </h2>
                                <div className="flex-shrink-0">
                                    <svg
                                        className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                                            openIndex === index ? 'rotate-180' : ''
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                            >
                                <div className="px-6 pb-6">
                                    <p className="text-gray-600 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}