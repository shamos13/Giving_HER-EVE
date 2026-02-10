import { useEffect, useState } from "react";
import { fetchSponsors } from "../services/api";

const fallbackSponsors = [
  { id: "fallback-1", name: "Shopify", icon: "" },
  { id: "fallback-2", name: "Upwork", icon: "" },
  { id: "fallback-3", name: "Notion", icon: "" },
  { id: "fallback-4", name: "Medium", icon: "" },
  { id: "fallback-5", name: "Airbnb", icon: "" },
  { id: "fallback-6", name: "Ripple", icon: "" },
];

const PartnerStrip = () => {
  const [sponsors, setSponsors] = useState(fallbackSponsors);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await fetchSponsors();
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          setSponsors(data);
        }
      } catch {
        // Keep fallback list on error.
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
          {visibleSponsors.map((partner) => (
            <span
              key={partner.id || partner.name}
              className="px-4 py-2 rounded-full bg-white/10 border border-white/15 inline-flex items-center justify-center"
            >
              {partner.icon && partner.name ? (
                <img
                  src={partner.icon}
                  alt={partner.name}
                  className="h-5 w-auto"
                />
              ) : (
                partner.name
              )}
            </span>
          ))}
          {visibleSponsors.length === 0 && (
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
