const { initDB } = require('../db/dbContext');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const { loginSchema } = require('../api.validators/validationService');
const { generateAccessToken, generateRefreshToken } = require('../api.utils/helperService');
const jwt = require('jsonwebtoken');
const { getIO, getOnlineUsers } = require("./socketService");

function normalize(value) {
    return value === undefined ? null : value;
}

class ContextService {

    constructor() {
        this.dbPromise = initDB();
        this.io = getIO();
        this.onlineUsers = getOnlineUsers();
    }

    // USERS
    /* createUser1(user) {
        const id = uuidv4();
        const hashedPassword = bcrypt.hashSync(user.password, 10);
        const stmt = db.prepare(`
      INSERT INTO users (id, name, email, password, phone, gender, address, dob, usertype, profession)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
        stmt.run(id, user.name, user.email, hashedPassword, user.phone, user.gender, user.address, user.dob, user.usertype, user.profession);
        return { id, ...user };
    } */
    async createUser(user) {
        const db = await this.dbPromise;
        const id = uuidv4();
        const hashedPassword = bcrypt.hashSync(user.password, 10);

        const query = `
            INSERT INTO users 
            (id, name, email, password, phone, gender, address, dob, usertype, profession)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            id,
            normalize(user.name),
            normalize(user.email),
            normalize(hashedPassword),
            normalize(user.phone),
            normalize(user.gender),
            normalize(user.address),
            normalize(user.dob),
            normalize(user.usertype),
            normalize(user.profession),
        ];
        const [result] = await db.execute(query, values);
        return { id, ...user, password: undefined };
    }

    /* updateCompleted(userId) {
        const stmt = db.prepare(`
        UPDATE users
        SET completed = 1
        WHERE id = ?
        `);
        const result = stmt.run(userId);
        return result.changes;
    } */

    async updateCompleted(userId) {
        const db = await this.dbPromise;
        const query = `
                UPDATE users
                SET completed = 1
                WHERE id = ?
            `;

        const [result] = await db.execute(query, [userId]);
        return result.affectedRows;
    }

    /*  getallprofiles() {
         const stmt = db.prepare(`
         SELECT 
         pprofile.*,
         users.name,
         users.email,
         users.phone,
         users.gender,
         users.address,
         users.dob,
         users.usertype,
         users.profession,
         users.completed
         FROM pprofile
         INNER JOIN users
         ON pprofile.userId = users.id
     `);
         const result = stmt.all();
         return result;
     } */

    async getAllProfiles() {
        const db = await this.dbPromise;
        const query = `
                SELECT 
                pprofile.*,
                users.name,
                users.email,
                users.phone,
                users.gender,
                users.address,
                users.dob,
                users.usertype,
                users.profession,
                users.completed
                FROM pprofile
                INNER JOIN users
                ON pprofile.userId = users.id
            `;

        const [rows] = await db.execute(query);
        return rows;
    }

    /* getUserById(id) {
        return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    } */

    async getUserById(id) {
        const db = await this.dbPromise;
        const query = `SELECT * FROM users WHERE id = ?`;
        const [rows] = await db.execute(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    /*  updateUser(id, updates) {
         const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
         const values = Object.values(updates);
         const stmt = db.prepare(`UPDATE users SET ${fields} WHERE id = ?`);
         const result = stmt.run(...values, id);
         return result.changes;
     } */

    async updateUser(id, updates) {
        const db = await this.dbPromise;
        const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
        const values = Object.values(updates);

        const query = `UPDATE users SET ${fields} WHERE id = ?`;
        const [result] = await db.execute(query, [...values, id]);

        return result.affectedRows;
    }

    /*     deleteUser(id) {
            const stmt = db.prepare('DELETE FROM users WHERE id = ?');
            return stmt.run(id).changes;
        } */

    async deleteUser(id) {
        const db = await this.dbPromise;
        const query = 'DELETE FROM users WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows;
    }

    async getAllUsers() {
        const db = await this.dbPromise;
        const query = 'SELECT * FROM users';
        const [rows] = await db.execute(query);
        return rows;
    }

    // PROFILES
    /*   createProfile(profile) {
          const stmt = db.prepare(`
        INSERT INTO profiles (userId, purl, ecd, pd)
        VALUES (?, ?, ?, ?)
      `);
          const info = stmt.run(profile.userId, profile.purl, profile.ecd, profile.pd);
          return { id: info.lastInsertRowid, ...profile };
      } */

    async createProfile(profile) {
        const db = await this.dbPromise;
        const query = `
            INSERT INTO profiles (userId, purl, ecd, pd)
            VALUES (?, ?, ?, ?)
        `;

        const [result] = await db.execute(query, [
            normalize(profile.userId),
            normalize(profile.purl),
            normalize(profile.ecd),
            normalize(profile.pd)
        ]);

        return { id: result.insertId, ...profile };
    }


    async getProfilesByUser(userId) {
        const db = await this.dbPromise;
        const query = 'SELECT * FROM profiles WHERE userId = ?';
        const [rows] = await db.execute(query, [userId]);
        return rows;;
    }

    async getProfileById(id) {
        const db = await this.dbPromise;
        const query = 'SELECT * FROM profiles WHERE id = ?';
        const [rows] = await db.execute(query, [id])
        return rows.length > 0 ? rows[0] : null;
    }

    /*  // GET all for user
     getProfilesByUser(userId) {
         return db.prepare('SELECT * FROM profiles WHERE userId = ?').all(userId);
     } */

    // UPDATE
    async updateProfile(id, updates) {
        const db = await this.dbPromise;
        const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
        const values = Object.values(updates);
        const query = `UPDATE profiles SET ${fields} WHERE userId = ?`;
        const result = await db.execute(query, [...values, id]);
        return result.affectedRows;
    }

    // DELETE
    async deleteProfile(id) {
        const db = await this.dbPromise;
        const query = 'DELETE FROM profiles WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows;
    }

    // MEDICAL HISTORY
    async createMedicalHistory(data) {
        const db = await this.dbPromise;
        const query = `INSERT INTO medicalhistory (userId, emc, allergies, cms)
                        VALUES (?, ?, ?, ?)
                        `;
        const result = await db.execute(query, [normalize(data.userId), normalize(data.emc), normalize(data.allergies), normalize(data.cms)]);
        return { id: result.insertId, ...data };
    }

    // GET by id
    async getMedicalHistoryById(id) {
        const db = await this.dbPromise;
        const query = 'SELECT * FROM medicalhistory WHERE id = ?';
        const [rows] = await db.execute(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    // GET all by user
    async getMedicalHistoriesByUser(userId) {
        const db = await this.dbPromise;
        const query = 'SELECT * FROM medicalhistory WHERE userId = ?';
        const [rows] = await db.execute(query, [userId]);
        return rows.length > 0 ? rows : [];
    }

    // UPDATE
    async updateMedicalHistory(id, updates) {
        const db = await this.dbPromise;
        const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
        const values = Object.values(updates);
        const query = `UPDATE medicalhistory SET ${fields} WHERE id = ?`;
        const [result] = await db.execute(query, [...values, id]);
        return result.affectedRows;
    }

    // DELETE
    async deleteMedicalHistory(id) {
        const db = await this.dbPromise;
        const query = 'DELETE FROM medicalhistory WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows;
    }

    async getMedicalHistoryByUser(userId) {
        const db = await this.dbPromise;
        const query = 'SELECT * FROM medicalhistory WHERE userId = ?';
        const [rows] = await db.execute(query, [userId]);
        return rows.length > 0 ? rows[0] : null;
    }

    // PPROFILE
    async createPProfile(pprofile) {
        const db = await this.dbPromise;
        const query = `
      INSERT INTO pprofile 
      (userId, medicallic, specialties, qualifications, ahs, ctp, usd, ugovId, yoe, bpd, purl, bio, experience)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        const [result] = await db.execute(query,
            [normalize(pprofile.userId), normalize(pprofile.medicallic), normalize(pprofile.specialties), normalize(pprofile.qualifications),
            normalize(pprofile.ahs), normalize(pprofile.ctp), normalize(pprofile.usd), normalize(pprofile.ugovId), normalize(pprofile.yoe), normalize(pprofile.bpd),
            normalize(pprofile.purl), normalize(pprofile.bio), normalize(pprofile.experience)]
        );
        return { id: result.insertId, ...pprofile };
    }

