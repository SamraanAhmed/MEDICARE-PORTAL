import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-transparent">
      {/* Top Wave Curve Block - Draws the curved top boundary of the footer */}
      <div className="w-full overflow-hidden leading-none bg-transparent">
        <svg className="relative block w-full h-[40px] sm:h-[70px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path 
            d="M0,40 C300,90 900,0 1200,30 L1200,120 L0,120 Z" 
            className="fill-footer-bg"
          />
        </svg>
      </div>

      {/* Main Content Block (filled with bg-footer-bg) */}
      <div className="bg-footer-bg text-slate-350 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-teal-900/30">
            
            {/* Left Side: Logo & Social Links (Olipop's left-side equivalents) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Logo (Only the Medicare logo image, text removed) */}
              <div className="flex items-center">
                <img 
                  src="/imgvid/medicarelogowhite.png" 
                  alt="MediCare Logo" 
                  className="h-16 w-auto object-contain shrink-0" 
                />
              </div>

              {/* Tagline */}
              <p className="text-xs text-teal-100/70 leading-relaxed font-body max-w-sm">
                Empowering wellness journeys through professional diagnostics, expert clinical coordinates, and state-of-the-art telemedicine links.
              </p>

              {/* Contact Details */}
              <div className="space-y-3 text-xs text-teal-100/60 font-body">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4.5 h-4.5 text-teal-400 shrink-0 mt-0.5" />
                  <span>Ibadat International University, Japan Road, Sihala, Islamabad, Pakistan</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4.5 h-4.5 text-teal-400 shrink-0" />
                  <span>+92 (51) 111-844-844</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4.5 h-4.5 text-teal-400 shrink-0" />
                  <span>support@medicare-portal.com</span>
                </div>
              </div>

              {/* Social Media Links (Exactly aligned like Olipop) */}
              <div className="flex items-center gap-4 pt-2">
                <a href="#" className="p-2.5 rounded-full bg-teal-900/40 hover:bg-teal-850/60 text-teal-105 hover:text-teal-400 transition-all shadow-xs border border-teal-800/30 flex items-center justify-center" aria-label="Instagram">
                  <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
                <a href="#" className="p-2.5 rounded-full bg-teal-900/40 hover:bg-teal-850/60 text-teal-105 hover:text-teal-400 transition-all shadow-xs border border-teal-800/30 flex items-center justify-center" aria-label="Facebook">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                  </svg>
                </a>
                <a href="#" className="p-2.5 rounded-full bg-teal-900/40 hover:bg-teal-850/60 text-teal-105 hover:text-teal-400 transition-all shadow-xs border border-teal-800/30 flex items-center justify-center" aria-label="Twitter">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="#" className="p-2.5 rounded-full bg-teal-900/40 hover:bg-teal-850/60 text-teal-105 hover:text-teal-400 transition-all shadow-xs border border-teal-800/30 flex items-center justify-center" aria-label="LinkedIn">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a href="#" className="p-2.5 rounded-full bg-teal-900/40 hover:bg-teal-850/60 text-teal-105 hover:text-teal-400 transition-all shadow-xs border border-teal-800/30 flex items-center justify-center" aria-label="YouTube">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.522 3.5 12 3.5 12 3.5s-7.522 0-9.388.555A3.002 3.002 0 0 0 .5 6.163C0 8.04 0 12 0 12s0 3.96.5 5.837a3.003 3.003 0 0 0 2.11 2.108c1.866.555 9.388.555 9.388.555s7.522 0 9.388-.555a3.002 3.002 0 0 0 2.11-2.108c.5-1.877.5-5.837.5-5.837s0-3.96-.5-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Right Side: Columns (Olipop's right-side content columns) */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Quick Navigation Column */}
              <div className="space-y-4">
                <h4 className="text-teal-50 font-bold tracking-wider uppercase text-xs font-heading">Quick Navigation</h4>
                <div className="flex flex-col space-y-2.5 text-sm text-teal-100/70 font-body">
                  <Link to="/home" className="hover:text-teal-400 transition-colors">Home Landing</Link>
                  <Link to="/about" className="hover:text-teal-400 transition-colors font-semibold text-teal-400">About Us</Link>
                  <Link to="/book" className="hover:text-teal-400 transition-colors">Book Consultation</Link>
                  <Link to="/chat" className="hover:text-teal-400 transition-colors">AI Diagnostics Chat</Link>
                  <Link to="/contact" className="hover:text-teal-400 transition-colors">Contact & Map</Link>
                  <Link to="/auth" className="hover:text-teal-400 transition-colors">Sign In Portal</Link>
                </div>
              </div>

              {/* Specialties Column */}
              <div className="space-y-4">
                <h4 className="text-teal-50 font-bold tracking-wider uppercase text-xs font-heading">Specialities</h4>
                <div className="flex flex-col space-y-2.5 text-sm text-teal-100/70 font-body">
                  <span className="hover:text-teal-400 transition-colors cursor-pointer">Cardiology Division</span>
                  <span className="hover:text-teal-400 transition-colors cursor-pointer">Dermatology Division</span>
                  <span className="hover:text-teal-400 transition-colors cursor-pointer">Orthopedics Division</span>
                  <span className="hover:text-teal-400 transition-colors cursor-pointer">Diagnostics & Lab Checks</span>
                  <span className="hover:text-teal-400 transition-colors cursor-pointer">Telehealth Remote Consultation</span>
                </div>
              </div>

              {/* Operating Hours Column */}
              <div className="space-y-4">
                <h4 className="text-teal-50 font-bold tracking-wider uppercase text-xs font-heading">Operating Hours</h4>
                <ul className="space-y-3 text-sm text-teal-100/70 font-body">
                  <li className="flex justify-between border-b border-teal-900/20 pb-1.5">
                    <span>Monday - Friday</span>
                    <span className="text-teal-50 font-semibold">08:00 AM - 08:00 PM</span>
                  </li>
                  <li className="flex justify-between border-b border-teal-900/20 pb-1.5">
                    <span>Saturday</span>
                    <span className="text-teal-50 font-semibold">09:00 AM - 05:00 PM</span>
                  </li>
                  <li className="flex justify-between border-b border-teal-900/20 pb-1.5">
                    <span>Sunday</span>
                    <span className="text-teal-400 font-bold uppercase tracking-wider text-xs">Emergency Only</span>
                  </li>
                  <li className="text-[11px] text-teal-100/40 leading-normal italic pt-1">
                    * Remote AI consultation service is active 24/7.
                  </li>
                </ul>
              </div>

            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-teal-100/50 font-body">
            <p>© {new Date().getFullYear()} MediCare Sihala Portal. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-teal-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-teal-400 transition-colors">Do Not Sell My Info</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
