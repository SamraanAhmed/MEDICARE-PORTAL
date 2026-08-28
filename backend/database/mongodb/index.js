const mongoose = require('mongoose');


const adminSchema = new mongoose.Schema({
    avatar: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0k6mJECkDvvxLWpl2C6oVOgbs49inNcoZtvJRFileqS3TAkNr3qOH87dG&s=10"
    },
    name: {
        type: String,
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
    }
}, { timestamps: true});

const admin = mongoose.model('admins', adminSchema);

const userSchema = new mongoose.Schema({
    avatar: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0k6mJECkDvvxLWpl2C6oVOgbs49inNcoZtvJRFileqS3TAkNr3qOH87dG&s=10"
    },
    name: {
        type: String,
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
        enum: ['male', 'female', 'not-specified'],
        default: 'not-specified'
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
    pillar: {
        type: String,
        enum: ['cardiology', 'dermatology', 'orthopedics', 'diagnostics', 'telehealth', 'general'],
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'not-specified'],
        default: 'not-specified'
    },
    available: {
        type: Boolean,
        default: true
    }
}, { timestamps: true});

const doctor = mongoose.model('doctors', doctorSchema);

const serviceSchema = new mongoose.Schema({
    service_name: {
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
        default: true
    },
    charges: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const service = mongoose.model('available-services', serviceSchema);

const messageSchema = new mongoose.Schema({
    user: {
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
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctors',
        required: true
    },
    service: {
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
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'payments',
        unique: true,
        require: true
    },
    notes: {
      type: String,
      trim: true,
      maxLength: 500,
    },
    proof: {
        type: String
    },
    vitals: {
        heartRate: String,
        bloodPressure: String,
        sleepCycles: String,
        bloodGlucose: String
    }
}, { timestamps: true });

const appointment = mongoose.model('appointments', appointmentSchema);

const paymentSchema = new mongoose.Schema({
    charges: {
        type: Number,
        required: true
    },
    paid: {
        type: Boolean,
        default: false
    },
    transcation: {
        type: String
    },
    paid_at: {
        type: Date
    }
}, { timestamps: true });

const payment = mongoose.model('payments', paymentSchema);

const contactFormSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true,
        maxLength: 100
    },
    message: {
        type: String,
        required: true,
        maxLength: 500
    },
    seen: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const contactForm = mongoose.model('contact-forms', contactFormSchema);

mongoose.connection.on('error', (err) => {
    console.warn("Mongoose connection error event:", err.message);
});

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
    admin, user, doctor, service, message, appointment, payment, contactForm,
    connectDB
};