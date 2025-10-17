import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../Assets/Appointment.css";
import axios from "axios";

const Appointment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const doctorName = queryParams.get("doctor");

  const [patientName, setPatientName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [nextAvailable, setNextAvailable] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [medicalHistoryFile, setMedicalHistoryFile] = useState(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
      alert("Please login to access the appointment page.");
      navigate("/Login");
    }
  }, [navigate]);

  // Fetch existing appointments for this doctor
  useEffect(() => {
    if (doctorName) {
      axios
        .get(
          `${
            process.env.REACT_APP_API_URL || "http://localhost:5000"
          }/api/appointments?doctor=${doctorName}`
        )
        .then((res) => setAppointments(res.data))
        .catch((err) => console.error("Error fetching appointments:", err));
    }
  }, [doctorName]);

  const doctorAvailability = {
    "Dr.JohnSmith": {
      days: ["Mon", "Wed", "Fri"],
      start: "08:00",
      end: "12:00",
    },
    "Dr.EmilyBrown": {
      days: ["Mon", "Thu", "Sat"],
      start: "10:00",
      end: "14:00",
    },
    "Dr.AnnaTaylor": {
      days: ["Mon", "Wed", "Fri"],
      start: "09:00",
      end: "13:00",
    },
    "Dr.MarkWilson": {
      days: ["Tue", "Thu", "Sat"],
      start: "10:00",
      end: "14:00",
    },
    "Dr.SarahClark": {
      days: ["Tue", "Thu", "Sat"],
      start: "09:00",
      end: "13:00",
    },
    "Dr.EmilyRoberts": {
      days: ["Mon", "Thu", "Sat"],
      start: "10:00",
      end: "14:00",
    },
    "Dr.SarahJohnson": {
      days: ["Mon", "Wed", "Fri"],
      start: "09:00",
      end: "13:00",
    },
    "Dr.EmilyWilliams": {
      days: ["Tue", "Thu", "Sat"],
      start: "10:00",
      end: "14:00",
    },
    "Dr.LucyHarris": {
      days: ["Mon", "Thu", "Sat"],
      start: "11:00",
      end: "15:00",
    },
    "Dr.JohnDoe": { days: ["Mon", "Wed", "Fri"], start: "10:00", end: "14:00" },
    "Dr.JaneSmith": {
      days: ["Tue", "Thu", "Sat"],
      start: "11:00",
      end: "15:00",
    },
    "Dr.MichaelBrown": {
      days: ["Mon", "Thu", "Sat"],
      start: "09:00",
      end: "13:00",
    },
  };

  const today = new Date().toISOString().split("T")[0];

  const toMinutes = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const checkAvailability = (doctor, date, time) => {
    const info = doctorAvailability[doctor];
    if (!info) {
      setError("Doctor not found.");
      return false;
    }
    const day = new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
    });
    if (!info.days.includes(day)) {
      setError(`❌ ${doctor} is not available on ${day}.`);
      return false;
    }
    if (time < info.start || time > info.end) {
      setError(`❌ ${doctor} works from ${info.start} to ${info.end}.`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNextAvailable("");

    if (!checkAvailability(doctorName, date, time)) return;

    // Check existing doctor bookings
    const sameDay = appointments.filter((a) => a.date === date);
    const conflict = sameDay.some(
      (a) => Math.abs(toMinutes(a.time) - toMinutes(time)) < 10
    );

    if (conflict) {
      let next = toMinutes(time) + 10;
      let foundNext = "";
      while (next < toMinutes(doctorAvailability[doctorName].end)) {
        const h = String(Math.floor(next / 60)).padStart(2, "0");
        const m = String(next % 60).padStart(2, "0");
        const slot = `${h}:${m}`;
        const occupied = sameDay.some(
          (a) => Math.abs(toMinutes(a.time) - toMinutes(slot)) < 10
        );
        if (!occupied) {
          foundNext = slot;
          break;
        }
        next += 10;
      }
      if (foundNext) setNextAvailable(`Next available slot: ${foundNext}`);
      else setError("❌ No slots left for today.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login again.");
      navigate("/login");
      return;
    }

    const newAppt = {
      doctor: doctorName,
      patientEmail: user.email,
      patientName,
      date,
      time,
      medicalHistory,
      medicalHistoryFile: medicalHistoryFile ? medicalHistoryFile.name : null,
      status: "Confirmed",
    };

    try {
      await axios.post(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000"
        }/api/appointments`,
        newAppt
      );
      setAppointments([...appointments, newAppt]);
      setPatientName("");
      setDate("");
      setTime("");
      setMedicalHistory("");
      setMedicalHistoryFile(null);
      alert(`✅ Appointment booked with ${doctorName} at ${time} on ${date}`);
    } catch (err) {
      console.error("Error booking appointment:", err);
      setError("Failed to book appointment. Try again later.");
    }
  };

  return (
    <div className="appointment-container">
      <h2>Book Appointment with {doctorName}</h2>
      {error && <div className="error-message">{error}</div>}
      {nextAvailable && <div className="next-slot">{nextAvailable}</div>}

      <form onSubmit={handleSubmit} className="appointment-form">
        <input
          type="text"
          placeholder="Your Name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={today}
          required
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <textarea
          placeholder="Enter your medical history (optional)"
          value={medicalHistory}
          onChange={(e) => setMedicalHistory(e.target.value)}
          rows="4"
        />
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={(e) => setMedicalHistoryFile(e.target.files[0])}
        />
        <button type="submit">Book</button>
      </form>

      {appointments.length > 0 && (
        <div className="appointment-list">
          <h3>Previous Appointments</h3>
          <ul>
            {appointments
              .filter(
                (a) =>
                  a.patientEmail ===
                  JSON.parse(localStorage.getItem("user"))?.email
              )
              .map((a, index) => (
                <li key={index}>
                  {a.doctor} — {a.date} at {a.time} ({a.status})
                  <div>
                    <strong>Medical History:</strong>{" "}
                    {a.medicalHistory || "Not provided"}
                  </div>
                  <div>
                    <strong>Uploaded File:</strong>{" "}
                    {a.medicalHistoryFile || "None"}
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Appointment;
