const profiles = require('../api.utils/profileHelper')

class Profiles {
    async create(req, res) {
        try {
            const result = await profiles.create(req.body);
            return res.status(result.success ? 200 : 400).json({ ...result });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    async findOne(req, res) {
        try {
            const profile = await profiles.findById(req.params.id);
            if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });
            return res.status(200).json({ success: true, data: result });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    async findAllProfiles(req, res) {
        try {
            const result = await profiles.findAllByUser(req.params.userId);
            return res.status(200).json({ success: true, data: result });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    async update(req, res) {
        try {
            const result = await profiles.update(req.params.id, req.body);
            return res.status(result.success ? 200 : 400).json({ ...result });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    async delete(req, res) {
        try {
            const deleted = await profiles.delete(req.params.id);
            return res.status(200).json({ success: true, data: deleted });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }
}

module.exports = new Profiles();