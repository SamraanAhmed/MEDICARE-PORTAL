import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Users, Activity, Building2, CheckCircle2, ShieldCheck, HeartPulse, GraduationCap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Staggered layout entrance on load
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    tl.from('.about-hero-title', { opacity: 0, y: -30, duration: 0.8 })
      .from('.about-hero-text', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
      .from('.about-hero-stats', { opacity: 0, scale: 0.95, duration: 0.6 }, '-=0.3');

    // Scroll trigger animation for sections
    gsap.from('.about-section-card', {
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.25,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about-sections-grid',
        start: 'top 80%',
      }
    });

    // Stats counter ticks
    gsap.from('.stat-count', {
      innerText: 0,
      duration: 2.0,
      snap: { innerText: 1 },
      ease: 'power1.out',
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* 1. Hero / Vision Banner */}
      <div className="relative rounded-3xl bg-black text-white overflow-hidden p-8 sm:p-16 text-left border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-800/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-teal-950/20 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex items-center gap-1 bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <HeartPulse className="w-3.5 h-3.5" />
            Healthcare Innovation
          </span>
          <h1 className="about-hero-title text-4xl sm:text-5xl font-black font-heading leading-tight tracking-tight">
            Redefining Medical Diagnostics & Clinical Checkups
          </h1>
          <p className="about-hero-text text-sm sm:text-base text-teal-150 leading-relaxed font-body">
            MediCare Portal is a pioneering telemedicine and healthcare scheduling ecosystem. 
            Initially designed to support the student and faculty demographic at Ibadat International University, Islamabad, 
            the system has expanded into an enterprise-grade digital health solution offering 24/7 AI diagnosis, 
            live consultation desk booking, and secure, encrypted electronic health records (EHR).
          </p>
        </div>

        {/* Dynamic Metric Ticks */}
        <div className="about-hero-stats grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-teal-900 mt-12 text-center md:text-left">
          <div className="space-y-1">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-teal-400 font-heading">
              <span className="stat-count">12000</span>+
            </h3>
            <p className="text-xs text-teal-200 uppercase tracking-widest font-semibold">Registered Patients</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-teal-400 font-heading">
              <span className="stat-count">65</span>+
            </h3>
            <p className="text-xs text-teal-200 uppercase tracking-widest font-semibold">Specialist Doctors</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-teal-400 font-heading">
              <span className="stat-count">100</span>%
            </h3>
            <p className="text-xs text-teal-200 uppercase tracking-widest font-semibold">Safe Data Auditing</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-teal-400 font-heading">
              <span className="stat-count">24</span>/7
            </h3>
            <p className="text-xs text-teal-200 uppercase tracking-widest font-semibold">AI Support Access</p>
          </div>
        </div>
      </div>

      {/* 2. Core Pillars / Highlights */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-teal-950 font-heading">Why Choose MediCare?</h2>
          <p className="text-xs sm:text-sm text-slate-400 font-body">
            Combining academic excellence, advanced automation, and human-centric healthcare pillars.
          </p>
        </div>

        <div className="about-sections-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Sihala Campus Connection */}
          <div className="about-section-card bg-white rounded-3xl border border-slate-100 p-8 shadow-xs hover:shadow-md transition-shadow text-left space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 font-heading">Sihala Islamabad Campus</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-body">
              Located within the main campus of Ibadat International University, Islamabad, our state-of-the-art physical dispensary 
              and clinical division provides immediate emergency support and hands-on laboratory checkups.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-650 pt-2 border-t border-slate-50">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                <span>Japan Road, Sihala location</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                <span>Direct student/staff integration</span>
              </li>
            </ul>
          </div>

          {/* Card 2: AI Tech Integration */}
          <div className="about-section-card bg-white rounded-3xl border border-slate-100 p-8 shadow-xs hover:shadow-md transition-shadow text-left space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 font-heading">AI-Powered Triage</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-body">
              Our advanced AI chat engine uses the Google Gemini large language model to help patients check medical symptoms, 
              provide healthy lifestyle guides, and route severe alerts directly to specialist doctors.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-650 pt-2 border-t border-slate-50">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                <span>Immediate response panels</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                <span>Pre-clinical consultation checks</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Research Driven Excellence */}
          <div className="about-section-card bg-white rounded-3xl border border-slate-100 p-8 shadow-xs hover:shadow-md transition-shadow text-left space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 font-heading">HIPAA-Compliant EHR</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-body">
              All consultation scheduling details, prescriptions, diagnostics reports, and credentials are encrypted using 
              best practices. Patient confidentiality and dashboard session logs are rigorously audited.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-650 pt-2 border-t border-slate-50">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                <span>Protected data stores</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                <span>Authenticated doctor reviews</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* 3. Academic Affiliation & Facilities Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left py-6">
        <div className="slide-in-left lg:col-span-6 section-header-anim space-y-6">
          <h2 className="text-3xl font-black text-teal-950 font-heading leading-tight">
            Ibadat International University Affiliated Healthcare
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed font-body">
            Through our association with Ibadat International University, Islamabad, we serve as the principal digital 
            medical platform for students, faculty, and administrative staff. Our clinic hosts top-tier general practitioners, 
            cardiologists, dermatologists, and orthopedists.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
              <Award className="w-5 h-5 text-teal-600 shrink-0" />
              <span className="text-xs font-bold text-slate-700">HEC Recognized Standards</span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
              <Building2 className="w-5 h-5 text-teal-600 shrink-0" />
              <span className="text-xs font-bold text-slate-700">On-Campus Dispatch Desk</span>
            </div>
          </div>
        </div>

        <div className="slide-in-right lg:col-span-6 relative">
          {/* Visual card mockup demonstrating high aesthetics */}
          <div className="fade-up-anim bg-black text-white rounded-3xl border border-slate-800 p-8 sm:p-16 text-center space-y-8 relative overflow-hidden shadow-2xl z-0">
            <div className="absolute top-0 right-0 w-48 h-48 bg-teal-800/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-teal-950/20 rounded-full blur-3xl -z-10"></div>
            <div className="space-y-4">
              <h4 className="text-teal-400 font-bold uppercase tracking-widest text-xs">Administrative Services</h4>
              <h3 className="text-xl sm:text-2xl font-black font-heading leading-snug">Hospital Dispatch Desk Sihala</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-body">
                Our main campus dispatch coordinates medical transports, clinical queues, prescription refills, 
                and references for local hospital structures in Islamabad.
              </p>
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                <span>Direct Hotline: +92 (51) 844-6666</span>
                <span className="text-teal-400 font-bold uppercase">Open Daily</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default About;
