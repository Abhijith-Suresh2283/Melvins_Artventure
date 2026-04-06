import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { X, Eye, Calendar, Palette } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BUCKET_NAME = "artworks";

const getOptimizedUrl = (raw, { w = 900, h = 900, q = 70 } = {}) => {
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(raw, {
    transform: { width: w, height: h, resize: "contain", quality: q, format: "webp" },
  });
  return data?.publicUrl || "";
};

const LazyImage = ({ src, alt, className = "", eager = false }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-full h-full">
      {!loaded && <div className="absolute inset-0 animate-pulse bg-gray-200 rounded-2xl" />}
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/600/CCCCCC/666666?text=Image+Not+Found"; }}
        className={`${className} ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
      />
    </div>
  );
};

// ─── Mobile Carousel ──────────────────────────────────────────────────────────

function MobileCarousel({ artworks, onSelect }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const goTo = useCallback((index) => {
    const clamped = Math.max(0, Math.min(artworks.length - 1, index));
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: clamped * el.offsetWidth, behavior: "smooth" });
    setActiveIndex(clamped);
  }, [artworks.length]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.offsetWidth);
    setActiveIndex(index);
  }, []);

  return (
    <div className="relative w-full mb-10">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
      >
        {artworks.map((art, i) => (
          <div key={art.id} className="flex-shrink-0 w-full snap-center">
            <div
              onClick={() => onSelect(art)}
              className="relative overflow-hidden rounded-2xl shadow-lg cursor-pointer bg-white mx-1"
            >
              <div className="relative w-full aspect-square bg-gray-50">
                <LazyImage
                  src={art.src}
                  alt={art.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                  eager={i === 0}
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                <h3 className="text-white text-lg font-bold mb-1 line-clamp-1">{art.title}</h3>
                <div className="flex items-center gap-3">
                  {art.medium && (
                    <div className="flex items-center gap-1.5 text-white/80 text-sm">
                      <Palette size={13} /><span>{art.medium}</span>
                    </div>
                  )}
                  {art.year && (
                    <div className="flex items-center gap-1.5 text-white/70 text-xs">
                      <Calendar size={12} /><span>{art.year}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md">
                <Eye className="w-4 h-4 text-black" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-5">
        {artworks.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === activeIndex ? "w-6 h-2 bg-black" : "w-2 h-2 bg-gray-300"
            }`}
          />
        ))}
      </div>

      {activeIndex > 0 && (
        <button
          onClick={() => goTo(activeIndex - 1)}
          className="absolute left-2 top-[calc(50%-32px)] -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full shadow flex items-center justify-center"
        >
          <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      {activeIndex < artworks.length - 1 && (
        <button
          onClick={() => goTo(activeIndex + 1)}
          className="absolute right-2 top-[calc(50%-32px)] -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full shadow flex items-center justify-center"
        >
          <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ─── Main GallerySection ──────────────────────────────────────────────────────

export default function GallerySection() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArt, setSelectedArt] = useState(null);

  const fetchArtworks = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("artworks")
        .select("*")
        .order("id", { ascending: true });
      if (error) throw error;
      setArtworks(data || []);
    } catch (e) {
      console.error("Fetch artworks error:", e?.message || e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArtworks();
  }, [fetchArtworks]);

  const normalizedArtworks = useMemo(() => {
    return artworks.map((a) => {
      const raw = a?.image_path || a?.src || a?.image_url || a?.url || a?.drawing_url;
      return {
        id: a?.id,
        title: a?.title || "Untitled",
        description: a?.description || "",
        medium: a?.medium || "",
        year: a?.year || "",
        size: a?.size || "",
        src: getOptimizedUrl(raw, { w: 900, h: 900, q: 70 }),
      };
    });
  }, [artworks]);

  useEffect(() => {
    document.body.style.overflow = selectedArt ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedArt]);

  return (
    <section id="gallery" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-10 left-20 w-24 h-24 bg-gray-100 rounded-full blur-2xl"></div>
      <div className="absolute bottom-10 right-20 w-32 h-32 bg-gray-200 rounded-full blur-2xl"></div>

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold tracking-tight text-black mb-4">Gallery Showcase</h2>
          <div className="w-24 h-1 bg-black mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            A curated collection showcasing diverse techniques and artistic expressions.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : normalizedArtworks.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            No artworks yet. Add artworks in the admin panel to display them here.
          </div>
        ) : (
          <>
            {/* Mobile: Carousel */}
            <div className="block sm:hidden">
              <MobileCarousel artworks={normalizedArtworks} onSelect={setSelectedArt} />
            </div>

            {/* Desktop: Grid (unchanged) */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {normalizedArtworks.map((art) => (
                <div
                  key={art.id}
                  onClick={() => setSelectedArt(art)}
                  className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 to-gray-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                  <div className="relative bg-gray-50 rounded-xl overflow-hidden">
                    <div className="relative w-full aspect-square">
                      <LazyImage
                        src={art.src}
                        alt={art.title}
                        className="absolute inset-0 w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                      <h3 className="text-white text-xl font-bold mb-1 line-clamp-1">{art.title}</h3>
                      {art.medium && (
                        <div className="flex items-center gap-1.5 text-white/80 text-sm mb-1">
                          <Palette size={13} /><span>{art.medium}</span>
                        </div>
                      )}
                      {art.year && (
                        <div className="flex items-center gap-1.5 text-white/70 text-xs">
                          <Calendar size={12} /><span>{art.year}</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 transform scale-0 group-hover:scale-100 flex items-center justify-center shadow-lg">
                      <Eye className="w-5 h-5 text-black" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Instagram link */}
            <div className="flex justify-center">
              <div className="inline-flex items-center space-x-4 px-8 py-4 bg-gray-50 rounded-full border border-gray-200 hover:border-gray-400 transition-colors group cursor-pointer">
                <a
                  href="https://www.instagram.com/melvins_artventure?igsh=bmozZXVhb3I5aDB1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 font-semibold"
                >
                  View Complete Portfolio
                </a>
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Artwork detail modal */}
      {selectedArt && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-lg z-[200] flex items-end md:items-center justify-center"
          onClick={() => setSelectedArt(null)}
        >
          {/*
            Mobile: bottom sheet (slides up, rounded top corners, scrollable).
            Desktop: centered card with max-width.
          */}
          <div
            className="relative bg-white w-full md:max-w-4xl md:rounded-3xl rounded-t-3xl shadow-2xl border border-gray-200 overflow-y-auto"
            style={{ maxHeight: "92dvh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle visible on mobile */}
            <div className="flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Close button */}
            <button
              onClick={() => setSelectedArt(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-all duration-300"
            >
              <X size={16} />
            </button>

            {/* Mobile: stacked vertically. Desktop: side by side. */}
            <div className="flex flex-col md:grid md:grid-cols-2">

              {/* Image — square on mobile, full height on desktop */}
              <div className="relative bg-gray-100 w-full aspect-square flex-shrink-0">
                <LazyImage
                  src={selectedArt.src}
                  alt={selectedArt.title}
                  eager
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details — fully visible, scrolls with the sheet if needed */}
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <h3 className="text-2xl md:text-3xl font-bold text-black mb-5 pr-10">
                  {selectedArt.title}
                </h3>

                <div className="space-y-3 mb-5">
                  {selectedArt.medium && (
                    <div className="flex items-center space-x-3">
                      <Palette size={18} className="text-gray-500 flex-shrink-0" />
                      <span className="text-gray-700">
                        Medium: <span className="font-medium text-gray-900">{selectedArt.medium}</span>
                      </span>
                    </div>
                  )}
                  {selectedArt.year && (
                    <div className="flex items-center space-x-3">
                      <Calendar size={18} className="text-gray-500 flex-shrink-0" />
                      <span className="text-gray-700">
                        Year: <span className="font-medium text-gray-900">{selectedArt.year}</span>
                      </span>
                    </div>
                  )}
                  {selectedArt.size && (
                    <div className="flex items-center space-x-3">
                      <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      <span className="text-gray-700">
                        Size: <span className="font-medium text-gray-900">{selectedArt.size}</span>
                      </span>
                    </div>
                  )}
                </div>

                {selectedArt.description && (
                  <p className="text-gray-600 leading-relaxed mb-5">{selectedArt.description}</p>
                )}

                <div className="w-full h-0.5 bg-black mb-6 md:mb-0"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}