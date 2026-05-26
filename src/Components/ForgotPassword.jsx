import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const sendOtp = async () => {
    const res = await API.post("/api/auth/send-otp", { email });
    alert(res.data);

    if (res.data === "OTP sent successfully") {
      setStep(2);
    }
  };

  const verifyOtp = async () => {
    const res = await API.post("/api/auth/verify-otp", { email, otp });
    alert(res.data);

    if (res.data === "OTP verified successfully") {
      setStep(3);
    }
  };

  const resetPassword = async () => {
    const res = await API.put("/api/auth/reset-password", {
      email,
      otp,
      newPassword,
    });

    alert(res.data);

    if (res.data === "Password reset successfully") {
      navigate("/login");
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>

      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={sendOtp}>Send OTP</button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}

      {step === 3 && (
        <>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={resetPassword}>Reset Password</button>
        </>
      )}
    </div>
  );
}