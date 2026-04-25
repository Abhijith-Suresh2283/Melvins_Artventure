import React, { useState, useEffect, useRef } from 'react';
import { Brush, Palette, PenTool, Droplets, X, Clock, Award, ChevronRight, FileText, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function ClassesSection() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const modalRef = useRef(null);

  const WHATSAPP_NUMBER = "918848622906";

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

  const iconMap = {
    'PenTool': <PenTool className="w-8 h-8" />,
    'Palette': <Palette className="w-8 h-8" />,
    'Brush': <Brush className="w-8 h-8" />,
    'Droplets': <Droplets className="w-8 h-8" />,
  };

  const iconMapLarge = {
    'PenTool': <PenTool className="w-12 h-12" />,
    'Palette': <Palette className="w-12 h-12" />,
    'Brush': <Brush className="w-12 h-12" />,
    'Droplets': <Droplets className="w-12 h-12" />,
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setSelectedClass(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedClass) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedClass]);

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

  const openModal = (cls) => {
    setSelectedClass(cls);
    setPdfLoading(true);
  };

  const closeModal = () => {
    setSelectedClass(null);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) closeModal();
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
    <>
      <section id="classes" className="py-24 px-6 bg-gray-50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gray-200 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gray-300 rounded-full blur-3xl opacity-30"></div>

        <div className="max-w-7xl mx-auto relative">
          {/* Section header */}
          <header className="text-center mb-16">
            <h2 className="text-5xl font-bold tracking-tight text-black mb-4">Online Art Classes</h2>
            <div className="w-24 h-1 bg-black mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Find the perfect class to start or advance your artistic journey. Our <strong>exclusive online drawing classes</strong> are designed for students to learn from <strong>zero to hero</strong>, offering a comprehensive course for you.
            </p>
          </header>

          {/* Classes grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {classes.map((cls, index) => (
              <div key={cls.id} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 to-gray-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>

                {/* Entire card is now clickable */}
                <div
                  onClick={() => openModal(cls)}
                  className="relative bg-white p-8 border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-500 cursor-pointer"
                >
                  {/* Icon container */}
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-800 group-hover:scale-110 transition-all duration-300 text-gray-700 group-hover:text-white">
                      {iconMap[cls.icon] || iconMap['PenTool']}
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
                    <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-black transition-colors">
                      {cls.title}
                    </h3>

                    {/* Duration info */}
                    <div className="flex items-center justify-center space-x-2 mb-6 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{cls.duration}</span>
                    </div>

                    {/* View Details CTA */}
                    <div className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl border border-gray-200 group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-300 flex items-center justify-center gap-2">
                      <span>View Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Decorative corners */}
                  <div className="absolute -top-2 -left-2 w-4 h-4 border-2 border-gray-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -bottom-2 -right-2 w-4 h-4 border-2 border-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"></div>
                </div>

                {/* Class number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg transform -rotate-12 group-hover:rotate-0 transition-transform duration-500 z-10">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>

          {/* Additional info section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-black mb-4">Why Choose Our Art Classes?</h3>
                <ul className="space-y-3 text-gray-600">
                  {[
                    "Expert-led techniques for pencil drawing & charcoal",
                    "Flexible scheduling options for global timezones",
                    "Dedicated support for both children and adult students",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                      <span>{item}</span>
                    </li>
                  ))}
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

      {/* ── MODAL ── */}
      {selectedClass && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={handleBackdropClick}
        >
          <div
            ref={modalRef}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
            style={{ animation: 'modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both' }}
          >
            {/* Modal header */}
            <div className="flex items-start gap-6 p-8 border-b border-gray-100">
              {/* Icon */}
              <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center text-white flex-shrink-0">
                {iconMapLarge[selectedClass.icon] || iconMapLarge['PenTool']}
              </div>

              {/* Title block */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full border border-gray-200">
                    {selectedClass.level}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 leading-tight">{selectedClass.title}</h2>
                <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{selectedClass.duration}</span>
                </div>
              </div>

              {/* Close */}
              <button
                onClick={closeModal}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto">
              {/* Description */}
              <div className="px-8 pt-6 pb-4">
                <p className="text-gray-600 leading-relaxed text-base">{selectedClass.description}</p>
              </div>

              {/* Syllabus PDF section */}
              <div className="px-8 pb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Course Syllabus
                  </h3>
                  {selectedClass.syllabus_url && (
                    <a
                      href={selectedClass.syllabus_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-black border border-gray-200 hover:border-black rounded-lg px-3 py-1.5 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </a>
                  )}
                </div>

                {selectedClass.syllabus_url ? (
                  <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 relative">
                    {pdfLoading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-10">
                        <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mb-3"></div>
                        <p className="text-sm text-gray-500">Loading syllabus…</p>
                      </div>
                    )}
                    <iframe
                      src={`${selectedClass.syllabus_url}#toolbar=1&navpanes=0&scrollbar=1`}
                      title={`${selectedClass.title} Syllabus`}
                      className="w-full"
                      style={{ height: '480px', border: 'none' }}
                      onLoad={() => setPdfLoading(false)}
                      onError={() => setPdfLoading(false)}
                    />
                  </div>
                ) : (
                  /* Placeholder when no PDF is attached yet */
                  <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center py-16 text-gray-400">
                    <FileText className="w-12 h-12 mb-3 opacity-40" />
                    <p className="font-semibold text-gray-500">Syllabus coming soon</p>
                    <p className="text-sm mt-1">Reach out via WhatsApp for the full course outline.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal footer – sticky CTA */}
            <div className="px-8 py-5 border-t border-gray-100 bg-white flex items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                Ready to start your creative journey?
              </p>
              <button
                onClick={() => {
                  openWhatsApp(selectedClass);
                  closeModal();
                }}
                className="flex items-center gap-2 px-8 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 active:scale-95 transition-all duration-200"
              >
                {/* WhatsApp icon */}
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

      `}</style>
    </>
  );
}