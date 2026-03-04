const context = require('../api.services/contextService');
const { appointmentSchema, appointmentUpdateSchema } = require('../api.validators/validationService');

class AppointmentHelper {
  async create(data) {
    const parsed = appointmentSchema.safeParse(data);
    if (!parsed.success) return { success: false, message: parsed.error.format() };
    const result = await context.createAppointment(parsed.data);
    return { success: true, data: result, message: 'Appointment submitted successfully' }
  }

  findById(id) {
    return context.getAppointmentById(id);
  }

  findAllByUser(userId) {
    return context.getAppointmentsByUser(userId);
  }

  getUserAppointmentsByDoctor(userId){
    return context.UserAppointmentsByDoctor(userId);
  }

  getUserAppointmentsByUser(userId){
    return context.UserAppointmentsByUser(userId);
  }

async update(id, updates) {
    const parsed = appointmentUpdateSchema.safeParse(updates);
    if (!parsed.success) return { success: false, message: parsed.error.format() };
    const result = await context.updateAppointment(id, parsed.data);
    return { success: true, data: result, message: 'Appointment updated successfully' }
  }

  delete(id) {
    return context.deleteAppointment(id);
  }
}

module.exports = new AppointmentHelper();