const appointmentHelper = require('../api.utils/appointmentHelper');

class AppointmentService {
    async create(req, res) {
        try {
            const appointment = await appointmentHelper.create(req.body);
            return res.status(appointment.success ? 200 : 400).json({ ...appointment });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    async findOne(req, res) {
        try {
            const appointment = await appointmentHelper.findById(req.params.id);
            if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
            return res.status(200).json({ success: true, data: appointment });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    async findAllByUser(req, res) {
        try {
            const appointments = await appointmentHelper.findAllByUser(req.params.userId);
            return res.status(200).json({ success: true, data: appointments });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    async getUserAppointmentsByDoctor(req, res) {
        try {
            const id = req.params.id;
            if (!id) { return res.status(401).json({ success: false, mesaage: 'Invalid user id' }) };
            const appointments = await appointmentHelper.getUserAppointmentsByDoctor(id);
            return res.status(200).json({ success: true, data: appointments });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    async getUserAppointmentsByUser(req, res) {
        try {
            const id = req.params.id;
            if (!id) { return res.status(401).json({ success: false, mesaage: 'Invalid user id' }) };
            const appointments = await appointmentHelper.getUserAppointmentsByUser(id);
            return res.status(200).json({ success: true, data: appointments });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    async update(req, res) {
        try {
            const updated = await appointmentHelper.update(req.params.id, req.body);
            return res.status(updated.success ? 200 : 400).json({ ...updated });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    async delete(req, res) {
        try {
            const deleted = await appointmentHelper.delete(req.params.id);
            return res.status(200).json({ success: true, data: deleted });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }
}

module.exports = new AppointmentService();