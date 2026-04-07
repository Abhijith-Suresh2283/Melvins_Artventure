import React, { useEffect, useState, useCallback, useRef } from "react";
import { X, Eye, User, Palette, MapPin, Calendar, Grid2X2, ChevronRight } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

// ─── Lazy Image ───────────────────────────────────────────────────────────────

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
        onError={(e) => {
          e.currentTarget.src =
            "https://via.placeholder.com/600/CCCCCC/666666?text=Image+Not+Found";
        }}
        className={`${className} ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
      />
    </div>
  );
};

// ─── Mobile Carousel ──────────────────────────────────────────────────────────

function MobileCarousel({ artworks, onSelect }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const goTo = useCallback(
    (index) => {
      const clamped = Math.max(0, Math.min(artworks.length - 1, index));
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTo({ left: clamped * el.offsetWidth, behavior: "smooth" });
      setActiveIndex(clamped);
    },
    [artworks.length]
  );

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setActiveIndex(Math.round(el.scrollLeft / el.offsetWidth));
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
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-white/80 text-sm">
                    <User size={13} /><span>{art.student}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/70 text-xs">
                    <Palette size={12} /><span>{art.course}</span>
                  </div>
                  {art.place && (
            <div className="flex items-center gap-2 text-white/70 mt-1 text-xs">
              <MapPin size={13} /><span>{art.place}</span>
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

// ─── Art Card (shared between grid and modal grid) ────────────────────────────

function ArtCard({ art, onSelect, eager = false }) {
  return (
    <div
      onClick={() => onSelect(art)}
      className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 to-gray-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      <div className="relative bg-gray-50 rounded-xl overflow-hidden">
        <div className="relative w-full aspect-square">
          <LazyImage
            src={art.src}
            alt={art.title}
            eager={eager}
            className="absolute inset-0 w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
          <div className="flex items-center gap-1.5 text-white/80 text-sm mb-1">
            <User size={13} /><span>{art.student}</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/70 text-xs">
            <Palette size={12} /><span>{art.course}</span>
          </div>
          {art.place && (
            <div className="flex items-center gap-2 text-white/70 mt-1 text-xs">
              <MapPin size={13} /><span>{art.place}</span>
            </div>
          )}
        </div>
        <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 transform scale-0 group-hover:scale-100 flex items-center justify-center shadow-lg">
          <Eye className="w-5 h-5 text-black" />
        </div>
      </div>
    </div>
  );
}

// ─── View All Modal ───────────────────────────────────────────────────────────

function ViewAllModal({ artworks, onClose, onSelectArt }) {

  return (
    <div
      className="fixed inset-0 bg-black/95 backdrop-blur-lg z-[190] flex flex-col"
      onClick={onClose}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/10 flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <Grid2X2 size={20} className="text-white/60" />
          <span className="text-white font-semibold text-lg">All Artworks</span>
          <span className="text-white/40 text-sm">({artworks.length})</span>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all duration-200"
        >
          <X size={16} />
        </button>
      </div>

      {/* Scrollable grid */}
      <div
        className="flex-1 overflow-y-auto px-6 md:px-10 py-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
          {artworks.map((art, i) => (
            <ArtCard
              key={art.id}
              art={art}
              eager={i < 8}
              onSelect={(a) => {
                onSelectArt(a);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function DetailModal({ art, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/95 backdrop-blur-lg z-[200] flex items-end md:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full md:max-w-4xl md:rounded-3xl rounded-t-3xl shadow-2xl border border-gray-200 overflow-y-auto"
        style={{ maxHeight: "92dvh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-all duration-300"
        >
          <X size={16} />
        </button>

        <div className="flex flex-col md:grid md:grid-cols-2">
          <div className="relative bg-gray-100 w-full aspect-square flex-shrink-0">
            <LazyImage
              src={art.src}
              alt={art.title}
              eager
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 md:p-8 flex flex-col justify-center">
            <div className="space-y-3 mb-5">
              <div className="flex items-center space-x-3">
                <User size={18} className="text-gray-500 flex-shrink-0" />
                <span className="text-gray-700">
                  Student: <span className="font-medium text-gray-900">{art.student}</span>
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Palette size={18} className="text-gray-500 flex-shrink-0" />
                <span className="text-gray-700">
                  Course: <span className="font-medium text-gray-900">{art.course}</span>
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar size={18} className="text-gray-500 flex-shrink-0" />
                <span className="text-gray-700">
                  Age: <span className="font-medium text-gray-900">{art.age}</span>
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={18} className="text-gray-500 flex-shrink-0" />
                <span className="text-gray-700">
                  Place: <span className="font-medium text-gray-900">{art.place}</span>
                </span>
              </div>
            </div>
            <div className="w-full h-0.5 bg-black" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const PREVIEW_COUNT = 6; // 2 rows × 3 cols

export default function StudentGallery() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArt, setSelectedArt] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const fetchDrawings = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("testimonials")
        .select("name, course, age, place, drawing_urls, drawing_titles")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const flat = [];
      for (const row of data || []) {
        (row.drawing_urls || []).forEach((url, i) => {
          flat.push({
            id: `${row.name}-${i}-${url}`,
            src: url,
            title: row.drawing_titles?.[i] || `Drawing ${i + 1}`,
            student: row.name,
            course: row.course,
            age: row.age,
            place: row.place,
          });
        });
      }
      setArtworks(flat);
    } catch (e) {
      console.error("Fetch student drawings error:", e?.message || e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDrawings(); }, [fetchDrawings]);

  // Lock body scroll whenever any modal is open
  useEffect(() => {
    const anyOpen = selectedArt || showAll;
    document.body.style.overflow = anyOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedArt, showAll]);

  const previewArtworks = artworks.slice(0, PREVIEW_COUNT);
  const hasMore = artworks.length > PREVIEW_COUNT;

  return (
    <section id="student-gallery" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-10 left-20 w-24 h-24 bg-gray-100 rounded-full blur-2xl" />
      <div className="absolute bottom-10 right-20 w-32 h-32 bg-gray-200 rounded-full blur-2xl" />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold tracking-tight text-black mb-4">Student Gallery</h2>
          <div className="w-24 h-1 bg-black mx-auto rounded-full mb-4" />
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Artwork created by our students across different courses and techniques.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" />
          </div>
        ) : artworks.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No student drawings yet.</div>
        ) : (
          <>
            {/* Mobile: full carousel (unchanged) */}
            <div className="block sm:hidden">
              <MobileCarousel artworks={artworks} onSelect={setSelectedArt} />
            </div>

            {/* Desktop: fixed 2-row preview grid */}
            <div className="hidden sm:block">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                {previewArtworks.map((art, i) => (
                  <ArtCard key={art.id} art={art} eager={i < 3} onSelect={setSelectedArt} />
                ))}
              </div>

              {/* View All button — only if there are more than 6 */}
              {hasMore && (
                <div className="flex flex-col items-center gap-2">
                  {/* Subtle fade hint at the bottom of the grid */}
                  <p className="text-gray-400 text-sm">
                    Showing 6 of {artworks.length} artworks
                  </p>
                  <button
                    onClick={() => setShowAll(true)}
                    className="group inline-flex items-center gap-2.5 bg-black text-white px-8 py-3.5 rounded-full font-medium text-sm hover:bg-gray-800 active:scale-95 transition-all duration-200 shadow-lg shadow-black/10"
                  >
                    <Grid2X2 size={15} />
                    View All Artworks
                    <ChevronRight
                      size={15}
                      className="group-hover:translate-x-0.5 transition-transform duration-200"
                    />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* View All Modal — stays mounted beneath detail modal */}
      {showAll && (
        <ViewAllModal
          artworks={artworks}
          onClose={() => setShowAll(false)}
          onSelectArt={setSelectedArt}
        />
      )}

      {/* Detail Modal — z-[200] sits above View All z-[190] */}
      {selectedArt && (
        <DetailModal
          art={selectedArt}
          onClose={() => setSelectedArt(null)}
        />
      )}
    </section>
  );
}