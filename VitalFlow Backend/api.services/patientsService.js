const patientHelper = require('../api.utils/patientHelper');

class PatientsService {
   async create(req, res) {
        try {
            const patient = await patientHelper.create(req.body);
            return res.status(patient.success ? 200 : 400).json({ ...patient });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }


   async findAll(req, res) {
        try {
            const patients = await patientHelper.findAll();
            return res.status(200).json({ success: true, data: patients });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    }

    /* delete(req, res) {
        try {
            const deleted = paymentHelper.delete(req.params.id);
            return res.status(200).json({ success: true, data: deleted });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: e.message });
        }
    } */
}

module.exports = new PatientsService();