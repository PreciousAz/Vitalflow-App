const express = require('express');
const router = express.Router();
const users = require('../api.services/usersService');

router.get('/api/users/all', users.findAll);

router.get('/api/users/:id', users.findOne);

router.put('/api/users/:id', users.update);

router.delete('/api/users/:id', users.delete);

module.exports = router;