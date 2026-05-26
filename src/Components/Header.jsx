import { Link } from "react-router-dom";
 import "./Header.css";
 import { useAuth } from "../auth/useAuth";
 import medicareLogo from "../assets/medicare.jpeg";

 export default function Header() {
  const { isLoggedIn, role } = useAuth();
  const showProfile = isLoggedIn && role === "user";
  
   return (
<header className="header">

  <div className="header-left">

    <img
      className="medicare-logo"
      src={medicareLogo}
      alt="medicare"
    />

    <span className="mc">
      MEDICARE CONNECT
    </span>

  </div>

  <nav className="nav-links">

    <Link to="/">Home</Link>

    <Link to="/doctors">
      View Doctors
    </Link>

    {role === "admin" ? (
      <Link to="/admindashboard">Admin Dashboard</Link>
    ) : (
      <Link to="/book">Book Appointment</Link>
    )}

    {showProfile && (
      <Link to="/userprofile">
        My Profile
      </Link>
    )}


    {!isLoggedIn ? (
      <Link to="/login" className="login-btn">
        Login
      </Link>
    ) : (
      <button
        type="button"
        className="login-btn"
        onClick={() => {
          localStorage.removeItem("ocs_auth_v1");
          localStorage.removeItem("userId");
          localStorage.removeItem("userRole");
          localStorage.removeItem("userName");
          localStorage.removeItem("userEmail");
          window.location.href = "/";
        }}
      >
        Logout
      </button>
    )}


  </nav>

</header>
 );
}
