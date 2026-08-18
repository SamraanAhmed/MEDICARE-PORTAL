const express = require('express');
const dotenv = require('dotenv');
const {
    loginDoctor, loginUser, createDoctor, createUser, loginAdmin, createAdmin,
    getdoctor, getPillarByService, getAllUser, getAllDoctor, getAllAppointment, getAllAppointmentOfUser, getAllAppointmentOfDoctor,
    createUser, createDoctor, createAppointment, createMessage, createService,
    updateService, updateAppointment, updateDoctorAvailability,
    checkDoctorDailyAvailability,
    markAppointmentAsCompleted,
    deleteAdmin, deleteDoctor, deleteMessages, deleteUser
} = require('../../database/queries');
const { 
    authenticate, checkAuthentication, jwt
} = require('../../authentication');

dotenv.config();

const router = express.Router();


router.get('/', (req, res) => {
    res.status(200).json({
        message: 'endpoint Healthy'
    });
});
router.post('/register/user', async (req, res) => {
    try {
        const { name, email, password, gender } = req.body;
        const results = await createUser(name, email, password, gender);
        const token = jwt.sign({
                _id: results._id, role: 'user'
            }, process.env.SECRET_KEY, {
                expiresIn: "7d"
        });
        const isProduction = (process.env.STATUS === 'production');
        res.cookie("token", token, {
                httpOnly: true,
                secure: isProduction,
                sameSite: ((isProduction)? "none" : "lax"),
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json(results);
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
        throw error;
    }
});
router.post('/register/doctor', async (req, res) => {
    try {
        const { name, email, password, gender, pillar } = req.body;
        const results = await createDoctor(name, email, password, gender, pillar);
        const token = jwt.sign({
                _id: results._id, role: 'doctor'
            }, process.env.SECRET_KEY, {
                expiresIn: "7d"
        });
        const isProduction = (process.env.STATUS === 'production');
        res.cookie("token", token, {
                httpOnly: true,
                secure: isProduction,
                sameSite: ((isProduction)? "none" : "lax"),
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json(results);
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
        throw error;
    }
});
router.post('/register/admin', authenticate, async (req, res) => {
    if (req.user.role !== 'admin') throw new Error('Only Admin can create new admins');
    try {
        const { name, email, password } = req.body;
        const results = await createAdmin(name, email, password);
        res.status(200).json(results);
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
        throw error;
    }
});
router.post('/login/user', async (req, res) => {
    try {
        const { email, password } = req.body;
        const results = await loginUser(email, password);
        const token = jwt.sign({
            _id: results._id, role: 'user'
        }, process.env.SECRET_KEY, {
            expiresIn: "7d"
        });
        const isProduction = (process.env.STATUS === 'production');
        res.cookie("token", token, {
                httpOnly: true,
                secure: isProduction,
                sameSite: ((isProduction)? "none" : "lax"),
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json(results);
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
        throw error;
    }
});
router.post('/login/doctor', async (req, res) => {
    try {
        const { email, password } = req.body;
        const results = await loginDoctor(email, password);
        const token = jwt.sign({
            _id: results._id, role: 'doctor'
        }, process.env.SECRET_KEY, {
            expiresIn: "7d"
        });
        const isProduction = (process.env.STATUS === 'production');
        res.cookie("token", token, {
                httpOnly: true,
                secure: isProduction,
                sameSite: ((isProduction)? "none" : "lax"),
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json(results);
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
        throw error;
    }
});
router.post('/login/admin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const results = await loginAdmin(email, password);
        const token = jwt.sign({
            _id: results._id, role: 'admin'
        }, process.env.SECRET_KEY, {
            expiresIn: "7d"
        });
        const isProduction = (process.env.STATUS === 'production');
        res.cookie("token", token, {
                httpOnly: true,
                secure: isProduction,
                sameSite: ((isProduction)? "none" : "lax"),
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json(results);
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
        throw error;
    }
});
router.get('/logout', authenticate, async (req, res) => {
    try {
        const isProduction = (process.env.STATUS === 'production');
        res.clearCookie("token", {
            httpOnly: true,
            secure: isProduction,
            path: '/',
            sameSite: ((isProduction)? "none" : "lax")
        });
        res.status(200).json({
            message: 'successfull logout'
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
        throw error;
    }
});


// user only routes
router.get('/appointment/all/user', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'user') {
            return res.status(403).json({ message: 'Forbidden: You are not an User' });
        }
        const result = await getAllAppointmentOfUser(req.user._id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
router.post('/create/appointment', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'user') {
            return res.status(403).json({ message: 'Forbidden: You are not an user' });
        }
        const result = await createAppointment({
            patient: req.user._id,
            date: req.body.date,
            service_id: req.body.service_id,
            note: req.body.note
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
router.post('/appointment/mark/cancel', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'user') {
            return res.status(403).json({ message: 'Forbidden: You are not an user' });
        }
        const result = await updateAppointment({
            appointment_id: req.body.appointment_id,
            status: 'cancelled'
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// doctor only routes
router.get('/appointment/all/doctor', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ message: 'Forbidden: You are not an Doctor' });
        }
        const result = await getAllAppointmentOfDoctor(req.user._id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
router.post('/appointment/mark/complete', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ message: 'Forbidden: You are not an Doctor' });
        }
        const result = await markAppointmentAsCompleted(req.body.appointment_id, req.body.proof);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// admin only routes
router.post('/create/service', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You are not an admin' });
        }
        const result = await createService({
            service_name: req.body.service_name,
            pillar: req.body.pillar
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
router.get('/get/user/all', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You are not an admin' });
        }
        const result = await getAllUser();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
router.get('/get/doctor/all', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You are not an admin' });
        }
        const result = await getAllDoctor();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
router.get('/get/appointment/all', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You are not an admin' });
        }
        const result = await getAllAppointment();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
router.post('/delete/user', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You are not an admin' });
        }
        const result = await deleteUser(req.body.user_id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
router.post('/delete/doctor', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You are not an admin' });
        }
        const result = await deleteDoctor(req.body.doctor_id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
router.post('/delete/admin', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You are not an admin' });
        }
        const result = await deleteAdmin(req.body.admin_id);
        const isProduction = (process.env.STATUS === 'production');
        res.clearCookie("token", {
            httpOnly: true,
            secure: isProduction,
            path: '/',
            sameSite: ((isProduction)? "none" : "lax")
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


module.exports = router;
