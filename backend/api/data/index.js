const express = require('express');
const dotenv = require('dotenv');
const {
    loginDoctor, loginUser, createDoctor, createUser, loginAdmin, createAdmin,
    getdoctor, getPillarByService,
    createAppointment, createMessage, createService,
    updateService, updateAppointment, updateDoctorAvailability,
    checkDoctorDailyAvailability
} = require('../../database/queries');
const { 
    authenticate, checkAuthentication
} = require('../../authentication');

dotenv.config();

const router = express.Router();


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
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            path: '/',
            sameSite: "lax"
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
router.post('create/appointment', authenticate, async (req, res) => {
    if (req.user.role !== 'user') throw new Error('Only users can add appointments');
    try {
        const result = await createAppointment({
            patient: req.user._id,
            date: req.body.date,
            service: req.body.service,
            note: req.body.note
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
});


// doctor only routes
router.get('appointment/all/doctor', authenticate, async (req, res) => {
    if (req.user.role !== 'doctor') throw new Error('Doctor can only view their appointments');
    try {
        const result = await getAllAppointmentOfDoctor(req.user._id);
        res.status(200).json(result);
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
});


// admin only routes
router.post('create/service', authenticate, async (req, res) => {
    if (req.user.role !== 'admin') throw new Error('Only admins can add services');
    try {
        const result = await createService({
            service_name: req.body.service_name,
            pillar: req.body.pillar
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
});

module.exports = router;
