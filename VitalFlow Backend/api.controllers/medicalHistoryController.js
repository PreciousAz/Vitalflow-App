const express = require('express');
const router = express.Router();
const HistoryService = require('../api.services/medicalHistoryService');

router.post('/api/medhistory/create', HistoryService.create);

router.get('/api/medhistory/:id', HistoryService.findOne);

router.get('/api/medhistory/user/:userId', HistoryService.findAllByUser);

router.put('/api/medhistory/:id', HistoryService.update);

router.delete('/api/medhistory/:id', HistoryService.delete);

module.exports = router;