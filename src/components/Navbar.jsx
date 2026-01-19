import React, { useState, useEffect } from 'react';

// Smooth scroll utility
const scrollToSection = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

// --- Navbar Component ---
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Sets isScrolled to true if user scrolls more than 10px
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation links array
  const navLinks = [
    { name: 'About', id: 'about' },
    { name: 'Gallery', id: 'gallery' },
    { name: 'Classes', id: 'classes' },
    { name: 'Testimonials', id: 'testimonials' },
    { name: 'Contact', id: 'contact' },
  ];

  // Define text color for nav links based on scroll state
  const navLinkColor = isScrolled ? 'text-gray-700' : 'text-white';

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#FDFBF6]/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo and text with dynamic color */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          {/* Conditional Logo Rendering */}
          {isScrolled ? (
            <img src="/images/logo-dark.png" alt="Dark Logo" className="h-8 w-auto mr-3" />
          ) : (
            <img src="/images/logo-light.png" alt="Light Logo" className="h-8 w-auto mr-3" />
          )}
          <div
            className={`text-2xl font-bold tracking-wider transition-colors duration-300 ${isScrolled ? 'text-black' : 'text-white'}`}
          >
            <span>MELVIN'S</span>
            <span>&nbsp;ARTVENTURE</span>
          </div>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map(link => (
            <button key={link.id} onClick={() => scrollToSection(link.id)} className={`text-sm font-medium hover:text-[#A7727D] transition-colors ${navLinkColor}`}>
              {link.name}
            </button>
          ))}
        </nav>

        {/* Mobile Menu Icon */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <svg className={`w-6 h-6 ${navLinkColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#FDFBF6] py-4 px-6 space-y-4">
          {navLinks.map(link => (
            <button key={link.id} onClick={() => { scrollToSection(link.id); setIsOpen(false); }} className="block w-full text-left text-sm font-medium text-gray-700 hover:text-[#A7727D] transition-colors">
              {link.name}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};