import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Award, Users, ArrowRight, Activity, Smile, PhoneCall, Sparkles, MessageSquare } from 'lucide-react';
import heroBg from '../assets/hero bg.jpeg';
import doctorImg from '../assets/doctor image.png';

const Home = () => {
  const departments = [
    {
      id: 'cardiology',
      name: 'Cardiology Division',
      description: 'Comprehensive coronary care, diagnostic mapping, and rhythm control monitored by seasoned cardiologists.',
      icon: Heart,
      color: 'text-rose-500 bg-rose-50 border-rose-100',
      image: 'https://images.unsplash.com/photo-1579684389782-64d84b5e905d?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'dermatology',
      name: 'Dermatology & Skin Science',
      description: 'Advanced clinical treatments for complex skin disorders, oncology checks, and aesthetics.',
      icon: Sparkles,
      color: 'text-amber-500 bg-amber-50 border-amber-100',
      image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'orthopedics',
      name: 'Orthopedics & Joint Care',
      description: 'Restoring joint motility and skeletal strength through non-invasive therapies and robotic surgeries.',
      icon: Activity,
      color: 'text-indigo-500 bg-indigo-50 border-indigo-100',
      image: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'diagnostics',
      name: 'Diagnostics Laboratory',
      description: 'Precision pathology reports, high-resolution radiology scans, and molecular profiling.',
      icon: ShieldCheck,
      color: 'text-teal-500 bg-teal-50 border-teal-100',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400',
    },
  ];

  const statistics = [
    { value: '18k+', label: 'Patients Treated', icon: Users },
    { value: '140+', label: 'Medical Specialists', icon: Award },
    { value: '99.6%', label: 'Positive Outcomes', icon: Smile },
    { value: '24/7', label: 'Telemedicine Desk', icon: PhoneCall },
  ];

  return (
    <div className="space-y-24 pb-20 -mt-20">
      {/* 1. Hero Section */}
      <section
        className="relative overflow-hidden min-h-screen flex"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Subtle overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/55 via-white/25 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center min-h-screen">

            {/* Left Content — padded top so text clears the fixed navbar */}
            <div className="flex flex-col justify-center space-y-6 pt-28 pb-12">

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-800 leading-[1.05] font-heading">
                Your Health,{' '}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-cyan-500">
                  Our Priority.
                </span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg max-w-md leading-relaxed font-body">
                MediCare Portal connects you with certified specialists, AI-powered diagnostics, and seamless appointment booking — all in one secure platform.
              </p>

              {/* CTAs */}
              <div className="flex flex-row gap-4">
                <Link
                  to="/book"
                  className="px-7 py-3.5 bg-teal-700 text-white font-bold rounded-2xl shadow-lg hover:bg-teal-800 transition-all hover:scale-[1.02] hover:shadow-xl flex items-center gap-2 group cursor-pointer font-heading text-[15px]"
                >
                  Book Appointment
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/chat"
                  className="px-7 py-3.5 bg-white/80 backdrop-blur-sm text-teal-800 border-2 border-teal-200 font-bold rounded-2xl hover:bg-white hover:border-teal-400 transition-all flex items-center gap-2 cursor-pointer font-heading text-[15px]"
                >
                  Consult AI
                </Link>
              </div>

            </div>

            {/* Right — Doctor Image flush to bottom */}
            <div className="relative flex justify-end items-end h-full min-h-screen">
              <img
                src={doctorImg}
                alt="MediCare specialist doctor"
                className="relative z-10 h-[85vh] max-h-[720px] w-auto object-contain object-bottom drop-shadow-2xl select-none"
                draggable={false}
              />
            </div>

          </div>
        </div>
      </section>

      {/* 2. Statistics Section */}
      <section className="bg-teal-900 py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-800/80 via-teal-950 to-slate-950 -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {statistics.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="text-center space-y-2 border-r last:border-0 border-teal-800/60 last:border-r-0">
                  <div className="inline-flex p-3 rounded-full bg-teal-800/50 text-emerald-400 mb-2">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">{stat.value}</h3>
                  <p className="text-xs sm:text-sm text-teal-200 font-medium font-body">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Department Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-black text-teal-950 font-heading">
            Our Dedicated Clinical Services
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            MediCare houses state-of-the-art departments engineered to cater to all aspects of clinical science, offering virtual scheduling and AI support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept) => {
            const Icon = dept.icon;
            return (
              <div
                key={dept.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col group"
              >
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={dept.image}
                    alt={dept.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                  <div className={`absolute bottom-3 left-3 p-2.5 rounded-2xl border ${dept.color} shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-800 font-heading">{dept.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-body">{dept.description}</p>
                  </div>
                  <Link
                    to="/book"
                    className="text-xs font-bold text-teal-800 hover:text-emerald-500 flex items-center gap-1.5 transition-colors group/link"
                  >
                    Schedule Specialist
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Telehealth Promo / AI Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-teal-900 to-slate-900 rounded-3xl p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden shadow-xl border border-teal-800/30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-3xl -z-10 translate-x-12 -translate-y-12"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-6 text-left">
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading leading-tight">
                Get Instant Clinical Answers from the <br className="hidden sm:inline" />
                MediCare AI Chatbot Assistant
              </h2>
              <p className="text-teal-200/80 text-sm sm:text-base leading-relaxed max-w-xl">
                Need immediate suggestions on minor symptoms or want to check doctor schedules? Chat with our virtual health desk integrated directly with your profile messages.
              </p>
              <div className="pt-2">
                <Link
                  to="/chat"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-teal-950 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  Start Consultation Chat
                  <MessageSquare className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            <div className="lg:col-span-4 flex justify-center">
              <div className="p-6 bg-slate-800/50 backdrop-blur-xs rounded-2xl border border-slate-700/50 text-left max-w-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-800 flex items-center justify-center font-bold text-white">AI</div>
                  <div>
                    <h4 className="text-xs font-extrabold text-white">MediCare Assistant</h4>
                    <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      Online & Listening
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-xl text-xs text-slate-300 leading-relaxed italic border-l-2 border-emerald-500">
                  "Hello! I can help check available services, analyze symptoms, and guide your booking flow."
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Interactive Testimonial Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-4">
          <h2 className="text-3xl font-black text-teal-950 font-heading">What Our Patients Say</h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Read stories of recovery and clinical satisfaction from patients registered in our databases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs relative text-left">
            <p className="text-sm text-slate-600 leading-relaxed font-body italic">
              "Booking a cardiologist was incredibly fast. I selected Cardiology, and within seconds the portal scheduled me with Dr. Sarah Jenkins on my chosen date. Fully digital!"
            </p>
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-50">
              <img src="https://ui-avatars.com/api/?name=James+Carter&background=10B981&color=fff" alt="User Avatar" className="w-10 h-10 rounded-full" />
              <div>
                <h4 className="text-xs font-extrabold text-slate-800">James Carter</h4>
                <p className="text-[10px] text-slate-400">Registered Patient</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs relative text-left">
            <p className="text-sm text-slate-600 leading-relaxed font-body italic">
              "The AI chatbot analyzed my minor rash and suggested dermatologist checking. The booking engine assigned me to Dr. Chen, who resolved my condition. Simply excellent experience!"
            </p>
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-50">
              <img src="https://ui-avatars.com/api/?name=Sofia+Martinez&background=115E59&color=fff" alt="User Avatar" className="w-10 h-10 rounded-full" />
              <div>
                <h4 className="text-xs font-extrabold text-slate-800">Sofia Martinez</h4>
                <p className="text-[10px] text-slate-400">Chronic Skin Care Patient</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs relative text-left">
            <p className="text-sm text-slate-600 leading-relaxed font-body italic">
              "As an administrator, registering new diagnostic services and tracking active hospital pillars is unified. The dashboard layouts are neat, reactive, and responsive."
            </p>
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-50">
              <img src="https://ui-avatars.com/api/?name=Admin+Staff&background=0F172A&color=fff" alt="User Avatar" className="w-10 h-10 rounded-full" />
              <div>
                <h4 className="text-xs font-extrabold text-slate-800">David Vance</h4>
                <p className="text-[10px] text-slate-400">Chief Operations Admin</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
