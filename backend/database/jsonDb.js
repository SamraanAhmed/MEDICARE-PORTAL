const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const DB_PATH = path.join(__dirname, '..', 'db.json');

const DEFAULT_SERVICES = [
  { _id: '64d1f2b5a1b2c3d4e5f60001', service_name: 'Cardiology Consultation', pillar: 'cardiology', available: true, charges: 150 },
  { _id: '64d1f2b5a1b2c3d4e5f60002', service_name: 'Dermatological Screening', pillar: 'dermatology', available: true, charges: 120 },
  { _id: '64d1f2b5a1b2c3d4e5f60003', service_name: 'Joint & Bone Therapy', pillar: 'orthopedics', available: true, charges: 100 },
  { _id: '64d1f2b5a1b2c3d4e5f60004', service_name: 'Full Body Diagnostic Lab', pillar: 'diagnostics', available: true, charges: 200 },
  { _id: '64d1f2b5a1b2c3d4e5f60005', service_name: '24/7 Virtual Consultation', pillar: 'telehealth', available: true, charges: 80 },
  { _id: '64d1f2b5a1b2c3d4e5f60006', service_name: 'General Wellness Checkup', pillar: 'general', available: true, charges: 50 },
];

const DEFAULT_DOCTORS = [
  { _id: '64d1f2b5a1b2c3d4e5f60011', name: 'Dr. Sarah Jenkins', email: 'sarah.j@medicare.com', pillar: 'cardiology', gender: 'female', available: true },
  { _id: '64d1f2b5a1b2c3d4e5f60012', name: 'Dr. Robert Chen', email: 'robert.c@medicare.com', pillar: 'dermatology', gender: 'male', available: true },
  { _id: '64d1f2b5a1b2c3d4e5f60013', name: 'Dr. Elena Rostova', email: 'elena.r@medicare.com', pillar: 'orthopedics', gender: 'female', available: true },
  { _id: '64d1f2b5a1b2c3d4e5f60014', name: 'Dr. Marcus Vance', email: 'marcus.v@medicare.com', pillar: 'diagnostics', gender: 'male', available: true },
  { _id: '64d1f2b5a1b2c3d4e5f60015', name: 'Dr. Aisha Rahman', email: 'aisha.r@medicare.com', pillar: 'telehealth', gender: 'female', available: true },
  { _id: '64d1f2b5a1b2c3d4e5f60016', name: 'Dr. Alan Mercer', email: 'alan.m@medicare.com', pillar: 'general', gender: 'male', available: true },
];

