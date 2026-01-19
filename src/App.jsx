import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import GallerySection from './components/GallerySection';
import ClassesSection from './components/ClassesSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import Testimonials from './components/Testimonials';

export default function App() {
  return (
    <div className="font-sans bg-[#FDFBF6] text-[#3C3C3C]">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <GallerySection />
        <ClassesSection />
        <Testimonials />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
