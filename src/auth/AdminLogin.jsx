import { useState } from "react";
import "../Components/Login.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { saveAuthToStorage } from "./authStorage";
import medicare from "../assets/medicare.jpeg";

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "1234567890";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { setIsLoggedIn, setRole } = useAuth();

  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");

  const handleAdminSignIn = () => {
    const normalizedEmail = emailOrMobile.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (!normalizedEmail || !normalizedPassword) {
      alert("Please enter admin email and password");
      return;
    }

    if (
      normalizedEmail === ADMIN_EMAIL &&
      normalizedPassword === ADMIN_PASSWORD
    ) {
      setIsLoggedIn(true);
      setRole("admin");
      saveAuthToStorage(true, "admin");

      alert("Admin login successful");
      navigate("/admindashboard");
    } else {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div className="login">
      <div className="login-header">
        <img src={medicare} alt="medicare" />
        <h2>Welcome to MEDICARE CONNECT</h2>
      </div>

      {/* <div className="login-buttons">
        <button onClick={() => navigate("/userlogin")}>User Login</button>
        <button onClick={() => navigate("/signup")}>Register</button>
        <button onClick={() => navigate("/")}>Continue as Guest</button>
      </div> */}

      <div className="form-card">
        <p className="login-title">
          Welcome Admin! Sign in to your OCS account
        </p>

        <div className="field">
          <label>Email</label>
          <input
            type="text"
            placeholder="Enter admin email"
            value={emailOrMobile}
            onChange={(e) => setEmailOrMobile(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="signin-btn" onClick={handleAdminSignIn}>
          Sign In
        </button>
      </div>
    </div>
  );
}