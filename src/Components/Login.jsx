import "./Login.css";
import { useNavigate } from "react-router-dom";
import medicare from "../assets/medicare.jpeg";




export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="login">
      <div className="login-header">
        <img src={medicare} alt="medicare" />

        <h2>Welcome to MEDICARE CONNECT</h2>
      </div>

      <div className="login-buttons">
        <button onClick={() => navigate("/userlogin")}> Login</button>
        {/* <button onClick={()=>navigate("/adminlogin")}>AdminLogin</button> */}
        <button onClick={() => navigate("/signup")}>Register</button>
        <button onClick={() => navigate("/AdminLogin")}>Admin Login</button>
        
      </div>
    </div>
  );
}