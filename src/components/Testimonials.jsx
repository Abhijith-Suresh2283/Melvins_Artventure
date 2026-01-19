import React, { useEffect, useMemo, useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { testimonialService } from "../services/testimonialService";
import emailjs from "@emailjs/browser";


// --- Sub-Component: Star Rating Display ---
const StarRating = ({ rating }) => (
  <div className="flex items-center justify-center mb-4">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "text-black fill-current" : "text-gray-200 fill-current"
        }`}
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase(); // e.g., "Abhijith" -> "AB"

  const first = parts[0][0] || "";
  const last = parts[parts.length - 1][0] || "";
  return (first + last).toUpperCase(); // e.g., "Abhijith Suresh" -> "AS"
}


// -------------------- CROPPER HELPERS --------------------
async function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

async function getCroppedFile(imageSrc, croppedAreaPixels, outName = "cropped.jpg") {
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;

  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height
  );

  const blob = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/jpeg", 0.9)
  );

  return new File([blob], outName, { type: "image/jpeg" });
}

// -------------------- CROPPER MODAL --------------------
function ImageCropModal({
  open,
  file,
  title = "Crop Image",
  aspect = 1,
  onCancel,
  onDone,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!file) return;
      const url = await fileToDataUrl(file);
      if (mounted) setImageSrc(url);
    })();
    return () => {
      mounted = false;
      setImageSrc(null);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
      setCroppedAreaPixels(null);
    };
  }, [file]);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleDone = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const croppedFile = await getCroppedFile(
      imageSrc,
      croppedAreaPixels,
      file?.name || "cropped.jpg"
    );
    onDone?.(croppedFile);
  };

  if (!open || !file) return null;

  

  return (
    <div className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-bold">{title}</h3>
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="relative w-full h-[60vh] bg-black">
          {imageSrc ? (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              objectFit="contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              Loading...
            </div>
          )}
        </div>

        <div className="p-5 flex items-center gap-4">
          <div className="flex-1">
            <label className="text-xs font-bold text-gray-500">ZOOM</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 font-semibold"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDone}
            className="px-6 py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-800"
          >
            Crop & Use
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------- MAIN COMPONENT --------------------
export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Upload states
  const [profileFile, setProfileFile] = useState(null);

  // We will store CROPPED drawing files here
  const [drawingFiles, setDrawingFiles] = useState([]);
  const [drawingTitles, setDrawingTitles] = useState([]);

  // Course "Other"
  const [customCourse, setCustomCourse] = useState("");

  // Modal gallery: array of objects { url, title, student, course }
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Cropping flow for drawings
  const [cropOpen, setCropOpen] = useState(false);
  const [cropQueue, setCropQueue] = useState([]); // original selected files
  const [cropIndex, setCropIndex] = useState(0);

  // Optional: enable/disable cropping
  const [enableCrop, setEnableCrop] = useState(true);
  const [contact, setContact] = useState({ name: "", email: "", message: "" });
const [sending, setSending] = useState(false);


const handleContactChange = (e) => {
  const { name, value } = e.target;
  setContact((p) => ({ ...p, [name]: value }));
};

const handleContactSubmit = async (e) => {
  e.preventDefault();
  setSending(true);

  try {
    await emailjs.send(
      "YOUR_SERVICE_ID",
      "YOUR_TEMPLATE_ID",
      {
        from_name: contact.name,
        from_email: contact.email,
        message: contact.message,
      },
      "YOUR_PUBLIC_KEY"
    );

    alert("Message sent successfully!");
    setContact({ name: "", email: "", message: "" });
  } catch (err) {
    console.error(err);
    alert("Failed to send message. Please try again.");
  } finally {
    setSending(false);
  }
};

  const [formData, setFormData] = useState({
    name: "",
    quote: "",
    course: "Watercolor",
    stars: 5,
  });

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    try {
      const data = await testimonialService.getAll(); // ✅ no approval filter
      setTestimonials(data || []);
    } catch (err) {
      console.error("Fetch error:", err?.message || err);
    } finally {
      setLoading(false);
    }
  }

  // Carousel Logic
  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % selectedGallery.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex(
      (prev) => (prev - 1 + selectedGallery.length) % selectedGallery.length
    );
  };

  // When user selects drawing files:
  const handleDrawingSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Set titles as before
    setDrawingTitles(files.map((f) => f.name.replace(/\.[^/.]+$/, "")));

    if (!enableCrop) {
      // No cropping: use original files directly
      setDrawingFiles(files);
      return;
    }

    // Cropping ON: reset and start crop queue
    setDrawingFiles([]); // important: clear old
    setCropQueue(files);
    setCropIndex(0);
    setCropOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Final course
      const finalCourse =
        formData.course === "Other" ? customCourse.trim() : formData.course;

      if (formData.course === "Other" && !finalCourse) {
        alert("Please enter your custom drawing type.");
        setIsSubmitting(false);
        return;
      }

      // Validate titles count (only if drawings exist)
      if (drawingFiles.length > 0) {
        const trimmed = drawingTitles.map((t) => (t || "").trim());
        const hasEmpty = trimmed.some((t) => !t);
        if (hasEmpty || trimmed.length !== drawingFiles.length) {
          alert("Please enter a name for each uploaded drawing.");
          setIsSubmitting(false);
          return;
        }
      }

      const payload = {
        ...formData,
        course: finalCourse,
        drawing_titles: drawingTitles.map((t) => (t || "").trim()),
      };

      // submit() should return inserted row
      const created = await testimonialService.submit(
        payload,
        profileFile,
        drawingFiles
      );

      // ✅ Immediately show it (no approval)
      if (created) {
        setTestimonials((prev) => [created, ...prev]);
      } else {
        // fallback refetch
        await loadReviews();
      }

      alert("Success! Your review has been posted.");

      // Reset
      setFormData({ name: "", quote: "", course: "Watercolor", stars: 5 });
      setCustomCourse("");
      setProfileFile(null);
      setDrawingFiles([]);
      setDrawingTitles([]);

      setCropQueue([]);
      setCropIndex(0);
      setCropOpen(false);
    } catch (err) {
      alert("Error: " + (err?.message || "Something went wrong"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // computed label in UI
  const drawingHint = useMemo(() => {
    if (!enableCrop) return "Multiple Allowed";
    return "Multiple Allowed (Crop enabled)";
  }, [enableCrop]);

  return (
    <section
      id="testimonials"
      className="py-24 bg-gray-50 relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gray-200 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gray-300 rounded-full blur-3xl opacity-30"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold tracking-tight text-black mb-4">
            What Our Students Say
          </h2>
          <div className="w-24 h-1 bg-black mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover the experiences of artists who started their creative
            journey with us and transformed their artistic skills.
          </p>
        </div>

        {/* --- Testimonial Grid --- */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 mb-16">
            {testimonials.map((item, index) => (
              <div key={item.id || index} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 to-gray-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>

                <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-gray-200 h-full flex flex-col">
                  <div className="absolute -top-4 left-8">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                      </svg>
                    </div>
                  </div>

                  <div className="absolute -top-2 -right-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full border border-gray-300">
                      {item.course}
                    </span>
                  </div>

                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full border-4 border-gray-100 group-hover:border-black transition-colors duration-300 overflow-hidden bg-gray-200 flex items-center justify-center">
      {item.avatar_url ? (
        <img
          src={item.avatar_url}
          alt={item.name || "User"}
          className="w-full h-full object-cover"
          onError={(e) => {
            // if image URL broken, remove it so initials appear
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <span className="text-black font-black text-xl tracking-wider">
          {getInitials(item.name)}
        </span>
      )}
    </div>
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <StarRating rating={item.stars} />

                  <blockquote className="text-gray-700 italic mb-6 leading-relaxed text-center flex-grow">
                    "{item.quote}"
                  </blockquote>

                  <div className="text-center pt-4 border-t border-gray-100">
                    <h3 className="font-bold text-lg text-black tracking-wide">
                      {item.name}
                    </h3>
                    <div className="w-12 h-0.5 bg-black mx-auto mt-2"></div>

                    {item.drawing_urls?.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const urls = Array.isArray(item.drawing_urls)
                            ? item.drawing_urls
                            : [];
                          const titles = Array.isArray(item.drawing_titles)
                            ? item.drawing_titles
                            : [];

                          setSelectedGallery(
                            urls.map((url, i) => ({
                              url,
                              title: titles[i] || `Drawing ${i + 1}`,
                              student: item.name,
                              course: item.course,
                            }))
                          );
                          setCurrentImageIndex(0);
                        }}
                        className="mt-3 text-xs font-black uppercase border-b-2 border-black hover:text-gray-500 transition-colors"
                      >
                        Here are my drawings ({item.drawing_urls.length})
                      </button>
                    )}
                  </div>

                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg transform -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- Submission Form --- */}
        <div className="max-w-2xl mx-auto mb-20 bg-white p-10 rounded-2xl shadow-lg border border-gray-200">
          <h3 className="text-xl font-black text-center mb-8 tracking-[0.2em] text-black">
            SHARE YOUR JOURNEY
          </h3>

          {/* Crop toggle */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <input
              id="cropToggle"
              type="checkbox"
              checked={enableCrop}
              onChange={(e) => setEnableCrop(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="cropToggle" className="text-sm text-gray-700">
              Enable image crop before upload (recommended)
            </label>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Full Name"
                required
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300 hover:border-gray-400"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              {/* Course Dropdown + Other */}
              <div className="relative group">
                <select
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300 hover:border-gray-400 appearance-none cursor-pointer pr-10"
                  value={formData.course}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({ ...formData, course: val });
                    if (val !== "Other") setCustomCourse("");
                  }}
                >
                  <option value="Watercolor">Watercolor</option>
                  <option value="Oil Pastel">Oil Pastel</option>
                  <option value="Pencil Drawing Advanced">
                    Pencil Drawing Advanced
                  </option>
                  <option value="Pencil Drawing Beginner">
                    Pencil Drawing Beginner
                  </option>
                  <option value="Other">Other</option>
                </select>

                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-black transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Custom course input */}
            {formData.course === "Other" && (
              <input
                type="text"
                placeholder="Enter your drawing type (e.g., Charcoal Sketch)"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300 hover:border-gray-400"
                value={customCourse}
                onChange={(e) => setCustomCourse(e.target.value)}
                required
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile */}
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-black hover:bg-gray-50 cursor-pointer transition-all duration-300 group">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-black mb-1">
                  Profile Picture
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfileFile(e.target.files[0])}
                  className="hidden"
                />
                <span className="text-xs text-gray-400 truncate w-full text-center">
                  {profileFile ? profileFile.name : "Choose File"}
                </span>
              </label>

              {/* Drawings */}
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-black hover:bg-gray-50 cursor-pointer transition-all duration-300 group">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-black mb-1">
                  Upload Drawings
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleDrawingSelect}
                  className="hidden"
                />
                <span className="text-xs text-gray-400 truncate w-full text-center">
                  {drawingFiles.length > 0
                    ? `${drawingFiles.length} files ready`
                    : drawingHint}
                </span>
              </label>
            </div>

            {/* Drawing names */}
            {drawingFiles.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">
                  Drawing Names
                </p>

                <div className="space-y-3">
                  {drawingFiles.map((file, idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                      <div className="text-xs text-gray-500 truncate">
                        {idx + 1}. {file.name}
                      </div>

                      <input
                        type="text"
                        placeholder={`Enter name for drawing ${idx + 1}`}
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300 hover:border-gray-400"
                        value={drawingTitles[idx] || ""}
                        onChange={(e) => {
                          const next = [...drawingTitles];
                          next[idx] = e.target.value;
                          setDrawingTitles(next);
                        }}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stars */}
            <div className="flex items-center justify-center space-x-3 py-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setFormData({ ...formData, stars: num })}
                  className={`text-3xl transition-all duration-300 hover:scale-125 active:scale-95 ${
                    formData.stars >= num
                      ? "text-black drop-shadow-sm"
                      : "text-gray-200"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              placeholder="Tell us about your experience..."
              required
              rows="3"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300 hover:border-gray-400 resize-none"
              value={formData.quote}
              onChange={(e) =>
                setFormData({ ...formData, quote: e.target.value })
              }
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-black text-white text-xs font-black tracking-[0.3em] rounded-xl hover:bg-gray-800 transition-all shadow-xl active:scale-95 disabled:bg-gray-300"
            >
              {isSubmitting ? "UPLOADING ASSETS..." : "SUBMIT REVIEW"}
            </button>
          </form>
        </div>
      </div>

      {/* --- Cropper Modal (for drawings) --- */}
      <ImageCropModal
        open={cropOpen}
        file={cropQueue[cropIndex]}
        aspect={1} // square crop to fit gallery placeholder
        title={`Crop Drawing ${cropIndex + 1} / ${cropQueue.length}`}
        onCancel={() => {
          setCropOpen(false);
          setCropQueue([]);
          setCropIndex(0);
          setDrawingFiles([]); // cancel means none selected
        }}
        onDone={(croppedFile) => {
          // Add cropped file
          setDrawingFiles((prev) => [...prev, croppedFile]);

          // Next in queue
          const nextIndex = cropIndex + 1;
          if (nextIndex < cropQueue.length) {
            setCropIndex(nextIndex);
          } else {
            // finished
            setCropOpen(false);
            setCropQueue([]);
            setCropIndex(0);
          }
        }}
      />

      {/* --- Carousel Modal --- */}
      {selectedGallery && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-10"
          onClick={() => setSelectedGallery(null)}
        >
          <button
            className="fixed top-8 right-8 text-white text-xl sm:text-2xl font-bold hover:scale-110 transition-transform z-[110]"
            onClick={() => setSelectedGallery(null)}
          >
            ✕ CLOSE
          </button>

          <div
            className="relative flex items-center justify-between w-full max-w-7xl h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-none w-12 sm:w-24 flex justify-center z-20">
              {selectedGallery.length > 1 && (
                <button
                  onClick={prevImage}
                  className="text-white p-2 sm:p-4 hover:bg-white/10 rounded-full transition-all"
                >
                  <svg
                    className="w-10 h-10 sm:w-16 sm:h-16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}
            </div>

            <div className="flex-grow flex flex-col items-center justify-center overflow-hidden h-full">
              <img
                src={selectedGallery[currentImageIndex].url}
                className="max-h-[70vh] sm:max-h-[80vh] w-auto max-w-full object-contain rounded shadow-2xl border-2 border-white/5"
                alt={selectedGallery[currentImageIndex].title || "Art"}
              />

              <div className="mt-6 text-white font-mono tracking-widest bg-white/10 border border-white/20 px-6 py-2 rounded-full text-[10px] sm:text-xs">
                {currentImageIndex + 1} / {selectedGallery.length}
              </div>

              <div className="mt-3 text-white text-center px-4">
                <div className="text-sm sm:text-base font-semibold">
                  {selectedGallery[currentImageIndex].title}
                </div>
                <div className="text-[10px] sm:text-xs text-white/70 mt-1 tracking-widest">
                  {selectedGallery[currentImageIndex].student} •{" "}
                  {selectedGallery[currentImageIndex].course}
                </div>
              </div>
            </div>

            <div className="flex-none w-12 sm:w-24 flex justify-center z-20">
              {selectedGallery.length > 1 && (
                <button
                  onClick={nextImage}
                  className="text-white p-2 sm:p-4 hover:bg-white/10 rounded-full transition-all"
                >
                  <svg
                    className="w-10 h-10 sm:w-16 sm:h-16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
