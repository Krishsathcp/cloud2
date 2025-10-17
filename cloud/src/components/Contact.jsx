import React, { useState } from "react";
import "../Assets/Contact.css";
import axios from "axios";
import { API_BASE_URL } from "../config"; // ✅ Added import

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      await axios.post(`${API_BASE_URL}/api/contact`, formData); // ✅ Updated

      alert("✅ Thank you for contacting us!");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setStatus("sent");
    } catch (err) {
      console.error("❌ Error sending contact form:", err);
      alert("Failed to send message. Please try again later.");
      setStatus("error");
    }
  };

  return (
    <div className="contact-wrapper">
      <div className="contact-body">
        <div className="form-box">
          <div className="hospital-contact-box">
            <h3>Hospital Contact Information</h3>
            <p>
              <strong>Address:</strong> 123 Hospital Street, City, State, ZIP
            </p>
            <p>
              <strong>Phone:</strong> +1 (123) 456-7890
            </p>
            <p>
              <strong>Email:</strong> contactKrish@hospital.com
            </p>
          </div>

          <div className="emergency-contact-box">
            <h3>Emergency Contact</h3>
            <p>
              <strong>Emergency Phone:</strong> +1 (800) 123-4567
            </p>
            <p>
              <strong>Emergency Email:</strong> emergencyKrish@hospital.com
            </p>
          </div>
        </div>

        <div className="form-container">
          <h2>Contact Us</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              required
            ></textarea>
            <button type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
