import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Plus, ToggleLeft, ToggleRight, List, UserCheck, Activity, AlertCircle, ShieldCheck, Mail, User } from 'lucide-react';

const serviceSchema = z.object({
  service_name: z.string().min(3, { message: 'Service name must be at least 3 characters.' }),
  pillar: z.enum(['cardiology', 'dermatology', 'orthopedics', 'diagnostics', 'telehealth', 'general']),
});

const adminSignupSchema = z.object({
  name: z.string().min(2, { message: 'Admin Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

const AdminDashboard = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [activeForm, setActiveForm] = useState('services'); // 'services' or 'add-admin'
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Hook forms setup
  const { register: registerService, handleSubmit: handleServiceSubmit, formState: { errors: serviceErrors, isSubmitting: isAddingService }, reset: resetService } = useForm({
    resolver: zodResolver(serviceSchema),
  });

  const { register: registerAdmin, handleSubmit: handleAdminSubmit, formState: { errors: adminErrors, isSubmitting: isAddingAdmin }, reset: resetAdmin } = useForm({
    resolver: zodResolver(adminSignupSchema),
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = () => {
    const list = api.getAvailableServices();
    setServices(list);
  };

  const onServiceSubmit = async (data) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      // Call endpoint that maps to real backend POST create/service endpoint
      await api.createService(data.service_name, data.pillar);
      setSuccessMsg('Medical specialty service created successfully in database!');
      resetService();
      loadServices();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create service.');
    }
  };

  const onAdminSubmit = async (data) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      // Call endpoint that maps to real backend POST register/admin endpoint
      await api.registerAdmin(data.name, data.email, data.password);
      setSuccessMsg(`Secondary admin account '${data.name}' registered successfully!`);
      resetAdmin();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to register admin staff.');
    }
  };

  const handleToggleService = (id, currentVal) => {
    const updated = api.toggleServiceAvailability(id, !currentVal);
    setServices(updated);
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <p className="text-slate-500 text-sm">Please log in to view admin dashboard.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* 1. Header Admin Profile */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-teal-50/30 rounded-bl-full -z-10"></div>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-teal-850 text-white flex items-center justify-center font-bold text-xl shadow-md">
            AD
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-teal-950 font-heading">Control Panel: {user.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4 text-teal-850" />
                Staff Rank: System Administrator
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {user.email}
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard toggles */}
        <div className="flex gap-2.5 bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => { setActiveForm('services'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeForm === 'services' ? 'bg-white text-teal-850 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <List className="w-4 h-4" />
            Specialty Catalog
          </button>
          <button
            onClick={() => { setActiveForm('add-admin'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeForm === 'add-admin' ? 'bg-white text-teal-850 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Add Admin Staff
          </button>
        </div>
      </div>

      {/* 2. Notification banners */}
      {(successMsg || errorMsg) && (
        <div className="text-left max-w-3xl mx-auto">
          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <p className="font-semibold">{successMsg}</p>
            </div>
          )}
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-800 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              <p className="font-semibold">{errorMsg}</p>
            </div>
          )}
        </div>
      )}

      {/* 3. Main Catalog / Management Form Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Hand: Services catalog table */}
        <div className="lg:col-span-7 space-y-4 text-left">
          <h3 className="text-lg font-bold text-teal-950 font-heading pl-1">Available Medical Services</h3>
          
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-slate-500 font-bold uppercase text-[10px] tracking-wider text-left">
                  <th className="px-6 py-4">Service Specialty</th>
                  <th className="px-6 py-4">Division Pillar</th>
                  <th className="px-6 py-4 text-right">Status Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {services.map((svc) => (
                  <tr key={svc._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">{svc.service_name}</td>
                    <td className="px-6 py-4 capitalize text-slate-500 font-semibold">{svc.pillar}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleService(svc._id, svc.available)}
                        className={`inline-flex items-center gap-1 font-bold text-xs p-1.5 rounded-lg border transition-all cursor-pointer ${
                          svc.available 
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-100' 
                            : 'text-slate-400 bg-slate-50 border-slate-100'
                        }`}
                      >
                        {svc.available ? (
                          <>
                            <ToggleRight className="w-5 h-5 text-emerald-500 shrink-0" />
                            Active
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-5 h-5 text-slate-400 shrink-0" />
                            Inactive
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Hand Form Column */}
        <div className="lg:col-span-5 text-left">
          {activeForm === 'services' ? (
            /* CREATE SERVICE FORM */
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-md space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-800 font-heading">Register Specialty Service</h3>
                <p className="text-xs text-slate-400">Add a new specialty that patients can select for bookings.</p>
              </div>

              <form onSubmit={handleServiceSubmit(onServiceSubmit)} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Service Title</label>
                  <input
                    type="text"
                    placeholder="Pediatric Heart Monitoring"
                    {...registerService('service_name')}
                    className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-700 ${
                      serviceErrors.service_name ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200'
                    }`}
                  />
                  {serviceErrors.service_name && (
                    <p className="text-rose-500 text-[10px] flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3.5 h-3.5 animate-bounce" />
                      {serviceErrors.service_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Medical Pillar</label>
                  <select
                    {...registerService('pillar')}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-700 cursor-pointer"
                  >
                    <option value="general">general</option>
                    <option value="cardiology">cardiology</option>
                    <option value="dermatology">dermatology</option>
                    <option value="orthopedics">orthopedics</option>
                    <option value="diagnostics">diagnostics</option>
                    <option value="telehealth">telehealth</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isAddingService}
                  className="w-full py-3 bg-teal-850 hover:bg-teal-900 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-slate-200"
                >
                  <Plus className="w-4.5 h-4.5" />
                  {isAddingService ? 'Creating Service...' : 'Create Service'}
                </button>
              </form>
            </div>
          ) : (
            /* REGISTER ADMIN FORM */
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-md space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-800 font-heading">Register Admin Staff</h3>
                <p className="text-xs text-slate-400">Grant administrative controls to another hospital coordinator.</p>
              </div>

              <form onSubmit={handleAdminSubmit(onAdminSubmit)} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Admin Name</label>
                  <input
                    type="text"
                    placeholder="Alice Sterling"
                    {...registerAdmin('name')}
                    className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-700 ${
                      adminErrors.name ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200'
                    }`}
                  />
                  {adminErrors.name && (
                    <p className="text-rose-500 text-[10px] flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {adminErrors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Email Address</label>
                  <input
                    type="email"
                    placeholder="alice.s@medicare.com"
                    {...registerAdmin('email')}
                    className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-700 ${
                      adminErrors.email ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200'
                    }`}
                  />
                  {adminErrors.email && (
                    <p className="text-rose-500 text-[10px] flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {adminErrors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...registerAdmin('password')}
                    className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-700 ${
                      adminErrors.password ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200'
                    }`}
                  />
                  {adminErrors.password && (
                    <p className="text-rose-500 text-[10px] flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {adminErrors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isAddingAdmin}
                  className="w-full py-3 bg-teal-850 hover:bg-teal-900 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-slate-200"
                >
                  <Activity className="w-4.5 h-4.5" />
                  {isAddingAdmin ? 'Registering Admin...' : 'Register Admin Account'}
                </button>
              </form>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
