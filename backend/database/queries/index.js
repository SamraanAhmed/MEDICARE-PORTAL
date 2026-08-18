const { admin, user, doctor, service, message, appointment } = require('../mongodb');
const bycrpt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();





// user accounts
const createUser = async (name, email, password, gender) => {
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
    try {
        const results = await user.findOne({ email: email }).select('_id password');
        if(!results) throw new Error('Incorrect Email');
        if(bycrpt.compare(password, results.password)) return results;
        else throw new Error('Incorrect Password');
    } catch (error) {
        throw error;
    }
};


//doctor accounts
const createDoctor = async (name, email, password, gender, pillar) => {
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
    try {
        const results = await doctor.findOne({ email: email }).select('_id password');
        if(!results) throw new Error('Incorrect Email');
        if(bycrpt.compare(password, results.password)) return results;
        else throw new Error('Incorrect Password');
    } catch (error) {
        throw error;
    }
};


// Admin accounts
const loginAdmin = async (email, password) => {
    try {
        const results = await admin.findOne({ email: email }).select('_id password');
        if(!results) throw new Error('Incorrect Email');
        if(bycrpt.compare(password, results.password)) return results;
        else throw new Error('Incorrect Password');
    } catch (error) {
        throw error;
    }
};
const createAdmin = async (name, email, password) => {
    try {
        const hash = await bycrpt.hash(password, 10);
        const results = await doctor.create({
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
    try {
        const result = await doctor.findOne({_id: id});
        return result;
    } catch (error) {
        throw error;
    }
}
const getAllAppointmentOfDoctor = async (doctor_id) => {
    try {
        const result = await appointment.find({ doctor_id: doctor_id, status: 'pending'}).populate('patient_id', 'name');
        return result;
    } catch (error) {
        throw error;
    }
}
const getPillarByService = async (service_id) => {
    try {
        const result = service.findOne({_id: service_id});
        return result;
    } catch (error) {
        throw error;
    }
}


// setter functions
const createAppointment = async (appointmentData) => {
    const { patient, date, service_id, note } = appointmentData;
    try {
        const service = await getPillarByService(service_id);
        const getDoctors = await user.find({ pillar: service.pillar, role: 'doctor' });
        const availabilityChecks = await Promise.all(getDoctors.map((doctor) => checkDoctorDailyAvailability(doctor._id, date)));
        const availableDoctors = getDoctors.filter((_, i) => availabilityChecks[i]);
        if (availableDoctors.length === 0) {
            throw new Error('No available doctors for this pillar on the selected date');
        }
        const result = await appointment.create({ patient: patient, doctor: availableDoctors[0]._id, appointment_date: date, service: service_id, notes: note });
    } catch (error) {
        throw error;
    }
}
const createMessage = async (messageData) => {
    const { user, content, sender } = messageData;
    try {
        const result = await message.create({ user: user, content: content, sender: sender });
        return result;
    } catch (error) {
        throw error;
    }
}
const createService = async (serviceData) => {
    const { service_name, pillar } = serviceData;
    try {
        const result = await service.create({ service_name: service_name, pillar: pillar });
        return result;
    } catch (error) {
        throw error;
    }
}

// update functions
const updateService = async (serviceData) => {
    const { service_id, available } = serviceData;
    try {
        const result = await service.findByIdAndUpdate(service_id, { available: available }, { new: true });
        return result;
    } catch (error) {
        throw error;
    }
}
const updateAppointment = async (appointmentData) => {
    const { appointment_id, status } = appointmentData;
    try {
        const result = await appointment.findByIdAndUpdate(appointment_id, { status: status }, { new: true });
        if (status !== 'pending') {
            const doctor = result.doctor;
            await updateDoctorAvailability({doctor: doctor, available: true});
        }
        return result;
    } catch (error) {
        throw error;
    }
}
const updateDoctorAvailability = async (doctorData) => {
    const { doctor, available } = doctorData;
    try {
        const result = await doctor.findByIdAndUpdate(doctor, { available: available }, { new: true });
        return result;
    } catch (error) {
        throw error;
    }
}
const markAppointmentAsCompleted = async (appointment_id, proof, role) => {
    try {
        if (role === 'doctor') {
            if (proof) {
                const result = appointment.findByIdAndUpdate(appointment_id, { proof: proof, status: 'completed'}, { new: true });
                return result;
            } else {
                throw new Error('No proof Provided');
            }
        } else {
            throw new Error('only doctor can edit');
        }
    } catch (error) {
        throw error;
    }
}

// Delete functions
const deleteUser = async (user_id) => {
    try {
        const result = await user.findOneAndDelete({_id: user_id});
        return result;
    } catch (error) {
        throw error;
    }
}
const deleteDoctor = async (doctor_id) => {
    try {
        const result = await doctor.findOneAndDelete({_id: doctor_id});
        return result;
    } catch (error) {
        throw error;
    }
}
const deleteMessages = async (user_id) => {
    try {
        const result = await message.deleteMany({user_id: user_id});
        return result;
    } catch (error) {
        throw error;
    }
}

// checker functions
const checkDoctorDailyAvailability = async (doctor_id, appointment_date) => {
    const startOfDay = new Date(appointment_date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(appointment_date);
    endOfDay.setHours(23, 59, 59, 999);
    const count = await appointment.countDocuments({
        doctor_id,
        appointment_date: { $gte: startOfDay, $lte: endOfDay },
        status: { $ne: 'cancelled' }
    });
    const limit = Number(process.env.DOCTOR_DAILY_APPOINTMENT_LIMIT);
    if (count >= limit) {
        return false;
    } else {
        return true;
    }
}



module.exports = {
    loginDoctor, loginUser, createDoctor, createUser, loginAdmin, createAdmin,
    getdoctor, getPillarByService,
    createUser, createDoctor, createAppointment, createMessage, createService,
    updateService, updateAppointment, updateDoctorAvailability,
    checkDoctorDailyAvailability
}