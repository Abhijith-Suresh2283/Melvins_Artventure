import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import GallerySection from './components/GallerySection';
import ClassesSection from './components/ClassesSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import Testimonials from './components/Testimonials';
import StudentGallery from './components/StudentGallery';
import LaunchOverlay from './components/LaunchOverlay';
// import FAQSection from './components/FAQSection'; 

export default function App() {
  return (
    <div className="font-sans bg-[#FDFBF6] text-[#3C3C3C]">
       <LaunchOverlay title="Melvin's Artventure" subtitle="Art Classes" />
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <GallerySection />
        <StudentGallery />
        <ClassesSection />
        <Testimonials />
        {/* <FAQSection /> */}
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
