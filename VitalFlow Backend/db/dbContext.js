const mysql2 = require("mysql2/promise");

let connection;
async function initDB() {
  if (!connection) {
    connection = await mysql2.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      port: process.env.DB_PORT,
      //database: process.env.DB_NAME,
    });

    console.log("✅ MySQL Connected!");

    // Create database if not exists
    await connection.query("CREATE DATABASE IF NOT EXISTS vitalflow");
    console.log("✅ Database Created");

    // Switch to database
    await connection.changeUser({ database: "vitalflow" });

    // Run migrations / init tables
    await initTableCreation(connection);
  }

  return connection;
}

async function initTableCreation(db) {
  // USERS
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      gender ENUM('M', 'F', 'Other'),
      address TEXT NOT NULL,
      dob DATE NOT NULL,
      usertype VARCHAR(50) NOT NULL,
      completed TINYINT DEFAULT 0, 
      profession VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // PROFILES
  await db.execute(`
    CREATE TABLE IF NOT EXISTS profiles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId VARCHAR(50),
      purl TEXT,
      ecd TEXT,
      pd TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // MEDICAL HISTORY
  await db.execute(`
    CREATE TABLE IF NOT EXISTS medicalhistory (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId VARCHAR(50),
      emc TEXT,
      allergies TEXT,
      cms TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // PROFESSIONAL PROFILE (Doctor Profile)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS pprofile (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId VARCHAR(50),
      medicallic TEXT,
      specialties TEXT,
      qualifications TEXT,
      ahs TEXT,
      ctp TEXT,
      usd TEXT,
      ugovId TEXT,
      purl TEXT,
      bio TEXT,
      experience TEXT,
      yoe TEXT,
      bpd TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // MESSAGES
  await db.execute(`
    CREATE TABLE IF NOT EXISTS messages (
      id VARCHAR(50) PRIMARY KEY,
      sender_id VARCHAR(50) NOT NULL,
      receiver_id VARCHAR(50) NOT NULL,
      content TEXT NOT NULL,
      is_read TINYINT DEFAULT 0,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES users(id),
      FOREIGN KEY (receiver_id) REFERENCES users(id)
    )
  `);

  // PATIENTS
  await db.execute(`
    CREATE TABLE IF NOT EXISTS patients (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      date DATE NOT NULL,
      gender VARCHAR(20) NOT NULL,
      disease TEXT,
      email VARCHAR(100) NOT NULL,
      reason TEXT,
      blood_group VARCHAR(10),
      user_id VARCHAR(50) UNIQUE NOT NULL,
      doctor_id VARCHAR(50),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (doctor_id) REFERENCES users(id)
    )
  `);

  // PAYMENTS
  await db.execute(`
    CREATE TABLE IF NOT EXISTS payments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id VARCHAR(50) NOT NULL,
      doctor_id VARCHAR(50),
      patient_name VARCHAR(100) NOT NULL,
      doctor_name VARCHAR(100) NOT NULL,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      gender ENUM('Male', 'Female', 'Other') NOT NULL,
      consultation TEXT NOT NULL,
      status ENUM('Pending', 'Paid', 'Cancelled') DEFAULT 'Pending',
      amount TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (doctor_id) REFERENCES users(id)
    )
  `);

  // APPOINTMENTS
  await db.execute(`
    CREATE TABLE IF NOT EXISTS appointments (
      id VARCHAR(50) PRIMARY KEY,
      user_id VARCHAR(50) NOT NULL,
      date DATE NOT NULL,
      doctor_id VARCHAR(50),
      status VARCHAR(50) DEFAULT 'pending',
      consultation TEXT,
      appointment TEXT,
      time VARCHAR(20),
      reason TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (doctor_id) REFERENCES users(id)
    )
  `);

  console.log("✅ Database initialized successfully in MySQL");
}

module.exports = { initDB };

//ecd ---> Emergency Contact Details
//pd ----> preferred doctor/specialty
//purl ----> profile url
//emc ----> Existing Medical Conditions
//cms ----> Current Conditions
//yoe ----> Years Of Experiences
//purl ----> professional profile
//ahs ----> Affiliated Hospitals or Clinic
//ctp ---> Consultation Types and Pricing
//ugovId  ----> Upload Government-Issued Id or Verification Document
//usd  ----> Upload Supporting Document
//bpd ----> Bank Payment Details
