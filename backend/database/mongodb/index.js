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
}, { timestamps: true })

const message = mongoose.model('messages', messageSchema);

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
    user, message,
    connectDB
};