function readDb() {
  if (!fs.existsSync(DB_PATH)) {
    const defaultHash = bcrypt.hashSync('password123', 10);
    const doctors = DEFAULT_DOCTORS.map(doc => ({ ...doc, password: defaultHash, role: 'doctor' }));
    
    // Add a default admin too for convenience
    const admins = [{
      _id: '64d1f2b5a1b2c3d4e5f60021',
      name: 'System Administrator',
      email: 'admin@medicare.com',
      password: defaultHash,
      role: 'admin'
    }];

    const initialDb = {
      users: [],
      doctors,
      admins,
      services: DEFAULT_SERVICES,
      appointments: [],
      payments: [],
      messages: []
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// Generate MongoDB-like ObjectIDs
function generateId() {
  return Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

// Helpers to simulate mongoose document conversion
function toObject(doc) {
  if (!doc) return doc;
  return {
    ...doc,
    toObject: function() {
      const obj = { ...this };
      delete obj.toObject;
      return obj;
    }
  };
}

const jsonDb = {
  createUser: async (name, email, password, gender) => {
    const db = readDb();
    if (db.users.some(u => u.email === email)) {
      throw new Error('Email already registered');
    }
    const hash = await bcrypt.hash(password, 10);
    const newUser = {
      _id: generateId(),
      name,
      email,
      password: hash,
      gender: gender || 'not-specified',
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    writeDb(db);
    return toObject(newUser);
  },

  loginUser: async (email, password) => {
    const db = readDb();
    const user = db.users.find(u => u.email === email);
    if (!user) throw new Error('Incorrect Email');
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Incorrect Password');
    return toObject(user);
  },

  createDoctor: async (name, email, password, gender, pillar) => {
    const db = readDb();
    if (db.doctors.some(d => d.email === email)) {
      throw new Error('Doctor email already registered');
    }
    const hash = await bcrypt.hash(password, 10);
    const newDoc = {
      _id: generateId(),
      name,
      email,
      password: hash,
      gender: gender || 'not-specified',
      pillar,
      available: true,
      role: 'doctor',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.doctors.push(newDoc);
    writeDb(db);
    return toObject(newDoc);
  },

  loginDoctor: async (email, password) => {
    const db = readDb();
    const doc = db.doctors.find(d => d.email === email);
    if (!doc) throw new Error('Incorrect Email');
    const match = await bcrypt.compare(password, doc.password);
    if (!match) throw new Error('Incorrect Password');
    return toObject(doc);
  },

  createAdmin: async (name, email, password) => {
    const db = readDb();
    if (db.admins.some(a => a.email === email)) {
      throw new Error('Admin email already registered');
    }
    const hash = await bcrypt.hash(password, 10);
    const newAdmin = {
      _id: generateId(),
      name,
      email,
      password: hash,
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.admins.push(newAdmin);
    writeDb(db);
    return toObject(newAdmin);
  },

  loginAdmin: async (email, password) => {
    const db = readDb();
    const adminObj = db.admins.find(a => a.email === email);
    if (!adminObj) throw new Error('Incorrect Email');
    const match = await bcrypt.compare(password, adminObj.password);
    if (!match) throw new Error('Incorrect Password');
    return toObject(adminObj);
  },

  getdoctor: async (id) => {
    const db = readDb();
    const doc = db.doctors.find(d => d._id === id);
    return toObject(doc);
  },

  getUserProfile: async (id, role) => {
    const db = readDb();
    let profile;
    if (role === 'user') {
      profile = db.users.find(u => u._id === id);
    } else if (role === 'doctor') {
      profile = db.doctors.find(d => d._id === id);
    } else if (role === 'admin') {
      profile = db.admins.find(a => a._id === id);
    }
    if (!profile) return null;
    const result = { ...profile };
    delete result.password;
    return toObject(result);
  },

  getPillarByService: async (service_id) => {
    const db = readDb();
    const svc = db.services.find(s => s._id === service_id);
    return toObject(svc);
  },

  getAllServices: async () => {
    const db = readDb();
    return db.services;
  },

  getAllUser: async () => {
    const db = readDb();
    return db.users;
  },

  getAllDoctor: async () => {
    const db = readDb();
    return db.doctors;
  },

  getAllAppointment: async () => {
    const db = readDb();
    return db.appointments.map(appt => {
      const patient = db.users.find(u => u._id === appt.patient) || { _id: appt.patient, name: 'Patient' };
      const doctor = db.doctors.find(d => d._id === appt.doctor) || { _id: appt.doctor, name: 'Doctor' };
      const service = db.services.find(s => s._id === appt.service) || { _id: appt.service, service_name: 'Consultation' };
      const payment = db.payments.find(p => p._id === appt.payment) || null;
      return {
        ...appt,
        patient,
        doctor,
        service,
        payment
      };
    });
  },

  getAllAppointmentOfUser: async (user_id) => {
    const db = readDb();
    const userAppts = db.appointments.filter(appt => appt.patient === user_id);
    return userAppts.map(appt => {
      const doc = db.doctors.find(d => d._id === appt.doctor) || { _id: appt.doctor, name: 'Doctor' };
      const svc = db.services.find(s => s._id === appt.service) || { _id: appt.service, service_name: 'Consultation' };
      return {
        ...appt,
        doctor: { _id: doc._id, name: doc.name, pillar: doc.pillar },
        service: svc
      };
    });
  },

  getAllAppointmentOfDoctor: async (doctor_id) => {
    const db = readDb();
    const docAppts = db.appointments.filter(appt => appt.doctor === doctor_id && appt.status === 'pending');
    return docAppts.map(appt => {
      const patient = db.users.find(u => u._id === appt.patient) || { name: 'Patient' };
      return {
        ...appt,
        patient: { name: patient.name }
      };
    });
  },

  getPayment: async (appointment_id) => {
    const db = readDb();
    const appt = db.appointments.find(a => a._id === appointment_id);
    if (!appt) return null;
    const pay = db.payments.find(p => p._id === appt.payment);
    return toObject(pay);
  },

  getDoctorFromAppointment: async (appointment_id) => {
    const db = readDb();
    const appt = db.appointments.find(a => a._id === appointment_id);
    if (!appt) return null;
    const doc = db.doctors.find(d => d._id === appt.doctor);
    return toObject(doc);
  },

  getUserFromAppointment: async (appointment_id) => {
    const db = readDb();
    const appt = db.appointments.find(a => a._id === appointment_id);
    if (!appt) return null;
    const userObj = db.users.find(u => u._id === appt.patient);
    return toObject(userObj);
  },

  createAppointment: async (appointmentData) => {
    const db = readDb();
    const { patient_id, date, service_id, note } = appointmentData;
    const svc = db.services.find(s => s._id === service_id);
    if (!svc) throw new Error('Service not found');

    const pillarDocs = db.doctors.filter(d => d.pillar === svc.pillar);
    // Find available doctor
    let selectedDoc = null;
    for (const doc of pillarDocs) {
      const count = db.appointments.filter(a => 
        a.doctor === doc._id && 
        a.appointment_date.startsWith(new Date(date).toISOString().split('T')[0]) &&
        a.status !== 'cancelled'
      ).length;
      const limit = Number(process.env.DOCTOR_DAILY_APPOINTMENT_LIMIT || 5);
      if (count < limit) {
        selectedDoc = doc;
        break;
      }
    }

    if (!selectedDoc) {
      throw new Error('No available doctors for this pillar on the selected date');
    }

    const newPayment = {
      _id: generateId(),
      charges: svc.charges || 100,
      paid: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.payments.push(newPayment);

    const newAppt = {
      _id: generateId(),
      patient: patient_id,
      doctor: selectedDoc._id,
      service: service_id,
      status: 'pending',
      appointment_date: date,
      payment: newPayment._id,
      notes: note || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.appointments.push(newAppt);
    writeDb(db);

    return toObject(newAppt);
  },

  createMessage: async (messageData) => {
    const db = readDb();
    const { user, content, sender } = messageData;
    const newMsg = {
      _id: generateId(),
      user,
      content,
      sender: sender || 'bot',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.messages.push(newMsg);
    writeDb(db);
    return toObject(newMsg);
  },

  createService: async (serviceData) => {
    const db = readDb();
    const { service_name, pillar, charges } = serviceData;
    if (db.services.some(s => s.service_name === service_name)) {
      throw new Error('Service already exists');
    }
    const newSvc = {
      _id: generateId(),
      service_name,
      pillar,
      available: true,
      charges: Number(charges || 100),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.services.push(newSvc);
    writeDb(db);
    return toObject(newSvc);
  },

  updateService: async (serviceData) => {
    const db = readDb();
    const { service_id, available } = serviceData;
    const svcIndex = db.services.findIndex(s => s._id === service_id);
    if (svcIndex === -1) throw new Error('Service not found');
    db.services[svcIndex].available = available;
    db.services[svcIndex].updatedAt = new Date().toISOString();
    writeDb(db);
    return toObject(db.services[svcIndex]);
  },

  updateAppointment: async (appointmentData) => {
    const db = readDb();
    const { appointment_id, status } = appointmentData;
    const apptIndex = db.appointments.findIndex(a => a._id === appointment_id);
    if (apptIndex === -1) throw new Error('Appointment not found');
    db.appointments[apptIndex].status = status;
    db.appointments[apptIndex].updatedAt = new Date().toISOString();
    
    if (status !== 'pending' && status !== 'completed') {
      const docId = db.appointments[apptIndex].doctor;
      const docIndex = db.doctors.findIndex(d => d._id === docId);
      if (docIndex !== -1) {
        db.doctors[docIndex].available = true;
      }
    }
    writeDb(db);
    return toObject(db.appointments[apptIndex]);
  },

  updateDoctorAvailability: async (doctorData) => {
    const db = readDb();
    const { doctor_id, available } = doctorData;
    const docIndex = db.doctors.findIndex(d => d._id === doctor_id);
    if (docIndex === -1) throw new Error('Doctor not found');
    db.doctors[docIndex].available = available;
    db.doctors[docIndex].updatedAt = new Date().toISOString();
    writeDb(db);
    return toObject(db.doctors[docIndex]);
  },

  markAppointmentAsCompleted: async (appointment_id, proof) => {
    const db = readDb();
    const apptIndex = db.appointments.findIndex(a => a._id === appointment_id);
    if (apptIndex === -1) throw new Error('No appointment Found');
    const appt = db.appointments[apptIndex];
    const pay = db.payments.find(p => p._id === appt.payment);
    if (!pay) throw new Error('No payment Found');
    if (!proof) throw new Error('No Proof Found');
    
    pay.paid = true; 
    
    appt.proof = proof;
    appt.status = 'completed';
    appt.updatedAt = new Date().toISOString();
    
    writeDb(db);
    return toObject(appt);
  },

  payBill: async (payment_id, transcation_id) => {
    const db = readDb();
    const payIndex = db.payments.findIndex(p => p._id === payment_id);
    if (payIndex === -1) throw new Error('Payment not found');
    db.payments[payIndex].paid = true;
    db.payments[payIndex].transcation = transcation_id;
    db.payments[payIndex].paid_at = new Date().toISOString();
    db.payments[payIndex].updatedAt = new Date().toISOString();
    writeDb(db);
    return toObject(db.payments[payIndex]);
  },

  deleteUser: async (user_id) => {
    const db = readDb();
    db.users = db.users.filter(u => u._id !== user_id);
    db.messages = db.messages.filter(m => m.user !== user_id);
    writeDb(db);
    return { success: true };
  },

  deleteDoctor: async (doctor_id) => {
    const db = readDb();
    db.doctors = db.doctors.filter(d => d._id !== doctor_id);
    writeDb(db);
    return { success: true };
  },

  deleteAdmin: async (admin_id) => {
    const db = readDb();
    db.admins = db.admins.filter(a => a._id !== admin_id);
    writeDb(db);
    return { success: true };
  },

  deleteMessages: async (user_id) => {
    const db = readDb();
    db.messages = db.messages.filter(m => m.user !== user_id);
    writeDb(db);
    return { success: true };
  },

  checkDoctorDailyAvailability: async (doctor_id, appointment_date) => {
    const db = readDb();
    const count = db.appointments.filter(a => 
      a.doctor === doctor_id && 
      a.appointment_date.startsWith(new Date(appointment_date).toISOString().split('T')[0]) &&
      a.status !== 'cancelled'
    ).length;
    const limit = Number(process.env.DOCTOR_DAILY_APPOINTMENT_LIMIT || 5);
    return count < limit;
  }
};

module.exports = jsonDb;
