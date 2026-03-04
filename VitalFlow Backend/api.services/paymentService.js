const paymentHelper = require('../api.utils/paymentHelper');

class PaymentService {
    async create(req, res) {
        try {
            const payment = await paymentHelper.create(req.body);
            return res.status(payment.success ? 200 : 400).json({ ...payment });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    async findPatientName(req, res) {
        try {
            const name = req.params.name;
            if (!name) { return res.status(401).json({ success: false, mesaage: 'Invalid user name' }) };
            const payments = await paymentHelper.findPatientName(name);
            if (!payments) return res.status(404).json({ success: false, message: 'Payments not found' });
            return res.status(200).json({ success: true, data: payments });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    async findAllByUser(req, res) {
        try {
            const id = req.params.id;
            if (!id) { return res.status(401).json({ success: false, mesaage: 'Invalid user id' }) };
            const payments = await paymentHelper.getPaymentsByUser(id);
            return res.status(200).json({ success: true, data: payments });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    async delete(req, res) {
        try {
            const deleted = await paymentHelper.delete(req.params.id);
            return res.status(200).json({ success: true, data: deleted });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }
}

module.exports = new PaymentService();