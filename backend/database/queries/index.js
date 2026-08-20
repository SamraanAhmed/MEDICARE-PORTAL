const mongoose = require('mongoose');
const { admin, user, doctor, service, message, appointment, payment, contactForm } = require('../mongodb');
const bycrpt = require('bcrypt');
const dotenv = require('dotenv');
const jsonDb = require('../jsonDb');

dotenv.config();

const isConnected = () => mongoose.connection.readyState === 1;

// user accounts
const createUser = async (name, email, password, gender) => {
    if (!isConnected()) return jsonDb.createUser(name, email, password, gender);
    try {
        const hash = await bycrpt.hash(password, 10);
        const results = await user.create({
            name: name,
            email: email,
            password: hash,
            gender: gender
        });
        return results;
    } catch (error) {
        throw error;
    }
};

const loginUser = async (email, password) => {
    if (!isConnected()) return jsonDb.loginUser(email, password);
    try {
        const results = await user.findOne({ email: email });
        if(!results) throw new Error('Incorrect Email');
        const match = await bycrpt.compare(password, results.password);
        if(match) return results;
        else throw new Error('Incorrect Password');
    } catch (error) {
        throw error;
    }
};

//doctor accounts
const createDoctor = async (name, email, password, gender, pillar) => {
    if (!isConnected()) return jsonDb.createDoctor(name, email, password, gender, pillar);
    try {
        const hash = await bycrpt.hash(password, 10);
        const results = await doctor.create({
            name: name,
            email: email,
            password: hash,
            gender: gender,
            pillar: pillar
        });
        return results;
    } catch (error) {
        throw error;
    }
};

const loginDoctor = async (email, password) => {
    if (!isConnected()) return jsonDb.loginDoctor(email, password);
    try {
        const results = await doctor.findOne({ email: email });
        if(!results) throw new Error('Incorrect Email');
        const match = await bycrpt.compare(password, results.password);
        if(match) return results;
        else throw new Error('Incorrect Password');
    } catch (error) {
        throw error;
    }
};

// Admin accounts
const loginAdmin = async (email, password) => {
    if (!isConnected()) return jsonDb.loginAdmin(email, password);
    try {
        const results = await admin.findOne({ email: email });
        if(!results) throw new Error('Incorrect Email');
        const match = await bycrpt.compare(password, results.password);
        if(match) return results;
        else throw new Error('Incorrect Password');
    } catch (error) {
        throw error;
    }
};

const createAdmin = async (name, email, password) => {
    if (!isConnected()) return jsonDb.createAdmin(name, email, password);
    try {
        const hash = await bycrpt.hash(password, 10);
        const results = await admin.create({
            name: name,
            email: email,
            password: hash,
        });
        return results;
    } catch (error) {
        throw error;
    }
};

// getter functions
const getdoctor = async (id) => {
    if (!isConnected()) return jsonDb.getdoctor(id);
    try {
        const result = await doctor.findOne({_id: id});
        return result;
    } catch (error) {
        throw error;
    }
}

