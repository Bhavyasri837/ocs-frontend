import "./AddDoctor.css";
import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../auth/useAuth";

export default function RemoveDoctor() {
  const { isLoggedIn, role } = useAuth();

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
    // fetch once on mount.
    const run = async () => {
      await fetchDoctors();
    };

    run();
  }, []);





  const handleRemoveDoctor = async (id) => {
    if (!isLoggedIn) {
      alert("Please login to continue");
      return;
    }

    if (role !== "ADMIN") {
      alert("Only admin can remove doctors");
      return;
    }

    try {
      await API.delete(`/api/doctors/${id}`);

      alert("Doctor removed successfully");

      fetchDoctors();
    } catch (error) {
      console.log(error);
      alert("Failed to remove doctor");
    }
  };

  return (
    <div className="add-page">
      <h2>Remove Doctor</h2>
      <p>Remove a registered specialist from the system</p>

      <div className="form-card">
        {doctors.length === 0 ? (
          <p>No doctors available</p>
        ) : (
          doctors.map((doctor) => (
            <div className="doctor-remove-card" key={doctor.id}>
              <div>
                <h3>{doctor.name}</h3>
                <p>{doctor.specialization}</p>
                <p>{doctor.email}</p>
                <p>{doctor.phone}</p>
              </div>

              <button
                className="butt2"
                onClick={() => handleRemoveDoctor(doctor.id)}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}