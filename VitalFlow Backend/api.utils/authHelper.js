const { loginSchema, signupSchema } = require('../api.validators/validationService');
const context = require('../api.services/contextService');
const { generateAccessToken, generateRefreshToken } = require('../api.utils/helperService');


class AuthService {
    async signup(data) {
        const parsed = signupSchema.safeParse(data);
        if (!parsed.success) { return { success: false, message: parsed.error.format() } };
        const existingUser = await context.getUserByIdEmail(parsed.data.email);
        if (existingUser) return { success: false, message: 'This email is already registered. Please use a different one.' };
        const user = await context.createUser(parsed.data);
        const token = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);
        return { success: true, user, token, refreshToken, message: 'User created successfully' };
    }

     login(credentials) {
        return context.login(credentials);
    }

    refresh(oldRefreshToken) {
        return context.refreshToken(oldRefreshToken);
    }

    async profileCompleted(userId) {
        const updated = await context.updateCompleted(userId);
        return { success: true, updated, message: 'User updated successfully' };
    }
}

module.exports = new AuthService();