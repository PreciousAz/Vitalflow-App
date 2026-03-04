const { success } = require('zod/v4');
const messages = require('../api.utils/messageHelper');

class MessageService {
    async create(req, res) {
        try {
            const result = await messages.create(req.body);
            return res.status(result.success ? 200 : 400).json({ ...result });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    async getById(req, res) {
        try {
            const msg = await messages.findById(req.params.id);
            if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
            return res.status(200).json({ success: true, data: msg });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    async getChat(req, res) {
        try {
            const { user1, user2 } = req.params;
            const msgs = await messages.findChatBetweenUsers(user1, user2);
            return res.status(200).json({ success: true, data: msgs });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    async getUserContactMessages(req, res) {
        try {
            const id = req.params.id;
            if (!id) { return res.status(401).json({ success: false, mesaage: 'Invalid user id' }) };
            const messageContacts = await messages.findUserContactMessages(id);
            return res.status(200).json({ success: true, data: messageContacts });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    async getAllUserMessages(req, res) {
        try {
            const id = req.params.id;
            if (!id) { return res.status(401).json({ success: false, mesaage: 'Invalid user id' }) };
            const result = await messages.getAllUSerMesssages(id);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    async updateChatStatus(req, res) {
        try {
            const id = req.params.id;
            if (!id) { return res.status(401).json({ success: false, mesaage: 'Invalid message id' }) };
            const result = await messages.updateMessageRead(id);
            return res.status(200).json({ success: true, data: result, message: 'Chat updated successfully' });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    async delete(req, res) {
        try {
            const del = await messages.delete(req.params.id);
            return res.status(200).json({ success: true, data: del });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }
}

module.exports = new MessageService();