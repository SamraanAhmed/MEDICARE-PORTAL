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

      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-md rounded-3xl border border-slate-100 p-8 sm:p-12 shadow-2xl text-center space-y-10 relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-700 to-emerald-500"></div>

        {/* Medicare Logo Branding */}
        <div className="space-y-4 flex flex-col items-center">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 opacity-30 blur-md group-hover:opacity-50 transition duration-300"></div>
            <img 
              src="/imgvid/medicarelogo.png" 
              alt="MediCare Logo" 
              className="h-28 w-28 sm:h-36 sm:w-36 rounded-full object-cover border-4 border-white bg-white shadow-lg relative z-10 transition-transform group-hover:scale-105 duration-300"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-teal-950 font-heading">
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
            className="flex flex-col items-center p-6 bg-teal-850 hover:bg-teal-900 text-white rounded-2xl shadow-md transition-all hover:scale-103 cursor-pointer group"
          >
            <div className="p-3 bg-teal-800/80 rounded-xl mb-3 border border-teal-700/50 group-hover:scale-110 transition-transform duration-300">
              <User className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-sm font-bold">Patient Portal</h3>
            <p className="text-[10px] text-teal-200 mt-1 text-center leading-normal">
              Book consultations & view health history
            </p>
          </Link>

          {/* Admin / Staff Card */}
          <Link
            to="/admin"
            className="flex flex-col items-center p-6 bg-slate-900 hover:bg-slate-950 text-white rounded-2xl shadow-md transition-all hover:scale-103 cursor-pointer group"
          >
            <div className="p-3 bg-slate-800 rounded-xl mb-3 border border-slate-700 group-hover:scale-110 transition-transform duration-300">
              <Shield className="w-6 h-6 text-teal-400" />
            </div>
            <h3 className="text-sm font-bold">Staff Portal</h3>
            <p className="text-[10px] text-slate-400 mt-1 text-center leading-normal">
              Doctors & Admin control panels
            </p>
          </Link>

          {/* Marketing Site Card */}
          <Link
            to="/home"
            className="flex flex-col items-center p-6 bg-white hover:bg-slate-50 text-slate-800 rounded-2xl border border-slate-200/80 shadow-sm transition-all hover:scale-103 cursor-pointer group"
          >
            <div className="p-3 bg-slate-100 rounded-xl mb-3 border border-slate-200/50 group-hover:scale-110 transition-transform duration-300">
              <Globe className="w-6 h-6 text-teal-700" />
            </div>
            <h3 className="text-sm font-bold text-teal-950">Visit Site</h3>
            <p className="text-[10px] text-slate-400 mt-1 text-center leading-normal">
              Browse clinics, specialities & contact us
            </p>
          </Link>
        </div>

        {/* Trust Badge */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400 text-xs">
          <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span>Secure HIPAA-compliant healthcare channels</span>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
