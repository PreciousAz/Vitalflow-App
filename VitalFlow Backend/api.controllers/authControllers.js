const express = require('express');
const router = express.Router();
const authService = require('../api.services/authService');

router.post('/api/auth/signup', authService.signup);

router.post('/api/auth/login', authService.login);

router.post('/api/auth/refresh', authService.refresh);

router.patch('/api/auth/profile-completed/:id', authService.completed);

module.exports = router;