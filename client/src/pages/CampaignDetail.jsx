import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { ArrowLeft, ArrowRight, Heart } from "lucide-react";
import { fetchCampaignById } from "../services/api";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

const CampaignDetail = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(20);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCampaignById(id);
        if (cancelled) return;
        setCampaign(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Campaign not found");
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
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-5xl mx-auto px-4 py-20 text-center text-gray-600">Loading campaign...</div>
        <Footer />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-2">Campaign not found</h1>
          <p className="text-gray-600 mb-6">
            We couldn't find that campaign.
          </p>
          <Link
            to="/campaigns"
            className="inline-flex items-center gap-2 text-purple-600 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to campaigns
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const progress =
    campaign.goal > 0
      ? Math.min(100, Math.round((campaign.raised / campaign.goal) * 100))
      : 0;

  const impactItems = [
    {
      amount: 20,
      label: "provides 5 hygiene kits",
    },
    {
      amount: 50,
      label: "keeps a girl in school for a year",
    },
    {
      amount: 100,
      label: "supports a health workshop",
    },
  ];

  const galleryImages = [
    campaign.image,
    "https://res.cloudinary.com/dlxil9dpo/image/upload/v1758014542/3_oy5jmv.avif",
    "https://res.cloudinary.com/dlxil9dpo/image/upload/v1758014549/4_qcb19a.avif",
    "https://res.cloudinary.com/dlxil9dpo/image/upload/v1758014550/5_wtvump.avif",
  ];

  const donorList = [
    { name: "Sarah M.", amount: 50 },
    { name: "David K.", amount: 100 },
    { name: "Amina R.", amount: 20 },
    { name: "Amina R.", amount: 30 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 bg-[#F8FAFC]">
        <section className="py-10 md:py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/campaigns"
              className="inline-flex items-center gap-2 text-purple-600 font-semibold mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to campaigns
            </Link>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              In-Depth Campaign Details
            </h1>

            <div className="relative overflow-hidden rounded-3xl shadow-[0_18px_50px_rgba(15,23,42,0.12)] border border-white/80">
              <img
                src={campaign.image}
                alt={campaign.title}
                className="w-full h-72 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xs uppercase tracking-[0.25em] text-white/80">
                  {campaign.category} · {campaign.location}
                </p>
                <h2 className="text-3xl md:text-4xl font-bold mt-2">
                  {campaign.title}
                </h2>
                <p className="mt-3 text-sm md:text-base text-white/90 max-w-2xl">
                  {campaign.shortDescription || campaign.description}
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_0.8fr]">
              <div className="space-y-8">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    The Challenge
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {campaign.description}
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                    Our Goal
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600">
                    We aim to reach the full funding target so partners can deliver
                    supplies, education, and support without interruption.
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Your Impact
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {impactItems.map((item) => (
                      <div
                        key={item.amount}
                        className="flex items-center gap-3 rounded-2xl bg-[#F9F5FF] px-4 py-3"
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F6E7FF] text-[#6A0DAD]">
                          <Heart className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-base font-semibold text-gray-900">
                            {formatCurrency(item.amount)}
                          </p>
                          <p className="text-xs text-gray-600">{item.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Project Gallery
                    </h3>
                    <span className="text-xs text-gray-500">
                      Community moments
                    </span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {galleryImages.map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="overflow-hidden rounded-2xl border border-gray-100"
                      >
                        <img
                          src={image}
                          alt={`${campaign.title} gallery ${index + 1}`}
                          className="h-40 w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-6">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span className="font-semibold text-[#6A0DAD]">
                      {formatCurrency(campaign.raised)}
                    </span>
                    <span>{formatCurrency(campaign.goal)}</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#F7B500] rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                    <span>Raised</span>
                    <span>{progress}% funded</span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3 text-sm font-semibold">
                    {[20, 50, 100].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setSelectedAmount(amount)}
                        className={`rounded-xl border px-4 py-2 transition ${
                          selectedAmount === amount
                            ? "border-[#6A0DAD] bg-[#6A0DAD] text-white shadow"
                            : "border-gray-200 text-gray-700 hover:border-[#6A0DAD]"
                        }`}
                      >
                        {formatCurrency(amount)}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setSelectedAmount(0)}
                      className={`rounded-xl border px-4 py-2 transition ${
                        selectedAmount === 0
                          ? "border-[#6A0DAD] bg-[#6A0DAD] text-white shadow"
                          : "border-gray-200 text-gray-700 hover:border-[#6A0DAD]"
                      }`}
                    >
                      Other Amount
                    </button>
                  </div>

                  <Link
                    to="/donate"
                    className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[#6A0DAD] px-5 py-3 text-sm font-semibold text-white shadow hover:bg-[#5a0b94] transition"
                  >
                    Donate Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">
                    Recent Hero Donors
                  </h3>
                  <div className="space-y-3">
                    {donorList.map((donor, index) => (
                      <div
                        key={`${donor.name}-${index}`}
                        className="flex items-center justify-between text-sm text-gray-700"
                      >
                        <span className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F2E7FF] text-xs font-semibold text-[#6A0DAD]">
                            {donor.name
                              .split(" ")
                              .map((part) => part[0])
                              .join("")}
                          </span>
                          {donor.name}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(donor.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CampaignDetail;
