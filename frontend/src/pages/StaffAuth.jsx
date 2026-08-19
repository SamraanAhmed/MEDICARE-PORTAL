import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, Eye, EyeOff, Lock, Stethoscope } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

const StaffAuth = () => {
  const navigate = useNavigate();
  const { login, error: authError } = useAuth();
  
  const [selectedRole, setSelectedRole] = useState('doctor'); // 'doctor' or 'admin'
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setSubmitError(null);
    try {
      await login(data.email, data.password, selectedRole);
      
      if (selectedRole === 'admin') {
        navigate('/dashboard/admin');
      } else {
        navigate('/dashboard/doctor');
      }
    } catch (err) {
      setSubmitError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 text-slate-100 relative overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-teal-800/20 blur-3xl"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-emerald-800/25 blur-3xl"></div>

      <div className="max-w-md w-full bg-slate-800/90 backdrop-blur-md rounded-3xl border border-slate-700 shadow-2xl overflow-hidden text-left relative z-10">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 to-emerald-400"></div>

        {/* Header */}
        <div className="p-8 pb-4">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-white font-heading">MediCare Staff Portal</h2>
            <p className="text-xs text-slate-400">Secure gateway for medical practitioners and administrators</p>
          </div>

          {/* Role selector buttons */}
          <div className="mt-8">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-center mb-3">Select Staff Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { setSelectedRole('doctor'); setSubmitError(null); }}
                className={`py-3 px-4 text-sm font-bold rounded-2xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  selectedRole === 'doctor'
                    ? 'border-teal-500 bg-teal-950/50 text-teal-400 shadow-lg'
                    : 'border-slate-700 bg-slate-850 hover:bg-slate-750 text-slate-400'
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                Medical Doctor
              </button>
              <button
                type="button"
                onClick={() => { setSelectedRole('admin'); setSubmitError(null); }}
                className={`py-3 px-4 text-sm font-bold rounded-2xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'border-teal-500 bg-teal-950/50 text-teal-400 shadow-lg'
                    : 'border-slate-700 bg-slate-850 hover:bg-slate-750 text-slate-400'
                }`}
              >
                <Lock className="w-4 h-4" />
                Administrator
              </button>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="px-8 pb-8 pt-2">
          
          {/* Error Banner */}
          {(submitError || authError) && (
            <div className="mb-6 p-4 bg-rose-950/40 border border-rose-900/50 rounded-2xl text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              <div>
                <p className="font-bold">Access Denied</p>
                <p className="mt-0.5 text-rose-300 leading-normal">{submitError || authError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
              <input
                type="email"
                placeholder="staff@medicare.com"
                {...register('email')}
                className={`w-full px-4 py-3 bg-slate-900 border text-sm rounded-xl text-slate-100 placeholder-slate-500 transition-all focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 ${
                  errors.email ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700'
                }`}
              />
              {errors.email && (
                <p className="text-rose-400 text-[10px] flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1 relative">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className={`w-full px-4 py-3 bg-slate-900 border text-sm rounded-xl text-slate-100 placeholder-slate-500 transition-all focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 pr-10 ${
                    errors.password ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-400 focus:outline-hidden cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-rose-400 text-[10px] flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-700 disabled:text-slate-450 disabled:shadow-none"
            >
              <LogIn className="w-4 h-4" />
              {isSubmitting ? 'Verifying Credentials...' : `Sign In as ${selectedRole === 'doctor' ? 'Doctor' : 'Admin'}`}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default StaffAuth;
