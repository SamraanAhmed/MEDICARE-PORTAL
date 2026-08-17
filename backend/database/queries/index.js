const { user, doctor, service, message, appointment } = require('../mongodb');
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
        const results = await user.findOne({ email: email }).select('avatar _id name email password');
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
        const results = await doctor.findOne({ email: email }).select('avatar _id name email password');
        if(!results) throw new Error('Incorrect Email');
        if(bycrpt.compare(password, results.password)) return results;
        else throw new Error('Incorrect Password');
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
        const result = await appointment.find({ doctor_id: doctor_id, status: 'pending'});
        return result;
    } catch (error) {
        throw error;
    }
}


// setter functions
const createUser = async (userData) => {
    const { name, email, password, gender } = userData;
    try {
        const hash = await bycrpt.hash(password, 10);
        const result = await user.create({ name: name, email: email, password: hash, gender: gender });
        return result;
    } catch (error) {
        throw error;
    }
}
const createDoctor = async (doctorData) => {
    const { name, email, password, role, pillar, gender } = doctorData;
    try {
        const hash = await bycrpt.hash(password, 10);
        const result = await doctor.create({ name: name, email: email, password: hash, role: role, pillar: pillar, gender: gender });
        return result;
    } catch (error) {
        throw error;
    }
}
const createAppointment = async (appointmentData) => {
    const { patient_id, date, service, pillar, note } = appointmentData;
    try {
        const getDoctors = await user.find({ pillar: pillar, role: 'doctor' });
        const availabilityChecks = await Promise.all(getDoctors.map((doctor) => checkDoctorDailyAvailability(doctor._id, date)));
        const availableDoctors = getDoctors.filter((_, i) => availabilityChecks[i]);
        if (availableDoctors.length === 0) {
            throw new Error('No available doctors for this pillar on the selected date');
        }
        const result = await appointment.create({ patient_id: patient_id, doctor_id: availableDoctors[0]._id, appointment_date: date, service_id: service, notes: note });
    } catch (error) {
        throw error;
    }
}
const createMessage = async (messageData) => {
    const { user_id, content, sender } = messageData;
    try {
        const result = await message.create({ user_id: user_id, content: content, sender: sender });
        return result;
    } catch (error) {
        throw error;
    }
}
const createService = async (serviceData) => {
    const { service, pillar } = serviceData;
    try {
        const result = await service.create({ service: service, pillar: pillar });
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
            const doctor_id = result.doctor_id;
            await updateDoctorAvailability({doctor_id: doctor_id, available: true});
        }
        return result;
    } catch (error) {
        throw error;
    }
}
const updateDoctorAvailability = async (doctorData) => {
    const { doctor_id, available } = doctorData;
    try {
        const result = await doctor.findByIdAndUpdate(doctor_id, { available: available }, { new: true });
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
    loginDoctor, loginUser, createDoctor, createUser,
    getdoctor,
    createUser, createDoctor, createAppointment, createMessage, createService,
    updateService, updateAppointment, updateDoctorAvailability,
    checkDoctorDailyAvailability
}