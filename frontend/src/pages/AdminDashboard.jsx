import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Plus, ToggleLeft, ToggleRight, List, UserCheck, Activity, AlertCircle, 
  ShieldCheck, Mail, User, Stethoscope, Lock, Trash2, Calendar, CreditCard, Clock, CheckCircle 
} from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const serviceSchema = z.object({
  service_name: z.string().min(3, { message: 'Service name must be at least 3 characters.' }),
  pillar: z.enum(['cardiology', 'dermatology', 'orthopedics', 'diagnostics', 'telehealth', 'general']),
  charges: z.coerce.number().min(1, { message: 'Charges must be a positive number.' }),
});

const adminSignupSchema = z.object({
  name: z.string().min(2, { message: 'Admin Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

const doctorSignupSchema = z.object({
  name: z.string().min(2, { message: 'Doctor Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  gender: z.enum(['male', 'female', 'not-specified'], { errorMap: () => ({ message: 'Please select a gender.' }) }),
  pillar: z.enum(['cardiology', 'dermatology', 'orthopedics', 'diagnostics', 'telehealth', 'general']),
});

const AdminDashboard = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [activeForm, setActiveForm] = useState('services'); // 'services', 'add-admin', 'add-doctor', 'patients', 'doctors', 'appointments', 'inquiries'
  
  // Data lists states
  const [patientsList, setPatientsList] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [appointmentsList, setAppointmentsList] = useState([]);
  const [inquiriesList, setInquiriesList] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [loadingInquiryDetail, setLoadingInquiryDetail] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const containerRef = useRef(null);

  useGSAP(() => {
    // Initial entrance on load
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.admin-header', { opacity: 0, y: -20, duration: 0.8 })
      .from('.admin-tabs', { opacity: 0, y: 15, duration: 0.6 }, '-=0.4');
  }, { scope: containerRef });

  useGSAP(() => {
    if (loadingData) return;
    
    // Animate tab content transitions when changing tabs
    gsap.from('.admin-content-section', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power3.out'
    });
  }, { scope: containerRef, dependencies: [activeForm, loadingData] });

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Hook forms setup
  const { register: registerService, handleSubmit: handleServiceSubmit, formState: { errors: serviceErrors, isSubmitting: isAddingService }, reset: resetService } = useForm({
    resolver: zodResolver(serviceSchema),
  });

  const { register: registerAdmin, handleSubmit: handleAdminSubmit, formState: { errors: adminErrors, isSubmitting: isAddingAdmin }, reset: resetAdmin } = useForm({
    resolver: zodResolver(adminSignupSchema),
  });

  const { register: registerDoctor, handleSubmit: handleDoctorSubmit, formState: { errors: doctorErrors, isSubmitting: isAddingDoctor }, reset: resetDoctor } = useForm({
    resolver: zodResolver(doctorSignupSchema),
    defaultValues: {
      gender: 'not-specified',
      pillar: 'general',
    }
  });

  useEffect(() => {
    loadServices();
    loadDashboardCounts();
  }, []);

  const loadServices = async () => {
    try {
      const list = await api.getAvailableServices();
      setServices(list);
    } catch (err) {
      console.error("Failed to load services:", err);
    }
  };

  const loadDashboardCounts = async () => {
    try {
      const p = await api.getAllUsers();
      setPatientsList(p);
      const d = await api.getAllDoctors();
      setDoctorsList(d);
      const appts = await api.getAllAppointmentsAdmin();
      setAppointmentsList(appts);
      const inqs = await api.getAllContactForms();
      setInquiriesList(inqs);
    } catch (err) {
      console.warn("Failed to prefetch counts:", err);
    }
  };

  const handleTabChange = async (tabName) => {
    setActiveForm(tabName);
    setErrorMsg('');
    setSuccessMsg('');
    setSelectedInquiry(null);
    setLoadingData(true);
    try {
      if (tabName === 'patients') {
        const list = await api.getAllUsers();
        setPatientsList(list);
      } else if (tabName === 'doctors') {
        const list = await api.getAllDoctors();
        setDoctorsList(list);
      } else if (tabName === 'appointments') {
        const list = await api.getAllAppointmentsAdmin();
        setAppointmentsList(list);
      } else if (tabName === 'services') {
        await loadServices();
      } else if (tabName === 'inquiries') {
        const list = await api.getAllContactForms();
        setInquiriesList(list);
      }
    } catch (err) {
      setErrorMsg(`Failed to query database for ${tabName}.`);
    } finally {
      setLoadingData(false);
    }
  };

  const handleViewInquiry = async (id) => {
    setErrorMsg('');
    setLoadingInquiryDetail(true);
    try {
      const detail = await api.getContactFormDetail(id);
      setSelectedInquiry(detail);
      // Auto mark as seen if unread
      if (!detail.seen) {
        await api.markContactFormSeen(id);
        // Refresh inquiry list to clear seen badge
        const list = await api.getAllContactForms();
        setInquiriesList(list);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to fetch inquiry details.');
    } finally {
      setLoadingInquiryDetail(false);
    }
  };

  const handleDeleteInquiry = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete the inquiry from '${name}'?`)) {
      setErrorMsg('');
      setSuccessMsg('');
      try {
        await api.deleteContactForm(id);
        setSuccessMsg(`Inquiry from '${name}' deleted successfully.`);
        setSelectedInquiry(null);
        const list = await api.getAllContactForms();
        setInquiriesList(list);
      } catch (err) {
        setErrorMsg(err.message || 'Failed to delete inquiry.');
      }
    }
  };

  const onServiceSubmit = async (data) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await api.createService(data.service_name, data.pillar, data.charges);
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
      await api.registerAdmin(data.name, data.email, data.password);
      setSuccessMsg(`Secondary admin account '${data.name}' registered successfully!`);
      resetAdmin();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to register admin staff.');
    }
  };

  const onDoctorSubmit = async (data) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await api.registerDoctor(data.name, data.email, data.password, data.gender, data.pillar);
      setSuccessMsg(`Doctor account '${data.name}' registered successfully!`);
      resetDoctor();
      // Update doctor counts
      const d = await api.getAllDoctors();
      setDoctorsList(d);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to register doctor.');
    }
  };

  const handleToggleService = async (id, currentVal) => {
    try {
      const updated = await api.toggleServiceAvailability(id, !currentVal);
      setServices(updated);
    } catch (err) {
      setErrorMsg('Failed to update service availability.');
    }
  };

  const handleDeletePatient = async (id, name) => {
    if (window.confirm(`Warning: Are you sure you want to permanently delete patient '${name}'? This will clear all chatbot message history as well.`)) {
      try {
        await api.deleteUser(id);
        setSuccessMsg(`Patient account '${name}' has been deleted.`);
        const list = await api.getAllUsers();
        setPatientsList(list);
      } catch (err) {
        setErrorMsg(err.message || 'Failed to delete user.');
      }
    }
  };

  const handleDeleteDoctor = async (id, name) => {
    if (window.confirm(`Warning: Are you sure you want to permanently delete doctor '${name}' from clinical registers?`)) {
      try {
        await api.deleteDoctor(id);
        setSuccessMsg(`Doctor account '${name}' has been deleted.`);
        const list = await api.getAllDoctors();
        setDoctorsList(list);
      } catch (err) {
        setErrorMsg(err.message || 'Failed to delete doctor.');
      }
    }
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
      
      {/* 1. Header Profile Box */}
      <div className="admin-header bg-black text-white rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-teal-50/30 rounded-bl-full -z-10"></div>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-teal-850 text-white flex items-center justify-center font-bold text-xl shadow-md">
            AD
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">Control Panel: {user.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-300">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4 text-teal-400" />
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

        {/* 2. Top Navigation Tabs */}
        <div className="admin-tabs flex flex-wrap gap-2 justify-start lg:justify-center border-b border-slate-700/50 pb-4">
          <button
            onClick={() => handleTabChange('services')}
            className={`px-3.5 py-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeForm === 'services' ? 'text-[#00d5be]' : 'text-[#fafffd] hover:text-[#00d5be]/80'
            }`}
          >
            <List className="w-4 h-4" />
            Services
          </button>
          <button
            onClick={() => handleTabChange('patients')}
            className={`px-3.5 py-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeForm === 'patients' ? 'text-[#00d5be]' : 'text-[#fafffd] hover:text-[#00d5be]/80'
            }`}
          >
            <User className="w-4 h-4" />
            Patients ({patientsList.length})
          </button>
          <button
            onClick={() => handleTabChange('doctors')}
            className={`px-3.5 py-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeForm === 'doctors' ? 'text-[#00d5be]' : 'text-[#fafffd] hover:text-[#00d5be]/80'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            Doctors ({doctorsList.length})
          </button>
          <button
            onClick={() => handleTabChange('appointments')}
            className={`px-3.5 py-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeForm === 'appointments' ? 'text-[#00d5be]' : 'text-[#fafffd] hover:text-[#00d5be]/80'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Appointments ({appointmentsList.length})
          </button>
          <button
            onClick={() => handleTabChange('add-doctor')}
            className={`px-3.5 py-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeForm === 'add-doctor' ? 'text-[#00d5be]' : 'text-[#fafffd] hover:text-[#00d5be]/80'
            }`}
          >
            <Plus className="w-4 h-4" />
            Add Doctor
          </button>
          <button
            onClick={() => handleTabChange('add-admin')}
            className={`px-3.5 py-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeForm === 'add-admin' ? 'text-[#00d5be]' : 'text-[#fafffd] hover:text-[#00d5be]/80'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Add Admin
          </button>
          <button
            onClick={() => handleTabChange('inquiries')}
            className={`px-3.5 py-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 relative ${
              activeForm === 'inquiries' ? 'text-[#00d5be]' : 'text-[#fafffd] hover:text-[#00d5be]/80'
            }`}
          >
            <Mail className="w-4 h-4" />
            Inquiries
            {inquiriesList.filter(i => !i.seen).length > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[8px] font-extrabold bg-rose-500 text-white rounded-full leading-none shadow-xs">
                {inquiriesList.filter(i => !i.seen).length}
              </span>
            )}
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

      {/* 3. Main Content Panel */}
      <div className="admin-content-section min-h-[400px]">
        {loadingData ? (
          <div className="text-center py-12">
            <Clock className="w-8 h-8 text-slate-300 animate-spin mx-auto" />
            <p className="text-xs text-slate-400 mt-2">Loading data directories...</p>
          </div>
        ) : ['services', 'add-doctor', 'add-admin'].includes(activeForm) ? (
        /* Split view dashboard layout for creation states */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
          
          <div className="slide-in-left lg:col-span-8 bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs text-left">
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
          <div className="lg:col-span-4 text-left animate-in fade-in duration-350">
            
            {activeForm === 'services' && (
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

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Service Fee ($)</label>
                    <input
                      type="number"
                      placeholder="150"
                      {...registerService('charges')}
                      className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-700 ${
                        serviceErrors.charges ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200'
                      }`}
                    />
                    {serviceErrors.charges && (
                      <p className="text-rose-500 text-[10px] flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3.5 h-3.5 animate-bounce" />
                        {serviceErrors.charges.message}
                      </p>
                    )}
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
            )}

            {activeForm === 'add-doctor' && (
              /* REGISTER DOCTOR FORM */
              <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-md space-y-6 animate-in slide-in-from-right-4 duration-250">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-800 font-heading">Register Doctor Staff</h3>
                  <p className="text-xs text-slate-400">Create a secure medical practitioner account.</p>
                </div>

                <form onSubmit={handleDoctorSubmit(onDoctorSubmit)} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Doctor Name</label>
                    <input
                      type="text"
                      placeholder="Dr. Evelyn Thorne"
                      {...registerDoctor('name')}
                      className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-700 ${
                        doctorErrors.name ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200'
                      }`}
                    />
                    {doctorErrors.name && (
                      <p className="text-rose-500 text-[10px] flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {doctorErrors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Email Address</label>
                    <input
                      type="email"
                      placeholder="evelyn.t@medicare.com"
                      {...registerDoctor('email')}
                      className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-700 ${
                        doctorErrors.email ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200'
                      }`}
                    />
                    {doctorErrors.email && (
                      <p className="text-rose-500 text-[10px] flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {doctorErrors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      {...registerDoctor('password')}
                      className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-700 ${
                        doctorErrors.password ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200'
                      }`}
                    />
                    {doctorErrors.password && (
                      <p className="text-rose-500 text-[10px] flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {doctorErrors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Gender</label>
                      <select
                        {...registerDoctor('gender')}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-700 cursor-pointer"
                      >
                        <option value="not-specified">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Medical Pillar</label>
                      <select
                        {...registerDoctor('pillar')}
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
                  </div>

                  <button
                    type="submit"
                    disabled={isAddingDoctor}
                    className="w-full py-3 mt-2 bg-teal-850 hover:bg-teal-900 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-slate-200"
                  >
                    <Plus className="w-4.5 h-4.5" />
                    {isAddingDoctor ? 'Registering Doctor...' : 'Register Doctor'}
                  </button>
                </form>
              </div>
            )}

            {activeForm === 'add-admin' && (
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
      ) : (
        /* Full width directory listings for patients, doctors, and appointments */
        <div className="text-left space-y-6 animate-in fade-in duration-200">
          
          {activeForm === 'patients' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-teal-950 font-heading pl-1">Registered Patient Directory</h3>
              <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs">
                {patientsList.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">No patient accounts currently registered.</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr className="text-slate-500 font-bold uppercase text-[10px] tracking-wider text-left">
                        <th className="px-6 py-4">Patient Profile</th>
                        <th className="px-6 py-4">Email Address</th>
                        <th className="px-6 py-4">Gender</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {patientsList.map((pt) => (
                        <tr key={pt._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 flex items-center gap-3">
                            <img
                              src={pt.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(pt.name)}&background=0F766E&color=fff`}
                              alt={pt.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-100"
                            />
                            <div>
                              <div className="font-bold text-slate-800">{pt.name}</div>
                              <div className="text-[10px] text-slate-400 font-semibold uppercase">ID: {pt._id}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-600 font-medium">{pt.email}</td>
                          <td className="px-6 py-4 capitalize text-slate-500">{pt.gender || 'not-specified'}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDeletePatient(pt._id, pt.name)}
                              className="p-1.5 rounded-lg border border-slate-100 hover:border-rose-100 text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                              title="Delete Patient Account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeForm === 'doctors' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-teal-950 font-heading pl-1">Registered Doctor Registers</h3>
              <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs">
                {doctorsList.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">No doctor accounts currently registered.</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr className="text-slate-500 font-bold uppercase text-[10px] tracking-wider text-left">
                        <th className="px-6 py-4">Physician Profile</th>
                        <th className="px-6 py-4">Email Address</th>
                        <th className="px-6 py-4">Medical Specialty</th>
                        <th className="px-6 py-4">Availability</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {doctorsList.map((doc) => (
                        <tr key={doc._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 flex items-center gap-3">
                            <img
                              src={doc.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=0D9488&color=fff`}
                              alt={doc.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-100"
                            />
                            <div>
                              <div className="font-bold text-slate-800">{doc.name}</div>
                              <div className="text-[10px] text-slate-400 font-semibold uppercase">ID: {doc._id}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-600 font-medium">{doc.email}</td>
                          <td className="px-6 py-4 capitalize text-slate-800 font-extrabold">{doc.pillar}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              doc.available !== false 
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                                : 'bg-slate-50 text-slate-500 border-slate-200'
                            }`}>
                              {doc.available !== false ? 'Available' : 'Busy / Off'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDeleteDoctor(doc._id, doc.name)}
                              className="p-1.5 rounded-lg border border-slate-100 hover:border-rose-100 text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                              title="Delete Doctor Account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeForm === 'appointments' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-teal-950 font-heading pl-1">All Consultation Schedules</h3>
              <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs">
                {appointmentsList.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">No appointments scheduled.</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr className="text-slate-500 font-bold uppercase text-[10px] tracking-wider text-left">
                        <th className="px-6 py-4">Patient details</th>
                        <th className="px-6 py-4">Assigned physician</th>
                        <th className="px-6 py-4">Consultation specialty</th>
                        <th className="px-6 py-4">date</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-right">Billing</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {appointmentsList.map((appt) => {
                        const dateText = new Date(appt.appointment_date).toLocaleDateString(undefined, {
                          month: 'short', day: 'numeric', year: 'numeric'
                        });
                        
                        return (
                          <tr key={appt._id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-800">{appt.patient?.name || 'Registered Patient'}</div>
                              <div className="text-[10px] text-slate-400">{appt.patient?.email || ''}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-800">{appt.doctor?.name || 'Dr. Specialist'}</div>
                              <div className="text-[10px] text-teal-700 capitalize font-bold">{appt.doctor?.pillar || 'Medical Column'}</div>
                            </td>
                            <td className="px-6 py-4 font-semibold text-slate-700">
                              {appt.service?.service_name || 'Clinic consultation'}
                            </td>
                            <td className="px-6 py-4 text-slate-500 font-medium">
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                {dateText}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`inline-block text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${
                                appt.status === 'completed'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
                                  : appt.status === 'cancelled' || appt.status === 'no-show'
                                  ? 'bg-rose-50 text-rose-800 border-rose-100'
                                  : 'bg-amber-50 text-amber-800 border-amber-100'
                              }`}>
                                {appt.status}
                              </span>
                              {appt.status === 'completed' && appt.proof && (
                                <div className="text-[9px] text-slate-400 italic max-w-xs truncate mx-auto mt-1" title={appt.proof}>
                                  Proof: "{appt.proof}"
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="font-bold text-slate-800">${appt.payment?.charges || appt.service?.charges || 100}</div>
                              <div className="text-[10px] mt-0.5">
                                <span className={`inline-flex items-center gap-0.5 font-bold ${
                                  appt.payment?.paid 
                                    ? 'text-emerald-700' 
                                    : 'text-amber-600'
                                }`}>
                                  <CreditCard className="w-3 h-3 shrink-0" />
                                  {appt.payment?.paid ? 'Paid' : 'Unpaid'}
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeForm === 'inquiries' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
              
              {/* Left side: Services List */}
              <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs text-left">
                <h3 className="text-lg font-bold text-teal-950 font-heading pl-1">Patient Inquiries</h3>
                <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs">
                  {inquiriesList.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">No inquiries found.</div>
                  ) : (
                    <div className="divide-y divide-slate-50">
                      {inquiriesList.map((inq) => (
                        <div
                          key={inq._id}
                          onClick={() => handleViewInquiry(inq._id)}
                          className={`p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-55 transition-colors relative ${
                            selectedInquiry?._id === inq._id ? 'bg-slate-50 border-l-4 border-teal-850' : ''
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-800">{inq.name}</h4>
                              {!inq.seen && (
                                <span className="bg-rose-50 text-rose-800 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase border border-rose-100 animate-pulse">
                                  Unread
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 font-medium">{inq.email}</p>
                            <p className="text-xs font-semibold text-slate-700 mt-1 line-clamp-1">Subject: {inq.subject}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteInquiry(inq._id, inq.name);
                              }}
                              className="p-1.5 rounded-lg border border-slate-100 hover:border-rose-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                              title="Delete Inquiry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Inquiry details viewer */}
              <div className="lg:col-span-6 text-left">
                <h3 className="text-lg font-bold text-teal-950 font-heading pl-1">Inquiry Details</h3>
                
                {loadingInquiryDetail ? (
                  <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center">
                    <Clock className="w-8 h-8 text-slate-300 animate-spin mx-auto" />
                    <p className="text-xs text-slate-400 mt-2">Opening inquiry record...</p>
                  </div>
                ) : selectedInquiry ? (
                  <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-md space-y-6 animate-in fade-in duration-300">
                    <div className="border-b border-slate-100 pb-4 space-y-2">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="text-base font-extrabold text-slate-800">{selectedInquiry.name}</h4>
                          <a href={`mailto:${selectedInquiry.email}`} className="text-xs text-teal-705 hover:underline">{selectedInquiry.email}</a>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">
                          {new Date(selectedInquiry.createdAt).toLocaleDateString(undefined, {
                            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>
                      
                      <div className="pt-2">
                        <span className="inline-block bg-teal-50 text-[10px] text-teal-850 font-bold px-2.5 py-0.5 rounded-md border border-teal-100">
                          Subject: {selectedInquiry.subject}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs leading-relaxed text-slate-700 bg-slate-50/50 p-5 rounded-2xl border border-slate-100 font-body">
                      <strong className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Message Content:</strong>
                      <p className="whitespace-pre-wrap">{selectedInquiry.message}</p>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[10px] text-slate-400">
                        Status: {selectedInquiry.seen ? 'Read' : 'Unread'}
                      </span>
                      <button
                        onClick={() => handleDeleteInquiry(selectedInquiry._id, selectedInquiry.name)}
                        className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete Message
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 p-12 text-center text-slate-400">
                    Select a patient inquiry from the register to read the detailed message body.
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      )}
      </div>

    </div>
  );
};

export default AdminDashboard;
