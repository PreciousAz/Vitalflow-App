const context = require('../api.services/contextService');
const { medicalHistorySchema, medicalHistoryUpdateSchema } = require('../api.validators/validationService');

class MedicalHistoryHelper {
    async create(data) {
        const parsed = medicalHistorySchema.safeParse(data);
        if (!parsed.success) return { success: false, message: parsed.error.format() };
        const result = await context.createMedicalHistory(parsed.data);
        return { success: true, data: result, message: 'Medical history created successfully' }
    }

    findById(id) {
        return context.getMedicalHistoryById(id);
    }

    findAllByUser(userId) {
        return context.getMedicalHistoriesByUser(userId);
    }

    async update(id, updates) {
        const parsed = medicalHistoryUpdateSchema.safeParse(updates);
        if (!parsed.success) return { success: false, message: parsed.error.format() };
        const result = await context.updateMedicalHistory(id, parsed.data);
        return { success: true, data: result, message: 'Medical history updated successfully' }
    }

    delete(id) {
        return context.deleteMedicalHistory(id);
    }
}

module.exports = new MedicalHistoryHelper();