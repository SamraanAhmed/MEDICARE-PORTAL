import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Calendar, User, CheckCircle2, Clock, XCircle, FileText, Stethoscope, Mail, ShieldAlert, Award } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [activeProofInput, setActiveProofInput] = useState(null); // ID of appointment being completed
  const [proofText, setProofText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    if (user) {
      loadDoctorData();
      setIsAvailable(user.available !== false);
    }
  }, [user]);

  useGSAP(() => {
    if (loading) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.doctor-header', { opacity: 0, y: -20, duration: 0.8 })
      .from('.doctor-availability-card', { opacity: 0, x: 30, duration: 0.6 }, '-=0.5')
      .from('.doctor-queue-column', { opacity: 0, x: -30, duration: 0.8 }, '-=0.4')
      .from('.doctor-sidebar-widget', { opacity: 0, x: 30, duration: 0.8 }, '-=0.8');
  }, { scope: containerRef, dependencies: [loading] });

  const loadDoctorData = async () => {
    setLoading(true);
    try {
      // Call endpoint that retrieves all pending doctor appointments populated with patient name
      const data = await api.getDoctorAppointments();
      
      // Filter appointments belonging to this doctor (if backend isn't filtering properly yet)
      const filtered = data.filter(appt => {
        const docId = appt.doctor?._id || appt.doctor;
        return docId === user._id && appt.status === 'pending';
      });
      setAppointments(filtered);
    } catch (e) {
      setErrorMsg('Failed to query appointment lists.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async () => {
    const nextVal = !isAvailable;
    try {
      // Update doctor availability in backend database
      await api.toggleDoctorAvailability(nextVal);
      setIsAvailable(nextVal);
      // Update Auth context user profile
      const updatedUser = { ...user, available: nextVal };
      localStorage.setItem('medicare_user', JSON.stringify(updatedUser));
    } catch (err) {
      console.warn("Failed to toggle availability status", err);
      alert(err.message || "Failed to update availability status on server.");
    }
  };

  const handleCompleteClick = (apptId) => {
    setActiveProofInput(apptId);
    setProofText('');
  };

  const handleCancelCompletion = () => {
    setActiveProofInput(null);
    setProofText('');
  };

  const handleSaveCompletion = async (apptId) => {
    if (!proofText.trim()) {
      alert("Please provide prescription notes as clinical proof of completion.");
      return;
    }

    try {
      // Call doctor appointment completion logic
      await api.completeAppointment(apptId, proofText);
      setActiveProofInput(null);
      setProofText('');
      
      // Reload lists
      loadDoctorData();
    } catch (err) {
      alert(err.message || "Failed to complete appointment entry.");
    }
  };

  const handleNoShowAppointment = async (apptId) => {
    if (window.confirm("Mark this patient as a No-Show (Cancelled)?")) {
      try {
        await api.cancelAppointment(apptId);
        loadDoctorData();
      } catch (err) {
        alert("Failed to update status");
      }
    }
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <p className="text-slate-500 text-sm">Please log in to view doctor portal.</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* 1. Header Profile Box */}
      <div className="doctor-header bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-teal-50/30 rounded-bl-full -z-10"></div>
        <div className="flex items-center gap-5">
          <img
            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=115E59&color=fff`}
            alt={user.name}
            className="w-20 h-20 rounded-full border-2 border-teal-800 object-cover shrink-0 shadow-sm"
          />
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-teal-950 font-heading">{user.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Stethoscope className="w-4 h-4 text-teal-850" />
                Speciality: <span className="capitalize font-semibold text-teal-800">{user.pillar} Division</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {user.email}
              </span>
            </div>
          </div>
        </div>

        {/* Live Availability Toggle Card */}
        <div className="doctor-availability-card p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-6">
          <div className="text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Desk Scheduling</p>
            <h4 className="text-sm font-bold text-slate-800 mt-0.5">Availability Status</h4>
          </div>
          <button
            onClick={handleToggleAvailability}
            className={`w-28 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
              isAvailable 
                ? 'bg-emerald-500 text-teal-950 hover:bg-emerald-600' 
                : 'bg-rose-500 text-white hover:bg-rose-600'
            }`}
          >
            {isAvailable ? 'Available' : 'Busy / Off'}
          </button>
        </div>
      </div>

      {/* 2. Main Grid: Appointments & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Appointments Queue */}
        <div className="doctor-queue-column lg:col-span-8 space-y-4 text-left">
          <h3 className="text-lg font-bold text-teal-950 font-heading pl-1">Consultation Waiting Queue</h3>
          
          {loading ? (
            <p className="text-slate-500 text-sm">Querying active schedules...</p>
          ) : appointments.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-4">
              <Calendar className="w-12 h-12 text-slate-200 mx-auto" />
              <p className="text-slate-500 text-sm font-body">No pending patients in your queue.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appt) => {
                const apptDate = new Date(appt.appointment_date).toLocaleDateString(undefined, {
                  weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                });
                
                const isCompleting = activeProofInput === appt._id;

                return (
                  <div
                    key={appt._id}
                    className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs hover:shadow-md transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      
                      {/* Patient Name */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-800 flex items-center justify-center font-bold">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-800">
                            {appt.patient?.name || (appt.patient === 'current_user' ? 'Registered Patient' : 'Clinical Member')}
                          </h4>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Date: {apptDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Initial Action Buttons */}
                      {!isCompleting && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCompleteClick(appt._id)}
                            className="px-4 py-2 bg-teal-850 hover:bg-teal-900 text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Complete Consult
                          </button>
                          <button
                            onClick={() => handleNoShowAppointment(appt._id)}
                            className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5 text-rose-500" />
                            No-Show
                          </button>
                        </div>
                      )}
                    </div>

                    {appt.notes && (
                      <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 leading-normal italic border-l-2 border-slate-350">
                        Patient Note: "{appt.notes}"
                      </div>
                    )}

                    {/* Completion input wrapper */}
                    {isCompleting && (
                      <div className="p-4 bg-teal-50/50 border border-teal-100 rounded-2xl space-y-3.5 animate-in slide-in-from-top-2 duration-200">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-teal-950 flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            Clinical Notes & Prescriptions (Proof)
                          </label>
                          <textarea
                            rows="3"
                            value={proofText}
                            onChange={(e) => setProofText(e.target.value)}
                            placeholder="Enter prescribed drugs, dosage details, diagnostics advice..."
                            className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-teal-700"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveCompletion(appt._id)}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-teal-950 font-extrabold rounded-xl text-xs cursor-pointer"
                          >
                            Submit Prescription Proof
                          </button>
                          <button
                            onClick={handleCancelCompletion}
                            className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Side Panel Guide */}
        <div className="doctor-sidebar-widget lg:col-span-4 space-y-6 text-left">
          <div className="bg-slate-900 text-white rounded-3xl p-6 relative overflow-hidden border border-slate-800 shadow-md">
            <h4 className="text-xs font-bold text-teal-300 uppercase tracking-wider mb-2">Physician Guidelines</h4>
            <ul className="space-y-4 text-xs text-slate-300 mt-4 leading-relaxed font-body">
              <li className="flex gap-2">
                <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Provide complete prescription names and usage schedules in the notes fields.</span>
              </li>
              <li className="flex gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Marking an appointment complete automatically clears availability tokens for your next slot.</span>
              </li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
};

export default DoctorDashboard;
