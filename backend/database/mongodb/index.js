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
    role: {
        type: String,
        enum: ['patient', 'doctor', 'admin'],
        required: true
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
        required: true
    }
}, { timestamps: true});

const user = mongoose.model('users', userSchema);

const serviceSchema = new mongoose.Schema({
    service: {
        type: String,
        required: true,
        unique: true
    },
    available: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const service = mongoose.model('available-services', serviceSchema);

const messageSchema = new mongoose.Schema({
    conversation_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'conversation',
        required: true
    },
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
    notes: {
      type: String,
      trim: true,
      maxLength: 500,
    },
    appointment_date: {
        type: Date,
        required: true
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
    user, service, message, appointment,
    connectDB
};