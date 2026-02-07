import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowRight, Facebook, Instagram, Twitter, Share2 } from "lucide-react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { fetchStories } from "../services/api";
import { IMPACT_STORIES_FALLBACK, IMPACT_STORY_DETAILS } from "../data/impactStories";

const cloudinaryTransform = (src, transform) => {
  if (!src) return src;
  return src.includes("/upload/") ? src.replace("/upload/", `/upload/${transform}/`) : src;
};

const IMPACT_SUMMARY = [
  { label: "Kits Distributed", value: "5,000+" },
  { label: "Schools Reached", value: "20" },
  { label: "Workshops Held", value: "1,500+" },
];

const StoryDetail = () => {
  const { id } = useParams();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchStories();
        if (cancelled) return;
        setStories(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load story");
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

  const story = useMemo(() => {
    if (!id) return null;
    const found = stories.find((item) => item.id === id);
    if (found) return found;
    return IMPACT_STORIES_FALLBACK.find((item) => item.id === id) ?? null;
  }, [id, stories]);

  const details = story ? IMPACT_STORY_DETAILS[story.id] : null;

  const narrative = useMemo(() => {
    if (!story) return [];
    if (details?.paragraphs?.length) return details.paragraphs;
    const base = story.content ?? story.excerpt ?? "";
    return [
      base,
      "Our teams coordinated with local partners to deliver practical resources, mentoring, and follow-up support.",
      "The program outcomes now guide future planning and inspire neighboring communities to engage.",
    ].filter(Boolean);
  }, [details, story]);

  const highlights = details?.highlights ?? [
    "Reconnected to community resources and consistent support.",
    "Gained confidence through mentoring and safe spaces.",
    "Inspired others to pursue education, safety, or economic stability.",
  ];

  const support = details?.support ?? [
    "Mentorship and case management support.",
    "Access to essential supplies and program services.",
    "Follow-up visits to sustain long-term progress.",
  ];

  const metaArea = details?.area ?? story?.area ?? "Community Support";
  const metaDate = details?.date ?? "2024";
  const metaLocation = details?.location ?? "East Africa";
  const readTime = "5 min read";

  const relatedStories = useMemo(() => {
    const base = stories.length > 0 ? stories : IMPACT_STORIES_FALLBACK;
    return base.filter((item) => item.id !== id).slice(0, 2);
  }, [stories, id]);

  const heroImage = story ? cloudinaryTransform(story.imageUrl, "f_auto,q_auto,w_1600,h_900,c_fill") : "";
  const highlightQuote =
    details?.quote ??
    "Giving Her E.V.E didn't just give education; it amplified voices. Now that voice is used to speak for those who cannot.";

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Header />

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
            <img
              src={heroImage}
              alt={story?.title ?? "Impact story"}
              className="w-full h-72 md:h-96 object-cover"
            />
          </div>

          <div className="py-8 md:py-12">
            <Link
              to="/impact"
              className="inline-flex items-center text-sm font-semibold text-[#6A0DAD] hover:text-[#4B0B7A]"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Impact Journal
            </Link>

            {loading && <p className="text-sm text-gray-500 mt-4">Loading story...</p>}
            {error && <p className="text-sm text-rose-600 mt-4">Error: {error}</p>}
            {!loading && !story && !error && <p className="text-sm text-gray-500 mt-6">Story not found.</p>}

            {story && (
              <div className="mt-6 md:mt-8 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-500 mb-3">
                    <span className="rounded-full bg-[#F2E7FF] text-[#6A0DAD] px-3 py-1">{metaArea}</span>
                    <span>{metaDate}</span>
                    <span>{metaLocation}</span>
                    <span>• {readTime}</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    {story.title}
                  </h1>
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">{story.excerpt}</p>

                  <div className="bg-[#F8F1FF] border border-[#E5D6FF] rounded-2xl p-6 md:p-7 text-[#4B0B7A] text-lg md:text-xl font-semibold italic leading-relaxed mb-6">
                    “{highlightQuote}”
                  </div>

                  <div className="space-y-5 text-gray-700 text-sm sm:text-base leading-relaxed">
                    {narrative.map((paragraph, index) => (
                      <p key={`paragraph-${index}`}>{paragraph}</p>
                    ))}
                  </div>

                  <div className="bg-[#F8F1FF] border border-[#E5D6FF] rounded-2xl p-6 md:p-7 text-[#4B0B7A] text-lg md:text-xl font-semibold italic leading-relaxed mt-8">
                    “{highlightQuote}”
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="font-semibold text-gray-700">Share</span>
                      <a className="p-2 rounded-full border border-gray-200 hover:border-[#6A0DAD] hover:text-[#6A0DAD]" href="#">
                        <Facebook className="h-4 w-4" />
                      </a>
                      <a className="p-2 rounded-full border border-gray-200 hover:border-[#6A0DAD] hover:text-[#6A0DAD]" href="#">
                        <Twitter className="h-4 w-4" />
                      </a>
                      <a className="p-2 rounded-full border border-gray-200 hover:border-[#6A0DAD] hover:text-[#6A0DAD]" href="#">
                        <Instagram className="h-4 w-4" />
                      </a>
                    </div>
                    <Link
                      to="/impact"
                      className="inline-flex items-center justify-center rounded-full bg-white border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700 hover:border-[#6A0DAD] hover:text-[#6A0DAD]"
                    >
                      Back to Stories
                    </Link>
                  </div>
                </div>

                <aside className="space-y-6">
                  <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact Summary</h3>
                    <div className="space-y-3">
                      {IMPACT_SUMMARY.map((item) => (
                        <div key={item.label} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{item.label}</span>
                          <span className="font-semibold text-gray-900">{item.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 rounded-xl border border-purple-100 bg-[#F8F1FF] p-4">
                      <p className="text-sm text-gray-700 mb-3">
                        Support sustained education access, safe spaces, and leadership programs for girls.
                      </p>
                      <Link
                        to="/donate"
                        className="inline-flex items-center justify-center w-full rounded-full bg-[#6A0DAD] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[#4B0B7A] transition-colors"
                      >
                        Donate to this Cause
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Other Organizational Initiatives</h3>
                      <Share2 className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="space-y-4">
                      {relatedStories.map((item) => (
                        <Link
                          key={item.id}
                          to={`/impact/${item.id}`}
                          className="flex gap-3 rounded-xl border border-gray-100 hover:border-[#6A0DAD]/50 transition-colors overflow-hidden"
                        >
                          <img
                            src={cloudinaryTransform(item.imageUrl, "f_auto,q_auto,w_200,h_140,c_fill")}
                            alt={item.title}
                            className="w-28 h-24 object-cover"
                            loading="lazy"
                          />
                          <div className="py-2 pr-3 flex flex-col justify-between">
                            <div>
                              <p className="text-[11px] uppercase font-semibold text-[#6A0DAD] mb-1">
                                {IMPACT_STORY_DETAILS[item.id]?.area ?? "Impact"}
                              </p>
                              <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">{item.title}</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              {IMPACT_STORY_DETAILS[item.id]?.date ?? "2024"}
                            </p>
                          </div>
                        </Link>
                      ))}
                      {relatedStories.length === 0 && (
                        <p className="text-sm text-gray-500">More initiatives coming soon.</p>
                      )}
                    </div>
                  </div>
                </aside>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StoryDetail;
