const context = require('../api.services/contextService');
const { userUpdateSchema } = require('../api.validators/validationService');

class UserHelper {

    findById(id) {
        return context.getUserById(id);
    }

    findAll() {
        return context.getAllUsers();
    }

    async update(id, updates) {
        const parsed = userUpdateSchema.safeParse(updates);
        if (!parsed.success) return { success: false, message: parsed.error.format() };
        const user = await context.updateUser(id, parsed.data);
        return { success: true, data: user, message: 'User updated successfully' };
    }

    delete(id) {
        return context.deleteUser(id);
    }
}

module.exports = new UserHelper();
