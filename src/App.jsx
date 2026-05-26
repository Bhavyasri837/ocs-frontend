import { BrowserRouter, Routes, Route } from "react-router-dom";
import ForgotPassword from "./Components/ForgotPassword";
import Header from "./Components/Header";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminProtectedRoute from "./auth/AdminProtectedRoute";
import Home from "./Components/Home";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import Doctors from "./Components/ViewDoctors";
import BookAppointment from "./Components/BookAppointment";
import AddDoctor from "./Components/AddDoctor";
import Footer from "./Components/Footer";

import AdminLogin from "./auth/AdminLogin";
import UserLogin from "./Components/UserLogin";
import AdminDashboard from "./Components/AdminDashboard";
import RemoveDoctor from "./Components/RemoveDoctor";
import ViewBookedAppointments from "./Components/ViewBookedAppointments";
import UserProfile from "./Components/UserProfile";


export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/userlogin" element={<UserLogin />} />
        <Route path="/adminlogin" element={<AdminLogin />} />

        <Route path="/doctors" element={<Doctors />} />

        <Route
          path="/book"
          element={
            <ProtectedRoute allowedRoles={["user", "PATIENT", "ADMIN"]}>
              <BookAppointment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admindashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/add-doctor"
          element={
            <AdminProtectedRoute>
              <AddDoctor />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/remove-doctor"
          element={
            <AdminProtectedRoute>
              <RemoveDoctor />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/view-booked-appointments"
          element={
            <AdminProtectedRoute>
              <ViewBookedAppointments />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/userprofile"
          element={
            <ProtectedRoute allowedRoles={["user", "PATIENT"]}>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />

      </Routes>
      

      <Footer />
    </BrowserRouter>
  );
}