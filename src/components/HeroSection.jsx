import React from 'react';

// Smooth scroll utility
const scrollToSection = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

// Replaced hotlinked Pinterest image with a local optimized webp image
const heroImageUrl = '/images/hero-bg.webp'; 

const HeroSection = () => { 
  return (
    <header className="relative h-screen w-full" aria-label="Hero Section">
      
      {/* Background Image - Added descriptive alt text */}
      <img
        src={heroImageUrl}
        alt="Creative workspace with painting tools and brushes"
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-between p-8 text-white md:p-12">
        
        <div className="text-2xl font-bold tracking-wider"></div>

        <div className="flex flex-col items-start md:flex-row md:items-end md:justify-between">
          
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold leading-tight md:text-6xl text-white">
              Online Drawing Classes at <span className="italic">Melvin's Artventure</span>
            </h1>
            {/* Added H2 for additional keyword context */}
            <h2 className="mt-4 text-lg font-medium text-gray-200 md:text-xl">
              Exclusive online sessions for students to learn from Zero to Hero in Pencil Drawing, Charcoal & Graphite, globally taught by expert Melvinraj C R.
            </h2>
          </div>

          <button
            onClick={() => scrollToSection('classes')}
            className="mt-8 rounded-full bg-white px-8 py-3 font-semibold tracking-wide text-black transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-white md:mt-0"
            aria-label="Enroll in art classes"
          >
            ENROLL NOW →
          </button>

        </div>
      </div>
    </header>
  );
};

export default HeroSection;