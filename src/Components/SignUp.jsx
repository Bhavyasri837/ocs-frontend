import { useState } from "react";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";
import API from "../Api/axios";

export default function SignUp() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    age: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  // Handle Input Change
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  // Handle Signup
  const handleSignup = async () => {

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.mobile ||
      !formData.age ||
      !formData.gender ||
      !formData.password ||
      !formData.confirmPassword
    ) {

      alert("Please fill all fields");
      return;

    }

    // Password Check
    if (formData.password !== formData.confirmPassword) {

      alert("Passwords do not match");
      return;

    }

    try {

      // Backend DTO Matching Data
      const registerData = {

        name: `${formData.firstName} ${formData.lastName}`,

        email: formData.email,

        password: formData.password,

        age: parseInt(formData.age),

        gender: formData.gender,

        phone: formData.mobile,

        address: "Palamaner"

      };

      // API Call
      const response = await API.post(
        "/api/auth/register",
        registerData
      );

      console.log(response.data);

      alert("Registration Successful");

      navigate("/userlogin");

    } catch (error) {

  console.log(error);

  console.log(error.response);

  console.log(error.response.data);

  alert(
  error.response?.data?.message
  || error.response?.data
  || "Registration Failed"
);

}
  };

  return (

    <div className="container">

      <div className="signup">
        <h2>Create your account</h2>
      </div>

      <div className="forms-card">

        {/* First Name */}
        <div className="field">

          <label>First Name</label>

          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
          />

        </div>

        {/* Last Name */}
        <div className="field">

          <label>Last Name</label>

          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
          />

        </div>

        {/* Email */}
        <div className="field">

          <label>Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
          />

        </div>

        {/* Mobile */}
        <div className="field">

          <label>Mobile</label>

          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Enter mobile number"
          />

        </div>

        {/* Age */}
        <div className="field">

          <label>Age</label>

          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Enter age"
          />

        </div>

        {/* Gender */}
        <div className="field">

          <label>Gender</label>

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >

            <option value="">Select Gender</option>

            <option value="MALE">Male</option>

            <option value="FEMALE">Female</option>

            <option value="OTHER">Other</option>

          </select>

        </div>

        {/* Password */}
        <div className="field">

          <label>Password</label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
          />

        </div>

        {/* Confirm Password */}
        <div className="field">

          <label>Confirm Password</label>

          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
          />

        </div>

        {/* Signup Button */}
        <button
          className="button"
          onClick={handleSignup}
        >
          Create Account
        </button>

      </div>

    </div>
  );
}