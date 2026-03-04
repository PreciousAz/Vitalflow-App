const historyHelper = require('../api.utils/medicalHistoryHelper');

class MedicalHistoryService {

    async create(req, res) {
        try {
            const record = await historyHelper.create(req.body);
            return res.status(record.success ? 200 : 400).json({ ...record });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    async findOne(req, res) {
        try {
            const record = await historyHelper.findById(req.params.id);
            if (!record) return res.status(404).json({ error: 'Record not found' });
            return res.status(200).json({ success: true, data: record });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    async findAllByUser(req, res) {
        try {
            const records = await historyHelper.findAllByUser(req.params.userId);
            return res.status(200).json({ success: true, data: records });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    async update(req, res) {
        try {
            const updated = await historyHelper.update(req.params.id, req.body);
            return res.status(updated.success ? 200 : 400).json({ ...updated });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    async delete(req, res) {
        try {
            const deleted = await historyHelper.delete(req.params.id);
            return res.status(200).json({ success: true, data: deleted });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }
}

module.exports = new MedicalHistoryService();