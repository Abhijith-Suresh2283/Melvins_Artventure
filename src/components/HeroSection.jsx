// src/components/HeroSection.jsx


import React from 'react';


// You can replace this with your own image path
const heroImageUrl = 'https://i.pinimg.com/736x/00/90/de/0090de0ae7af7424bbe4fee07b71a0d8.jpg';


const HeroSection = () => { 
 return (
 <div className="relative h-screen w-full">
 {/* Background Image */}
 <img
 src={heroImageUrl}
 alt="Artistic background with paint brushes"
 className="absolute inset-0 h-full w-full object-cover"
 />


 {/* Overlay */}
 <div className="absolute inset-0 bg-black/50"></div>


 {/* Content Container */}
 <div className="relative z-10 flex h-full flex-col justify-between p-8 text-white md:p-12">
 {/* Top-left Logo */}
 <div className="text-2xl font-bold tracking-wider">
 </div>


 {/* Main Text & Button Container */}
 <div className="flex flex-col items-start md:flex-row md:items-end md:justify-between">
 {/* Main Headline */}
 <div className="max-w-xl">
 <h1 className="text-4xl font-bold leading-tight md:text-6xl">
 Unleash your creativity and{' '}
 <span className="italic">bring your vision to life.</span>
 </h1>
 </div>


 {/* Call to Action Button */}
 <button className="mt-8 rounded-full bg-white px-8 py-3 font-semibold tracking-wide text-black transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-white md:mt-0">
ENROLL NOW →
 </button>
 </div>
 </div>
 </div>
 );
};


export default HeroSection;