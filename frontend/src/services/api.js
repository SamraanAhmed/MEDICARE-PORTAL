import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial for HTTP-only cookies
});

// Response interceptor for clean errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK' || !error.response) {
      return Promise.reject(new Error('The backend server is offline or unreachable. Please start the backend by running "node index.js" in the backend directory.'));
    }
    const message = error.response?.data?.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// Initial Static Data for Local Storage Fallbacks
const DEFAULT_SERVICES = [
  { _id: '64d1f2b5a1b2c3d4e5f60001', service_name: 'Cardiology Consultation', pillar: 'cardiology', available: true },
  { _id: '64d1f2b5a1b2c3d4e5f60002', service_name: 'Dermatological Screening', pillar: 'dermatology', available: true },
  { _id: '64d1f2b5a1b2c3d4e5f60003', service_name: 'Joint & Bone Therapy', pillar: 'orthopedics', available: true },
  { _id: '64d1f2b5a1b2c3d4e5f60004', service_name: 'Full Body Diagnostic Lab', pillar: 'diagnostics', available: true },
  { _id: '64d1f2b5a1b2c3d4e5f60005', service_name: '24/7 Virtual Consultation', pillar: 'telehealth', available: true },
  { _id: '64d1f2b5a1b2c3d4e5f60006', service_name: 'General Wellness Checkup', pillar: 'general', available: true },
];

