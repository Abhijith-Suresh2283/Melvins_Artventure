import React, { useState, useEffect } from 'react';

// Smooth scroll utility
const scrollToSection = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);

    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'About', id: 'about' },
    { name: 'Gallery', id: 'gallery' },
    { name: 'Classes', id: 'classes' },
    { name: 'Testimonials', id: 'testimonials' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled || isOpen
          ? 'bg-[#FDFBF6]/90 backdrop-blur-lg shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo Section */}
        <div
          className="flex items-center gap-2 min-w-0"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img
            src={isScrolled || isOpen ? '/images/logo-dark.png' : '/images/logo-light.png'}
            alt="Logo"
            className="h-7 w-auto flex-shrink-0"
          />

          {/* FIX: truncate text instead of overlapping */}
          <div
            className={`text-lg sm:text-xl font-bold tracking-wider whitespace-nowrap overflow-hidden text-ellipsis ${
              isScrolled || isOpen ? 'text-black' : 'text-white'
            }`}
          >
            MELVIN'S ARTVENTURE
          </div>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className={`text-sm font-medium hover:text-[#A7727D] transition-colors ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              {link.name}
            </button>
          ))}
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 flex-shrink-0"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className={`w-6 h-6 ${
              isScrolled || isOpen ? 'text-gray-700' : 'text-white'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-[#FDFBF6] px-6 overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 py-4' : 'max-h-0'
        }`}
      >
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => {
              scrollToSection(link.id);
              setIsOpen(false);
            }}
            className="block w-full text-left text-sm font-medium text-gray-700 hover:text-[#A7727D] py-2"
          >
            {link.name}
          </button>
        ))}
      </div>
    </header>
  );
}