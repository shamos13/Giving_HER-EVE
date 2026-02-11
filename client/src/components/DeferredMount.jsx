import { useEffect, useRef, useState } from "react";

const DEFAULT_ROOT_MARGIN = "280px 0px";

function DeferredMount({
  children,
  fallback = null,
  rootMargin = DEFAULT_ROOT_MARGIN,
  className = "",
}) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = containerRef.current;
    if (!target) return;

    if (typeof window === "undefined" || typeof window.IntersectionObserver !== "function") {
      setIsVisible(true);
      return;
    }

    const observer = new window.IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={containerRef} className={className}>
      {isVisible ? children : fallback}
    </div>
  );
}

export default DeferredMount;

