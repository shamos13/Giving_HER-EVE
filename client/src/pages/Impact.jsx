import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Search, Share2 } from "lucide-react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { fetchStories } from "../services/api";
import { IMPACT_AREAS, IMPACT_STORIES_FALLBACK, IMPACT_STORY_DETAILS } from "../data/impactStories";

const cloudinaryTransform = (src, transform) => {
  if (!src) return src;
  return src.includes("/upload/") ? src.replace("/upload/", `/upload/${transform}/`) : src;
};

const IMPACT_STATS = [
  { label: "Women & girls supported", value: "2,500+" },
  { label: "Communities reached", value: "15" },
  { label: "Education kits delivered", value: "800" },
];

const stripHtml = (value) =>
  value ? value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() : "";

const FALLBACK_DATES = [
  "Feb 12, 2024",
  "Jan 28, 2024",
  "Jan 15, 2024",
  "Dec 22, 2023",
  "Dec 05, 2023",
  "Nov 18, 2023",
];

const ImpactStoryCard = ({ story, tone }) => (
  <article
    id={`story-${story.id}`}
    className="group overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-shadow"
  >
    <div className="relative overflow-hidden">
      <img
        src={cloudinaryTransform(story.imageUrl, "f_auto,q_auto,w_800,h_520,c_fill")}
        alt={story.title}
        className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        loading="lazy"
      />
      <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>
        {story.area}
      </span>
    </div>
    <div className="p-5">
      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
        <span>{story.location}</span>
        <span>{story.date}</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{story.title}</h3>
      <p className="text-sm text-gray-600 mb-4">{story.excerpt}</p>
      <Link
        to={`/impact/${story.id}`}
        className="inline-flex items-center text-sm font-semibold text-[#6A0DAD] hover:text-[#4B0B7A] transition-colors"
      >
        Read full story
        <ArrowRight className="ml-1 w-4 h-4" />
      </Link>
    </div>
  </article>
);

