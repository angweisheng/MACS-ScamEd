import { useState, ChangeEvent, FormEvent } from "react";
import "./Form.css";

interface FormData {
  name: string;
  email: string;
}

const Form = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Form submitted successfully!");
  };

  return (
    <div className="form-container">
      <header className="header">
        <div className="logo-container">
          <img src="build-logo.png" alt="Singapore Government Logo" className="sg-logo" />
          <span className="gov-text">A Singapore Government Agency Website</span>
          <a href="#" className="identify-link">How to identify ▼</a>
        </div>
        <div className="app-header">
          <h1>Free Ice Cream - Build Hackathon</h1>
          <div className="time-estimate">
            <span className="clock-icon">⏱</span>
            <span>2 mins estimated time to complete</span>
          </div>
        </div>
      </header>

      <section className="instructions">
        <h2>Instructions</h2>
        <p>
          Please note that by submitting this form, you agree to share your email with the team at MACS-Delivery
          for purposes of education.
        </p>
      </section>

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="name">1. Name</label>
          <p className="field-note">Please enter your full name.</p>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="email">2. Email Address</label>
          <p className="field-note">Please enter your email address.</p>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-button">Submit now</button>
      </form>

      <div className="help-button">?</div>
    </div>
  );
};

export default Form;
