import "./BookAppointment.css";
import API from "../Api/axios";
import { useEffect, useState } from "react";
import { useAuthFromContext } from "../auth/useAuthFromContext";

export default function BookAppointment() {
  const { isLoggedIn } = useAuthFromContext();

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await API.get("/api/doctors");
        setDoctors(response.data);
      } catch (error) {
        console.log(error);
        setModalMessage("Failed to load doctors.");
        setShowModal(true);
      }
    };

    fetchDoctors();
  }, []);

  const timeSlots = [

    { value: "09:00:00", label: "9:00 AM" },
    { value: "09:30:00", label: "9:30 AM" },
    { value: "10:00:00", label: "10:00 AM" },
    { value: "10:30:00", label: "10:30 AM" },
    { value: "11:00:00", label: "11:00 AM" },
    { value: "11:30:00", label: "11:30 AM" },
    { value: "14:00:00", label: "2:00 PM" },
    { value: "14:30:00", label: "2:30 PM" },
  ];

  const handleConfirm = async () => {
    if (!isLoggedIn) {
      setModalMessage("Please login to book an appointment.");
      setShowModal(true);
      return;
    }

    if (!selectedDoctor || !appointmentDate || !appointmentTime) {
      setModalMessage("Please select doctor, date, and time.");
      setShowModal(true);
      return;
    }

    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setModalMessage("User ID missing. Please login again.");
        setShowModal(true);
        return;
      }

      const appointmentData = {
        appointmentDate: appointmentDate,
        appointmentTime: appointmentTime,
        status: "BOOKED",
      };

      try {
        await API.post(
          `/api/appointments/${userId}/${selectedDoctor}`,
          appointmentData
        );

        setModalMessage("Your appointment has been successfully booked.");
        setShowModal(true);

        setSelectedDoctor("");
        setAppointmentDate("");
        setAppointmentTime("");
      } catch (err) {
        const msg = String(err?.response?.data?.message || "");

        // If backend reports conflict / already booked, show a friendly message.
        if (
          msg.toLowerCase().includes("already booked") ||
          msg.toLowerCase().includes("conflict") ||
          msg.toLowerCase().includes("duplicate") ||
          msg.toLowerCase().includes("booked")
        ) {
          setModalMessage(
            "Appointment already booked for this doctor at this time. Please choose another time."
          );
        } else {
          setModalMessage("Appointment booking failed.");
        }

        setShowModal(true);
      }
    } catch (error) {
      console.log(error);
      setModalMessage("Appointment booking failed.");
      setShowModal(true);
    }
  };

  return (
    <div className="book-page">
      <h1>Book Appointment</h1>
      <p>Choose your doctor and preferred time</p>

      <div className="book-card">
        <div className="form-group">
          <label>Select Doctor</label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
          >
            <option value="">-- Choose a doctor --</option>

            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} — {doctor.specialization}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Preferred Time Slot</label>
          <select
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
          >
            <option value="">-- Select time slot --</option>

            {timeSlots.map((slot) => (
              <option
                key={slot.value}
                value={slot.value}
                disabled={slot.disabled}
              >
                {slot.label}
              </option>
            ))}
          </select>
        </div>

        <button className="confirm-btn" onClick={handleConfirm}>
          Confirm Appointment
        </button>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <div className="modal-icon">✅</div>
              <h2>Message</h2>
              <p>{modalMessage}</p>
              <button onClick={() => setShowModal(false)}>Done</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}