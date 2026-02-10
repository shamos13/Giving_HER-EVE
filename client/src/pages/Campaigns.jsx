import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import PartnerStrip from "../components/PartnerStrip.jsx";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { fetchActiveCampaigns } from "../services/api";
const SuccessStories = lazy(() => import("../components/SuccessStories.jsx"));
const Team = lazy(() => import("../components/Team.jsx"));
const NewsLetter = lazy(() => import("../components/NewsLetter.jsx"));

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

const ProgressBar = ({ raised, goal }) => {
  const percentage = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

  return (
    <div className="mt-4">
      <div className="flex justify-between text-xs text-gray-500 mb-2">
        <span className="font-semibold text-gray-900">
          {formatCurrency(raised)}{" "}
          <span className="font-normal text-gray-500">
            raised of {formatCurrency(goal)} goal
          </span>
        </span>
        <span className="text-gray-500">{percentage}%</span>
      </div>
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#7F19E6] rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const CampaignHero = () => {
  return (
    <section className="relative overflow-hidden bg-[#7F19E6]">
      <div className="absolute inset-0 opacity-15">
        <div className="absolute -top-24 -left-24 h-80 w-80 border-[36px] border-white/30 rounded-3xl rotate-12" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 border-[36px] border-white/20 rounded-3xl -rotate-12" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.12)_1px,transparent_0)] [background-size:32px_32px]" />
      </div>
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center text-white">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em]">
          <Sparkles className="h-3 w-3" />
          Small Effort. Make Big Change
        </div>
        <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
          Explore Our Active Fundraisers
        </h1>
        <p className="mt-4 text-sm sm:text-base md:text-lg text-white/85 max-w-2xl mx-auto">
          Join us in supporting passionate campaigns dedicated to education,
          healthcare, and empowerment across East Africa.
        </p>
      </div>
    </section>
  );
};

const ActiveCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All Campaigns");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchActiveCampaigns();
        if (cancelled) return;
        setCampaigns(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load campaigns");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(campaigns.map((campaign) => campaign.category).filter(Boolean)),
    );
    return ["All Campaigns", ...unique];
  }, [campaigns]);

  const filteredCampaigns = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return campaigns.filter((campaign) => {
      const matchesCategory =
        selectedCategory === "All Campaigns" || campaign.category === selectedCategory;
      const matchesQuery =
        !query ||
        campaign.title?.toLowerCase().includes(query) ||
        campaign.shortDescription?.toLowerCase().includes(query) ||
        campaign.location?.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [campaigns, searchTerm, selectedCategory]);

  return (
    <section className="bg-[#F7F6F8] py-16 md:py-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 md:mb-12 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.35em] text-gray-700">
              <span className="h-[2px] w-10 bg-[#F7B500]" />
              Filter Campaigns
            </h2>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search campaigns..."
                className="w-full h-10 rounded-full bg-white pl-10 pr-4 text-sm shadow-sm border border-transparent focus:border-[#7F19E6]/40 focus:ring-2 focus:ring-[#7F19E6]/10"
              />
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`h-10 whitespace-nowrap rounded-full px-5 text-sm font-semibold transition ${
                  selectedCategory === category
                    ? "bg-[#7F19E6] text-white shadow-md shadow-[#7F19E6]/20"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-[#7F19E6]/30"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          {loading && <p className="text-sm text-gray-500">Loading campaigns...</p>}
          {error && <p className="text-sm text-rose-600">Error: {error}</p>}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredCampaigns.map((campaign) => (
            <Link
              key={campaign.id}
              to={`/campaigns/${campaign.id}`}
              className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group border border-gray-100"
            >
              <div className="relative w-full aspect-[16/10] overflow-hidden">
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                  <span className="text-[#7F19E6] font-bold text-[10px] uppercase tracking-wider">
                    {campaign.category}
                  </span>
                </div>
                {campaign.label && (
                  <span className="absolute top-4 right-4 rounded-full bg-[#F7B500] text-[10px] font-bold text-[#4A2A00] px-3 py-1 shadow-sm uppercase tracking-wide">
                    {campaign.label}
                  </span>
                )}
              </div>
              <div className="p-6 flex flex-col gap-4">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#7F19E6] transition-colors">
                  {campaign.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {campaign.shortDescription}
                </p>
                <ProgressBar raised={campaign.raised} goal={campaign.goal} />
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto text-xs">
                  <span className="text-gray-500">{campaign.location}</span>
                  <span className="inline-flex items-center gap-1 text-[#7F19E6] font-semibold">
                    View details
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
          {!loading && filteredCampaigns.length === 0 && (
            <p className="text-sm text-gray-500">No campaigns match your filters right now.</p>
          )}
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
        <CampaignHero />
        <ActiveCampaigns />
        <PartnerStrip />
        <TransparencySection />
        <Suspense fallback={<div className="py-16" />}>
          <SuccessStories />
        </Suspense>
        <Suspense fallback={<div className="py-16" />}>
          <Team />
        </Suspense>
        <Suspense fallback={<div className="py-16" />}>
          <NewsLetter />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Campaigns;
