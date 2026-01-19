import React, { useEffect, useMemo, useState } from "react";
import { testimonialService } from "../services/testimonialService";

export default function GallerySection() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  

  useEffect(() => {
    (async () => {
      try {
        const data = await testimonialService.getAll();
        setTestimonials(data || []);
      } catch (e) {
        console.error("Gallery fetch error:", e?.message || e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Build gallery items from drawing_urls + drawing_titles
  const artworks = useMemo(() => {
    const items = [];

    for (const t of testimonials) {
      const urls = Array.isArray(t?.drawing_urls) ? t.drawing_urls : [];
      const titles = Array.isArray(t?.drawing_titles) ? t.drawing_titles : [];

      urls.forEach((url, idx) => {
        items.push({
          src: url,
          title: titles[idx] || `Drawing ${idx + 1}`,
          studentName: t?.name || "Student",
          course: t?.course || "Artwork",
          stars: t?.stars || 5,
          quote: t?.quote || "",
        });
      });
    }

    return items;
  }, [testimonials]);

  const openModal = (artwork) => {
    setSelectedImage(artwork);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <section id="gallery" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-20 w-24 h-24 bg-gray-100 rounded-full blur-2xl"></div>
      <div className="absolute bottom-10 right-20 w-32 h-32 bg-gray-200 rounded-full blur-2xl"></div>

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold tracking-tight text-black mb-4">
            Gallery Showcase
          </h2>
          <div className="w-24 h-1 bg-black mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Artworks uploaded by our students through testimonials.
          </p>
        </div>

        {/* Loading / Empty state */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : artworks.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            No student artworks yet. Upload drawings in testimonials to show them
            here.
          </div>
        ) : (
          <>
            {/* Gallery grid - Improved to show full images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {artworks.map((art, index) => (
                <div
                  key={`${art.src}-${index}`}
                  onClick={() => openModal(art)}
                  className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white"
                >
                  {/* Decorative border */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 to-gray-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>

                  {/* Main image container - IMPROVED */}
                  <div className="relative bg-gray-50 rounded-xl overflow-hidden">
                    {/* Image wrapper with aspect ratio container */}
                    <div className="relative w-full aspect-square">
                      <img
                        src={art.src}
                        alt={art.title}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/600/CCCCCC/666666?text=Image+Not+Found";
                        }}
                        className="absolute inset-0 w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
                      />
                  </div>


                    {/* Overlay with gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                    {/* Info overlay on hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                      <h3 className="text-white text-xl font-bold mb-1 line-clamp-1">
                        {art.title}
                      </h3>
                      <p className="text-white/90 text-sm mb-1">{art.studentName}</p>
                      <p className="text-white/70 text-xs mb-2">{art.course}</p>
                      {/* <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < art.stars ? "text-yellow-400" : "text-white/30"
                            } fill-current`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div> */}
                    </div>

                    {/* Click to view indicator */}
                    <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 transform scale-0 group-hover:scale-100 flex items-center justify-center shadow-lg">
                      <svg
                        className="w-5 h-5 text-black"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View more section */}
            <div className="text-center">
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
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Stats section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center group">
            <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-xl">{artworks.length}+</span>
            </div>
            <p className="text-gray-800 font-semibold">Artworks Created</p>
            <p className="text-gray-500 text-sm">In Our Studio</p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-xl">{testimonials.length}+</span>
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
        </div>
      </div>

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4 sm:p-10 backdrop-blur-sm"
          onClick={closeModal}
        >
          {/* Close button */}
          <button
            className="fixed top-6 right-6 sm:top-10 sm:right-10 text-white text-2xl sm:text-3xl font-bold hover:scale-110 transition-transform z-[210] bg-white/10 backdrop-blur-md w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center hover:bg-white/20"
            onClick={closeModal}
          >
            ✕
          </button>

          {/* Modal Content */}
          <div
            className="relative w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-center lg:items-start"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Section */}
            <div className="flex-1 flex items-center justify-center">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="max-h-[70vh] sm:max-h-[80vh] w-auto max-w-full object-contain rounded-lg shadow-2xl border-4 border-white/10"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/800/CCCCCC/666666?text=Image+Not+Found';
                }}
              />
            </div>

            {/* Details Section */}
            <div className="w-full lg:w-96 bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
              {/* Title */}
              <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
                {selectedImage.title}
              </h2>

              {/* Divider */}
              <div className="w-16 h-1 bg-white/50 rounded-full mb-6"></div>

              {/* Artist Info */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-wider">Artist</p>
                    <p className="text-white font-semibold text-lg">{selectedImage.studentName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-wider">Course</p>
                    <p className="text-white font-semibold text-lg">{selectedImage.course}</p>
                  </div>
                </div>
              </div>

              {/* Star Rating
              <div className="mb-6">
                <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Rating</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-6 h-6 ${
                        i < selectedImage.stars ? "text-yellow-400" : "text-white/20"
                      } fill-current`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-white font-semibold">{selectedImage.stars}/5</span>
                </div>
              </div> */}

              {/* Testimonial Quote */}
              {/* {selectedImage.quote && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Testimonial</p>
                  <p className="text-white/90 text-sm italic leading-relaxed">
                    "{selectedImage.quote}"
                  </p>
                </div>
              )} */}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}