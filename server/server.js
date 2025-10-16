require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");
const Appointment = require("./models/Appointment");
const Contact = require("./models/Contact"); // ✅ changed from import to require
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ---------------- Routes ----------------

// Signup
app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const user = new User({ email, password });
    await user.save();
    res.json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ error: "Server error during signup" });
  }
});

// Contact form
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();
    res.json({ message: "Contact form saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error saving contact form" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user)
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    res.json({ success: true, message: "Login successful", user: { email } });
  } catch (err) {
    res.status(500).json({ error: "Server error during login" });
  }
});

// Appointments
app.post("/api/appointments", async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.json({ message: "Appointment saved" });
  } catch (err) {
    res.status(500).json({ error: "Server error saving appointment" });
  }
});

app.get("/api/appointments", async (req, res) => {
  try {
    const { doctor } = req.query;
    const appts = await Appointment.find(doctor ? { doctor } : {});
    res.json(appts);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching appointments" });
  }
});

// Profile
app.get("/api/profile", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email is required" });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching profile" });
  }
});

app.put("/api/profile", async (req, res) => {
  const { email, ...profileData } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });
  try {
    const updatedUser = await User.findOneAndUpdate({ email }, profileData, {
      new: true,
    });
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: "Server error updating profile" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🌍 Server running on port ${PORT}`));
