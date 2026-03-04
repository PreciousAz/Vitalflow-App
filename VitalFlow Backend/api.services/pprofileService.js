const pprofileHelper = require('../api.utils/pprofileHelper');

class PProfileService {
    async create(req, res) {
        try {
            const pprofile = await pprofileHelper.create(req.body);
            return res.status(pprofile.success ? 200 : 400).json({ ...pprofile });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    async findAll(req, res) {
        try {
            const pprofiles = await pprofileHelper.findAll();
            return res.status(200).json({ success: true, data: pprofiles });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    async findOne(req, res) {
        try {
            const profile = await pprofileHelper.findById(req.params.id);
            if (!profile) return res.status(404).json({ error: 'PProfile not found' });
            return res.status(200).json({ success: true, data: profile });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    async findAllByUser(req, res) {
        try {
            const profiles = await pprofileHelper.findAllByUser(req.params.userId);
            return res.status(200).json({ success: true, data: profiles });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    async update(req, res) {
        try {
            const updated = await pprofileHelper.update(req.params.id, req.body);
            return res.status(updated.success ? 200 : 400).json({ ...updated });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    async delete(req, res) {
        try {
            const deleted = await pprofileHelper.delete(req.params.id);
            return res.status(200).json({ success: true, data: deleted });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }
}

module.exports = new PProfileService();