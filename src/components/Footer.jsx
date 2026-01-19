import React from 'react';
import { Instagram } from 'lucide-react';

export default function Footer() {
  const footerNav = [
    { name: 'About', href: '#about' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Classes', href: '#classes' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Column 1: Brand */}
          <div className="lg:col-span-1">
            <div className="text-2xl font-bold tracking-wider mb-4">
              <span className="text-black">MELVIN'S </span>
              <span className="text-black">ARTVENTURE</span>
            </div>
          </div>

          {/* Column 2: Navigation & Socials */}
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-black mb-4 tracking-wider uppercase">Navigate</h3>
              <ul className="space-y-3">
                {footerNav.map(link => (
                  <li key={link.name}>
                    <a href={link.href} className="text-gray-600 hover:text-black transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-black mb-4 tracking-wider uppercase">Legal</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            {/* Follow Us */}
            <div className="flex flex-col items-center">
              <h3 className="font-semibold text-black mb-4 tracking-wider uppercase text-center">
                Follow Us
              </h3>

              <a
                href="#"
                className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Melvin's Artventure. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
