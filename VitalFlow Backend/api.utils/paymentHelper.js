const context = require('../api.services/contextService');
const { paymentSchema, paymentUpdateSchema, } = require('../api.validators/validationService');

class PaymentHelper {
   async create(data) {
        const parsed = paymentSchema.safeParse(data);
        if (!parsed.success) return { success: false, message: parsed.error.format() };
        const result = await context.createPayment(parsed.data);
        return { success: true, data: result, message: 'Payment was successfully' }
    }

    PaymentsByPatientName(name) {
        return context.getPaymentsByPatientName(name);
    }

    getPaymentsByUser(userId) {
        return context.getPaymentsByUser(userId);
    }

    delete(id) {
        return context.deletePayment(id);
    }
}

module.exports = new PaymentHelper();