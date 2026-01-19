import React, { useState, useEffect } from "react";
import { X, Eye, Calendar, Palette } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

// --- DUMMY DATA FOR ARTWORK ---
const artPieces = [
  {
    id: 1,
    src: "/images/drawing1.webp",
    title: "The Gaze Beneath",
    description:
      "Always excited when drawing detailed eyes, as it showcases true artistic skill and creativity. Each line and shade brings emotion to life, reflecting talent and passion",
    medium: "Charcoal",
    year: "2025",
    size: "A4 ( 21.0 cm x 29.7 cm)",
  },
  {
    id: 2,
    src: "/images/drawing2.jpg",
    title: "Whispers of Light",
    description:
      "A door opens silently, revealing nothing but endless dark shadows",
    medium: "Charcoal",
    year: "2025",
    size: "A6 ( 10.5 cm x 14.5 cm)",
  },
  {
    id: 3,
    src: "/images/drawing3.jpg",
    title: "Beacon in the Storm",
    description:
      "Water splashes through mountains, guided gently by a distant lighthouse",
    medium: "Charcoal",
    year: "2025",
    size: "A6 ( 10.5 cm x 14.5 cm)",
  },
  {
    id: 4,
    src: "/images/drawing4.jpg",
    title: "Eyes of the Wild",
    description: "Slashing through the darkness with power!",
    medium:
      "Charcoal Generals 2B, 4B & 6B, Charcoal powder, Staedtler 2B,3B,4B,6B & 8B, Graphite powder",
    year: "2025",
    size: "A3 ( 29.7 cm x 42.0 cm)",
  },
  {
    id: 5,
    src: "/images/drawing5.jpg",
    title: "Through the Lens",
    description: "Eye..",
    medium: "Graphite, Steadtler Mars lumograpgh :2B, 4B, 6B, Graphite powder",
    year: "2025",
    size: "A5 ( 14.8 cm x 21.0 cm)",
  },
  {
    id: 6,
    src: "/images/drawing6.webp",
    title: "Spirit of Pandora",
    description:
      "Capturing the ethereal beauty and otherworldly essence of the Na’vi character from Avatar",
    medium:
      "Steadtler 6B, 4B, 2B, White gel pen, Charcoal Generals: 2B, 4B & 6B, Charcoal powder",
    year: "2024",
    size: "A4 ( 21.0 cm x 29.7 cm)",
  },
];

