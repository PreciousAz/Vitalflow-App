const express = require('express');
const router = express.Router();
const patientService = require('../api.services/patientsService');

router.post('/api/patients/create', patientService.create);

router.get('/api/patients/all', patientService.findAll);

module.exports = router;