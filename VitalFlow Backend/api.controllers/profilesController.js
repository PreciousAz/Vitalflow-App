const express = require('express');
const router = express.Router();
const profiles = require('../api.services/profileService');

router.post('/api/profile/create', profiles.create);

router.get('/api/profile/:id', profiles.findOne);

router.get('/api/profile/user/:userId', profiles.findAllProfiles);

router.patch('/api/profile/:id', profiles.update);

router.delete('/api/profile/:id', profiles.delete);

module.exports = router;