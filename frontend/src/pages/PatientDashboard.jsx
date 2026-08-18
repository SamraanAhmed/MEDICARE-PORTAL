import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Calendar, Heart, ShieldCheck, Activity, Trash2, Clock, CheckCircle2, User, UserCheck, Eye } from 'lucide-react';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const list = api.getPatientAppointments(user._id);
      setAppointments(list);
      setLoading(false);
    }
  }, [user]);

  const handleCancelAppointment = (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      const updated = api.cancelAppointment(id);
      setAppointments(updated);
    }
  };

  // Mock health metrics trackers for premium visual appeal
  const healthMetrics = [
    { label: 'Heart Rate', value: '72 bpm', status: 'Optimal', color: 'text-rose-500 bg-rose-50 border-rose-100', change: 'Normal resting rate' },
    { label: 'Blood Pressure', value: '118/79 mmHg', status: 'Normal', color: 'text-teal-500 bg-teal-50 border-teal-100', change: 'Sys/Dias standard' },
    { label: 'Sleep Cycles', value: '7.8 hrs', status: 'Restful', color: 'text-indigo-500 bg-indigo-50 border-indigo-100', change: 'Avg 82% deep sleep' },
    { label: 'Blood Glucose', value: '94 mg/dL', status: 'Fasting', color: 'text-amber-500 bg-amber-50 border-amber-100', change: 'Pre-meal reading' }
  ];

  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <p className="text-slate-500 text-sm">Please log in to view patient dashboard.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Upper Dashboard Header: User Info */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-teal-50/30 rounded-bl-full -z-10"></div>
        <div className="flex items-center gap-5">
          <img
            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=115E59&color=fff`}
            alt={user.name}
            className="w-20 h-20 rounded-full border-2 border-emerald-500 object-cover shrink-0 shadow-sm"
          />
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-teal-950 font-heading">Welcome, {user.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4 text-teal-850" />
                Patient ID: {user._id?.substring(0, 10) || 'D1093'}
              </span>
              <span>•</span>
              <span className="capitalize">Gender: {user.gender}</span>
              <span>•</span>
              <span>Account: Active</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            to="/book"
            className="px-6 py-3.5 bg-teal-850 hover:bg-teal-900 text-white font-bold rounded-xl shadow-md text-sm transition-all cursor-pointer"
          >
            New Consultation
          </Link>
          <Link
            to="/chat"
            className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all cursor-pointer"
          >
            Chat Advisor
          </Link>
        </div>
      </div>

      {/* Health Vitals Summary Row */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-teal-950 font-heading text-left pl-1">Vitals Tracker</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {healthMetrics.map((metric, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow text-left space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{metric.label}</span>
                <span className="inline-block bg-teal-50 text-[9px] text-teal-800 font-bold px-2 py-0.5 rounded-full uppercase">
                  {metric.status}
                </span>
              </div>
              <div>
                <h4 className="text-2xl font-black text-slate-800 font-heading">{metric.value}</h4>
                <p className="text-[10px] text-slate-500 mt-1">{metric.change}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Grid: Appointments History & Directives */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Appointments List Column */}
        <div className="lg:col-span-8 space-y-4 text-left">
          <h3 className="text-lg font-bold text-teal-950 font-heading pl-1">Appointment Register</h3>
          
          {loading ? (
            <p className="text-slate-500 text-sm">Querying schedules...</p>
          ) : appointments.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-10 text-center space-y-4">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-slate-500 text-sm">You do not have any appointments booked.</p>
              <Link to="/book" className="text-sm font-bold text-teal-850 hover:underline inline-block">
                Schedule your first checkup →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appt) => {
                const dateStr = new Date(appt.appointment_date).toLocaleDateString(undefined, {
                  weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                });
                
                return (
                  <div
                    key={appt._id}
                    className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs hover:shadow-md transition-shadow grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                  >
                    {/* Doctor Info */}
                    <div className="md:col-span-4 flex items-center gap-3.5">
                      <img
                        src={appt.doctor?.avatar || 'https://ui-avatars.com/api/?name=Dr+Staff'}
                        alt={appt.doctor?.name}
                        className="w-12 h-12 rounded-full object-cover border border-slate-100 shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 leading-tight">{appt.doctor?.name || 'Dr. Assigned Speciality'}</h4>
                        <span className="text-[10px] text-teal-800 font-semibold capitalize mt-0.5 inline-block">
                          {appt.doctor?.pillar} Division
                        </span>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="md:col-span-5 space-y-1">
                      <p className="text-xs font-bold text-slate-700 font-body">{appt.service?.service_name || 'Standard Consultation'}</p>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Date: {dateStr}</span>
                      </div>
                      {appt.notes && (
                        <p className="text-[10px] text-slate-400 italic truncate max-w-xs mt-1">"Notes: {appt.notes}"</p>
                      )}
                      
                      {/* Prescriptions / proof display */}
                      {appt.status === 'completed' && appt.proof && (
                        <div className="mt-2 p-2 bg-emerald-50 border border-emerald-100 rounded-lg text-[10px] text-emerald-800 flex items-start gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <strong>Prescription Proof:</strong>
                            <p className="text-emerald-700">{appt.proof}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Status & Cancel Action */}
                    <div className="md:col-span-3 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3">
                      {/* Status Badges */}
                      {appt.status === 'pending' && (
                        <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase border border-amber-100">
                          Pending
                        </span>
                      )}
                      {appt.status === 'completed' && (
                        <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase border border-emerald-100">
                          Completed
                        </span>
                      )}
                      {appt.status === 'cancelled' && (
                        <span className="bg-rose-50 text-rose-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase border border-rose-100">
                          Cancelled
                        </span>
                      )}

                      {appt.status === 'pending' && (
                        <button
                          onClick={() => handleCancelAppointment(appt._id)}
                          className="p-1.5 rounded-lg border border-slate-100 hover:border-rose-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Cancel Booking"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Informative Side Card */}
        <div className="lg:col-span-4 space-y-6 text-left">
          <div className="bg-slate-900 text-white rounded-3xl p-6 relative overflow-hidden border border-slate-800 shadow-md">
            <h4 className="text-xs font-bold text-teal-300 uppercase tracking-wider mb-2">Telehealth Reminders</h4>
            <ul className="space-y-4 text-xs text-slate-300 mt-4 leading-relaxed font-body">
              <li className="flex gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Join virtual desk consults 5 minutes prior to scheduled slots.</span>
              </li>
              <li className="flex gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Keep medical record files ready. You can query clinical details with the AI bot.</span>
              </li>
              <li className="flex gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Proof documents (prescriptions/notes) will show directly on booking cards post completion.</span>
              </li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
};

export default PatientDashboard;
