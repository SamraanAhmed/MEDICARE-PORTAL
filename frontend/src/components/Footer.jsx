import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Shield, Award, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Upper Footer: Value Props */}
      <div className="border-b border-slate-800 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4 px-4">
              <Award className="w-10 h-10 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-white font-semibold font-heading">Certified Excellence</h4>
                <p className="text-xs text-slate-400 mt-1">Accredited by healthcare authorities for premium medical standards.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 px-4 border-y md:border-y-0 md:border-x border-slate-800 py-6 md:py-0">
              <Clock className="w-10 h-10 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-white font-semibold font-heading">24/7 Virtual Desk</h4>
                <p className="text-xs text-slate-400 mt-1">Our AI chatbot and active telemedicine links operate round-the-clock.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 px-4">
              <Shield className="w-10 h-10 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-white font-semibold font-heading">Strict Data Security</h4>
                <p className="text-xs text-slate-400 mt-1">Patient records, database connections, and session channels are fully secured.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Footer: Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Brand Info */}
          <div>
            <div className="flex items-center gap-3">
              <img src="/imgvid/medicarelogo.png" alt="Logo" className="h-12 w-12 rounded-full object-cover border border-slate-700 bg-white shadow-xs shrink-0" />
              <span className="text-xl font-bold text-white font-heading">
                Medi<span className="text-emerald-400">Care</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-4 leading-relaxed font-body">
              Empowering Your Wellness Journey through professional diagnostics, expert counseling, and cutting-edge digital health services.
            </p>
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>350 5th Ave, New York, NY 10118</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+1 (212) 555-0199</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@medicare-portal.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-white font-bold tracking-wider uppercase text-xs font-heading">Quick Navigation</h4>
            <div className="mt-4 flex flex-col space-y-2 text-sm">
              <Link to="/" className="hover:text-emerald-400 transition-colors">Home Landing</Link>
              <Link to="/book" className="hover:text-emerald-400 transition-colors">Book Consultation</Link>
              <Link to="/chat" className="hover:text-emerald-400 transition-colors">AI Diagnostics Chat</Link>
              <Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact & Map</Link>
              <Link to="/auth" className="hover:text-emerald-400 transition-colors">Sign In Portal</Link>
            </div>
          </div>

          {/* Column 3: Pillars */}
          <div>
            <h4 className="text-white font-bold tracking-wider uppercase text-xs font-heading">Our Specialities</h4>
            <div className="mt-4 flex flex-col space-y-2 text-sm">
              <span className="hover:text-slate-100 transition-colors">Cardiology & Heart Care</span>
              <span className="hover:text-slate-100 transition-colors">Dermatology & Skin Science</span>
              <span className="hover:text-slate-100 transition-colors">Orthopedics & Joint Alignment</span>
              <span className="hover:text-slate-100 transition-colors">Diagnostics & Laboratory</span>
              <span className="hover:text-slate-100 transition-colors">Telehealth & Remote Therapy</span>
            </div>
          </div>

          {/* Column 4: Operating Hours */}
          <div>
            <h4 className="text-white font-bold tracking-wider uppercase text-xs font-heading">Operating Hours</h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li className="flex justify-between border-b border-slate-800 pb-1">
                <span>Monday - Friday</span>
                <span className="text-white">08:00 AM - 08:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-slate-800 pb-1">
                <span>Saturday</span>
                <span className="text-white">09:00 AM - 05:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-slate-800 pb-1">
                <span>Sunday</span>
                <span className="text-emerald-400 font-semibold">Emergency Only</span>
              </li>
              <li className="text-xs text-slate-500 leading-normal italic">
                * Our AI assistant is operational 24/7 for support.
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Footer: Copyright */}
      <div className="bg-slate-950 py-6 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MediCare Portal Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for a healthier world.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
