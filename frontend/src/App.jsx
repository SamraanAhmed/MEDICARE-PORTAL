import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';

// Pages import
import Home from './pages/Home';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import BookAppointment from './pages/BookAppointment';
import Chat from './pages/Chat';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Landing page */}
            <Route path="/" element={<Home />} />
            
            {/* Lead generation and Contact */}
            <Route path="/contact" element={<Contact />} />
            
            {/* Login & Register Tabbed Interface */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Appointment Booking Flow */}
            <Route path="/book" element={<BookAppointment />} />
            
            {/* AI Assistant Messaging Desk */}
            <Route path="/chat" element={<Chat />} />
            
            {/* Dashboards */}
            <Route path="/dashboard/patient" element={<PatientDashboard />} />
            <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />

            {/* Catch-all fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;