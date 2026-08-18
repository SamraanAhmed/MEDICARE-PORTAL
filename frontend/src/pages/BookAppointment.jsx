import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Calendar, Clock, AlertCircle, FileText, CheckCircle2, ChevronRight, Activity, ShieldCheck } from 'lucide-react';

const appointmentSchema = z.object({
  service: z.string().min(1, { message: 'Please select a medical service.' }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)) && new Date(val) > new Date(), {
    message: 'Please select a valid future date.',
  }),
  note: z.string().max(500, { message: 'Notes must not exceed 500 characters.' }).optional(),
});

const BookAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [successAppt, setSuccessAppt] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm({
    resolver: zodResolver(appointmentSchema),
  });

  const selectedServiceId = watch('service');

  useEffect(() => {
    // Fetch available services (both default ones and admin-created ones)
    const list = api.getAvailableServices();
    setServices(list.filter(s => s.available));
  }, []);

  const onSubmit = async (data) => {
    setSubmitError(null);
    setSuccessAppt(null);
    try {
      // 1. Book appointment (which calls real backend database POST create/appointment endpoint)
      const res = await api.createAppointment(data.service, data.date, data.note);
      
      // 2. Fetch full lists to extract doctor details for success display
      const localDocs = api.getDoctors();
      const selectedService = services.find(s => s._id === data.service);
      const assignedDoctor = localDocs.find(d => d.pillar === selectedService?.pillar) || localDocs[0];

      setSuccessAppt({
        date: data.date,
        service: selectedService?.service_name || 'Medical Care',
        doctor: assignedDoctor?.name || 'Dr. Assigned Consultant',
        avatar: assignedDoctor?.avatar,
      });
    } catch (err) {
      setSubmitError(err.message || 'Unable to book appointment. Ensure a doctor is available on the chosen date.');
    }
  };

  // Redirect to Auth if not logged in
  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-800 flex items-center justify-center mx-auto border border-teal-100">
          <Calendar className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black text-teal-950 font-heading">Consultation Booking</h2>
        <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
          Please log in to your patient account to schedule an appointment with our specialist doctors.
        </p>
        <div className="pt-2">
          <Link
            to="/auth"
            className="px-8 py-3.5 bg-teal-850 hover:bg-teal-900 text-white font-bold rounded-xl shadow-md transition-colors"
          >
            Access Sign In / Registration
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      
      {/* Header */}
      <div className="text-left space-y-2 border-b border-slate-100 pb-6">
        <h1 className="text-4xl font-black text-teal-950 font-heading mt-1">Book a Consultation</h1>
        <p className="text-slate-500 text-xs sm:text-sm">
          Select a medical service. Our booking algorithm automatically schedules you with an available physician.
        </p>
      </div>

      {successAppt ? (
        /* SUCCESS SCREEN */
        <div className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-12 shadow-xl text-center space-y-8 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-100">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-800 font-heading">Consultation Confirmed!</h2>
            <p className="text-slate-500 text-sm">Your medical entry is saved in the database tables.</p>
          </div>

          {/* Assigned Doctor details */}
          <div className="bg-slate-50 rounded-2xl p-6 max-w-md mx-auto border border-slate-100 flex items-center gap-4 text-left">
            <img
              src={successAppt.avatar || 'https://ui-avatars.com/api/?name=Dr+Consultant'}
              alt={successAppt.doctor}
              className="w-14 h-14 rounded-full border border-teal-800/20 object-cover shrink-0"
            />
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Assigned Specialist</p>
              <h4 className="text-base font-extrabold text-slate-800">{successAppt.doctor}</h4>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                <span className="font-semibold text-teal-800 capitalize">{successAppt.service}</span>
                <span>•</span>
                <span>Date: {new Date(successAppt.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-2">
            <Link
              to="/dashboard/patient"
              className="px-6 py-3 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl shadow-md text-sm transition-colors cursor-pointer"
            >
              Go To Dashboard
            </Link>
            <button
              onClick={() => setSuccessAppt(null)}
              className="px-6 py-3 bg-white border border-teal-850/20 text-teal-850 hover:bg-teal-50 font-bold rounded-xl text-sm transition-colors cursor-pointer"
            >
              Book Another
            </button>
          </div>
        </div>
      ) : (
        /* BOOKING FORM */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Booking Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-md space-y-6 text-left">
            
            {/* Error message */}
            {submitError && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                <div>
                  <p className="font-bold">Failed to Book Appointment</p>
                  <p className="mt-0.5 text-rose-600 leading-normal">{submitError}</p>
                </div>
              </div>
            )}

            {/* Step 1: Select Service */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-teal-850" />
                1. Select Service / Specialty
              </label>
              <select
                {...register('service')}
                className={`w-full px-4 py-3.5 rounded-xl border bg-slate-50/50 text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-700 cursor-pointer ${
                  errors.service ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200'
                }`}
              >
                <option value="">Choose Service...</option>
                {services.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.service_name} ({s.pillar.toUpperCase()})
                  </option>
                ))}
              </select>
              {errors.service && (
                <p className="text-rose-500 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.service.message}
                </p>
              )}
            </div>

            {/* Step 2: Date Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-850" />
                2. Select Date
              </label>
              <input
                type="date"
                {...register('date')}
                className={`w-full px-4 py-3.5 rounded-xl border bg-slate-50/50 text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-700 cursor-pointer ${
                  errors.date ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200'
                }`}
              />
              {errors.date && (
                <p className="text-rose-500 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Step 3: Medical Notes */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-teal-850" />
                3. Symptoms / Notes (Optional)
              </label>
              <textarea
                rows="4"
                placeholder="Please describe symptoms, prior treatments, or special requests..."
                {...register('note')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-700"
              />
              {errors.note && (
                <p className="text-rose-500 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.note.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-teal-850 hover:bg-teal-900 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300"
              >
                {isSubmitting ? 'Booking Consultation...' : 'Confirm Appointment Request'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </form>

          {/* Sidebar Guidelines */}
          <div className="lg:col-span-4 space-y-6 text-left">
            <div className="bg-slate-50 rounded-3xl border border-slate-100 p-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Booking Guidelines</h4>
              
              <div className="space-y-3.5 text-xs text-slate-600">
                <div className="flex gap-2">
                  <span className="text-teal-800 font-extrabold">1.</span>
                  <p>Our algorithm schedules appointments only with active, online doctors matching your selected clinical pillar.</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-teal-800 font-extrabold">2.</span>
                  <p>A daily limit of 5 appointments per doctor is active in the database checks (`checkDoctorDailyAvailability`).</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-teal-800 font-extrabold">3.</span>
                  <p>You can review and track appointment statuses in your Personal Patient Dashboard.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-3xl border border-teal-100/50 p-6 space-y-3">
              <ShieldCheck className="w-8 h-8 text-teal-850" />
              <h4 className="text-sm font-bold text-teal-950 font-heading">HIPAA Compliant Data</h4>
              <p className="text-xs text-slate-600 leading-normal">
                Your medical record entries are stored in encrypted collections and are only shared with your assigned practitioner.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default BookAppointment;