// --- ARTWORK MODAL COMPONENT ---
const ArtModal = ({ isOpen, onClose, artworks }) => {
  const [selectedArt, setSelectedArt] = useState(null);

  // This useEffect hook controls body scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to restore scrolling when the component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-7xl h-[95vh] rounded-3xl shadow-2xl overflow-hidden border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Enhanced Header */}
        <div className="relative bg-gradient-to-r from-gray-50 to-white p-8 border-b border-gray-200">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-all duration-300 transform hover:scale-110 shadow-lg"
            aria-label="Close gallery"
          >
            <X size={20} />
          </button>

          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-4">
              Artist's Portfolio
            </h2>
            <div className="w-24 h-1 bg-black mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 text-lg">
              A curated collection showcasing diverse techniques and artistic
              expressions
            </p>
          </div>

          {/* Stats bar */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-8 bg-white rounded-full px-8 py-3 shadow-lg border border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-black">
                  {artworks.length}
                </div>
                <div className="text-sm text-gray-500">Artworks</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-black">5+</div>
                <div className="text-sm text-gray-500">Mediums</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-black">3</div>
                <div className="text-sm text-gray-500">Years</div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Content */}
        <div className="p-8 h-[calc(100%-200px)] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {artworks.map((art, index) => (
              <div
                key={art.id}
                className="group relative overflow-hidden rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-500 cursor-pointer"
                onClick={() => setSelectedArt(art)}
              >
                {/* Border effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 to-gray-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>

                <div className="relative bg-white rounded-2xl overflow-hidden">
                  <img
                    src={art.src}
                    alt={art.title}
                    className="w-full h-80 object-cover transition-all duration-700 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    <h3 className="text-white font-bold text-xl mb-2">
                      {art.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-white/80 text-sm">
                      <div className="flex items-center space-x-1">
                        <Palette size={14} />
                        <span>{art.medium}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{art.year}</span>
                      </div>
                    </div>
                    <div className="w-12 h-0.5 bg-white mt-3"></div>
                  </div>

                  {/* View icon */}
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 transform scale-0 group-hover:scale-100">
                    <Eye size={16} className="text-black" />
                  </div>
                </div>

                {/* Artwork number
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg transform -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                  {String(index + 1).padStart(2, '0')}
                </div> */}
              </div>
            ))}
          </div>

          {/* Bottom section */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center space-x-4 px-8 py-4 bg-gray-50 rounded-full border border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all duration-300 group cursor-pointer">
              {/* <span className="font-semibold">View Complete Exhibition</span> */}
              {/* <div className="w-8 h-8 bg-black group-hover:bg-white rounded-full flex items-center justify-center transition-colors">
                <svg
                  className="w-4 h-4 text-white group-hover:text-black transition-colors"
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
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Individual artwork detail modal */}
      {selectedArt && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-lg z-60 flex items-center justify-center p-4"
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
              <div className="relative">
                <img
                  src={selectedArt.src}
                  alt={selectedArt.title}
                  className="w-full h-96 md:h-full object-cover"
                />
              </div>

              <div className="p-8 flex flex-col justify-center">
                <h3 className="text-3xl font-bold text-black mb-4">
                  {selectedArt.title}
                </h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <Palette size={18} className="text-gray-600" />
                    <span className="text-gray-700">
                      Medium: {selectedArt.medium}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar size={18} className="text-gray-600" />
                    <span className="text-gray-700">
                      Year: {selectedArt.year}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                      />
                    </svg>
                    <span className="text-gray-700">
                      Size: {selectedArt.size}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {selectedArt.description}
                </p>
                <div className="w-full h-0.5 bg-black"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN ABOUT SECTION COMPONENT ---
export default function AboutSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [artworks, setArtworks] = useState([]);
  const [artLoading, setArtLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setArtLoading(true);
        const { data, error } = await supabase
          .from("artworks")
          .select("*")
          .order("id", { ascending: true });

        if (error) throw error;
        setArtworks(data || []);
      } catch (e) {
        console.error("Fetch artworks error:", e?.message || e);
      } finally {
        setArtLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  return (
    <>
      <section
        id="about"
        className="py-24 px-6 bg-white relative overflow-hidden"
      >
        {/* Decorative background elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gray-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gray-200 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 tracking-tight text-black">
              Meet the Artist
            </h2>
            <div className="w-24 h-1 bg-black mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Image side */}
            <div className="relative group">
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-gray-300 rounded-lg transform rotate-2 transition-transform group-hover:rotate-3"></div>
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-gray-400 rounded-lg transform -rotate-1 transition-transform group-hover:-rotate-2"></div>
              <div className="absolute -inset-3 bg-gray-200 rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-all duration-700"></div>
              <div className="relative overflow-hidden rounded-lg shadow-2xl">
                <img
                  src="/images/melvinsir.jpg"
                  alt="Portrait of the art teacher, Melvinraj C R"
                  className="relative w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-black rounded-full opacity-80 shadow-lg animate-pulse"></div>
              <div
                className="absolute -bottom-8 -left-8 w-8 h-8 bg-gray-600 rounded-full opacity-60 shadow-lg animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>

            {/* Content side */}
            <div className="space-y-6">
              <div className="inline-flex items-center px-6 py-3 bg-gray-100 rounded-full border border-gray-300">
                <div className="w-3 h-3 bg-black rounded-full mr-3 animate-pulse"></div>
                <span className="text-black font-bold text-lg tracking-wide">
                  MELVINRAJ C R
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 leading-tight">
                Artist & Creative Instructor
              </h3>
              <div className="flex items-center space-x-4 py-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">10+</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-800 font-semibold">
                    Years of Experience
                  </p>
                  {/* <p className="text-gray-600 text-sm">
                    Classical & Contemporary Art
                  </p> */}
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed text-lg">
                An Assistant Professor at Jyothi Engineering College and a seasoned artist with 10+ years of experience, he is committed to fostering creativity in learners of all ages. Combining five years of experience in children’s art education with a passion for transformative teaching, his sessions—available both online and offline—go beyond the basics. He empowers students to build confidence and explore their potential, turning every lesson into a joyful, creative adventure.
                </p>
                {/* <p className="text-gray-600 leading-relaxed">
                  From foundational drawing skills to advanced oil painting techniques, my classes are designed to be engaging, informative, and, most importantly, fun.
                </p> */}
              </div>
              <div className="pt-6">
                <h4 className="text-gray-800 font-semibold mb-3">
                  Specialties
                </h4>
                <div className="flex flex-wrap gap-2">
                  {["Pencil Drawing", "Charcoal", "Graphite"].map(
                    (skill, index) => (
                      <span
                        key={skill}
                        className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium border border-gray-300 hover:border-gray-500 hover:bg-gray-200 transition-colors cursor-default"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>
              <div className="pt-6">
                <button
  onClick={() => setIsModalOpen(true)}
  disabled={artLoading}
  className="inline-flex items-center px-8 py-3 bg-black text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:bg-gray-800 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
>
  {artLoading ? "Loading..." : "View My Work"}
  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
</button>

              </div>
            </div>
          </div>
        </div>
      </section>

      <ArtModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  artworks={artworks}
/>

    </>
  );
}