    async createPayment(payment) {
        const db = await this.dbPromise;
        const query = `
            INSERT INTO payments (user_id, doctor_id, doctor_name, patient_name, gender, consultation, status, amount)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query,
            [normalize(payment.user_id),
            normalize(payment.doctor_id),
            normalize(payment.doctor_name),
            normalize(payment.patient_name),
            normalize(payment.gender),
            normalize(payment.consultation),
            payment.status || 'Pending',
            normalize(payment.amount)]
        );
        return { id: result.insertId, ...payment };
    }

    async createPatient(patient) {
        const db = await this.dbPromise;
        const query = `
            INSERT INTO patients (user_id, doctor_id, name, disease, date, gender, email, reason, blood_group)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query,
            [normalize(patient.user_id),
            normalize(patient.doctor_id),
            normalize(patient.name),
            normalize(patient.disease),
            patient.date || new Date().toISOString(),
            normalize(patient.gender),
            normalize(patient.email),
            normalize(patient.reason),
            normalize(patient.blood_group)]
        );
        return { id: result.insertId, ...patient };
    }

    async getAllPatientsWithDetails() {
        const db = await this.dbPromise;
        const query = `
            SELECT 
            p.id AS patient_id,
            p.name AS patient_name,
            p.date,
            p.gender AS patient_gender,
            p.disease,
            p.email AS patient_email,
            p.reason,
            p.blood_group,
            p.user_id,
            p.doctor_id,
            
            u.name AS user_name,
            u.email AS user_email,
            u.phone AS user_phone,
            u.gender AS user_gender,
            u.address AS user_address,
            u.dob AS user_dob,
            u.usertype,
            u.profession,
            
            pr.purl,
            pr.ecd,
            pr.pd
            FROM patients p
            JOIN users u ON u.id = p.user_id
            LEFT JOIN profiles pr ON pr.userId = u.id
            ORDER BY p.created_at DESC
        `;
        const [rows] = await db.execute(query);
        return rows;
    }

    async getAllPayments() {
        const db = await this.dbPromise;
        const query = `SELECT * FROM payments ORDER BY date DESC`;
        const [rows] = await db.execute(query);
        return rows;
    }

    async getPaymentsByPatientName(name) {
        const db = await this.dbPromise;
        const query = `SELECT * FROM payments WHERE patient_name = ? ORDER BY date DESC`;
        const [rows] = await db.execute(query, [name]);
        return rows.length > 0 ? rows[0] : null;
    }

    async getPaymentsByUser(userId) {
        const db = await this.dbPromise;
        const query = `
        SELECT * FROM payments
         WHERE user_id = ? OR doctor_id = ?
        ORDER BY date DESC
    `;
        const [rows] = await db.execute(query, [userId, userId]);
        return rows;
    }

    async deletePayment(id) {
        const db = await this.dbPromise;
        const query = `DELETE FROM payments WHERE id = ?`;
        const [result] = await db.execute(query, [id]);
        return result.affectedRows;
    }

    // GET by id
    async getPProfileById(id) {
        const db = await initDB();
        const query = 'SELECT * FROM pprofile WHERE id = ?';
        const [rows] = await db.execute(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    // GET all by user
    async getPProfilesByUser(userId) {
        const db = await this.dbPromise;
        const query = 'SELECT * FROM pprofile WHERE userId = ?';
        const [rows] = await db.execute(query, [userId]);
        return rows.length > 0 ? rows[0] : null;
    }

    // UPDATE
    async updatePProfile(id, updates) {
        const db = await this.dbPromise;
        const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
        const values = Object.values(updates);
        const query = `UPDATE pprofile SET ${fields} WHERE userId = ?`;
        const [result] = await db.execute(query, [...values, id])
        return result.affectedRows;
    }

    // DELETE
    async deletePProfile(id) {
        const db = await this.dbPromise;
        const query = 'DELETE FROM pprofile WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows;
    }

    async getPProfileByUser(userId) {
        const db = await this.dbPromise;
        const query = 'SELECT * FROM pprofile WHERE userId = ?';
        const [rows] = await db.execute(query, [userId]);
        return rows.length > 0 ? rows[0] : null;
    }

    // MESSAGES
    async sendMessage(message) {
        const db = await this.dbPromise;
        const id = uuidv4();
        const query = `
      INSERT INTO messages (id, sender_id, receiver_id, content)
      VALUES (?, ?, ?, ?)
    `;
        const [result] = await db.execute(query, [id, message.sender_id, message.receiver_id, message.content]);
        const [rows] = await db.execute(`SELECT * FROM messages WHERE id = ?`, [result.insertId]);
        const newMessage = rows[0];
        const receiverSocket = this.onlineUsers?.get(message.receiver_id);
        if (receiverSocket) {
            this.io.to(receiverSocket).emit("newMessage", newMessage);
        }
        return newMessage;
    }

    /*     getMessagesBetweenUsers(user1, user2) {
            return db.prepare(`
          SELECT * FROM messages
          WHERE (sender_id = ? AND receiver_id = ?)
             OR (sender_id = ? AND receiver_id = ?)
          ORDER BY timestamp ASC
        `).all(user1, user2, user2, user1);
        } */

    async getMessagesBetweenUsers(user1, user2) {
        const db = await this.dbPromise;
        const query = `
            SELECT * FROM messages
            WHERE (sender_id = ? AND receiver_id = ?)
            OR (sender_id = ? AND receiver_id = ?)
            ORDER BY timestamp ASC
        `;
        const [rows] = await db.execute(query, [user1, user2, user2, user1]);
        return rows;
    }

    // GET by id
    async getMessageById(id) {
        const db = await this.dbPromise;
        const query = 'SELECT * FROM messages WHERE id = ?';
        const [rows] = await db.execute(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    // DELETE by id
    async deleteMessage(id) {
        const db = await this.dbPromise;
        const query = 'DELETE FROM messages WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows
    }

    // APPOINTMENTS
    async createAppointment(appointment) {
        const db = await this.dbPromise;
        const id = uuidv4();
        const query = `
      INSERT INTO appointments (id, user_id, date, reason, doctor_id, status, consultation, appointment, time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        const [result] = await db.execute(query, [id, appointment.user_id, appointment.date, appointment.reason, appointment.doctor_id, appointment.status, appointment.consultation, appointment.appointment, appointment.time]);
        return { id, ...appointment }
    }

    // GET by id
    async getAppointmentById(id) {
        const db = await this.dbPromise;
        const query = 'SELECT * FROM appointments WHERE id = ?';
        const [rows] = await db.execute(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    // GET all for user
    async getAppointmentsByUser(userId) {
        const db = await this.dbPromise;
        const query = 'SELECT * FROM appointments WHERE user_id = ? OR doctor_id = ? ORDER BY date ASC';
        const [rows] = await db.execute(query, [userId, userId]);
        return rows;
    }

    // UPDATE
    async updateAppointment(id, updates) {
        const db = await this.dbPromise;
        const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
        const values = Object.values(updates);
        const query = `UPDATE appointments SET ${fields} WHERE id = ?`;
        const [result] = await db.execute(query, [...values, id]);
        return { result: result.affectedRows, ...updates };
    }

    // DELETE
    async deleteAppointment(id) {
        const db = await this.dbPromise;
        const query = 'DELETE FROM appointments WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows;
    }

    async login(credentials) {
        const db = await this.dbPromise;
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return { success: false, message: parsed.error.format() }
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.execute(query, [parsed.data.email])
        if (rows.length === 0) return { success: false, message: 'User not found' };
        const user = rows[0];
        const valid = bcrypt.compareSync(parsed.data.password, user.password);
        if (!valid) return { success: false, message: 'Invalid email or password' }
        const token = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        return { success: true, user, token, refreshToken };
    }

    refreshToken(oldRefreshToken) {
        try {
            const decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
            const newAccessToken = generateAccessToken(decoded.userId);
            const newRefreshToken = generateRefreshToken(decoded.userId);
            return { success: true, accessToken: newAccessToken, refreshToken: newRefreshToken };
        } catch (e) {
            return {
                success: false,
                message: 'Invalid or expired refresh token'
            }
        }
    }

    async getUserByIdEmail(email) {
        const db = await this.dbPromise;
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.execute(query, [email]);
        return rows.length > 0 ? rows[0] : null;
    }

    getUserConversations = async (userId) => {
        const db = await this.dbPromise;
        const query = `
    SELECT 
      u.id AS other_user_id,
      u.name AS other_user_name,
      m.content AS last_message,
      m.timestamp AS last_message_time
    FROM messages m
    JOIN users u 
      ON u.id = CASE 
                  WHEN m.sender_id = ? THEN m.receiver_id
                  ELSE m.sender_id
                END
    WHERE (m.sender_id = ? OR m.receiver_id = ?)
      AND m.timestamp = (
        SELECT MAX(timestamp) 
        FROM messages 
        WHERE (sender_id = u.id AND receiver_id = ?)
           OR (sender_id = ? AND receiver_id = u.id)
      )
    GROUP BY other_user_id
    ORDER BY last_message_time DESC
  `;

        const [rows] = await db.execute(query, [userId, userId, userId, userId, userId]);
        return rows;
    };

    async updateMessageStatus(messageId) {
        const db = await this.dbPromise;
        const query = `UPDATE messages SET is_read = 1 WHERE id = ?`;
        const [result] = await db.execute(query, [messageId]);
        return result.affectedRows;
    }

    async UserAppointmentsByDoctor(userId) {
        const db = await this.dbPromise;
        const query = `
        SELECT 
            a.doctor_id,
            u.name AS doctor_name,
            u.email AS doctor_email,
            u.phone AS doctor_phone,
            u.gender AS doctor_gender,
            u.profession,
            p.purl AS profile_image_url,
            p.specialties AS doctor_specialties,
            COUNT(a.id) AS total_appointments
        FROM appointments a
        JOIN users u 
            ON u.id = a.doctor_id
        LEFT JOIN pprofile p 
            ON p.userId = a.doctor_id
        WHERE a.user_id = ?
        GROUP BY a.doctor_id
        ORDER BY total_appointments DESC
        `;
        const [rows] = await db.execute(query, [userId]);
        return rows;
    }

    async getUserMessages(userId) {
        const db = await this.dbPromise;
        const query = `
        SELECT *
        FROM messages
        WHERE sender_id = ? OR receiver_id = ?
        ORDER BY timestamp ASC
        `;
        const [rows] = await db.execute(query, [userId, userId]);
        return rows;
    }

    async UserAppointmentsByUser(userId) {
        const db = await this.dbPromise;
        const query = `
        SELECT 
            a.user_id,
            a.status,
            a.reason,
            a.date,
            a.time,
            a.id,
            a.consultation,
            a.appointment,
            a.user_id,
            a.created_at,
            u.name AS name,
            u.email AS email,
            u.phone AS phone,
            u.gender AS gender,
            u.dob AS dob,
            u.profession,
            p.purl AS purl,
            COUNT(a.id) OVER (PARTITION BY a.user_id) AS total_appointments
        FROM appointments a
        JOIN users u 
            ON u.id = a.user_id
        LEFT JOIN profiles p 
            ON p.userId = a.user_id
        WHERE a.doctor_id = ?
        ORDER BY total_appointments DESC
        `;
        const [rows] = await db.execute(query, [userId]);
        return rows;
    }
    //GROUP BY a.user_id
}

module.exports = new ContextService();

