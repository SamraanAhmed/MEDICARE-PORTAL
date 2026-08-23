import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Shield, Award, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-slate-400 border-t border-neutral-900">
      {/* Upper Footer: Value Props */}
      <div className="border-b border-neutral-900 bg-neutral-950/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4 px-4">
              <Award className="w-9 h-9 text-emerald-450 shrink-0" />
              <div>
                <h4 className="text-white font-semibold font-heading text-sm">Certified Excellence</h4>
                <p className="text-xs text-slate-500 mt-1">Accredited by healthcare authorities for premium medical standards.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 px-4 border-y md:border-y-0 md:border-x border-neutral-900 py-6 md:py-0">
              <Clock className="w-9 h-9 text-emerald-450 shrink-0" />
              <div>
                <h4 className="text-white font-semibold font-heading text-sm">24/7 Virtual Desk</h4>
                <p className="text-xs text-slate-500 mt-1">Our AI chatbot and active telemedicine links operate round-the-clock.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 px-4">
              <Shield className="w-9 h-9 text-emerald-450 shrink-0" />
              <div>
                <h4 className="text-white font-semibold font-heading text-sm">Strict Data Security</h4>
                <p className="text-xs text-slate-500 mt-1">Patient records, database connections, and session channels are fully secured.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Footer: Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/imgvid/medicarelogo.png" 
                alt="Logo" 
                className="h-12 w-auto object-contain shrink-0" 
              />
              <span className="text-xl font-black text-white font-heading tracking-tight">
                Medi<span className="text-emerald-450">Care</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-body">
              Empowering wellness journeys through professional diagnostics, expert clinical coordinates, and state-of-the-art telemedicine links.
            </p>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-450 shrink-0 mt-0.5" />
                <span className="text-slate-400">Ibadat International University, Japan Road, Sihala, Islamabad, Pakistan</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-450 shrink-0" />
                <span className="text-slate-400">+92 (51) 111-844-844</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-450 shrink-0" />
                <span className="text-slate-400">support@medicare-portal.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-white font-bold tracking-widest uppercase text-[10px] font-heading">Quick Navigation</h4>
            <div className="mt-4 flex flex-col space-y-2 text-xs">
              <Link to="/home" className="hover:text-emerald-405 transition-colors">Home Landing</Link>
              <Link to="/about" className="hover:text-emerald-405 transition-colors font-semibold text-emerald-400">About Us</Link>
              <Link to="/book" className="hover:text-emerald-405 transition-colors">Book Consultation</Link>
              <Link to="/chat" className="hover:text-emerald-405 transition-colors">AI Diagnostics Chat</Link>
              <Link to="/contact" className="hover:text-emerald-405 transition-colors">Contact & Map</Link>
              <Link to="/auth" className="hover:text-emerald-405 transition-colors">Sign In Portal</Link>
            </div>
          </div>

          {/* Column 3: Pillars */}
          <div>
            <h4 className="text-white font-bold tracking-widest uppercase text-[10px] font-heading">Specialities</h4>
            <div className="mt-4 flex flex-col space-y-2 text-xs text-slate-400">
              <span className="hover:text-white transition-colors">Cardiology Division</span>
              <span className="hover:text-white transition-colors">Dermatology Division</span>
              <span className="hover:text-white transition-colors">Orthopedics Division</span>
              <span className="hover:text-white transition-colors">Diagnostics & Lab Checks</span>
              <span className="hover:text-white transition-colors">Telehealth Remote Consultation</span>
            </div>
          </div>

          {/* Column 4: Operating Hours */}
          <div>
            <h4 className="text-white font-bold tracking-widest uppercase text-[10px] font-heading">Operating Hours</h4>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-500">
              <li className="flex justify-between border-b border-neutral-900 pb-1.5">
                <span>Monday - Friday</span>
                <span className="text-white font-semibold">08:00 AM - 08:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-neutral-900 pb-1.5">
                <span>Saturday</span>
                <span className="text-white font-semibold">09:00 AM - 05:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-neutral-900 pb-1.5">
                <span>Sunday</span>
                <span className="text-emerald-450 font-bold uppercase tracking-wider">Emergency Only</span>
              </li>
              <li className="text-[10px] text-slate-600 leading-normal italic pt-1">
                * Remote AI consultation service is active 24/7.
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Footer: Copyright */}
      <div className="bg-neutral-950 py-6 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} MediCare Sihala Portal. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for a healthier world.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
