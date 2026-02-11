import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowRight, Facebook, Instagram, Twitter, Share2 } from "lucide-react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { fetchStories, isRecoverableApiError } from "../services/api";
import { IMPACT_STORIES_FALLBACK, IMPACT_STORY_DETAILS } from "../data/impactStories";
import { getResponsiveImage } from "../utils/image";

const stripHtml = (value) =>
  value ? value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() : "";

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
  const [useFallbackStories, setUseFallbackStories] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      setUseFallbackStories(false);
      try {
        const data = await fetchStories();
        if (cancelled) return;
        setStories(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) {
          const recoverable = isRecoverableApiError(err);
          setError(recoverable ? null : "Unable to load story details right now.");
          setUseFallbackStories(recoverable);
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
    if (useFallbackStories) {
      return IMPACT_STORIES_FALLBACK.find((item) => item.id === id) ?? null;
    }
    return null;
  }, [id, stories, useFallbackStories]);

  const isFallbackStory = Boolean(story && useFallbackStories && stories.length === 0);
  const details = isFallbackStory && story ? IMPACT_STORY_DETAILS[story.id] : null;

  const contentHtml = story?.content ?? "";
  const usesRichText = Boolean(contentHtml && /<[^>]+>/.test(contentHtml));

  const narrative = useMemo(() => {
    if (!story) return [];
    if (usesRichText) return [];
    if (story.content) return [stripHtml(story.content)];
    if (details?.paragraphs?.length) return details.paragraphs;
    const base = story.excerpt ?? "";
    return [
      base,
      "Our teams coordinated with local partners to deliver practical resources, mentoring, and follow-up support.",
      "The program outcomes now guide future planning and inspire neighboring communities to engage.",
    ].filter(Boolean);
  }, [details, story, usesRichText]);

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

  const metaArea = story?.area ?? details?.area ?? "Community Support";
  const metaDate = story?.date ?? details?.date ?? "Date TBD";
  const metaLocation = story?.location ?? details?.location ?? "Location TBD";
  const readTime = "5 min read";

  const relatedStories = useMemo(() => {
    const base = stories.length > 0
      ? stories
      : useFallbackStories
        ? IMPACT_STORIES_FALLBACK
        : [];
    return base.filter((item) => item.id !== id).slice(0, 2);
  }, [stories, id, useFallbackStories]);

  const heroImage = getResponsiveImage(story?.imageUrl, {
    widths: [720, 1080, 1440, 1800],
    sizes: "100vw",
  });
  const highlightQuote =
    details?.quote ??
    "Giving Her E.V.E didn't just give education; it amplified voices. Now that voice is used to speak for those who cannot.";
  const projectGallery = useMemo(() => {
    if (!story) return [];
    const explicitGallery = Array.isArray(story.galleryImages) ? story.galleryImages : [];
    if (explicitGallery.length > 0) {
      const uniqueStoryImages = [];
      const seenStoryImages = new Set();
      for (const src of [story.imageUrl, ...explicitGallery]) {
        if (!src || seenStoryImages.has(src)) continue;
        uniqueStoryImages.push({ src, title: story.title });
        seenStoryImages.add(src);
        if (uniqueStoryImages.length >= 6) break;
      }
      return uniqueStoryImages;
    }

    const fallbackPool = useFallbackStories
      ? IMPACT_STORIES_FALLBACK.filter((item) => item.id !== story.id)
      : [];
    const pool = [story, ...fallbackPool];
    const unique = [];
    const seen = new Set();
    for (const item of pool) {
      if (!item?.imageUrl || seen.has(item.imageUrl)) continue;
      unique.push({ src: item.imageUrl, title: item.title });
      seen.add(item.imageUrl);
      if (unique.length >= 6) break;
    }
    return unique;
  }, [story, useFallbackStories]);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Header />

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-10 md:pt-14">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#6A0DAD] mb-3">
              In-Depth Campaign Details
            </p>
          </div>

          <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 mt-4">
            <div className="relative h-[340px] sm:h-[420px] md:h-[520px] bg-[#1B0D29] overflow-hidden">
              <img
                src={heroImage.src}
                srcSet={heroImage.srcSet}
                sizes={heroImage.sizes}
                alt={story?.title ?? "Impact story"}
                className="w-full h-full object-cover"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width={1800}
                height={1080}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 px-6 sm:px-10 pb-8 sm:pb-10 text-white">
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-white/80 mb-3">
                  <span className="rounded-full bg-white/15 text-white px-3 py-1">{metaArea}</span>
                  <span>{metaLocation}</span>
                  <span>{metaDate}</span>
                  <span>• {readTime}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">{story?.title}</h1>
                <p className="text-sm sm:text-base text-white/90 max-w-2xl">{story?.excerpt}</p>
              </div>
            </div>
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
            {error && <p className="text-sm text-rose-600 mt-4">{error}</p>}
            {!loading && useFallbackStories && (
              <p className="text-sm text-amber-600 mt-2">Live story data is temporarily unavailable. Showing fallback story data.</p>
            )}
            {!loading && !story && !error && <p className="text-sm text-gray-500 mt-6">Story not found.</p>}

            {story && (
              <div className="mt-6 md:mt-8 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <div className="bg-[#F8F1FF] border border-[#E5D6FF] rounded-2xl p-6 md:p-7 text-[#4B0B7A] text-lg md:text-xl font-semibold italic leading-relaxed mb-6">
                    “{highlightQuote}”
                  </div>

                  {usesRichText ? (
                    <div
                      className="rich-text text-gray-700 text-sm sm:text-base leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: contentHtml }}
                    />
                  ) : (
                    <div className="space-y-5 text-gray-700 text-sm sm:text-base leading-relaxed">
                      {narrative.map((paragraph, index) => (
                        <p key={`paragraph-${index}`}>{paragraph}</p>
                      ))}
                    </div>
                  )}

                  <div className="bg-[#F8F1FF] border border-[#E5D6FF] rounded-2xl p-6 md:p-7 text-[#4B0B7A] text-lg md:text-xl font-semibold italic leading-relaxed mt-8">
                    “{highlightQuote}”
                  </div>

                  <div className="mt-10">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Project Gallery</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {projectGallery.map((item, index) => {
                        const galleryImage = getResponsiveImage(item.src, {
                          widths: [320, 520, 680],
                          aspectRatio: 600 / 420,
                          sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
                        });

                        return (
                          <figure
                            key={`${item.title}-${index}`}
                            className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm"
                          >
                            <img
                              src={galleryImage.src}
                              srcSet={galleryImage.srcSet}
                              sizes={galleryImage.sizes}
                              alt={item.title}
                              className="w-full h-40 sm:h-44 object-cover"
                              loading="lazy"
                              decoding="async"
                              width={680}
                              height={476}
                            />
                          </figure>
                        );
                      })}
                    </div>
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
                      {relatedStories.map((item) => {
                        const relatedImage = getResponsiveImage(item.imageUrl, {
                          widths: [200, 280, 360],
                          aspectRatio: 200 / 140,
                          sizes: "112px",
                        });

                        return (
                          <Link
                            key={item.id}
                            to={`/impact/${item.id}`}
                            className="flex gap-3 rounded-xl border border-gray-100 hover:border-[#6A0DAD]/50 transition-colors overflow-hidden"
                          >
                            <img
                              src={relatedImage.src}
                              srcSet={relatedImage.srcSet}
                              sizes={relatedImage.sizes}
                              alt={item.title}
                              className="w-28 h-24 object-cover"
                              loading="lazy"
                              decoding="async"
                              width={360}
                              height={252}
                            />
                            <div className="py-2 pr-3 flex flex-col justify-between">
                              <div>
                                <p className="text-[11px] uppercase font-semibold text-[#6A0DAD] mb-1">
                                  {item.area ?? (useFallbackStories ? IMPACT_STORY_DETAILS[item.id]?.area : null) ?? "Impact"}
                                </p>
                                <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">{item.title}</p>
                              </div>
                              <p className="text-xs text-gray-500">
                                {item.date ?? (useFallbackStories ? IMPACT_STORY_DETAILS[item.id]?.date : null) ?? "Date TBD"}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
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
