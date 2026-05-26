import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home">

      <div className="hero">

        <p>TRUSTED HEALTHCARE</p>

        <h1>
          Your Health, Our Priority.<br />
          Book an Appointment Today.
        </h1>

        <p>
          Access top-rated specialists, book appointments instantly,
          <br />
          and manage your healthcare journey — all from one place.
        </p>

        <div className="hero-buttons">
          <button id='book'><Link to="/book" id="aa">Book Appointment</Link></button>
          
          <button><Link to="/doctors" id="aa">View Doctors</Link></button>
        </div>

      </div>

      <div className="stats">
        <div className="stat-card">
          <h2>120+</h2>
          <p>Specialists</p>
        </div>

        <div className="stat-card">
          <h2>8,400+</h2>
          <p>Patients Served</p>
        </div>

        <div className="stat-card">
          <h2>4.9★</h2>
          <p>Avg Rating</p>
        </div>

        <div className="stat-card">
          <h2>24/7</h2>
          <p>Support</p>
        </div>
      </div>

      <div className="features">
        <div className="feature-card">
          <h2>Expert Specialists</h2>
          <p>Browse verified doctors across all specializations, with ratings and availability at a glance.</p>
        </div>

        <div className="feature-card">
          <h2>Instant Booking</h2>
          <p>Choose your preferred time slot and confirm your appointment in under 60 seconds.</p>
        </div>

        <div className="feature-card">
          <h2>Secure & Private</h2>
          <p>Your health data is encrypted and never shared without your explicit consent.</p>
        </div>
      </div>

    </div>
  );
}