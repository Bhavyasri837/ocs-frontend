import "./AddDoctor.css";

import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isLoggedIn, role } = useAuth();
  const effectiveIsLoggedIn = Boolean(isLoggedIn);
  const effectiveRole = role;


  return (
    <div className="add-page">
      <h2>Admin Dashboard</h2>
      <p>Manage doctors and appointments</p>

      <div className="form-card">
        <button
          className="butt1"
          onClick={() => {
            if (!effectiveIsLoggedIn) {
              alert("Please login to continue");
              return;
            }
            if (effectiveRole !== "admin") {
              alert("Only admin can access this");
              return;
            }
            navigate("/add-doctor");
          }}
        >
          Add Doctor
        </button>

        <br />
        <br />

        <button
          className="butt2"
          onClick={() => {
            if (!effectiveIsLoggedIn) {
              alert("Please login to continue");
              return;
            }
            if (effectiveRole !== "admin") {
              alert("Only admin can access this");
              return;
            }
            navigate("/remove-doctor");
          }}
        >
          Remove Doctor
        </button>

        <br />
        <br />

        <button
          className="butt1"
          onClick={() => {
            if (!effectiveIsLoggedIn) {
              alert("Please login to continue");
              return;
            }
            if (effectiveRole !== "admin") {
              alert("Only admin can access this");
              return;
            }
            navigate("/view-booked-appointments");
          }}
        >
          View Booked Appointments
        </button>
      </div>
    </div>
  );
}

