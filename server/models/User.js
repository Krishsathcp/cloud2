const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  fullName: String,
  dateOfBirth: String,
  sex: String,
  age: Number,
  address: String,
  maritalStatus: String,
  phoneNumber: String,
  nationality: String,
  emergencyContact: String,
  occupation: String,
  parentName: String,
  parentPhoneNumber: String,
  parentOccupation: String,
});

module.exports = mongoose.model("User", userSchema);
