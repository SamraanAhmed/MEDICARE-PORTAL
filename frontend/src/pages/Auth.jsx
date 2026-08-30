import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { LogIn, UserPlus, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

// Zod schemas for forms
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  gender: z.enum(['male', 'female', 'not-specified'], { errorMap: () => ({ message: 'Please select a gender.' }) }),
});

const Auth = () => {
  const navigate = useNavigate();
  const { login, register: signUp, error: authError } = useAuth();
  const { showNotification } = useNotification();
  
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const containerRef = useRef(null);

  // Zod form setups
  const { register: registerLogin, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors, isSubmitting: isLoggingIn } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { register: registerSignup, handleSubmit: handleSignupSubmit, formState: { errors: signupErrors, isSubmitting: isRegistering } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      gender: 'not-specified',
    }
  });

  useGSAP(() => {
    // Initial card entrance
    gsap.from('.auth-card', {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power3.out'
    });

    gsap.from('.auth-header-el', {
      opacity: 0,
      y: -15,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power3.out'
    });
  }, { scope: containerRef });

  useGSAP(() => {
    // Animate form fields whenever activeTab switches
    gsap.from('.auth-field', {
      opacity: 0,
      y: 10,
      stagger: 0.08,
      duration: 0.4,
      ease: 'power3.out'
    });
  }, { scope: containerRef, dependencies: [activeTab] });

  const onLoginSubmit = async (data) => {
    setSubmitError(null);
    try {
      const res = await login(data.email, data.password, 'user');
      showNotification(`Welcome Back ! ${res?.name || 'Patient'}`);
      window.dispatchEvent(new CustomEvent('page-transition', { detail: { to: '/dashboard/patient' } }));
    } catch (err) {
      setSubmitError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const onSignupSubmit = async (data) => {
    setSubmitError(null);
    try {
      await signUp(
        data.name, 
        data.email, 
        data.password, 
        data.gender, 
        'user'
      );
      showNotification(`Welcome! ${data.name}`);
      window.dispatchEvent(new CustomEvent('page-transition', { detail: { to: '/dashboard/patient' } }));
    } catch (err) {
      setSubmitError(err.message || 'Registration failed. Email might already be taken.');
    }
  };

  return (
    <div ref={containerRef} className="min-h-[calc(100vh-80px)] flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-[#fafffd]">
      <div className="auth-card max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden text-left relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-850 to-teal-600"></div>

        {/* Brand & Toggle Header */}
        <div className="p-8 pb-4">
          <div className="text-center space-y-2">
            <h2 className="auth-header-el text-3xl font-black text-teal-950 font-heading">MediCare Patient Portal</h2>
            <p className="auth-header-el text-xs text-slate-400">Access your medical files and book appointments</p>
          </div>

          {/* Login/Register Tabs */}
          <div className="auth-header-el mt-8 grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => { setActiveTab('login'); setSubmitError(null); }}
              className={`py-3 text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'login' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab('register'); setSubmitError(null); }}
              className={`py-3 text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'register' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Register
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="px-8 pb-8 pt-2">
          
          {/* Error Banner */}
          {(submitError || authError) && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              <div>
                <p className="font-bold">Authentication Error</p>
                <p className="mt-0.5 text-rose-600 leading-normal">{submitError || authError}</p>
              </div>
            </div>
          )}

          {activeTab === 'login' ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-4">
              <div className="auth-field space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Email Address</label>
                <input
                  type="email"
                  placeholder="john.doe@medicare.com"
                  {...registerLogin('email')}
                  className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-sm transition-all focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-700 ${
                    loginErrors.email ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200'
                  }`}
                />
                {loginErrors.email && (
                  <p className="text-rose-500 text-[10px] flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5" /> {loginErrors.email.message}
                  </p>
                )}
              </div>

              <div className="auth-field space-y-1 relative">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...registerLogin('password')}
                    className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-sm transition-all focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-700 pr-10 ${
                      loginErrors.password ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200'
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
                {loginErrors.password && (
                  <p className="text-rose-500 text-[10px] flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5" /> {loginErrors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="auth-field w-full mt-4 py-3.5 bg-teal-800 text-white rounded-xl font-bold shadow-md hover:bg-teal-900 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300 disabled:shadow-none"
              >
                {isLoggingIn ? 'Logging in...' : 'Login as Patient'}
              </button>
            </form>
          ) : (
            /* REGISTRATION FORM */
            <form onSubmit={handleSignupSubmit(onSignupSubmit)} className="space-y-4">
              
              {/* Full Name */}
              <div className="auth-field space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  {...registerSignup('name')}
                  className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-sm transition-all focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-700 ${
                    signupErrors.name ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200'
                  }`}
                />
                {signupErrors.name && (
                  <p className="text-rose-500 text-[10px] flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5" /> {signupErrors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="auth-field space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Email Address</label>
                <input
                  type="email"
                  placeholder="john.doe@medicare.com"
                  {...registerSignup('email')}
                  className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-sm transition-all focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-700 ${
                    signupErrors.email ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200'
                  }`}
                />
                {signupErrors.email && (
                  <p className="text-rose-500 text-[10px] flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5" /> {signupErrors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="auth-field space-y-1 relative">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="•••••••• (Min 6 chars)"
                    {...registerSignup('password')}
                    className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-sm transition-all focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-700 pr-10 ${
                      signupErrors.password ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200'
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
                {signupErrors.password && (
                  <p className="text-rose-500 text-[10px] flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5" /> {signupErrors.password.message}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div className="auth-field space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Gender</label>
                <select
                  {...registerSignup('gender')}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm transition-all focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-700 cursor-pointer"
                >
                  <option value="not-specified">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {signupErrors.gender && (
                  <p className="text-rose-500 text-[10px] flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5" /> {signupErrors.gender.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isRegistering}
                className="auth-field w-full mt-4 py-3.5 bg-teal-800 text-white rounded-xl font-bold shadow-md hover:bg-teal-900 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300 disabled:shadow-none"
              >
                {isRegistering ? 'Registering...' : 'Register as Patient'}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default Auth;