const getUserProfile = async (id, role) => {
    if (!isConnected()) return jsonDb.getUserProfile(id, role);
    try {
        let result;
        if (role === 'user') {
            result = await user.findOne({ _id: id }).select('-password');
        } else if (role === 'doctor') {
            result = await doctor.findOne({ _id: id }).select('-password');
        } else if (role === 'admin') {
            result = await admin.findOne({ _id: id }).select('-password');
        }
        return result;
    } catch (error) {
        throw error;
    }
}
const getAllAppointmentOfUser = async (user_id) => {
    if (!isConnected()) return jsonDb.getAllAppointmentOfUser(user_id);
    try {
        const result = await appointment.find({ patient: user_id }).populate('doctor', '_id name pillar');
        return result;
    } catch (error) {
        throw error;
    }
}
const getPillarByService = async (service_id) => {
    if (!isConnected()) return jsonDb.getPillarByService(service_id);
    try {
        const result = await service.findOne({_id: service_id});
        return result;
    } catch (error) {
        throw error;
    }
}
const getAllServices = async () => {
    if (!isConnected()) return jsonDb.getAllServices();
    try {
        const result = await service.find({});
        return result;
    } catch (error) {
        throw error;
    }
}
const getAllUser = async () => {
    if (!isConnected()) return jsonDb.getAllUser();
    try {
        const result = await user.find({});
        return result;
    } catch (error) {
        throw error;
    }
}
const getAllDoctor = async () => {
    if (!isConnected()) return jsonDb.getAllDoctor();
    try {
        const result = await doctor.find({});
        return result;
    } catch (error) {
        throw error;
    }
}
const getAllAppointment = async () => {
    if (!isConnected()) return jsonDb.getAllAppointment();
    try {
        const result = await appointment.find({}).populate('patient doctor service payment');
        return result;
    } catch (error) {
        throw error;
    }
}
const getPayment = async (appointment_id) => {
    if (!isConnected()) return jsonDb.getPayment(appointment_id);
    try {
        const appoint = await appointment.findById(appointment_id).select('payment').populate('payment');
        const result = appoint.payment;
        return result;
    } catch (error) {
        throw error;
    }
}
const getAllAppointmentOfDoctor = async (doctor_id) => {
    if (!isConnected()) return jsonDb.getAllAppointmentOfDoctor(doctor_id);
    try {
        const result = await appointment.find({ doctor: doctor_id, status: 'pending'}).populate('patient', 'name');
        return result;
    } catch (error) {
        throw error;
    }
}
const getDoctorFromAppointment = async (appointment_id) => {
    if (!isConnected()) return jsonDb.getDoctorFromAppointment(appointment_id);
    try {
        const appoint = await appointment.findById(appointment_id).select('doctor').populate('doctor');
        const result = appoint.doctor;
        return result;
    } catch (error) {
        throw error;
    }
}
const getUserFromAppointment = async (appointment_id) => {
    if (!isConnected()) return jsonDb.getUserFromAppointment(appointment_id);
    try {
        const appoint = await appointment.findById(appointment_id).select('patient').populate('patient');
        const result = appoint.patient;
        return result;
    } catch (error) {
        throw error;
    }
}
const getMessages = async (user_id) => {
    try {
        const result = await message.find({user: user_id});
        return result;
    } catch(error) {
        throw error;
    }
}
const getAllContactForm = async () => {
    try {
        const result = await contactForm.find({}).select('_id name email subject');
        return result;
    } catch (error) {
        throw error;
    }
}
const getContactForm = async (form_id) => {
    try {
        const result = await contactForm.findById(form_id);
        return result;
    } catch (error) {
        throw error;
    }
}


// setter functions
const createAppointment = async (appointmentData) => {
    if (!isConnected()) return jsonDb.createAppointment(appointmentData);
    const { patient_id, date, service_id, note } = appointmentData;
    try {
        const services = await getPillarByService(service_id);
        const getDoctors = await doctor.find({ pillar: services.pillar });
        const availabilityChecks = await Promise.all(getDoctors.map((doctor) => checkDoctorDailyAvailability(doctor._id, date)));
        const availableDoctors = getDoctors.filter((_, i) => availabilityChecks[i]);
        if (availableDoctors.length === 0) {
            throw new Error('No available doctors for this pillar on the selected date');
        }
        const paymentResult = await payment.create({ 
            charges: services.charges
        });
        const result = await appointment.create({ patient: patient_id, doctor: availableDoctors[0]._id, appointment_date: date, service: service_id, notes: note, payment: paymentResult._id });
        return result;
    } catch (error) {
        throw error;
    }
}
const createMessage = async (messageData) => {
    if (!isConnected()) return jsonDb.createMessage(messageData);
    const { user, content, sender } = messageData;
    try {
        const result = await message.create({ user: user, content: content, sender: sender });
        return result;
    } catch (error) {
        throw error;
    }
}
const createService = async (serviceData) => {
    if (!isConnected()) return jsonDb.createService(serviceData);
    const { service_name, pillar, charges } = serviceData;
    try {
        const result = await service.create({ service_name: service_name, pillar: pillar, charges: charges });
        return result;
    } catch (error) {
        throw error;
    }
}
const createContactForm = async (name, email, subject, message) => {
    try {
        const result = await contactForm.create({name, email, subject, message});
        return result;
    } catch (error) {
        throw error;
    }
}


// update functions
const updateService = async (serviceData) => {
    if (!isConnected()) return jsonDb.updateService(serviceData);
    const { service_id, available } = serviceData;
    try {
        const result = await service.findByIdAndUpdate(service_id, { available: available }, { new: true });
        return result;
    } catch (error) {
        throw error;
    }
}

const updateAppointment = async (appointmentData) => {
    if (!isConnected()) return jsonDb.updateAppointment(appointmentData);
    const { appointment_id, status } = appointmentData;
    try {
        const result = await appointment.findByIdAndUpdate(appointment_id, { status: status }, { new: true });
        if ((status !== 'pending') && (status !== 'completed')) {
            const doctor = result.doctor;
            await updateDoctorAvailability({doctor: doctor, available: true});
        }
        return result;
    } catch (error) {
        throw error;
    }
}

