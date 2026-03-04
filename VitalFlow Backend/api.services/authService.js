const authHelper = require('../api.utils/authHelper');

class UserController {
    async signup(req, res) {
        try {
            const result = await authHelper.signup(req.body);
            return res.status(result.success ? 200 : 400).json({ ...result });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error, please try again later', error: e.message });
        }
    }

    async login(req, res) {
        try {
            const result = await authHelper.login(req.body);
            return res.status(result.success ? 200 : 400).json({ ...result });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    async refresh(req, res) {
        try {
            const result = await authHelper.refresh(req.body.refreshToken);
            return res.status(result.success ? 200 : 400).json({ ...result });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    async completed(req, res) {
        try {
            const id = req.params.id;
            if (!id) { return res.status(401).json({ success: false, mesaage: 'Invalid user id' }) };
            const result = await authHelper.profileCompleted(id);
            return res.status(result.success ? 200 : 400).json({ ...result });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }
}

module.exports = new UserController();