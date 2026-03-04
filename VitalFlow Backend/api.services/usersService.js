const users = require('../api.utils/userHelper');


class Users {
    async findOne(req, res) {
        try {
            const user = await users.findById(req.params.id);
            if (!user) return res.status(404).json({ success: false, MESSAGE: 'User not found' });
            return res.status(200).json({ success: true, data: user });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    async findAll(req, res) {
        try {
            const result = await users.findAll();
            return res.status(200).json({ success: true, data: result });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    async update(req, res) {
        try {
            const result = await users.update(req.params.id, req.body);
            res.status(result.success ? 200 : 401).json({ ...result });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    async delete(req, res) {
        try {
            const deleted = await users.delete(req.params.id);
            return res.status(200).json({ success: true, deleted });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }
}

module.exports = new Users();