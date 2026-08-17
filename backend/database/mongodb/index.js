const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    avatar: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0k6mJECkDvvxLWpl2C6oVOgbs49inNcoZtvJRFileqS3TAkNr3qOH87dG&s=10"
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        default: 'male'
    }
}, { timestamps: true});

const user = mongoose.model('users', userSchema);

const doctorSchema = new mongoose.Schema({
    avatar: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0k6mJECkDvvxLWpl2C6oVOgbs49inNcoZtvJRFileqS3TAkNr3qOH87dG&s=10"
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    pillar: {
        type: String,
        enum: ['cardiology', 'dermatology', 'orthopedics', 'diagnostics', 'telehealth', 'general'],
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        default: 'male'
    },
    available: {
        type: Boolean,
        default: true
    }
}, { timestamps: true});

const doctor = mongoose.model('doctors', doctorSchema);

const serviceSchema = new mongoose.Schema({
    service: {
        type: String,
        required: true,
        unique: true
    },
    pillar: {
        type: String,
        enum: ['cardiology', 'dermatology', 'orthopedics', 'diagnostics', 'telehealth', 'general'],
        required: true
    },
    available: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const service = mongoose.model('available-services', serviceSchema);

const messageSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    sender: {
        type: String,
        default: 'bot'
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true });

const message = mongoose.model('messages', messageSchema);

const appointmentSchema = new mongoose.Schema({
    patient_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    doctor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    service_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'available-services',
        required: true
    },
    status: {
      type: String,
      enum: ['pending', 'cancelled', 'completed', 'no-show'],
      default: 'pending',
    },
    appointment_date: {
        type: Date,
        required: true
    },
    notes: {
      type: String,
      trim: true,
      maxLength: 500,
    }
}, { timestamps: true });

const appointment = mongoose.model('appointments', appointmentSchema);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: "MediCare"
        });
    } catch (error) {
        throw error;
    }
}

module.exports = {
    user, doctor, service, message, appointment,
    connectDB
};