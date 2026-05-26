import { useEffect, useState } from "react";
import "./ViewDoctors.css";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function ViewDoctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);

  const fetchDoctors = async () => {
    try {
      const response = await API.get("/api/doctors");
      setDoctors(response.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load doctors");
    }
  };

  useEffect(() => {
    const run = async () => {
      await fetchDoctors();
    };

    run();
  }, []);



  return (
    <div className="doctors-page">
      <h1>Our Doctors</h1>
      <p>Find and book with top-rated specialists</p>

      <div className="doctors-grid">
        {doctors.map((doctor) => (
          <div className="doctor-card" key={doctor.id}>
            <div className="doctor-avatar">
              {doctor.name ? doctor.name.substring(0, 2).toUpperCase() : "DR"}
            </div>

            <h3>{doctor.name}</h3>
            <span>{doctor.specialization}</span>

            <p>★★★★★ 4.9</p>

            <button onClick={() => navigate("/book")}>
              Book Appointment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}