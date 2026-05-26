import "./BookAppointment.css";
import { useEffect, useState } from "react";
// import { useAuth } from "../auth/useAuth";
import { useAuthFromContext } from "../auth/useAuthFromContext";
import API from "../api/axios";

export default function ViewBookedAppointments() {

  // const { isLoggedIn, role } = useAuth();

  const { isLoggedIn, role } = useAuthFromContext();

  const [appointments, setAppointments] = useState([]);
  const handleCancelAppointment = async (id) => {
    try {
      await API.put(`/api/appointments/cancel/${id}`);

      alert("Appointment cancelled successfully");

      fetchAppointments();
    } catch (error) {
      console.log(error);
      alert("Failed to cancel appointment");
    }
  };

  const fetchAppointments = async () => {

    try {

      const response = await API.get("/api/appointments");

      setAppointments(response.data);

    } catch (error) {

      console.log(error);

      alert("Failed to load appointments");
    }
  };

  useEffect(() => {

    fetchAppointments();

  }, []);

  if (!isLoggedIn) {

    return (
      <div className="book-page">
        <h1>Booked Appointments</h1>
        <p>Please login to continue.</p>
      </div>
    );
  }

  // if (role !== "ADMIN") {

    if (role?.toUpperCase() !== "ADMIN")
    {

    return (
      <div className="book-page">
        <h1>Booked Appointments</h1>
        <p>Only admin can access this page.</p>
      </div>
    );
  }

  return (
    <div className="book-page">

      <h1>Booked Appointments</h1>
      <p>Admin view</p>

      <div className="book-card">

        {appointments.length === 0 ? (

          <p>No appointments booked yet.</p>

        ) : (

          appointments.map((a) => (

            <div
              className="doctor-remove-card"
              key={a.id}
            >

              <h3>{a.doctor?.name}</h3>

              <p>
                Specialization:
                {" "}
                {a.doctor?.specialization}
              </p>

              <p>
                Patient:
                {" "}
                {a.user?.name || a.user?.email}
              </p>

              <p>
                Date:
                {" "}
                {a.appointmentDate}
              </p>

              <p>
                Time:
                {" "}
                {a.appointmentTime}
              </p>

              <p>
                Status:
                {" "}
                {a.status}
              </p>
              <button
                className="butt2"
                onClick={() => handleCancelAppointment(a.id)}
              >
                Cancel Appointment
              </button>

            </div>
          ))
        )}
      </div>
    </div>
  );
}