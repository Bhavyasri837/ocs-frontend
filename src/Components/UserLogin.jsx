import "./Login.css";
import "./UserLogin.css";

import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import medicare from "../assets/medicare.jpeg";
import { useAuth } from "../auth/useAuth";
import API from "../Api/axios";

export default function UserLogin() {
  const navigate = useNavigate();
  const { setIsLoggedIn, setRole } = useAuth();

  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");

  const handleUserSignIn = async () => {
    if (!emailOrMobile || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      const response = await API.post("/api/users/login", {
        email: emailOrMobile,
        password: password,
      });

      if (response.data.success === true) {
        setIsLoggedIn(true);
        setRole("user");

        localStorage.setItem("userId", response.data.data.id);
        localStorage.setItem("userRole", "user");
        if (response.data.data?.name) localStorage.setItem("userName", response.data.data.name);
        if (response.data.data?.email) localStorage.setItem("userEmail", response.data.data.email);

        alert("Login successful");
        navigate("/doctors");
      } else {
        alert(response.data.message || "Invalid credentials");
      }
    } catch (error) {
      console.log(error);
      alert("Login failed. Please check backend.");
    }
  };

  // OTP-based forgot password modal (React state only)
  const [forgotOpen, setForgotOpen] = useState(false);
  const [step, setStep] = useState(1);

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");

  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);

  const [generalForgotError, setGeneralForgotError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const isEmailValid = useMemo(() => {
    const v = forgotEmail.trim();
    if (!v) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }, [forgotEmail]);

  const openForgotModal = () => {
    setForgotOpen(true);
    setStep(1);
    setGeneralForgotError("");
    setFieldErrors({ email: "", otp: "", newPassword: "", confirmPassword: "" });
    setForgotEmail("");
    setForgotOtp("");
    setForgotNewPassword("");
    setForgotConfirmPassword("");
  };

  const closeForgotModal = () => {
    setForgotOpen(false);
  };

  const validateStep1 = () => {
    const next = { email: "", otp: "", newPassword: "", confirmPassword: "" };

    if (!forgotEmail.trim()) next.email = "Please enter your registered email";
    else if (!isEmailValid) next.email = "Please enter a valid email address";

    setFieldErrors((prev) => ({ ...prev, ...next }));
    setGeneralForgotError("");

    return !next.email;
  };

  const validateStep2 = () => {
    const next = { email: "", otp: "", newPassword: "", confirmPassword: "" };

    const otp = forgotOtp.trim();
    if (!otp) next.otp = "Please enter the OTP";
    else if (!/^\d{6}$/.test(otp)) next.otp = "OTP must be exactly 6 digits";

    setFieldErrors((prev) => ({ ...prev, ...next }));
    setGeneralForgotError("");

    return !next.otp;
  };

  const validateStep3 = () => {
    const next = { email: "", otp: "", newPassword: "", confirmPassword: "" };

    if (!forgotNewPassword) next.newPassword = "Please enter a new password";
    else if (forgotNewPassword.length < 4) next.newPassword = "Password must be at least 4 characters";

    if (!forgotConfirmPassword) next.confirmPassword = "Please confirm your password";
    else if (forgotConfirmPassword !== forgotNewPassword) next.confirmPassword = "Passwords do not match";

    setFieldErrors((prev) => ({ ...prev, ...next }));
    setGeneralForgotError("");

    return !next.newPassword && !next.confirmPassword;
  };

  const handleSendOtp = async () => {
    if (!validateStep1()) return;

    setSendOtpLoading(true);
    try {
      const res = await API.post("/api/auth/send-otp", { email: forgotEmail.trim() });
      const msg = res?.data?.message || res?.data || "OTP sent successfully";
      // Some backends return { success: true }, others return plain strings.
      if (res?.data?.success === false) {
        setGeneralForgotError(res?.data?.message || "Failed to send OTP");
        return;
      }
      // If success, move to step 2
      setStep(2);
      setGeneralForgotError("");
      alert(msg);
    } catch (err) {
      console.log(err);
      setGeneralForgotError(err?.response?.data?.message || "Failed to send OTP. Check backend.");
    } finally {
      setSendOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!validateStep2()) return;

    setVerifyOtpLoading(true);
    try {
      const res = await API.post("/api/auth/verify-otp", {
        email: forgotEmail.trim(),
        otp: forgotOtp.trim(),
      });
      const msg = res?.data?.message || res?.data || "OTP verified successfully";
      if (res?.data?.success === false) {
        setGeneralForgotError(res?.data?.message || "OTP verification failed");
        return;
      }
      setStep(3);
      setGeneralForgotError("");
      alert(msg);
    } catch (err) {
      console.log(err);
      setGeneralForgotError(err?.response?.data?.message || "Failed to verify OTP. Check backend.");
    } finally {
      setVerifyOtpLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setResetPasswordLoading(true);
    try {
      const res = await API.put("/api/auth/reset-password", {
        email: forgotEmail.trim(),
        otp: forgotOtp.trim(),
        newPassword: forgotNewPassword,
      });
      const msg = res?.data?.message || res?.data || "Password reset successfully";
      if (res?.data?.success === false) {
        setGeneralForgotError(res?.data?.message || "Password reset failed");
        return;
      }
      alert(msg);
      closeForgotModal();
      setStep(1);
      setForgotOtp("");
      setForgotNewPassword("");
      setForgotConfirmPassword("");
    } catch (err) {
      console.log(err);
      setGeneralForgotError(err?.response?.data?.message || "Password reset failed. Check backend.");
    } finally {
      setResetPasswordLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login-header">
        <img src={medicare} alt="medicare" />
        <h2>Welcome to MEDICARE CONNECT</h2>
      </div>

      <div className="form-card">
        <p className="login-title">Welcome user! Sign in to your OCS account</p>

        {/* <div style={{ marginBottom: 12 }}>
          <button type="button" className="forgot-link" onClick={openForgotModal}>
            Forgot password?
          </button>
        </div> */}

        {/* Forgot password modal */}
        <div id="forgot-modal" className={`forgot-modal${forgotOpen ? " open" : ""}`}>
          <div className="forgot-modal-card">
            <div className="forgot-modal-header">
              <h3>Reset Password</h3>
              <button type="button" className="forgot-close" onClick={closeForgotModal} aria-label="Close">
                ×
              </button>
            </div>

            <div className="forgot-stepper" aria-hidden="true">
              <span className={step === 1 ? "active" : "done"}>1</span>
              <span className={"divider"} />
              <span className={step === 2 ? "active" : step > 2 ? "done" : ""}>2</span>
              <span className={"divider"} />
              <span className={step === 3 ? "active" : step > 3 ? "done" : ""}>3</span>
            </div>

            {step === 1 && (
              <div className="forgot-step-content">
                <div className="field">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Enter your registered email"
                    value={forgotEmail}
                    onChange={(e) => {
                      setForgotEmail(e.target.value);
                      setFieldErrors((prev) => ({ ...prev, email: "" }));
                      setGeneralForgotError("");
                    }}
                    autoComplete="email"
                  />
                  {fieldErrors.email ? <p className="forgot-error">{fieldErrors.email}</p> : null}
                </div>

                {generalForgotError ? <p className="forgot-error">{generalForgotError}</p> : null}

                <div className="forgot-actions">
                  <button type="button" className="forgot-cancel" onClick={closeForgotModal} disabled={sendOtpLoading}>
                    Cancel
                  </button>
                  <button
                    className="signin-btn"
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendOtpLoading}
                  >
                    {sendOtpLoading ? "Sending..." : "Send OTP"}
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="forgot-step-content">
                <div className="field">
                  <label>OTP</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter 6-digit OTP"
                    value={forgotOtp}
                    onChange={(e) => {
                      const next = e.target.value;
                      setForgotOtp(next);
                      setFieldErrors((prev) => ({ ...prev, otp: "" }));
                      setGeneralForgotError("");
                    }}
                    autoComplete="one-time-code"
                  />
                  {fieldErrors.otp ? <p className="forgot-error">{fieldErrors.otp}</p> : null}
                </div>

                {generalForgotError ? <p className="forgot-error">{generalForgotError}</p> : null}

                <div className="forgot-actions">
                  <button
                    type="button"
                    className="forgot-cancel"
                    onClick={() => setStep(1)}
                    disabled={verifyOtpLoading}
                  >
                    Back
                  </button>
                  <button
                    className="signin-btn"
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={verifyOtpLoading}
                  >
                    {verifyOtpLoading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <form onSubmit={handleResetPassword} className="forgot-step-content">
                <div className="field">
                  <label>New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={forgotNewPassword}
                    onChange={(e) => {
                      setForgotNewPassword(e.target.value);
                      setFieldErrors((prev) => ({ ...prev, newPassword: "" }));
                      setGeneralForgotError("");
                    }}
                    autoComplete="new-password"
                  />
                  {fieldErrors.newPassword ? <p className="forgot-error">{fieldErrors.newPassword}</p> : null}
                </div>

                <div className="field">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={forgotConfirmPassword}
                    onChange={(e) => {
                      setForgotConfirmPassword(e.target.value);
                      setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }));
                      setGeneralForgotError("");
                    }}
                    autoComplete="new-password"
                  />
                  {fieldErrors.confirmPassword ? (
                    <p className="forgot-error">{fieldErrors.confirmPassword}</p>
                  ) : null}
                </div>

                {generalForgotError ? <p className="forgot-error">{generalForgotError}</p> : null}

                <div className="forgot-actions">
                  <button
                    type="button"
                    className="forgot-cancel"
                    onClick={() => setStep(2)}
                    disabled={resetPasswordLoading}
                  >
                    Back
                  </button>
                  <button className="signin-btn" type="submit" disabled={resetPasswordLoading}>
                    {resetPasswordLoading ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="field">
          <label>Email</label>
          <input
            type="text"
            placeholder="Enter your email"
            value={emailOrMobile}
            onChange={(e) => setEmailOrMobile(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>



<div style={{ marginBottom: 12 }}>
          <button type="button" className="forgot-link" onClick={openForgotModal}>
            Forgot password?
          </button>
        </div>




        <button className="signin-btn" onClick={handleUserSignIn}>
          Sign In
        </button>

        <p className="new-user">New user?</p>

        <button className="signup-btn" onClick={() => navigate("/signup")}>
          Sign Up / Create an Account
        </button>
      </div>
    </div>
  );
}

