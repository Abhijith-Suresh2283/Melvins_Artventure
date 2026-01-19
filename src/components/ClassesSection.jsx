import React, { useState, useEffect } from 'react';
import { Brush, Palette, PenTool, Droplets } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function ClassesSection() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const WHATSAPP_NUMBER = "919061610323"; // <-- put your number here (country code + number, no +, no spaces)

const buildWhatsAppMessage = (cls) => {
  const lines = [
    "Hi! I want to enroll in a class.",
    "",
    `Class: ${cls?.title || "N/A"}`,
    `Level: ${cls?.level || "N/A"}`,
    `Duration: ${cls?.duration || "N/A"}`,
    `Details: ${cls?.description || "N/A"}`,
  ];
  return lines.join("\n");
};

const openWhatsApp = (cls) => {
  const message = buildWhatsAppMessage(cls);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
};


  // Icon mapping based on icon name stored in database
  const iconMap = {
    'PenTool': <PenTool className="w-8 h-8 text-black" />,
    'Palette': <Palette className="w-8 h-8 text-gray-700" />,
    'Brush': <Brush className="w-8 h-8 text-gray-600" />,
    'Droplets': <Droplets className="w-8 h-8 text-gray-500" />,
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      setClasses(data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="classes" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600">Loading classes...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="classes" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-600">Error loading classes: {error}</p>
          <button 
            onClick={fetchClasses}
            className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="classes" className="py-24 px-6 bg-gray-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gray-200 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gray-300 rounded-full blur-3xl opacity-30"></div>
      
      <div className="max-w-7xl mx-auto relative">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold tracking-tight text-black mb-4">
            Art Classes
          </h2>
          <div className="w-24 h-1 bg-black mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Find the perfect class to start or advance your artistic journey with our comprehensive course offerings.
          </p>
        </div>

        {/* Classes grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {classes.map((cls, index) => (
            <div key={cls.id} className="group relative">
              {/* Card background with layered effects */}
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 to-gray-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
              
              <div className="relative bg-white p-8 border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-500">
                {/* Icon container */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-300 group-hover:scale-110 transition-all duration-300">
                    <div className="group-hover:text-white transition-colors duration-300">
                      {iconMap[cls.icon] || iconMap['PenTool']}
                    </div>
                  </div>
                </div>

                {/* Level badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full border border-gray-200">
                    {cls.level}
                  </span>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-black transition-colors">
                    {cls.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {cls.description}
                  </p>
                  
                  {/* Duration info */}
                  <div className="flex items-center justify-center space-x-2 mb-6 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{cls.duration}</span>
                  </div>

                  {/* Enroll button */}
                  <button
  onClick={() => openWhatsApp(cls)}
  className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-black hover:text-white hover:border-black transition-all duration-300 group-hover:scale-105"
>
  Enroll Now
</button>

                </div>

                {/* Decorative corner elements */}
                <div className="absolute -top-2 -left-2 w-4 h-4 border-2 border-gray-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-2 border-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"></div>
              </div>

              {/* Class number */}
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg transform -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                {String(index + 1).padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>

        {/* Additional info section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-black mb-4">
                Why Choose Our Classes?
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                  <span>Small class sizes for personalized attention</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                  <span>Professional-grade materials provided</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                  <span>Flexible scheduling options available</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                  <span>Take-home portfolio of your creations</span>
                </li>
              </ul>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center space-x-4 px-8 py-4 bg-gray-100 rounded-full border border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all duration-300 group cursor-pointer">
                <span className="font-semibold">Schedule a Free Consultation</span>
                <div className="w-8 h-8 bg-black group-hover:bg-white rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 text-white group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.72-.424l-3.178.992.924-3.178A8.943 8.943 0 013 12a8 8 0 018-8 8 8 0 018 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}