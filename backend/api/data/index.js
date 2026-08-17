const express = require('express');
const {
    loginDoctor, loginUser, createDoctor, createUser,
    getdoctor,
    createUser, createDoctor, createAppointment, createMessage, createService,
    updateService, updateAppointment, updateDoctorAvailability,
    checkDoctorDailyAvailability
} = require('../../database/queries');
const { 
    authenticate, checkAuthentication
} = require('../../authentication');

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
        res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
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
        res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
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
router.post('/login/user', async (req, res) => {
    try {
        const { email, password } = req.body;
        const results = await loginUser(email, password);
        const token = jwt.sign({
            _id: results._id, role: 'user'
        }, process.env.SECRET_KEY, {
            expiresIn: "7d"
        });
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
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
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
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


module.exports = router;
