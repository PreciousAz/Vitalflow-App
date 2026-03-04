const { z } = require('zod');

const userSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().min(1),
    gender: z.enum(['M', 'F', 'Other']),
    address: z.string(),
    dob: z.string(), // could use date string pattern
    usertype: z.string(), // e.g., 'patient', 'doctor'
    profession: z.string().optional().nullable(),
});

const userUpdateSchema = z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    profession: z.string().optional().nullable(),
});

const profileSchema = z.object({
    userId: z.string().uuid(),
    purl: z.string().optional().nullable(),
    ecd: z.string().optional().nullable(),
    pd: z.string().optional().nullable(),
});

const profileUpdateSchema = z.object({
    purl: z.string().optional().nullable(),
    ecd: z.string().optional().nullable(),
    pd: z.string().optional().nullable(),
});

const medicalHistorySchema = z.object({
    userId: z.string().uuid(),
    emc: z.string().optional().nullable(),
    allergies: z.string().optional().nullable(),
    cms: z.string().optional().nullable(),
});

const medicalHistoryUpdateSchema = z.object({
    emc: z.string().optional().nullable(),
    allergies: z.string().optional().nullable(),
    cms: z.string().optional().nullable(),
});

const pprofileSchema = z.object({
    userId: z.string().uuid(),
    medicallic: z.string().optional().nullable(),
    specialties: z.string().optional().nullable(),
    qualifications: z.string().optional().nullable(),
    ahs: z.string().optional().nullable(),
    ctp: z.string().optional().nullable(),
    usd: z.string().optional().nullable(),
    ugovId: z.string().optional().nullable(),
    yoe: z.string().optional().nullable(),
    bpd: z.string().optional().nullable(),
    purl: z.string().optional().nullable(),
    bio: z.string().optional().nullable(),
    experience: z.string().optional().nullable(),
});

const pprofileUpdateSchema = z.object({
    specialties: z.string().optional().nullable(),
    purl: z.string().optional().nullable(),
    bio: z.string().optional().nullable(),
    experience: z.string().optional().nullable(),
});

const messageSchema = z.object({
    sender_id: z.string().uuid(),
    receiver_id: z.string().uuid(),
    content: z.string().min(1),
});

const appointmentSchema = z.object({
    user_id: z.string().uuid(),
    date: z.string(),
    reason: z.string().optional().nullable(),
    doctor_id: z.string().optional().nullable(),
    status: z.string().optional(),
    consultation: z.string().optional(),
    appointment: z.string().optional(),
    time: z.string().optional(),
});

const patientsSchema = z.object({
    user_id: z.string().uuid(),
    date: z.string(),
    reason: z.string().optional().nullable(),
    doctor_id: z.string().optional().nullable(),
    email: z.string().optional(),
    blood_group: z.string().optional(),
    name: z.string().optional(),
    disease: z.string().optional(),
    gender: z.string().optional(),
});

const paymentSchema = z.object({
    user_id: z.string().uuid(),
    patient_name: z.string(),
    doctor_name: z.string(),
    doctor_id: z.string().optional().nullable(),
    gender: z.string().optional(),
    consultation: z.string().optional(),
    status: z.enum(['Pending', 'Paid', 'Cancelled']).default('Pending'),
    amount: z.string().min(1),
});

const paymentUpdateSchema = z.object({
    status: z.enum(['Pending', 'Paid', 'Cancelled']),
});

const appointmentUpdateSchema = z.object({
    status: z.string().optional().nullable(),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

const completedSchema = z.object({
    completed: z.boolean().default(false),
});

const signupSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string(),
    phone: z.string().min(1),
    gender: z.enum(['M', 'F', 'Other']),
    address: z.string(),
    dob: z.string(),
    usertype: z.string(),
    profession: z.string().optional().nullable(),
});

module.exports = {
    loginSchema,
    signupSchema,
    userUpdateSchema,
    profileSchema,
    profileUpdateSchema,
    messageSchema,
    appointmentSchema,
    appointmentUpdateSchema,
    pprofileSchema,
    pprofileUpdateSchema,
    medicalHistorySchema,
    medicalHistoryUpdateSchema,
    completedSchema,
    paymentSchema,
    paymentUpdateSchema,
    patientsSchema,
}