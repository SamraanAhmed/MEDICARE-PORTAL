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
      const res = await login(data.email, data.password, selectedRole);
      
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
    <div className="min-h-[calc(100vh-80px)] flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-[#fafffd] relative overflow-hidden">


      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden text-left relative z-10">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-850 to-teal-600"></div>

        {/* Header */}
        <div className="p-8 pb-4">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-teal-950 font-heading">MediCare Staff Portal</h2>
            <p className="text-xs text-slate-400">Secure gateway for medical practitioners and administrators</p>
          </div>

          {/* Role selector buttons */}
          <div className="mt-8">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block text-center mb-3">Select Staff Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { setSelectedRole('doctor'); setSubmitError(null); }}
                className={`py-3 px-4 text-sm font-bold rounded-2xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  selectedRole === 'doctor'
                    ? 'border-teal-200 bg-teal-50 text-teal-800 shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-500'
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
                    ? 'border-teal-200 bg-teal-50 text-teal-800 shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-500'
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
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              <div>
                <p className="font-bold">Access Denied</p>
                <p className="mt-0.5 text-rose-600 leading-normal">{submitError || authError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Email Address</label>
              <input
                type="email"
                placeholder="staff@medicare.com"
                {...register('email')}
                className={`w-full px-4 py-3 bg-slate-50/50 border text-sm rounded-xl text-slate-800 placeholder-slate-400 transition-all focus:outline-hidden focus:bg-white focus:border-teal-700 focus:ring-1 focus:ring-teal-700 ${
                  errors.email ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200'
                }`}
              />
              {errors.email && (
                <p className="text-rose-500 text-[10px] flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1 relative">
              <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className={`w-full px-4 py-3 bg-slate-50/50 border text-sm rounded-xl text-slate-800 placeholder-slate-400 transition-all focus:outline-hidden focus:bg-white focus:border-teal-700 focus:ring-1 focus:ring-teal-700 pr-10 ${
                    errors.password ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 focus:outline-hidden cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-rose-500 text-[10px] flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 py-3.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
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
