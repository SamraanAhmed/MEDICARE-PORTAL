import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Globe, Activity } from 'lucide-react';

const Welcome = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user && role) {
      if (role === 'admin') {
        navigate('/dashboard/admin', { replace: true });
      } else if (role === 'doctor') {
        navigate('/dashboard/doctor', { replace: true });
      } else {
        navigate('/dashboard/patient', { replace: true });
      }
    }
  }, [user, role, navigate]);

  // Render selection portal if not logged in
  return (
    <div className="min-h-[calc(100vh-80px)] flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-25%] left-[-20%] w-[60%] h-[60%] rounded-full bg-teal-500/10 blur-3xl -z-10"></div>
      <div className="absolute bottom-[-25%] right-[-20%] w-[60%] h-[60%] rounded-full bg-emerald-500/10 blur-3xl -z-10"></div>

      <div className="welcome-card max-w-2xl w-full bg-white/80 backdrop-blur-md rounded-3xl border border-slate-100 p-8 sm:p-12 shadow-2xl text-center space-y-10 relative">
        
        {/* Medicare Logo Branding */}
        <div className="space-y-4 flex flex-col items-center">
          <img 
            src="/imgvid/medicarelogo.png" 
            alt="MediCare Logo" 
            className="h-24 sm:h-32 w-auto object-contain transition-transform hover:scale-105 duration-300"
          />
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-teal-950 font-kanit">
              WELCOME TO MEDICARE
            </h1>
            <p className="text-teal-700 font-semibold tracking-wider uppercase text-xs sm:text-sm">
              Empowering Your Wellness Journey
            </p>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              Access your medical dashboards, consult our 24/7 AI health assistant, or coordinate clinical care.
            </p>
          </div>
        </div>

        {/* Access Gateway Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Patient Card */}
          <Link
            to="/auth"
            className="flex flex-col items-center p-6 bg-black hover:bg-slate-900 text-white rounded-2xl border border-slate-800 hover:border-teal-500/40 shadow-xl transition-all hover:scale-103 cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-teal-500/5 rounded-full blur-xl -z-10 group-hover:bg-teal-500/10 transition-colors"></div>
            <div className="p-3 bg-teal-500/10 rounded-xl mb-3 border border-teal-500/20 group-hover:scale-110 transition-transform duration-300">
              <User className="w-6 h-6 text-teal-400" />
            </div>
            <h3 className="text-sm font-bold text-teal-100 font-heading">Patient Portal</h3>
            <p className="text-[10px] text-slate-400 mt-1 text-center leading-normal">
              Book consultations & view health history
            </p>
          </Link>

          {/* Admin / Staff Card */}
          <Link
            to="/admin"
            className="flex flex-col items-center p-6 bg-black hover:bg-slate-900 text-white rounded-2xl border border-slate-800 hover:border-teal-500/40 shadow-xl transition-all hover:scale-103 cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-teal-500/5 rounded-full blur-xl -z-10 group-hover:bg-teal-500/10 transition-colors"></div>
            <div className="p-3 bg-teal-500/10 rounded-xl mb-3 border border-teal-500/20 group-hover:scale-110 transition-transform duration-300">
              <Shield className="w-6 h-6 text-teal-400" />
            </div>
            <h3 className="text-sm font-bold text-teal-100 font-heading">Staff Portal</h3>
            <p className="text-[10px] text-slate-400 mt-1 text-center leading-normal">
              Doctors & Admin control panels
            </p>
          </Link>

          {/* Marketing Site Card */}
          <Link
            to="/home"
            className="flex flex-col items-center p-6 bg-black hover:bg-slate-900 text-white rounded-2xl border border-slate-800 hover:border-teal-500/40 shadow-xl transition-all hover:scale-103 cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-teal-500/5 rounded-full blur-xl -z-10 group-hover:bg-teal-500/10 transition-colors"></div>
            <div className="p-3 bg-teal-500/10 rounded-xl mb-3 border border-teal-500/20 group-hover:scale-110 transition-transform duration-300">
              <Globe className="w-6 h-6 text-teal-400" />
            </div>
            <h3 className="text-sm font-bold text-teal-100 font-heading">Visit Site</h3>
            <p className="text-[10px] text-slate-400 mt-1 text-center leading-normal">
              Browse clinics, specialities & contact us
            </p>
          </Link>
        </div>

        {/* Trust Badge */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400 text-xs">
          <Activity className="w-4 h-4 text-teal-500 animate-pulse" />
          <span>Secure HIPAA-compliant healthcare channels</span>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
