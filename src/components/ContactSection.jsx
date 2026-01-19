import React, { useEffect, useState } from "react";
import { Send, Mail, Phone, MapPin } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import emailjs from "@emailjs/browser";

export default function ContactSection() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Contact form state
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("contact_info")
          .select("*")
          .order("id", { ascending: true })
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        setInfo(data);
      } catch (e) {
        console.error("Contact info fetch error:", e?.message || e);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const headline = info?.headline || "Get In Touch";
  const subheadline =
    info?.subheadline ||
    "Have a question, a project idea, or just want to say hello? Drop us a line, we’d love to hear from you.";
  const email = info?.email || "hello@artventure.com";
  const phone = info?.phone || "+1 (234) 567-890";
  const address = info?.address || "123 Art Street, Creativity City, 12345";

  // ✅ Controlled inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  // ✅ EmailJS send
  const handleSubmit = async (e) => {
    e.preventDefault();

    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    // quick env check
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      alert("EmailJS env keys missing. Check .env and restart the dev server.");
      return;
    }

    setSending(true);

    try {
      // IMPORTANT: keys must match your EmailJS TEMPLATE variables!
      // If your template variables are different, rename these keys accordingly.
      const params = {
        from_name: form.name,
        from_email: form.email,
        message: form.message,

        // Optional: include your studio contact email in the email body
        to_email: email,
      };

      const res = await emailjs.send(SERVICE_ID, TEMPLATE_ID, params, PUBLIC_KEY);
      console.log("EmailJS success:", res);

      alert("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.log("EmailJS error:", err);
      alert(err?.text || err?.message || "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-20 right-10 w-32 h-32 bg-gray-200 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-gray-300 rounded-full blur-3xl opacity-30"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold tracking-tight text-black mb-4">
            {headline}
          </h2>
          <div className="w-24 h-1 bg-black mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {subheadline}
          </p>
        </div>

        {loading && (
          <div className="text-center py-10 text-gray-600">
            Loading contact info...
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Form */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 to-gray-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>

            <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-gray-200">
              <h3 className="text-2xl font-bold text-black mb-6">
                Send us a Message
              </h3>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-600 mb-2 block">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-600 mb-2 block">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john.doe@example.com"
                      className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Your message here..."
                    rows="5"
                    className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all"
                  />
                </div>

                <div className="text-right">
                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex items-center space-x-3 px-6 py-3 bg-black text-white rounded-full border border-black hover:bg-white hover:text-black transition-all duration-300 group cursor-pointer shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <span className="font-semibold">
                      {sending ? "Sending..." : "Send Message"}
                    </span>
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>

              {/* <p className="mt-4 text-xs text-gray-500">
                Note: EmailJS template variables must match:
                <code className="ml-1">from_name, from_email, message</code>
              </p> */}
            </div>
          </div>

          {/* Right: Info */}
          <div className="space-y-8 mt-8 lg:mt-0">
            <div className="flex items-start space-x-4 group">
              <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center group-hover:bg-black transition-colors duration-300">
                <Mail className="w-6 h-6 text-black group-hover:text-white transition-colors duration-300" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-black">Email Us</h4>
                <p className="text-gray-600">Our team is here to help.</p>
                <a
                  href={`mailto:${email}`}
                  className="text-black font-semibold hover:underline"
                >
                  {email}
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4 group">
              <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center group-hover:bg-black transition-colors duration-300">
                <Phone className="w-6 h-6 text-black group-hover:text-white transition-colors duration-300" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-black">Call Us</h4>
                <p className="text-gray-600">Mon-Fri from 8am to 5pm.</p>
                <a
                  href={`tel:${phone}`}
                  className="text-black font-semibold hover:underline"
                >
                  {phone}
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4 group">
              <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center group-hover:bg-black transition-colors duration-300">
                <MapPin className="w-6 h-6 text-black group-hover:text-white transition-colors duration-300" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-black">Visit Us</h4>
                <p className="text-gray-600">Find us at our studio location.</p>
                <p className="text-black font-semibold">{address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
