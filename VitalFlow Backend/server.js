const express = require('express');
const cors = require('cors');
const http = require("http");
const { initSocket } = require("./api.services/socketService.js");
const bodyParser = require('body-parser');
const app = express();
const server = http.createServer(app);
initSocket(server);
require('dotenv').config();
const authRoute = require('./api.controllers/authControllers');
const chatRoute = require('./api.controllers/chatControllers');
const appointmentRoute = require('./api.controllers/appointmentControllers');
const profileRoute = require('./api.controllers/profilesController');
const pprofileRoute = require('./api.controllers/pprofileContainer');
const usersRoute = require('./api.controllers/usersController');
const medRoute = require('./api.controllers/medicalHistoryController');
const uploadRoute = require("./api.controllers/api.uploadControllers.js");
const paymentRoute = require('./api.controllers/paymentController');
const patientRoute = require('./api.controllers/patientsController');
const path = require("path");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});



app.use(authRoute);
app.use(chatRoute);
app.use(appointmentRoute);
app.use(profileRoute);
app.use(pprofileRoute);
app.use(usersRoute);
app.use(medRoute);
app.use(paymentRoute);
app.use(uploadRoute);
app.use(patientRoute);


const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
