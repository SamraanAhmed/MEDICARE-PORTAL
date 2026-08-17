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



module.exports = router;
