import React from "react";
// Assuming you still need Supabase imports here based on your original file
import { supabase } from "../lib/supabaseClient"; 

export default function AboutSection() {
  return (
    <section id="about" className="py-24 px-6 bg-white relative overflow-hidden" aria-labelledby="about-heading">
      <div className="absolute top-20 left-10 w-32 h-32 bg-gray-100 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gray-200 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <h2 id="about-heading" className="text-5xl font-bold mb-4 tracking-tight text-black">
            Meet the Artist
          </h2>
          <div className="w-24 h-1 bg-black mx-auto rounded-full"></div>
        </div>

        <article className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <div className="relative group">
            <div className="absolute -top-4 -left-4 w-full h-full border-2 border-gray-300 rounded-lg transform rotate-2 transition-transform group-hover:rotate-3"></div>
            <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-gray-400 rounded-lg transform -rotate-1 transition-transform group-hover:-rotate-2"></div>
            <div className="absolute -inset-3 bg-gray-200 rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-all duration-700"></div>
            <div className="relative overflow-hidden rounded-lg shadow-2xl">
              <img
                src="/images/melvinsir.jpg"
                alt="Melvinraj C R - Expert Art Instructor and Assistant Professor"
                className="relative w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>

          {/* Content side - Enhanced E-E-A-T signals */}
          <div className="space-y-6">
            <div className="inline-flex items-center px-6 py-3 bg-gray-100 rounded-full border border-gray-300">
              <div className="w-3 h-3 bg-black rounded-full mr-3 animate-pulse"></div>
              <h3 className="text-black font-bold text-lg tracking-wide m-0">
                MELVINRAJ C R
              </h3>
            </div>

            <h4 className="text-3xl font-bold text-gray-800 leading-tight">
              Artist & Creative Instructor
            </h4>

            <div className="flex items-center space-x-4 py-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">10+</span>
                </div>
              </div>
              <div>
                <p className="text-gray-800 font-semibold text-lg">Years of Professional Experience</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed text-lg">
                An Assistant Professor at Jyothi Engineering College and a
                seasoned artist with over a decade of experience, he is committed
                to fostering creativity in learners of all ages. Combining five
                years of specialized experience in children's art education with a passion
                for transformative teaching, his sessions—available both <strong>online
                and offline</strong>—go beyond the basics. He empowers students to build
                confidence and explore their potential, turning every lesson
                into a joyful, creative adventure.
              </p>
            </div>

            <div className="pt-6">
              <h5 className="text-gray-800 font-semibold mb-3">Core Artistic Specialties</h5>
              <div className="flex flex-wrap gap-2" aria-label="List of art specialties">
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
        </article>
      </div>
    </section>
  );
}