const DEFAULT_DOCTORS = [
  { _id: '64d1f2b5a1b2c3d4e5f60011', name: 'Dr. Sarah Jenkins', email: 'sarah.j@medicare.com', pillar: 'cardiology', gender: 'female', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250' },
  { _id: '64d1f2b5a1b2c3d4e5f60012', name: 'Dr. Robert Chen', email: 'robert.c@medicare.com', pillar: 'dermatology', gender: 'male', avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250' },
  { _id: '64d1f2b5a1b2c3d4e5f60013', name: 'Dr. Elena Rostova', email: 'elena.r@medicare.com', pillar: 'orthopedics', gender: 'female', avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=250' },
  { _id: '64d1f2b5a1b2c3d4e5f60014', name: 'Dr. Marcus Vance', email: 'marcus.v@medicare.com', pillar: 'diagnostics', gender: 'male', avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=250' },
  { _id: '64d1f2b5a1b2c3d4e5f60015', name: 'Dr. Aisha Rahman', email: 'aisha.r@medicare.com', pillar: 'telehealth', gender: 'female', avatar: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=250' },
  { _id: '64d1f2b5a1b2c3d4e5f60016', name: 'Dr. Alan Mercer', email: 'alan.m@medicare.com', pillar: 'general', gender: 'male', avatar: 'https://images.unsplash.com/photo-1582750433449-64c676996edb?auto=format&fit=crop&q=80&w=250' },
];

// Helper to initialize local storage
const initLocalStorage = () => {
  if (!localStorage.getItem('medicare_services')) {
    localStorage.setItem('medicare_services', JSON.stringify(DEFAULT_SERVICES));
  }
  if (!localStorage.getItem('medicare_doctors')) {
    localStorage.setItem('medicare_doctors', JSON.stringify(DEFAULT_DOCTORS));
  }
  if (!localStorage.getItem('medicare_appointments')) {
    localStorage.setItem('medicare_appointments', JSON.stringify([]));
  }
  if (!localStorage.getItem('medicare_messages')) {
    localStorage.setItem('medicare_messages', JSON.stringify([]));
  }
};
initLocalStorage();

export const api = {
  // --- AUTH ENDPOINTS ---
  registerUser: async (name, email, password, gender) => {
    const response = await apiClient.post('/database/register/user', { name, email, password, gender });
    return response.data;
  },

  registerDoctor: async (name, email, password, gender, pillar) => {
    const response = await apiClient.post('/database/register/doctor', { name, email, password, gender, pillar });
    
    // Add registered doctor to local listing so they are selectable in appointment flow
    const localDocs = JSON.parse(localStorage.getItem('medicare_doctors') || '[]');
    const newDoc = {
      _id: response.data._id,
      name: response.data.name || name,
      email: response.data.email || email,
      pillar: response.data.pillar || pillar,
      gender: response.data.gender || gender,
      avatar: response.data.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=115E59&color=fff`,
    };
    localDocs.push(newDoc);
    localStorage.setItem('medicare_doctors', JSON.stringify(localDocs));

    return response.data;
  },

  registerAdmin: async (name, email, password) => {
    const response = await apiClient.post('/database/register/admin', { name, email, password });
    return response.data;
  },

  loginUser: async (email, password) => {
    const response = await apiClient.post('/database/login/user', { email, password });
    return response.data;
  },

  loginDoctor: async (email, password) => {
    const response = await apiClient.post('/database/login/doctor', { email, password });
    return response.data;
  },

  loginAdmin: async (email, password) => {
    const response = await apiClient.post('/database/login/admin', { email, password });
    return response.data;
  },

  // --- CONTACT INQUIRY ENDPOINTS ---
  createContactForm: async (name, email, subject, message) => {
    const response = await apiClient.post('/database/create/contact/form', { name, email, subject, message });
    return response.data;
  },

  getAllContactForms: async () => {
    const response = await apiClient.get('/database/get/all/contact/form');
    return response.data;
  },

  getContactFormDetail: async (form_id) => {
    const response = await apiClient.get(`/database/get/contact/form?form_id=${form_id}`);
    return response.data;
  },

  markContactFormSeen: async (form_id) => {
    const response = await apiClient.post('/database/contact/form/marked/seen', { form_id });
    return response.data;
  },

  deleteContactForm: async (form_id) => {
    const response = await apiClient.post('/database/contact/form/delete', { form_id });
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.get('/database/logout');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/database/me');
    return response.data;
  },

  // --- SERVICE ENDPOINTS (ADMIN) ---
  createService: async (service_name, pillar, charges) => {
    // Call backend endpoint to persist in DB
    const response = await apiClient.post('/database/create/service', { service_name, pillar, charges: Number(charges || 100) });
    
    // Cache service locally so patients can book it immediately
    const services = JSON.parse(localStorage.getItem('medicare_services') || '[]');
    const newService = {
      _id: response.data?._id || `s_${Date.now()}`,
      service_name,
      pillar,
      available: true,
      charges: Number(charges || 100)
    };
    services.push(newService);
    localStorage.setItem('medicare_services', JSON.stringify(services));

    return response.data || newService;
  },

  getAvailableServices: async () => {
    try {
      const response = await apiClient.get('/database/service/all');
      localStorage.setItem('medicare_services', JSON.stringify(response.data));
      return response.data;
    } catch (e) {
      console.warn("getAvailableServices failed:", e.message);
      return JSON.parse(localStorage.getItem('medicare_services') || '[]');
    }
  },

  toggleServiceAvailability: async (service_id, available) => {
    try {
      const response = await apiClient.post('/database/service/update', { service_id, available });
      const listRes = await apiClient.get('/database/service/all');
      localStorage.setItem('medicare_services', JSON.stringify(listRes.data));
      return listRes.data;
    } catch (e) {
      console.warn("toggleServiceAvailability failed:", e.message);
      const services = JSON.parse(localStorage.getItem('medicare_services') || '[]');
      const updated = services.map(s => s._id === service_id ? { ...s, available } : s);
      localStorage.setItem('medicare_services', JSON.stringify(updated));
      return updated;
    }
  },

  toggleDoctorAvailability: async (available) => {
    try {
      const response = await apiClient.post('/database/doctor/availability', { available });
      return response.data;
    } catch (e) {
      console.warn("toggleDoctorAvailability failed, using fallback:", e.message);
      const user = JSON.parse(localStorage.getItem('medicare_user') || '{}');
      const updated = { ...user, available };
      localStorage.setItem('medicare_user', JSON.stringify(updated));
      return { success: true, fallback: true };
    }
  },

  // --- APPOINTMENT ENDPOINTS ---
  createAppointment: async (service_id, date, note) => {
    // 1. Call real backend database endpoint
    const response = await apiClient.post('/database/create/appointment', { service_id, date, note });
    
    // 2. Resolve doctor and service details to save rich history in local storage
    const services = JSON.parse(localStorage.getItem('medicare_services') || '[]');
    const doctors = JSON.parse(localStorage.getItem('medicare_doctors') || '[]');
    
    const activeService = services.find(s => s._id === service_id);
    const assignedDoctor = doctors.find(d => d.pillar === activeService?.pillar) || doctors[0];

    const localAppointments = JSON.parse(localStorage.getItem('medicare_appointments') || '[]');
    const newAppointment = {
      _id: response.data?._id || `appt_${Date.now()}`,
      patient: response.data?.patient || 'current_user',
      doctor: assignedDoctor,
      service: activeService,
      status: 'pending',
      appointment_date: date,
      notes: note,
    };
    localAppointments.push(newAppointment);
    localStorage.setItem('medicare_appointments', JSON.stringify(localAppointments));

    // Attach the backend-assigned doctor ID so the caller can fetch real doctor details
    const result = response.data || newAppointment;
    result._backendDoctorId = response.data?.doctor || null;
    return result;
  },

  getPatientAppointments: async (patientId) => {
    try {
      const response = await apiClient.get('/database/appointment/all/user');
      return response.data;
    } catch (e) {
      console.warn("getPatientAppointments failed:", e.message);
      return JSON.parse(localStorage.getItem('medicare_appointments') || '[]');
    }
  },

  getDoctorAppointments: async () => {
    try {
      const response = await apiClient.get('/database/appointment/all/doctor');
      return response.data;
    } catch (e) {
      // Fallback: search appointments in local storage belonging to the doctor
      const appointments = JSON.parse(localStorage.getItem('medicare_appointments') || '[]');
      return appointments;
    }
  },

  completeAppointment: async (appointment_id, proof, vitals) => {
    try {
      const response = await apiClient.post('/database/appointment/mark/complete', { appointment_id, proof, vitals });
      return response.data;
    } catch (e) {
      console.warn("completeAppointment failed:", e.message);
      const appointments = JSON.parse(localStorage.getItem('medicare_appointments') || '[]');
      const updated = appointments.map(app => 
        app._id === appointment_id ? { ...app, status: 'completed', proof, vitals } : app
      );
      localStorage.setItem('medicare_appointments', JSON.stringify(updated));
      return updated;
    }
  },

  cancelAppointment: async (appointment_id) => {
    try {
      const response = await apiClient.post('/database/appointment/mark/cancel', { appointment_id });
      return response.data;
    } catch (e) {
      console.warn("cancelAppointment failed:", e.message);
      const appointments = JSON.parse(localStorage.getItem('medicare_appointments') || '[]');
      const updated = appointments.map(app => 
        app._id === appointment_id ? { ...app, status: 'cancelled' } : app
      );
      localStorage.setItem('medicare_appointments', JSON.stringify(updated));
      return updated;
    }
  },

  // --- TELEHEALTH & AI CHAT BOT ---
  askChatbot: async (message) => {
    const response = await apiClient.post('/chatbot/ask', { message });
    
    // Save to local chat history
    const history = JSON.parse(localStorage.getItem('medicare_messages') || '[]');
    history.push({ sender: 'user', content: message, created_at: new Date() });
    history.push({ sender: 'bot', content: response.data.message, created_at: new Date() });
    localStorage.setItem('medicare_messages', JSON.stringify(history));

    return response.data.message;
  },

  getChatHistory: async () => {
    try {
      const response = await apiClient.get('/database/chat/all');
      localStorage.setItem('medicare_messages', JSON.stringify(response.data));
      return response.data;
    } catch (e) {
      console.warn("getChatHistory failed, using local fallback:", e.message);
      return JSON.parse(localStorage.getItem('medicare_messages') || '[]');
    }
  },

  sendDirectMessage: (sender, content) => {
    const history = JSON.parse(localStorage.getItem('medicare_messages') || '[]');
    const newMsg = { sender, content, created_at: new Date() };
    history.push(newMsg);
    localStorage.setItem('medicare_messages', JSON.stringify(history));
    return newMsg;
  },

  getDoctors: () => {
    return JSON.parse(localStorage.getItem('medicare_doctors') || '[]');
  },

  getDoctorById: async (doctorId) => {
    try {
      const response = await apiClient.get(`/database/get/doctor/${doctorId}`);
      return response.data;
    } catch (e) {
      console.warn('getDoctorById failed, using local fallback:', e.message);
      const doctors = JSON.parse(localStorage.getItem('medicare_doctors') || '[]');
      return doctors.find(d => d._id === doctorId) || null;
    }
  },

  // --- NEW PAYMENT & BILLING ENDPOINTS ---
  payAppointment: async (payment_id, transaction_id) => {
    try {
      const response = await apiClient.post('/database/appointment/pay', {
        payment_id,
        transcation_id: transaction_id // Match backend typo "transcation_id"
      });
      return response.data;
    } catch (e) {
      console.warn("payAppointment API failed, using fallback:", e.message);
      // Fallback: update local storage appointments payment
      const appointments = JSON.parse(localStorage.getItem('medicare_appointments') || '[]');
      const updated = appointments.map(appt => {
        if (appt.payment && appt.payment._id === payment_id) {
          return {
            ...appt,
            payment: {
              ...appt.payment,
              paid: true,
              transcation: transaction_id,
              paid_at: new Date()
            }
          };
        }
        // In some cases appointment.payment might just be a string ID or nested differently
        if (appt._id === payment_id || (appt.payment && typeof appt.payment === 'object' && appt.payment._id === payment_id)) {
          return {
            ...appt,
            payment: {
              ...appt.payment,
              paid: true,
              transcation: transaction_id,
              paid_at: new Date()
            }
          };
        }
        return appt;
      });
      localStorage.setItem('medicare_appointments', JSON.stringify(updated));
      return { payment_id, success: true, fallback: true };
    }
  },

  getAppointmentPayment: async (appointment_id) => {
    try {
      const response = await apiClient.post('/database/appointment/payment', { appointment_id });
      return response.data;
    } catch (e) {
      console.warn("getAppointmentPayment API failed, using fallback:", e.message);
      const appointments = JSON.parse(localStorage.getItem('medicare_appointments') || '[]');
      const appt = appointments.find(a => a._id === appointment_id);
      if (appt && appt.payment) {
        return appt.payment;
      }
      // If payment details not initialized, create mock details based on service charges
      const charges = appt?.service?.charges || 100;
      return {
        _id: `pay_${appointment_id}`,
        charges: Number(charges),
        paid: false,
        transcation: ""
      };
    }
  },

  // --- NEW ADMIN LISTING & DELETION ENDPOINTS ---
  getAllUsers: async () => {
    try {
      const response = await apiClient.get('/database/get/user/all');
      return response.data;
    } catch (e) {
      console.warn("getAllUsers API failed, using fallback:", e.message);
      return [];
    }
  },

  getAllDoctors: async () => {
    try {
      const response = await apiClient.get('/database/get/doctor/all');
      return response.data;
    } catch (e) {
      console.warn("getAllDoctors API failed, using fallback:", e.message);
      return JSON.parse(localStorage.getItem('medicare_doctors') || '[]');
    }
  },

  getAllAppointmentsAdmin: async () => {
    try {
      const response = await apiClient.get('/database/get/appointment/all');
      return response.data;
    } catch (e) {
      console.warn("getAllAppointmentsAdmin API failed, using fallback:", e.message);
      return JSON.parse(localStorage.getItem('medicare_appointments') || '[]');
    }
  },

  deleteUser: async (user_id) => {
    const response = await apiClient.post('/database/delete/user', { user_id });
    return response.data;
  },

  deleteDoctor: async (doctor_id) => {
    const response = await apiClient.post('/database/delete/doctor', { doctor_id });
    
    // Remove doctor from local storage list as well
    const doctors = JSON.parse(localStorage.getItem('medicare_doctors') || '[]');
    const filtered = doctors.filter(d => d._id !== doctor_id);
    localStorage.setItem('medicare_doctors', JSON.stringify(filtered));

    return response.data;
  },

  deleteAdmin: async (admin_id) => {
    const response = await apiClient.post('/database/delete/admin', { admin_id });
    return response.data;
  }
};
export default api;
