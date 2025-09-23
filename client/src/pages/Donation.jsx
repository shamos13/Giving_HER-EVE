import React, { useState, useEffect } from 'react';
import {CreditCard, Smartphone, Building2, Heart, Users, Package, CheckCircle} from 'lucide-react';
import Footer from "../components/Footer.jsx";
import Header from "../components/Header.jsx";

export default function DonationForm() {
    const [activeTab, setActiveTab] = useState('one-time');
    const [selectedAmount, setSelectedAmount] = useState(100);
    const [customAmount, setCustomAmount] = useState('');
    const [selectedPayment, setSelectedPayment] = useState('mpesa');

    const presetAmounts = [25, 50, 100, 250, 500, 1000];
    const monthlyAmounts = [30, 60, 120, 300];

    const impactMessages = {
        25: 'Provides menstrual health kit for 1 girl for 1 month',
        50: 'Provides menstrual health kit for 1 girl for 2 months',
        100: 'Provides menstrual health kit for 1 girl for 3 months',
        250: 'Provides menstrual health kits for 2 girls for 3 months',
        500: 'Provides menstrual health kits for 4 girls for 3 months',
        1000: 'Provides menstrual health kits for 8 girls for 3 months'
    };

    const monthlyImpactMessages = {
        30: "Supports 1 girl's menstrual health needs for a full year",
        60: 'Provides ongoing education support for 1 student',
        120: 'Sustains food security for 1 vulnerable family',
        300: 'Funds comprehensive support for 3 program beneficiaries'
    };

    const getImpactMessage = (amount) => {
        if (activeTab === 'monthly') {
            if (monthlyImpactMessages[amount]) return monthlyImpactMessages[amount];
            if (amount <= 30) return monthlyImpactMessages[30];
            if (amount <= 60) return monthlyImpactMessages[60];
            if (amount <= 120) return monthlyImpactMessages[120];
            if (amount >= 300) return monthlyImpactMessages[300];
            return `Provides monthly support for ${Math.floor(amount / 30)} beneficiaries`;
        } else {
            if (amount <= 25) return impactMessages[25];
            if (amount <= 50) return impactMessages[50];
            if (amount <= 100) return impactMessages[100];
            if (amount <= 250) return impactMessages[250];
            if (amount <= 500) return impactMessages[500];
            if (amount >= 1000) return impactMessages[1000];
            return `Provides menstrual health support for ${Math.floor(amount / 25)} girls`;
        }
    };

    const handleAmountSelect = (amount) => {
        setSelectedAmount(amount);
        setCustomAmount('');
    };

    const handleCustomAmountChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setCustomAmount(value);
        if (value) {
            setSelectedAmount(parseInt(value));
        }
    };

    const paymentMethods = [
        {
            id: 'mpesa',
            name: 'PayPal',
            icon: <Smartphone className="w-6 h-6" />,
            description: 'Link Directly to Your Mpesa or Bank Account.',
            details: 'Mpesa, Credit/Debit Cards'
        },
        {
            id: 'card',
            name: 'Credit/Debit Card',
            icon: <CreditCard className="w-6 h-6" />,
            description: 'Secure online payment processing',
            details: 'Visa, Mastercard, American Express accepted'
        },
        {
            id: 'bank',
            name: 'Bank Transfer',
            icon: <Building2 className="w-6 h-6" />,
            description: 'Direct bank transfer',
            details: 'Account details provided after selection'
        }
    ];

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <Header/>
            {/* hero section*/}
            <section className="py-20 text-white bg-purple-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Heart className="h-16 w-16 mx-auto mb-6 text-yellow-300"/>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Make a Difference Today</h1>
                    <p className="text-xl text-white/90 text-balance">
                        Your donation directly supports women and girls in underserved communities,
                        providing them with essential resources and opportunities for empowerment.
                    </p>
                </div>
            </section>

            {/* Donations Form*/}
            <div className="max-w-4xl mx-auto p-6 bg-white">
            {/* Donation Frequency Tabs */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-8 w-full">
                <button
                    onClick={() => setActiveTab('one-time')}
                    className={`flex-1 py-3 px-6 rounded-md text-sm font-medium transition-all duration-200 ${
                        activeTab === 'one-time'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    One-Time Donation
                </button>
                <button
                    onClick={() => setActiveTab('monthly')}
                    className={`flex-1 py-3 px-6 rounded-md text-sm font-medium transition-all duration-200 ${
                        activeTab === 'monthly'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    Monthly Giving
                </button>
            </div>

            {/* Choose Impact Level */}
            <div className="mb-8">
                {activeTab === 'one-time' ? (
                    <>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Impact Level</h2>

                        {/* Preset Amount Grid */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {presetAmounts.map((amount) => (
                                <button
                                    key={amount}
                                    onClick={() => handleAmountSelect(amount)}
                                    className={`py-4 px-6 rounded-lg border-2 font-semibold text-lg transition-all duration-200 ${
                                        selectedAmount === amount && !customAmount
                                            ? 'bg-purple-600 text-white border-purple-600 shadow-lg transform scale-105'
                                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                                    }`}
                                >
                                    ${amount}
                                </button>
                            ))}
                        </div>

                        {/* Custom Amount Input */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Or enter a custom amount
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 text-lg">$</span>
                                </div>
                                <input
                                    type="text"
                                    value={customAmount}
                                    onChange={handleCustomAmountChange}
                                    placeholder="Enter amount"
                                    className="block w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg"
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Become a Monthly Champion</h2>
                            <p className="text-lg text-gray-600">
                                Monthly giving provides consistent support that helps us plan and expand our programs
                            </p>
                        </div>

                        {/* Monthly Amount Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {monthlyAmounts.map((amount) => (
                                <button
                                    key={amount}
                                    onClick={() => handleAmountSelect(amount)}
                                    className={`p-6 rounded-xl border-2 text-left transition-all duration-200 ${
                                        selectedAmount === amount && !customAmount
                                            ? 'border-purple-500 bg-purple-50 shadow-lg'
                                            : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                                    }`}
                                >
                                    <div className="text-2xl font-bold text-purple-600 mb-2">
                                        ${amount}/month
                                    </div>
                                    <p className="text-gray-600">
                                        {monthlyImpactMessages[amount]}
                                    </p>
                                </button>
                            ))}
                        </div>

                        {/* Custom Monthly Amount Input */}
                        <div className="mb-6">
                            <label className="block text-lg font-medium text-gray-700 mb-3">
                                Custom monthly amount
                            </label>
                            <div className="relative max-w-sm">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="text-gray-500 text-lg">$</span>
                                </div>
                                <input
                                    type="text"
                                    value={customAmount}
                                    onChange={handleCustomAmountChange}
                                    placeholder="Enter monthly amount"
                                    className="block w-full pl-8 pr-4 py-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg bg-gray-50"
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* Impact Display */}
                {selectedAmount > 0 && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-purple-800 mb-2">Your Impact</h3>
                        <p className="text-purple-700">{getImpactMessage(selectedAmount)}</p>
                    </div>
                )}
            </div>

            {/* Payment Methods */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Payment Method</h2>
                <div className="space-y-4">
                    {paymentMethods.map((method) => (
                        <div
                            key={method.id}
                            onClick={() => setSelectedPayment(method.id)}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                selectedPayment === method.id
                                    ? 'border-purple-500 bg-purple-50 shadow-md'
                                    : 'border-gray-200 bg-gray-50 hover:border-purple-300 hover:bg-purple-25'
                            }`}
                        >
                            <div className="flex items-start space-x-4">
                                <div className={`p-2 rounded-lg ${
                                    selectedPayment === method.id ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {method.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">{method.name}</h3>
                                    <p className="text-sm text-gray-600 mb-1">{method.description}</p>
                                    <p className="text-xs text-gray-500">{method.details}</p>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    selectedPayment === method.id
                                        ? 'border-purple-500 bg-purple-500'
                                        : 'border-gray-300'
                                }`}>
                                    {selectedPayment === method.id && (
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Donation Button */}
            <button
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                disabled={selectedAmount === 0}
            >
                {activeTab === 'monthly' ? `Start Monthly Giving ${selectedAmount}` : `Donate ${selectedAmount}`} →
            </button>

            {/* Security Notice */}
            <p className="text-center text-sm text-gray-500 mt-4">
                🔒 Your donation is secure and encrypted. We never store your payment information.
            </p>
        </div>

            {/* Other ways to Help*/}
            <section className="py-20 ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Other Ways To Support</h2>
                        <p className="text-xl text-[#808994] max-w-2xl mx-auto text-balance">Your contribution doesn't have to be monetary. There are many ways to support our mission.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-[#FFFFFF]">
                        <div className="border border-0 text-center rounded-lg text-[#232027]">
                            <div className="p-8">
                                <Users className="h-12 w-12 text-[#6A0DAD] mx-auto mb-4"/>
                                <h3 className="text-xl font-bold text-[#232027] mb-4"> Volunteer </h3>
                                <p className="mb-6 text-[#808994]">
                                    Donate your time and skills to directly support our programs and beneficiaries.
                                </p>
                                <button
                                    className="border border-input bg-[#FAFAFA] hover:bg-[#F7ECFB] hover:text-[#6A0DAD] h-10 px-4 py-2 rounded-md">
                                    Learn More
                                </button>
                            </div>
                        </div>

                        {/*Share our Story*/}
                        <div className="border border-0 text-center rounded-lg text-[#232027]">
                            <div className="p-8">
                                <Heart className="h-12 w-12 text-[#6A0DAD] mx-auto mb-4"/>
                                <h3 className="text-xl font-bold text-[#232027] mb-4"> Spread Awareness </h3>
                                <p className="mb-6 text-[#808994]">
                                    Share our mission with your network and help us reach more supporters.
                                </p>
                                <button
                                    className="border border-input bg-[#FAFAFA] hover:bg-[#F7ECFB] hover:text-[#6A0DAD] h-10 px-4 py-2 rounded-md">
                                    Share Our Story
                                </button>
                            </div>
                        </div>

                        {/* In Kind Donations */}
                        <div className="border border-0 text-center rounded-lg text-[#232027]">
                            <div className="p-8">
                                <Package className="h-12 w-12 text-[#6A0DAD] mx-auto mb-4"/>
                                <h3 className="text-xl font-bold text-[#232027] mb-4"> In-Kind Donations</h3>
                                <p className="mb-6 text-[#808994]">
                                    Donate supplies, materials, or services that directly support our programs.
                                </p>
                                <button
                                    className="border border-input bg-[#FAFAFA] hover:bg-[#F7ECFB] hover:text-[#6A0DAD] h-10 px-4 py-2 rounded-md">
                                    Contact Us
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Trust and Transparency*/}
            <section className="py-20 bg-linear-to-br from-[#F7ECFB] to-[#ECF3F8]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <CheckCircle className="h-16 w-16 text-[#6A0DAD] mx-auto mb-6"/>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#232027] mb-6"> Your Trust Matters</h2>
                    <p className="text-xl text-[#637081] mb-8 text-balance">
                        We are committed to transparency and accountability. 85% of every donation goes directly to
                        programs,
                        with detailed impact reports shared quarterly with all donors.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div>
                            <div className="text-3xl font-bold text-[#6A0DAD] mb-2">85%</div>
                            <div className="text-sm text-[#637081]">Direct Program Funding</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-[#6A0DAD] mb-2">15%</div>
                            <div className="text-sm text-[#637081]">Operations & Fundraising</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-[#6A0DAD] mb-2">100%</div>
                            <div className="text-sm text-[#637081]">Transparency Commitment</div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer/>
        </div>
    );
}