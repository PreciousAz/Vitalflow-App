const context = require('../api.services/contextService');
const { patientsSchema } = require('../api.validators/validationService');


class PatientHelper {
   async create(data) {
        const parsed = patientsSchema.safeParse(data);
        if (!parsed.success) return { success: false, message: parsed.error.format() };
        const result = await context.createPatient(parsed.data);
        return { success: true, data: result, message: 'Patient created successfully' }
    }

    findAll() {
        return context.getAllPatientsWithDetails();
    }

}

module.exports = new PatientHelper();