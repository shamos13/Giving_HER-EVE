import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { CAMPAIGNS } from "../data/campaigns.js";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

const ProgressBar = ({ raised, goal }) => {
  const percentage = Math.min(100, Math.round((raised / goal) * 100));

  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>
          Raised: <span className="font-semibold text-purple-700">{formatCurrency(raised)}</span>
        </span>
        <span>
          Goal: <span className="font-semibold">{formatCurrency(goal)}</span>
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#F7B500] rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const ActiveCampaigns = () => {
  return (
    <section className="bg-[#F8FAFC] py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-12 max-w-3xl mx-auto">
          <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-[#6A0DAD] bg-[#F2E7FF] rounded-full px-4 py-1 mb-3">
            Our Campaigns
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Explore Our Active Fundraisers
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base text-gray-600">
            Choose a campaign that resonates with you. Every initiative is vetted,
            transparent, and focused on immediate impact for women and girls.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CAMPAIGNS.map((campaign) => (
            <Link
              key={campaign.id}
              to={`/campaigns/${campaign.id}`}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100 flex flex-col group"
            >
              <div className="relative">
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                {campaign.label && (
                  <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-[#F7B500] text-xs font-semibold text-[#4A2A00] px-3 py-1 shadow-sm">
                    {campaign.label}
                  </span>
                )}
              </div>
              <div className="flex flex-col flex-1 p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {campaign.title}
                </h3>
                <p className="text-xs text-[#6A0DAD] font-medium mb-2">
                  {campaign.category} · {campaign.location}
                </p>
                <p className="text-sm text-gray-600 mb-3 flex-1">
                  {campaign.shortDescription}
                </p>
                <ProgressBar raised={campaign.raised} goal={campaign.goal} />
                <span className="mt-4 inline-flex items-center justify-between text-xs font-semibold text-[#6A0DAD]">
                  <span className="inline-flex items-center gap-1">
                    View details
                    <ArrowRight className="w-3 h-3" />
                  </span>
                  <span className="text-gray-500">
                    {Math.round((campaign.raised / campaign.goal) * 100)}% funded
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const TransparencySection = () => {
  const items = [
    {
      title: "85% Programs",
      description:
        "Directly funds our initiatives on the ground in East Africa—education, health, and economic empowerment.",
    },
    {
      title: "10% Administration",
      description:
        "Keeps the lights on, secures systems, and supports essential staff to steward your gift well.",
    },
    {
      title: "5% Fundraising",
      description:
        "Helps us reach more supporters like you so we can grow impact for women and girls.",
    },
  ];

  return (
    <section className="bg-white py-14 md:py-18 lg:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-xl md:text-2xl font-semibold text-[#6A0DAD] mb-2">
          Transparency Promise
        </h2>
        <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          We ensure every dollar is maximized for impact.
        </p>
        <div className="grid gap-6 md:grid-cols-3 text-left">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-100 bg-[#F9FAFB] px-6 py-5"
            >
              <p className="text-base font-semibold text-gray-900 mb-2">
                {item.title}
              </p>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Campaigns = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <ActiveCampaigns />
        <TransparencySection />
      </main>
      <Footer />
    </div>
  );
};

export default Campaigns;

