const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  doctor: String,
  patientEmail: String,
  patientName: String,
  date: String,
  time: String,
  medicalHistory: String,
  medicalHistoryFile: String,
  status: String,
});

module.exports = mongoose.model("Appointment", appointmentSchema);
