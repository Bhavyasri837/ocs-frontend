import "./AddDoctor.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../Api/axios";
import { useAuth } from "../auth/useAuth";

export default function AddDoctor() {
  const navigate = useNavigate();
  const { isLoggedIn, role } = useAuth();

  const [doctorName, setDoctorName] = useState("");
  const [specialization, setSpecialization] = useState("Cardiology");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("");

  const handleAddDoctor = async () => {
    if (!isLoggedIn) {
      alert("Please login to continue");
      navigate("/login");
      return;
    }

    if (role !== "admin") {
      alert("Only admin can add doctors");
      return;
    }

    if (
      !doctorName.trim() ||
      !specialization.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !experience.trim()
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const doctorData = {
        name: doctorName.trim(),
        specialization: specialization,
        email: email.trim(),
        phone: phone.trim(),
        experience: experience.trim(),
      };

      await API.post("/api/doctors", doctorData);

      alert("Doctor added successfully");

      setDoctorName("");
      setSpecialization("Cardiology");
      setEmail("");
      setPhone("");
      setExperience("");
    // } catch (error) {
    //   console.log(error);
    //   alert("Failed to add doctor.");
    // }
    } catch (error) {
  console.log("Full error:", error);
  console.log("Backend error:", error.response?.data);
  console.log("Status:", error.response?.status);

  alert(error.response?.data?.message || "Failed to add doctor.");
}
  };

  return (
    <div className="add-page">
      <h2>Add new doctor</h2>
      <p>Register a new specialist to the system</p>

      <div className="form-card">
        <div className="field">
          <label>Doctor name</label>
          <input
            type="text"
            placeholder="Dr. First Last"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Specialization</label>
          <select
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          >
            <option>Cardiology</option>
            <option>Dermatology</option>
            <option>Neurology</option>
            <option>Orthopedics</option>
            <option>Psychiatry</option>
            <option>General</option>
            <option>Oncology</option>
            <option>Radiology</option>
            <option>Pathology</option>
          </select>
        </div>

        <div className="field">
          <label>Email</label>
          <input
            type="email"
            placeholder="doctor@clinic.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Contact number</label>
          <input
            type="text"
            placeholder="+91 0000000000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Years of Experience</label>
          <input
            type="text"
            placeholder="e.g. 5"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
        </div>

        <button className="butt1" onClick={handleAddDoctor}>
          Add Doctor
        </button>

        <br />
        <br />

        <button className="butt2" onClick={() => navigate("/remove-doctor")}>
          Remove Doctor
        </button>
      </div>
    </div>
  );
}