const updateDoctorAvailability = async (doctorData) => {
    if (!isConnected()) return jsonDb.updateDoctorAvailability(doctorData);
    const { doctor_id, available } = doctorData;
    try {
        const result = await doctor.findByIdAndUpdate(doctor_id, { available: available }, { new: true });
        return result;
    } catch (error) {
        throw error;
    }
}
const markAppointmentAsCompleted = async (appointment_id, proof) => {
    if (!isConnected()) return jsonDb.markAppointmentAsCompleted(appointment_id, proof);
    try {
        const appointments = await appointment.findById(appointment_id)
            .populate({ path: 'payment', select: 'paid' });
        if (proof && appointments.payment.paid) {
            const result = await appointment.findByIdAndUpdate(appointment_id, { proof: proof, status: 'completed'}, { new: true });
            return result;
        } else {
            if(!appointments) throw new Error('No appointment Founded');
            else if(!appointments.payment) throw new Error('No payment Founded');
            else if (!proof) throw new Error('No Proof Founded');
        }
    } catch (error) {
        throw error;
    }
}
const payBill = async (payment_id, transcation_id, user_id) => {
    if (!isConnected()) return jsonDb.payBill(payment_id, transcation_id);
    try {
        const user = await appointment.findOne({payment: payment_id}).select('patient');
        if (user_id === user.patient) {
            const result = await payment.findByIdAndUpdate(payment_id, { paid: true, transcation: transcation_id }, { new: true });
            return result;
        } else {
            throw new Error('You can not pay this bill');
        }
    } catch (error) {
        throw error;
    }
}
const markContactFormAsSeen = async (form_id) => {
    try {
        const result = await contactForm.findByIdAndUpdate(form_id, { seen: true }, { new: true });
        return result;
    } catch (error) {
        throw error;
    }
}


// Delete functions
const deleteUser = async (user_id) => {
    if (!isConnected()) return jsonDb.deleteUser(user_id);
    try {
        await deleteMessages(user_id);
        const result = await user.findOneAndDelete({_id: user_id});
        return result;
    } catch (error) {
        throw error;
    }
}

const deleteDoctor = async (doctor_id) => {
    if (!isConnected()) return jsonDb.deleteDoctor(doctor_id);
    try {
        const result = await doctor.findOneAndDelete({_id: doctor_id});
        return result;
    } catch (error) {
        throw error;
    }
}

const deleteMessages = async (user_id) => {
    if (!isConnected()) return jsonDb.deleteMessages(user_id);
    try {
        const result = await message.deleteMany({user: user_id});
        return result;
    } catch (error) {
        throw error;
    }
}
const deleteAdmin = async (admin_id) => {
    if (!isConnected()) return jsonDb.deleteAdmin(admin_id);
    try {
        const result = await admin.findOneAndDelete({_id: admin_id});
        return result;
    } catch (error) {
        throw error;
    }
}
const deleteContactForm = async (form_id) => {
    try {
        const result = await contactForm.findOneAndDelete({_id: form_id});
        return result;
    } catch (error) {
        throw error;
    }
}


// checker functions
const checkDoctorDailyAvailability = async (doctor_id, appointment_date) => {
    if (!isConnected()) return jsonDb.checkDoctorDailyAvailability(doctor_id, appointment_date);
    const startOfDay = new Date(appointment_date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(appointment_date);
    endOfDay.setHours(23, 59, 59, 999);
    const count = await appointment.countDocuments({
        doctor: doctor_id,
        appointment_date: { $gte: startOfDay, $lte: endOfDay },
        status: { $ne: 'cancelled' }
    });
    const limit = Number(process.env.DOCTOR_DAILY_APPOINTMENT_LIMIT || 5);
    if (count >= limit) {
        return false;
    } else {
        return true;
    }
}

module.exports = {
    loginDoctor, loginUser, createDoctor, createUser, loginAdmin, createAdmin,
    getdoctor, getPillarByService, getAllServices, getUserProfile, getAllUser, getAllDoctor, getAllAppointment, getAllAppointmentOfUser,
    getAllAppointmentOfDoctor, getPayment, getDoctorFromAppointment, getUserFromAppointment, getMessages, getAllContactForm,
    getContactForm, 
    createAppointment, createMessage, createService, createContactForm,
    updateService, updateAppointment, updateDoctorAvailability, payBill, markContactFormAsSeen,
    checkDoctorDailyAvailability,
    markAppointmentAsCompleted,
    deleteAdmin, deleteDoctor, deleteMessages, deleteUser, deleteContactForm
}