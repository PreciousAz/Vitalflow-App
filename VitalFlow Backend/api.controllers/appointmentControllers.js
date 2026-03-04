const express = require('express');
const router = express.Router();
const appointmentService = require('../api.services/appointmentService');

router.post('/api/appointment/create', appointmentService.create);

router.get('/api/appointment/:id', appointmentService.findOne);

router.get('/api/appointment/user/:id/doctor', appointmentService.getUserAppointmentsByDoctor);

router.get('/api/appointment/doctor/:id/user', appointmentService.getUserAppointmentsByUser);

router.get('/api/appointment/user/:userId', appointmentService.findAllByUser);

router.patch('/api/appointment/:id', appointmentService.update);

router.delete('/api/appointment/:id', appointmentService.delete);

module.exports = router;