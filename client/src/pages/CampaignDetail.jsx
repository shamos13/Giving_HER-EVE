import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useParams, Link } from "react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CAMPAIGNS, getCampaignById } from "../data/campaigns.js";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

const CampaignDetail = () => {
  const { id } = useParams();
  const campaign = getCampaignById(id);

  if (!campaign) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-md text-center">
            <p className="text-sm font-semibold text-[#6A0DAD] mb-2">
              Campaign Not Found
            </p>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              We couldn&apos;t find that campaign.
            </h1>
            <p className="text-gray-600 mb-6 text-sm">
              It might have been updated or no longer be active. You can return to our
              active campaigns to explore other ways to support.
            </p>
            <Link
              to="/campaigns"
              className="inline-flex items-center gap-2 rounded-full bg-[#6A0DAD] text-white px-5 py-2 text-sm font-semibold hover:bg-[#4D0B7E] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Campaigns
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const progress = Math.min(100, Math.round((campaign.raised / campaign.goal) * 100));

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5FB]">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative bg-gradient-to-b from-[#6A0DAD] to-[#8B2BD3] text-white pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-10">
            <div className="flex items-center justify-between gap-4 mb-6">
              <Link
                to="/campaigns"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-purple-100 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Campaigns
              </Link>
            </div>

            <div className="text-center">
              <p className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] sm:text-xs font-medium tracking-[0.18em] uppercase mx-auto mb-3">
                Small effort, big change
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
                {campaign.title}
              </h1>
              <p className="text-sm sm:text-base text-purple-100 max-w-2xl mx-auto">
                {campaign.shortDescription}
              </p>
            </div>
          </div>

          {/* Centered hero image card */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            <div className="rounded-3xl overflow-hidden bg-white shadow-2xl">
              <img
                src={campaign.image}
                alt={campaign.title}
                className="w-full h-56 sm:h-64 md:h-80 object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="py-10 md:py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 lg:grid-cols-[1.6fr,1fr] items-start">
            {/* Left column */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                  About This Campaign
                </h2>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  {campaign.description}
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3">
                  Impact at a Glance
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Every contribution moves this campaign closer to full funding.</li>
                  <li>• Your support helps us respond quickly where the need is greatest.</li>
                  <li>• Stories and updates from the field will be shared with supporters.</li>
                </ul>
              </div>
            </div>

            {/* Right column - donation summary */}
            <aside className="lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 md:p-6">
                <p className="text-xs font-semibold text-[#6A0DAD] mb-1 uppercase tracking-[0.18em]">
                  Support This Campaign
                </p>
                <p className="text-lg md:text-xl font-bold text-gray-900 mb-3">
                  {formatCurrency(campaign.raised)} raised of{" "}
                  {formatCurrency(campaign.goal)}
                </p>
                <div className="mb-3">
                  <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#F7B500] rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-gray-600">
                    <span>{progress}% funded</span>
                    <span>Goal: {formatCurrency(campaign.goal)}</span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2 mb-4">
                  {[25, 50, 100, 0].map((amount) => (
                    <button
                      key={amount}
                      className={`text-xs py-2 rounded-full border ${
                        amount === 50
                          ? "bg-[#6A0DAD] text-white border-[#6A0DAD]"
                          : "border-gray-200 text-gray-700 hover:border-[#6A0DAD] hover:text-[#6A0DAD]"
                      }`}
                    >
                      {amount === 0 ? "Custom" : `$${amount}`}
                    </button>
                  ))}
                </div>
                <button className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#F7B500] hover:bg-[#FFC93C] text-[#4A2A00] text-sm font-semibold py-2.5 transition-colors mb-3">
                  Complete Donation
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-gray-500">
                  By donating, you agree to our terms. You&apos;ll receive a receipt and
                  impact updates as this campaign progresses.
                </p>
              </div>
            </aside>
          </div>
        </section>

        {/* Related campaigns */}
        <section className="pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base md:text-lg font-semibold text-gray-900">
                More Campaigns You Can Support
              </h3>
              <Link
                to="/campaigns"
                className="text-xs font-medium text-[#6A0DAD] hover:text-[#4D0B7E] inline-flex items-center gap-1"
              >
                View all
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {CAMPAIGNS.filter((c) => c.id !== campaign.id).map((c) => (
                <Link
                  key={c.id}
                  to={`/campaigns/${c.id}`}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <img
                    src={c.image}
                    alt={c.title}
                    className="w-full h-32 object-cover"
                    loading="lazy"
                  />
                  <div className="p-4">
                    <p className="text-xs text-[#6A0DAD] font-medium mb-1">
                      {c.category}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                      {c.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CampaignDetail;

