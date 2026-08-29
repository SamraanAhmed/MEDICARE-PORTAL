import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Calendar, Heart, ShieldCheck, Activity, Trash2, Clock, CheckCircle2, User, UserCheck, Eye, CreditCard, AlertCircle, X, Download, Printer } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  
  const [reportModal, setReportModal] = useState(null);
  const [activeTab, setActiveTab] = useState('appointments');
  
  // Payment states
  const [payingAppointment, setPayingAppointment] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState('');

  const fetchDashboardData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Fetch available services to map names locally
      const servicesList = await api.getAvailableServices();
      setServices(servicesList);

      // 2. Fetch appointments
      const list = await api.getPatientAppointments(user._id);

      // 3. Fetch payment info for each appointment in parallel
      const appointmentsWithPayments = await Promise.all(list.map(async (appt) => {
        try {
          const paymentInfo = await api.getAppointmentPayment(appt._id);
          return { ...appt, paymentInfo };
        } catch (err) {
          console.warn(`Failed to fetch payment for appointment ${appt._id}`, err);
          return { ...appt, paymentInfo: null };
        }
      }));

      setAppointments(appointmentsWithPayments);
    } catch (e) {
      console.error("Failed to load patient dashboard data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  useGSAP(() => {
    if (loading) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.dashboard-header', { opacity: 0, y: -25, duration: 0.8 })
      .from('.vitals-card', { opacity: 0, y: 20, stagger: 0.1, duration: 0.6 }, '-=0.5')
      .from('.appt-register', { opacity: 0, x: -30, duration: 0.8 }, '-=0.4')
      .from('.telehealth-reminders', { opacity: 0, x: 30, duration: 0.8 }, '-=0.8');
  }, { scope: containerRef, dependencies: [loading] });

  const handleCancelAppointment = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await api.cancelAppointment(id);
        await fetchDashboardData();
      } catch (err) {
        alert(err.message || "Failed to cancel appointment.");
      }
    }
  };

  const handleOpenPaymentModal = (appt) => {
    setPayingAppointment(appt);
    setTransactionId('');
    setPaymentError('');
    setPaymentSuccess('');
  };

  const handleClosePaymentModal = () => {
    setPayingAppointment(null);
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      setPaymentError('Please enter a valid Transaction ID.');
      return;
    }

    const paymentId = payingAppointment.paymentInfo?._id || payingAppointment.payment;
    if (!paymentId) {
      setPaymentError('Payment record not found for this appointment.');
      return;
    }

    setIsSubmittingPayment(true);
    setPaymentError('');
    setPaymentSuccess('');

    try {
      await api.payAppointment(paymentId, transactionId.trim());
      setPaymentSuccess('Payment completed successfully! Transaction logged.');
      
      // Refresh after a brief delay
      setTimeout(async () => {
        handleClosePaymentModal();
        await fetchDashboardData();
      }, 1500);
    } catch (err) {
      setPaymentError(err.message || 'Payment processing failed. Try again.');
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  // Download report as printable HTML file
  const handleDownloadReport = (appt) => {
    const doc = appt.doctor;
    const svc = typeof appt.service === 'object' ? appt.service : (services.find(s => s._id === appt.service) || {});
    const v = appt.vitals || {};
    const dateStr = new Date(appt.appointment_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const html = [
      '<!DOCTYPE html><html><head><title>MediCare Report</title>',
      '<style>',
      '* { margin: 0; padding: 0; box-sizing: border-box; }',
      'body { font-family: Segoe UI, Tahoma, sans-serif; padding: 48px; color: #1e293b; }',
      '.header { text-align: center; border-bottom: 3px solid #0f766e; padding-bottom: 24px; margin-bottom: 32px; }',
      '.header h1 { color: #0f766e; font-size: 28px; }',
      '.header p { color: #64748b; font-size: 13px; margin-top: 4px; }',
      '.section { margin-bottom: 28px; }',
      '.section h3 { color: #0f766e; font-size: 14px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 14px; text-transform: uppercase; letter-spacing: 1px; }',
      '.info-row { display: flex; gap: 8px; margin-bottom: 6px; font-size: 14px; }',
      '.info-row strong { min-width: 100px; color: #475569; }',
      '.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }',
      '.metric { background: #f8fafc; padding: 16px; border-radius: 10px; border: 1px solid #e2e8f0; }',
      '.metric label { font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }',
      '.metric p { font-size: 20px; font-weight: 800; margin-top: 6px; color: #0f172a; }',
      '.notes { background: #f0fdfa; padding: 20px; border-radius: 10px; border-left: 4px solid #0f766e; font-size: 14px; line-height: 1.7; white-space: pre-wrap; }',
      '.footer { text-align: center; margin-top: 48px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; }',
      '</style></head><body>',
      '<div class="header"><h1>MediCare</h1><p>Medical Consultation Report</p></div>',
      '<div class="section"><h3>Appointment Details</h3>',
      '<div class="info-row"><strong>Date:</strong><span>' + dateStr + '</span></div>',
      '<div class="info-row"><strong>Service:</strong><span>' + (svc.service_name || 'Consultation') + '</span></div>',
      '<div class="info-row"><strong>Doctor:</strong><span>' + (doc?.name || 'Specialist') + '</span></div>',
      '<div class="info-row"><strong>Division:</strong><span>' + ((doc?.pillar || 'general').charAt(0).toUpperCase() + (doc?.pillar || 'general').slice(1)) + '</span></div>',
      '</div>',
      '<div class="section"><h3>Clinical Notes</h3>',
      '<div class="notes">' + (appt.proof || 'No notes provided.') + '</div></div>',
      '<div class="section"><h3>Vitals Report</h3><div class="grid">',
      '<div class="metric"><label>Heart Rate</label><p>' + (v.heartRate || 'N/A') + '</p></div>',
      '<div class="metric"><label>Blood Pressure</label><p>' + (v.bloodPressure || 'N/A') + '</p></div>',
      '<div class="metric"><label>Sleep Cycles</label><p>' + (v.sleepCycles || 'N/A') + '</p></div>',
      '<div class="metric"><label>Blood Glucose</label><p>' + (v.bloodGlucose || 'N/A') + '</p></div>',
      '</div></div>',
      '<div class="footer"><p>Generated by MediCare Portal on ' + new Date().toLocaleString() + '</p></div>',
      '</body></html>'
    ].join('\n');
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MediCare_Report_' + new Date(appt.appointment_date).toISOString().split('T')[0] + '.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Auto-compute vitals from the latest completed appointment report
  const getHealthMetrics = () => {
    const completedWithVitals = appointments.filter(a => a.status === 'completed' && a.vitals);
    const latestReport = completedWithVitals.length > 0 ? completedWithVitals[completedWithVitals.length - 1] : null;
    if (latestReport && latestReport.vitals) {
      const v = latestReport.vitals;
      return [
        { label: 'Heart Rate', value: v.heartRate && v.heartRate !== 'N/A' ? v.heartRate : 'N/A', status: 'Reported', color: 'text-rose-500 bg-rose-50 border-rose-100', change: `Latest from Dr. ${latestReport.doctor?.name || 'Specialist'}` },
        { label: 'Blood Pressure', value: v.bloodPressure && v.bloodPressure !== 'N/A' ? v.bloodPressure : 'N/A', status: 'Reported', color: 'text-teal-500 bg-teal-50 border-teal-100', change: 'From latest checkup' },
        { label: 'Sleep Cycles', value: v.sleepCycles && v.sleepCycles !== 'N/A' ? v.sleepCycles : 'N/A', status: 'Reported', color: 'text-indigo-500 bg-indigo-50 border-indigo-100', change: 'Recorded duration' },
        { label: 'Blood Glucose', value: v.bloodGlucose && v.bloodGlucose !== 'N/A' ? v.bloodGlucose : 'N/A', status: 'Reported', color: 'text-amber-500 bg-amber-50 border-amber-100', change: 'Glucose screening' }
      ];
    }
    return [
      { label: 'Heart Rate', value: '72 bpm', status: 'Optimal', color: 'text-rose-500 bg-rose-50 border-rose-100', change: 'Normal resting rate' },
      { label: 'Blood Pressure', value: '118/79 mmHg', status: 'Normal', color: 'text-teal-500 bg-teal-50 border-teal-100', change: 'Sys/Dias standard' },
      { label: 'Sleep Cycles', value: '7.8 hrs', status: 'Restful', color: 'text-indigo-500 bg-indigo-50 border-indigo-100', change: 'Avg 82% deep sleep' },
      { label: 'Blood Glucose', value: '94 mg/dL', status: 'Fasting', color: 'text-amber-500 bg-amber-50 border-amber-100', change: 'Pre-meal reading' }
    ];
  };

  const healthMetrics = getHealthMetrics();

  // Computed values for report modal
  const reportDoc = reportModal?.doctor;
  const reportSvc = reportModal ? (typeof reportModal.service === 'object' ? reportModal.service : (services.find(s => s._id === reportModal.service) || {})) : {};
  const reportVitals = reportModal?.vitals || {};

  const filteredAppointments = appointments.filter(appt => {
    if (activeTab === 'appointments') {
      return appt.status === 'pending' || appt.status === 'cancelled';
    } else {
      return appt.status === 'completed';
    }
  });

  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <p className="text-slate-500 text-sm">Please log in to view patient dashboard.</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Upper Dashboard Header: User Info */}
      <div className="dashboard-header bg-black text-white rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 text-left relative overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-52 h-52 bg-teal-800/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute -bottom-10 -left-10 w-52 h-52 bg-teal-950/20 rounded-full blur-3xl -z-10"></div>
        <div className="flex items-center gap-5">
          <img
            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=115E59&color=fff`}
            alt={user.name}
            className="w-20 h-20 rounded-full border-2 border-teal-500 object-cover shrink-0 shadow-sm"
          />
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-teal-100 font-heading">Welcome, {user.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4 text-teal-400" />
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
            className="px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md text-sm transition-all cursor-pointer"
          >
            New Consultation
          </Link>
          <Link
            to="/chat"
            onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent('open-chatbot'));
            }}
            className="px-6 py-3.5 bg-slate-900 hover:bg-slate-850 text-slate-100 border border-slate-800 font-bold rounded-xl text-sm transition-all cursor-pointer"
          >
            Chat Advisor
          </Link>
        </div>
      </div>


      {/* Health Vitals Summary Row */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-teal-950 font-heading text-left pl-1">Vitals Summary Row</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {healthMetrics.map((metric, i) => (
            <div
              key={i}
              className="vitals-card bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col gap-2 text-left"
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

      {/* Bottom: Appointments History */}
      <div className="appt-register bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 text-left min-h-[500px]">
          
          {/* Tabs header */}
          <div className="flex gap-4 border-b border-slate-100 pb-2">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`pb-2 px-1 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'appointments'
                  ? 'border-teal-800 text-teal-850'
                  : 'border-transparent text-slate-400 hover:text-slate-650'
              }`}
            >
              Appointment Register
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`pb-2 px-1 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'reports'
                  ? 'border-teal-800 text-teal-850'
                  : 'border-transparent text-slate-400 hover:text-slate-650'
              }`}
            >
              Medical Reports
            </button>
          </div>
          
          {loading ? (
            <p className="text-slate-500 text-sm">Querying schedules...</p>
          ) : filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-10 text-center space-y-4">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-slate-500 text-sm">
                {activeTab === 'appointments' 
                  ? 'You do not have any pending or cancelled appointments.' 
                  : 'You do not have any completed medical reports yet.'
                }
              </p>
              {activeTab === 'appointments' && (
                <Link to="/book" className="text-sm font-bold text-teal-850 hover:underline inline-block">
                  Schedule your first checkup →
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appt) => {
                const dateStr = new Date(appt.appointment_date).toLocaleDateString(undefined, {
                  weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                });
                
                // Map service details in case they are not populated from API
                const serviceObj = typeof appt.service === 'object' ? appt.service : (services.find(s => s._id === appt.service) || {});
                
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
                        <h4 className="text-sm font-bold text-slate-805 leading-tight">{appt.doctor?.name || 'Dr. Assigned Speciality'}</h4>
                        <span className="text-[10px] text-teal-800 font-semibold capitalize mt-0.5 inline-block">
                          {appt.doctor?.pillar} Division
                        </span>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="md:col-span-5 space-y-1">
                      <p className="text-xs font-bold text-slate-700 font-body">{serviceObj?.service_name || 'Standard Consultation'}</p>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Date: {dateStr}</span>
                      </div>
                      {appt.notes && (
                        <p className="text-[10px] text-slate-400 italic truncate max-w-xs mt-1">"Notes: {appt.notes}"</p>
                      )}
                      
                      {/* Payment info visual badge */}
                      {appt.paymentInfo && (
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                            appt.paymentInfo.paid 
                              ? 'bg-teal-50 text-teal-850 border-teal-100' 
                              : 'bg-amber-50 text-amber-800 border-amber-100'
                          }`}>
                            {appt.paymentInfo.paid 
                              ? `Paid via Txn: ${appt.paymentInfo.transcation || 'Offline'}` 
                              : `Unpaid: $${appt.paymentInfo.charges}`
                            }
                          </span>
                        </div>
                      )}
                      
                      {/* Prescriptions / proof display */}
                      {appt.status === 'completed' && appt.proof && (
                        <div className="mt-2 p-2 bg-teal-50 border border-teal-105 rounded-lg text-[10px] text-teal-850 flex items-start gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                          <div>
                            <strong>Prescription Proof:</strong>
                            <p className="text-teal-700">{appt.proof}</p>
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
                        <span className="bg-teal-50 text-teal-850 text-[10px] font-bold px-3 py-1 rounded-full uppercase border border-teal-100">
                          Completed
                        </span>
                      )}
                      {appt.status === 'cancelled' && (
                        <span className="bg-rose-50 text-rose-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase border border-rose-100">
                          Cancelled
                        </span>
                      )}

                      <div className="flex gap-2">
                        {appt.status === 'completed' && (
                          <button
                            onClick={() => setReportModal(appt)}
                            className="px-2.5 py-1 bg-teal-850 hover:bg-teal-900 text-white font-bold rounded-lg text-[10px] flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Check Report
                          </button>
                        )}

                        {appt.status === 'pending' && appt.paymentInfo && !appt.paymentInfo.paid && (
                          <button
                            onClick={() => handleOpenPaymentModal(appt)}
                            className="px-2.5 py-1 bg-teal-850 hover:bg-teal-900 text-white font-bold rounded-lg text-[10px] flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            Pay Now
                          </button>
                        )}

                        {appt.status === 'pending' && (
                          <button
                            onClick={() => handleCancelAppointment(appt._id)}
                            className="p-1 rounded-lg border border-slate-100 hover:border-rose-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Cancel Booking"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>


      {/* Payment Modal Overlay */}
      {payingAppointment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-2xl max-w-md w-full space-y-6 text-left relative animate-in zoom-in-95 duration-250">
            <button
              onClick={handleClosePaymentModal}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-800 font-heading">Consultation Payment</h3>
              <p className="text-xs text-slate-400">Complete payment to enable practitioner review and checkup completion.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Specialist:</span>
                <span className="font-semibold text-slate-800">{payingAppointment.doctor?.name || 'Assigned Specialist'}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Medical Specialty:</span>
                <span className="font-semibold text-slate-800 capitalize">{payingAppointment.doctor?.pillar || 'Consultation'}</span>
              </div>
              <hr className="border-slate-200" />
              <div className="flex justify-between text-sm font-bold">
                <span className="text-slate-800">Total Charges:</span>
                <span className="text-teal-850">${payingAppointment.paymentInfo?.charges || 100}</span>
              </div>
            </div>

            {paymentError && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4.5 h-4.5 text-rose-500 shrink-0" />
                <p className="font-semibold">{paymentError}</p>
              </div>
            )}

            {paymentSuccess && (
              <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl text-teal-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-teal-600 shrink-0" />
                <p className="font-semibold">{paymentSuccess}</p>
              </div>
            )}

            <form onSubmit={handleProcessPayment} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Transaction / Reference ID</label>
                <input
                  type="text"
                  placeholder="e.g. TXN987654321"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-700"
                  disabled={isSubmittingPayment || paymentSuccess}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClosePaymentModal}
                  className="flex-1 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  disabled={isSubmittingPayment || paymentSuccess}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPayment || paymentSuccess}
                  className="flex-1 py-3 bg-teal-850 hover:bg-teal-900 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md disabled:bg-slate-200"
                >
                  {isSubmittingPayment ? 'Processing...' : 'Confirm Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Medical Report Detail Modal */}
      {reportModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-2xl max-w-lg w-full space-y-6 text-left relative animate-in zoom-in-95 duration-250 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setReportModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-800 font-heading">Medical Report</h3>
              <p className="text-xs text-slate-400">Consultation completed on {new Date(reportModal.appointment_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>

            {/* Doctor & Service Info */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex items-center gap-3">
                <img src={reportDoc?.avatar || 'https://ui-avatars.com/api/?name=Dr+Staff'} alt={reportDoc?.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{reportDoc?.name || 'Assigned Specialist'}</h4>
                  <p className="text-[10px] text-teal-800 font-semibold capitalize">{reportDoc?.pillar || 'General'} Division</p>
                </div>
              </div>
              <div className="flex justify-between text-xs text-slate-500 pt-1">
                <span>Service:</span>
                <span className="font-semibold text-slate-800">{reportSvc?.service_name || 'Consultation'}</span>
              </div>
            </div>

            {/* Clinical Notes */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-teal-950 uppercase tracking-widest">Clinical Notes & Prescriptions</h4>
              <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100 border-l-4 border-l-teal-800 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-body">
                {reportModal.proof || 'No clinical notes provided.'}
              </div>
            </div>

            {/* Vitals Grid */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-teal-950 uppercase tracking-widest">Vitals Report</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-rose-50 p-3 rounded-xl border border-rose-100">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Heart Rate</span>
                  <p className="text-lg font-black text-slate-800 mt-1">{reportVitals.heartRate || 'N/A'}</p>
                </div>
                <div className="bg-teal-50 p-3 rounded-xl border border-teal-100">
                  <span className="text-[10px] font-bold text-teal-500 uppercase tracking-wider">Blood Pressure</span>
                  <p className="text-lg font-black text-slate-800 mt-1">{reportVitals.bloodPressure || 'N/A'}</p>
                </div>
                <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Sleep Cycles</span>
                  <p className="text-lg font-black text-slate-800 mt-1">{reportVitals.sleepCycles || 'N/A'}</p>
                </div>
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Blood Glucose</span>
                  <p className="text-lg font-black text-slate-800 mt-1">{reportVitals.bloodGlucose || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Download & Print Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleDownloadReport(reportModal)}
                className="flex-1 py-3 bg-teal-850 hover:bg-teal-900 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
              >
                <Download className="w-4 h-4" />
                Download Report
              </button>
              <button
                onClick={() => { window.print(); }}
                className="flex-1 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PatientDashboard;
