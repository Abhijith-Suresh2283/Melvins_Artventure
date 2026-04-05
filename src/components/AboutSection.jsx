import React, { useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

const BUCKET_NAME = "artworks";

const getOptimizedUrl = (raw, { w = 900, h = 900, q = 70 } = {}) => {
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(raw, {
    transform: { width: w, height: h, resize: "contain", quality: q, format: "webp" },
  });
  return data?.publicUrl || "";
};

export default function AboutSection() {
  return (
    <section id="about" className="py-24 px-6 bg-white relative overflow-hidden">
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
                loading="lazy"
                decoding="async"
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
                <p className="text-gray-800 font-semibold">Years of Experience</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed text-lg">
                An Assistant Professor at Jyothi Engineering College and a
                seasoned artist with 10+ years of experience, he is committed
                to fostering creativity in learners of all ages. Combining five
                years of experience in children's art education with a passion
                for transformative teaching, his sessions—available both online
                and offline—go beyond the basics. He empowers students to build
                confidence and explore their potential, turning every lesson
                into a joyful, creative adventure.
              </p>
            </div>

            <div className="pt-6">
              <h4 className="text-gray-800 font-semibold mb-3">Specialties</h4>
              <div className="flex flex-wrap gap-2">
                {["Pencil Drawing", "Charcoal", "Graphite"].map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium border border-gray-300 hover:border-gray-500 hover:bg-gray-200 transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}