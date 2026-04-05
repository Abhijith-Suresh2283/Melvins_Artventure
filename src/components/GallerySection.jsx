import React, { useEffect, useMemo, useState, useCallback } from "react";
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

        {/* Loading */}
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
            {/* Artworks grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
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

        {/* Stats */}
        {/* <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center group">
            <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-xl">{normalizedArtworks.length}+</span>
            </div>
            <p className="text-gray-800 font-semibold">Artworks Created</p>
            <p className="text-gray-500 text-sm">In Our Studio</p>
          </div>
          <div className="text-center group">
            <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-xl">50+</span>
            </div>
            <p className="text-gray-800 font-semibold">Happy Students</p>
            <p className="text-gray-500 text-sm">Learning Art</p>
          </div>
          <div className="text-center group">
            <div className="w-16 h-16 bg-gray-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-xl">25+</span>
            </div>
            <p className="text-gray-800 font-semibold">Techniques Taught</p>
            <p className="text-gray-500 text-sm">Different Mediums</p>
          </div>
          <div className="text-center group">
            <div className="w-16 h-16 bg-gray-400 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-xl">5+</span>
            </div>
            <p className="text-gray-800 font-semibold">Years Teaching</p>
            <p className="text-gray-500 text-sm">Professional Classes</p>
          </div>
        </div> */}
      </div>

      {/* Artwork detail modal */}
      {selectedArt && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-lg z-[200] flex items-center justify-center p-4"
          onClick={() => setSelectedArt(null)}
        >
          <div
            className="relative bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedArt(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-all duration-300"
            >
              <X size={16} />
            </button>

            <div className="grid md:grid-cols-2 h-full">
              <div className="relative bg-gray-100">
                <LazyImage
                  src={selectedArt.src}
                  alt={selectedArt.title}
                  eager
                  className="w-full h-96 md:h-full object-cover"
                />
              </div>

              <div className="p-8 flex flex-col justify-center overflow-y-auto">
                <h3 className="text-3xl font-bold text-black mb-6">{selectedArt.title}</h3>
                <div className="space-y-3 mb-6">
                  {selectedArt.medium && (
                    <div className="flex items-center space-x-3">
                      <Palette size={18} className="text-gray-500 flex-shrink-0" />
                      <span className="text-gray-700">Medium: <span className="font-medium text-gray-900">{selectedArt.medium}</span></span>
                    </div>
                  )}
                  {selectedArt.year && (
                    <div className="flex items-center space-x-3">
                      <Calendar size={18} className="text-gray-500 flex-shrink-0" />
                      <span className="text-gray-700">Year: <span className="font-medium text-gray-900">{selectedArt.year}</span></span>
                    </div>
                  )}
                  {selectedArt.size && (
                    <div className="flex items-center space-x-3">
                      <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      <span className="text-gray-700">Size: <span className="font-medium text-gray-900">{selectedArt.size}</span></span>
                    </div>
                  )}
                </div>
                {selectedArt.description && (
                  <p className="text-gray-600 leading-relaxed mb-6">{selectedArt.description}</p>
                )}
                <div className="w-full h-0.5 bg-black"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}