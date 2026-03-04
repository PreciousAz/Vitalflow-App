const express = require('express');
const router = express.Router();
const messages = require('../api.services/chatService');

router.post('/api/chat/create', messages.create);

router.get('/api/chat/:id', messages.getById);

router.get('/api/chat/all/:id', messages.getAllUserMessages);

router.get('/api/chat/user/:id', messages.getUserContactMessages);

router.get('/api/chat/:user1/:user2', messages.getChat);

router.patch('/api/chat/status/:id', messages.updateChatStatus)

router.delete('/api/chat/:id', messages.delete);

module.exports = router;