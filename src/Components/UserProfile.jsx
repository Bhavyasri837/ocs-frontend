import "./UserProfile.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import API from "../api/axios";

function formatDate(value) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return String(value);
  }
}

export default function UserProfile() {
  const navigate = useNavigate();
  const { isLoggedIn, role, logout } = useAuth();

  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);

  const userId = useMemo(() => {
    const id = localStorage.getItem("userId");
    return id || "";
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get(`/api/users/${userId}`);
      setUser(res.data);
    } catch {
      // Fallback to whatever login gives us (avoid empty name/mail in UI)
      const raw = null;


      if (raw?.name || raw?.email) {
        setUser(raw);
        return;
      }
      setUser({ name: localStorage.getItem("userName") || "", email: localStorage.getItem("userEmail") || "" });
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await API.get(`/api/appointments/user/${userId}`);
      setAppointments(res.data);
    } catch {
      // Fallback to all appointments endpoint if specific endpoint does not exist.
      try {
        const res2 = await API.get(`/api/appointments`);
        const data = Array.isArray(res2.data) ? res2.data : [];
        const filtered = data.filter(
          (a) => String(a?.user?.id) === String(userId) || String(a?.userId) === String(userId)
        );
        setAppointments(filtered);
      } catch {
        setAppointments([]);
      }
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    navigate("/userlogin");
  };

  useEffect(() => {
    if (!isLoggedIn || role !== "user") return;

    const run = async () => {
      await fetchProfile();
      await fetchAppointments();
    };

    run();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, role, userId]);


  if (!isLoggedIn) {
    return (
      <div className="user-profile-page">
        <h1>Your Profile</h1>
        <p>Please login to continue.</p>
      </div>
    );
  }

  if (role !== "user") {
    return (
      <div className="user-profile-page">
        <h1>Your Profile</h1>
        <p>Only normal users can view this page.</p>
      </div>
    );
  }

  const now = new Date();
  const pastAppointments = [];
  const presentAppointments = [];

  for (const a of appointments || []) {
    const apptDate = a?.appointmentDate;

    try {
      const dt = new Date(`${apptDate}T${a?.appointmentTime || "00:00:00"}`);
      if (dt && dt.getTime() < now.getTime()) pastAppointments.push(a);
      else presentAppointments.push(a);
    } catch {
      // If date parsing fails, treat as upcoming/unknown
      presentAppointments.push(a);
    }
  }


  const renderAppointmentCard = (a) => (
    <div className="appointment-card" key={a.id}>
      <div className="appointment-row">
        <div className="appointment-field">
          <div className="appointment-label">Doctor</div>
          <div className="appointment-value">{a?.doctor?.name || ""}</div>
        </div>
        <div className="appointment-field">
          <div className="appointment-label">Specialization</div>
          <div className="appointment-value">{a?.doctor?.specialization || ""}</div>
        </div>
      </div>

      <div className="appointment-row">
        <div className="appointment-field">
          <div className="appointment-label">Date</div>
          <div className="appointment-value">{formatDate(a?.appointmentDate)}</div>
        </div>
        <div className="appointment-field">
          <div className="appointment-label">Time</div>
          <div className="appointment-value">{a?.appointmentTime || ""}</div>
        </div>
      </div>

      <div className="appointment-row">
        <div className="appointment-field">
          <div className="appointment-label">Status</div>
          <div className="appointment-value">{a?.status || ""}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="user-profile-page">
      <div className="profile-header">
        <h1>User Profile</h1>
        {/* <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button> */}
      </div>

      <div className="profile-summary">
        <div className="profile-name">
          <div className="profile-label">Name</div>
          <div className="profile-value">{user?.name || ""}</div>
        </div>
        <div className="profile-email">
          <div className="profile-label">Email</div>
          <div className="profile-value">{user?.email || ""}</div>
        </div>
      </div>

      <div className="appointments-section">
        <h2>Past Bookings</h2>
        {pastAppointments.length === 0 ? (
          <p>No past appointments.</p>
        ) : (
          <div className="appointments-list">{pastAppointments.map(renderAppointmentCard)}</div>
        )}
      </div>

      <div className="appointments-section">
        <h2>Present / Upcoming Bookings</h2>
        {presentAppointments.length === 0 ? (
          <p>No upcoming appointments.</p>
        ) : (
          <div className="appointments-list">{presentAppointments.map(renderAppointmentCard)}</div>
        )}
      </div>
    </div>
  );
}

