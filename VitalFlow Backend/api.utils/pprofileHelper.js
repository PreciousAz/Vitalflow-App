const context = require('../api.services/contextService');
const { pprofileSchema, pprofileUpdateSchema } = require('../api.validators/validationService');

class PProfileHelper {
   async create(data) {
        const parsed = pprofileSchema.safeParse(data);
        if (!parsed.success) return { success: false, message: parsed.error.format() };
        const result = await context.createPProfile(parsed.data);
        return { success: true, data: result, message: 'Professional profile created successfully' }
    }

    findById(id) {
        return context.getPProfileById(id);
    }

    findAllByUser(userId) {
        return context.getPProfilesByUser(userId);
    }

    findAll() {
        return context.getAllProfiles();
    }

   async update(id, updates) {
        const parsed = pprofileUpdateSchema.safeParse(updates);
        if (!parsed.success) return { success: false, message: parsed.error.format() };
        const result = await context.updatePProfile(id, parsed.data);
        return { success: true, data: result, message: 'Profile updated successfully' }
    }

    delete(id) {
        return context.deletePProfile(id);
    }
}

module.exports = new PProfileHelper();