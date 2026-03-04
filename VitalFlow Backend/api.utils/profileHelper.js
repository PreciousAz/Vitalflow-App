const context = require('../api.services/contextService');
const { profileSchema, profileUpdateSchema } = require('../api.validators/validationService');

class ProfileHelper {
    async create(data) {
        const parsed = profileSchema.safeParse(data);
        console.log('passed',parsed)
        if (!parsed.success) return { success: false, message: parsed.error.format() };
        const profile = await context.createProfile(parsed.data);
        return { success: true, data: profile, message: 'Profile updated successfully' }
    }

    findById(id) {
        return context.getProfileById(id);
    }

    findAllByUser(userId) {
        return context.getProfilesByUser(userId);
    }

    async update(id, updates) {
        const parsed = profileUpdateSchema.safeParse(updates);
        if (!parsed.success) return { success: false, message: parsed.error.format() };
        const result = await context.updateProfile(id, parsed.data);
        return { success: true, data: result, message: 'Profile updated successfully' }
    }

    delete(id) {
        return context.deleteProfile(id);
    }
}

module.exports = new ProfileHelper();