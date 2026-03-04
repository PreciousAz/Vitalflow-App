const express = require('express');
const router = express.Router();
const paymentService = require('../api.services/paymentService');

router.post('/api/payment/create', paymentService.create);

router.get('/api/payment/:name', paymentService.findPatientName);

router.get('/api/payment/user/:id', paymentService.findAllByUser);

router.delete('/api/payment/:id', paymentService.delete);

module.exports = router;