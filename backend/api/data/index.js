const express = require('express');
const dotenv = require('dotenv');
const {
    loginDoctor, loginUser, createDoctor, createUser, loginAdmin, createAdmin,
    getdoctor, getPillarByService, getAllServices, getUserProfile, getAllUser, getAllDoctor,
    getAllAppointment, getUserFromAppointment, getAllAppointmentOfUser, getAllAppointmentOfDoctor,
    getPayment, getDoctorFromAppointment, getMessages, getAllContactForm, getContactForm,

    createAppointment, createMessage, createService, createContactForm,

    updateService, updateAppointment, updateDoctorAvailability, payBill, markAppointmentAsCompleted,
    markContactFormAsSeen,

    checkDoctorDailyAvailability,
    
    deleteAdmin, deleteDoctor, deleteMessages, deleteUser, deleteContactForm
} = require('../../database/queries');
const { 
    authenticate, checkAuthentication, jwt
} = require('../../authentication');
const { appointment, user } = require('../../database/mongodb');

dotenv.config();

const router = express.Router();


router.get('/', (req, res) => {
    res.status(200).json({
        message: 'endpoint Healthy'
    });
});
router.get('/me', authenticate, async (req, res) => {
    try {
        const results = await getUserProfile(req.user._id, req.user.role);
        if (!results) {
            return res.status(404).json({ message: 'User profile not found' });
        }
        res.status(200).json({ ...results, role: req.user.role });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
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
        delete results.password;
        res.status(200).json(results);
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
        throw error;
    }
});
router.post('/register/doctor', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'admin') throw new Error('Only Admin can create Doctors');
        const { name, email, password, gender, pillar } = req.body;
        const results = await createDoctor(name, email, password, gender, pillar);
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
        delete results.password;
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
    }
});
router.post('/appointment/payment', authenticate, async (req, res) => {
    try {
        const result = await getPayment(req.body.appointment_id);
        res.status(200).json(result);
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
});
router.post('/create/contact/form', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        const result = await createContactForm(name, email, subject, message);
        res.status(200).json(result);
    } catch(error) {
        res.status(409).json({
            message: error.message
        });
    }
});


// user only routes
router.get('/chat/all', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'user') {
            return res.status(403).json({ message: 'Forbidden: You are not an User' });
        }
        const result = await getMessages(req.user._id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
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
            patient_id: req.user._id,
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
        const appointmentPatient = await getUserFromAppointment(req.body.appointment_id);
        if (appointmentPatient._id.toString() === req.user._id.toString()) {
            const result = await updateAppointment({
                appointment_id: req.body.appointment_id,
                status: 'cancelled'
            });
            res.status(200).json(result);
        } else {
            throw new Error('You can not mark this appointment');
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
router.post('/appointment/pay', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'user') {
            return res.status(403).json({ message: 'Forbidden: You are not an user' });
        }
        const result = await payBill(req.body.payment_id, req.body.transcation_id, req.user._id);
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
        const appointmentDoctor = await getDoctorFromAppointment(req.body.appointment_id);
        if (appointmentDoctor._id.toString() === req.user._id.toString()) {
            const result = await markAppointmentAsCompleted(req.body.appointment_id, req.body.proof, req.body.vitals);
            res.status(200).json(result);
        } else {
            throw new Error('You cannt mark this appointment');
        }
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

router.post('/doctor/availability', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ message: 'Forbidden: You are not a Doctor' });
        }
        const { available } = req.body;
        const result = await updateDoctorAvailability({
            doctor_id: req.user._id,
            available: !!available
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// admin only routes
router.get('/get/all/contact/form', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You are not an admin' });
        }
        const result = await getAllContactForm();
        res.status(200).json(result);
    } catch(error) {
        res.status(409).json({
            message: error.message
        });
    }
});
router.post('/contact/form/marked/seen', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You are not an admin' });
        }
        const result = await markContactFormAsSeen(req.body.form_id);
        res.status(200).json(result);
    } catch(error) {
        res.status(409).json({
            message: error.message
        });
    }
});
router.get('/get/contact/form', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You are not an admin' });
        }
        const result = await getContactForm(req.query.form_id || req.body.form_id);
        res.status(200).json(result);
    } catch(error) {
        res.status(409).json({
            message: error.message
        });
    }
});
router.post('/create/service', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You are not an admin' });
        }
        const result = await createService({
            service_name: req.body.service_name,
            pillar: req.body.pillar,
            charges: req.body.charges
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
router.get('/service/all', async (req, res) => {
    try {
        const result = await getAllServices();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
router.post('/service/update', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You are not an admin' });
        }
        const result = await updateService({
            service_id: req.body.service_id,
            available: req.body.available
        });
        res.status(200).json(result);
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
router.get('/get/doctor/:id', authenticate, async (req, res) => {
    try {
        const result = await getdoctor(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        // Return only public fields (no password)
        res.status(200).json({
            _id: result._id,
            name: result.name,
            email: result.email,
            pillar: result.pillar,
            gender: result.gender,
            avatar: result.avatar,
            available: result.available
        });
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
router.post('/contact/form/delete', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You are not an admin' });
        }
        const result = await deleteContactForm(req.body.form_id);
        res.status(200).json(result);
    } catch(error) {
        res.status(409).json({
            message: error.message
        });
    }
});


module.exports = router;