import { useEffect, useState } from "react";
import { fetchSponsors, isRecoverableApiError } from "../services/api";
import { getResponsiveImage } from "../utils/image";

const fallbackSponsors = [
  { id: "fallback-1", name: "Shopify", icon: "" },
  { id: "fallback-2", name: "Upwork", icon: "" },
  { id: "fallback-3", name: "Notion", icon: "" },
  { id: "fallback-4", name: "Medium", icon: "" },
  { id: "fallback-5", name: "Airbnb", icon: "" },
  { id: "fallback-6", name: "Ripple", icon: "" },
];

const PartnerStrip = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useFallbackSponsors, setUseFallbackSponsors] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      setUseFallbackSponsors(false);
      try {
        const data = await fetchSponsors();
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          setSponsors(data);
        } else {
          setSponsors([]);
        }
      } catch (err) {
        if (!cancelled) {
          const recoverable = isRecoverableApiError(err);
          setSponsors(recoverable ? fallbackSponsors : []);
          setUseFallbackSponsors(recoverable);
          setError(recoverable ? null : "Unable to load sponsors right now.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleSponsors = sponsors.filter(item => item?.name || item?.icon);

  return (
    <section className="bg-gradient-to-r from-[#7A2BCB] via-[#8F3CD6] to-[#B066EA] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-white/70 mb-6">
          Trusted by our supporters
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 text-white/80 text-sm font-semibold">
          {loading && (
            <span className="px-4 py-2 rounded-full bg-white/10 border border-white/15">
              Loading sponsors...
            </span>
          )}
          {!loading && error && (
            <span className="px-4 py-2 rounded-full bg-white/10 border border-white/15">
              Sponsors unavailable right now
            </span>
          )}
          {!loading && useFallbackSponsors && (
            <span className="px-4 py-2 rounded-full bg-white/10 border border-white/15">
              Fallback sponsors
            </span>
          )}
          {visibleSponsors.map((partner) => {
            const logo = getResponsiveImage(partner.icon, {
              widths: [80, 120, 160],
              sizes: "80px",
              crop: "fit",
            });

            return (
              <span
                key={partner.id || partner.name}
                className="px-4 py-2 rounded-full bg-white/10 border border-white/15 inline-flex items-center justify-center"
              >
                {partner.icon && partner.name ? (
                  <img
                    src={logo.src}
                    srcSet={logo.srcSet}
                    sizes={logo.sizes}
                    alt={partner.name}
                    className="h-5 w-auto"
                    loading="lazy"
                    decoding="async"
                    width={160}
                    height={64}
                  />
                ) : (
                  partner.name
                )}
              </span>
            );
          })}
          {!loading && !error && visibleSponsors.length === 0 && (
            <span className="px-4 py-2 rounded-full bg-white/10 border border-white/15">
              Sponsors coming soon
            </span>
          )}
        </div>
      </div>
    </section>
  );
};

export default PartnerStrip;