const Impact = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeArea, setActiveArea] = useState("All Stories");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

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
          setError(err instanceof Error ? err.message : "Failed to load stories");
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

  const normalizedStories = useMemo(() => {
    const base = stories.length > 0 ? stories : IMPACT_STORIES_FALLBACK;
    return base.map((story, index) => {
      const details = IMPACT_STORY_DETAILS[story.id];
      return {
        ...story,
        area: story.area ?? details?.area ?? IMPACT_AREAS[index % IMPACT_AREAS.length].label,
        tone: IMPACT_AREAS[index % IMPACT_AREAS.length].tone,
        date: story.date ?? details?.date ?? FALLBACK_DATES[index % FALLBACK_DATES.length],
        location: story.location ?? details?.location ?? "East Africa",
      };
    });
  }, [stories]);

  const filteredStories = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return normalizedStories.filter((story) => {
      const matchesArea = activeArea === "All Stories" || story.area === activeArea;
      if (!query) return matchesArea;
      const haystack = `${story.title} ${story.excerpt} ${stripHtml(story.content ?? "")}`.toLowerCase();
      return matchesArea && haystack.includes(query);
    });
  }, [activeArea, normalizedStories, searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [activeArea, searchTerm]);

  const [featuredStory, ...remainingStories] = filteredStories;
  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(remainingStories.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedStories = remainingStories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Header />

      <section className="bg-[#F6F2FB]">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-16 -right-12 h-56 w-56 rounded-full bg-[#E9DFFF] blur-3xl opacity-70" />
            <div className="absolute -bottom-10 -left-8 h-48 w-48 rounded-full bg-[#F3E7FF] blur-3xl opacity-70" />
          </div>

          <div className="relative flex flex-col items-center text-center">
            <span className="inline-flex items-center rounded-full bg-[#EADDFB] text-[#6A0DAD] px-4 py-1.5 text-[11px] font-semibold tracking-[0.3em] uppercase">
              Archive of Progress
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold text-[#1B0D29]">
              The Impact Journal:
              <span className="block text-[#6A0DAD] italic">Our Story of Change</span>
            </h1>
            <p className="mt-6 text-sm sm:text-base text-gray-600 max-w-2xl">
              A chronological collection of milestones, voices, and victories in our mission to empower women and
              girls across East Africa.
            </p>
          </div>

          <div className="relative mt-10 flex justify-center">
            <label className="w-full max-w-md relative flex items-center rounded-full border border-white bg-white/90 px-4 py-3 shadow-lg focus-within:border-[#6A0DAD]">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search stories"
                className="ml-3 flex-1 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none bg-transparent"
              />
            </label>
          </div>
        </div>
      </section>

      <section className="bg-[#F8FAFC] pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <button
              type="button"
              onClick={() => setActiveArea("All Stories")}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                activeArea === "All Stories"
                  ? "bg-[#6A0DAD] text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-[#6A0DAD] hover:text-[#6A0DAD]"
              }`}
            >
              All Stories
            </button>
            {IMPACT_AREAS.map((area) => (
              <button
                key={area.label}
                type="button"
                onClick={() => setActiveArea(area.label)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                  activeArea === area.label
                    ? "bg-[#6A0DAD] text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-[#6A0DAD] hover:text-[#6A0DAD]"
                }`}
              >
                {area.label}
              </button>
            ))}
          </div>

          {loading && <p className="text-sm text-gray-500">Loading stories...</p>}
          {error && <p className="text-sm text-rose-600">Error: {error}</p>}

          {featuredStory ? (
            <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] items-stretch mb-12">
              <div className="relative overflow-hidden rounded-3xl shadow-lg">
                <img
                  src={cloudinaryTransform(featuredStory.imageUrl, "f_auto,q_auto,w_1200,h_800,c_fill")}
                  alt={featuredStory.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="rounded-3xl bg-white border border-gray-100 p-8 shadow-lg flex flex-col">
                <span className="inline-flex w-fit items-center rounded-full bg-[#F2E7FF] text-[#6A0DAD] px-3 py-1 text-xs font-semibold mb-4">
                  Featured Impact Story
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  {featuredStory.title}
                </h2>
                <p className="text-sm text-gray-600 mb-4">{featuredStory.content ?? featuredStory.excerpt}</p>
                <div className="mt-auto flex items-center justify-between">
                  <Link
                    to={`/impact/${featuredStory.id}`}
                    className="inline-flex items-center rounded-full bg-[#6A0DAD] text-white px-5 py-2 text-sm font-semibold hover:bg-[#4B0B7A] transition-colors"
                  >
                    Read Full Story
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full border border-gray-200 p-2 text-gray-500 hover:text-[#6A0DAD] hover:border-[#6A0DAD] transition-colors"
                    aria-label="Share story"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            !loading && <p className="text-sm text-gray-500">No stories found for this filter.</p>
          )}

          <div className="grid gap-6 md:grid-cols-3 mb-12">
            {IMPACT_STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm"
              >
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedStories.map((story) => (
              <ImpactStoryCard key={story.id} story={story} tone={story.tone} />
            ))}
          </div>

          {paginatedStories.length === 0 && !loading && featuredStory && (
            <p className="text-sm text-gray-500 mt-6">No additional stories in this selection.</p>
          )}

          {remainingStories.length > pageSize && (
            <div className="mt-10 flex items-center justify-center gap-2 text-sm">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="rounded-full border border-gray-200 px-4 py-2 text-gray-600 hover:border-[#6A0DAD] hover:text-[#6A0DAD]"
                disabled={currentPage === 1}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={`page-${index + 1}`}
                  type="button"
                  onClick={() => setPage(index + 1)}
                  className={`h-9 w-9 rounded-full border text-sm font-semibold transition-colors ${
                    currentPage === index + 1
                      ? "bg-[#6A0DAD] text-white border-[#6A0DAD]"
                      : "border-gray-200 text-gray-600 hover:border-[#6A0DAD] hover:text-[#6A0DAD]"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                className="rounded-full border border-gray-200 px-4 py-2 text-gray-600 hover:border-[#6A0DAD] hover:text-[#6A0DAD]"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <div className="rounded-3xl bg-gradient-to-r from-[#6A0DAD] via-[#8F3CD6] to-[#B066EA] p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute right-[-4rem] top-[-3rem] h-40 w-40 rounded-3xl bg-white/10 rotate-12" />
            <div className="absolute left-[-3rem] bottom-[-4rem] h-48 w-48 rounded-full bg-white/10" />
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Keep following the Impact Journal
              </h2>
              <p className="text-sm md:text-base text-white/90 max-w-2xl mb-6">
                New stories are added throughout the year as our teams report from the field.
                Subscribe to stay connected and see how your generosity continues to transform lives.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/donate"
                  className="inline-flex items-center justify-center rounded-full bg-white text-[#6A0DAD] px-6 py-3 text-sm font-semibold hover:bg-[#F2E7FF] transition-colors"
                >
                  Support the next story
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-white/60 px-6 py-3 text-sm font-semibold hover:bg-white/10 transition-colors"
                >
                  Partner with us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Impact;
