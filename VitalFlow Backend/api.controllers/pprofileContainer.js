const express = require('express');
const router = express.Router();
const pprofileService = require('../api.services/pprofileService');

router.post('/api/pprofile/create', pprofileService.create);

router.get('/api/pprofile/all', pprofileService.findAll);

router.get('/api/pprofile/:id', pprofileService.findOne);

router.get('/api/pprofile/user/:userId', pprofileService.findAllByUser);

router.patch('/api/pprofile/:id', pprofileService.update);

router.delete('/api/pprofile/:id', pprofileService.delete);

module.exports = router;