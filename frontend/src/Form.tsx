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
          <img src="sg-logo.png" alt="Singapore Government Logo" className="sg-logo" />
          <span className="gov-text">A Singapore Government Agency Website</span>
          <a href="#" className="identify-link">How to identify ▼</a>
        </div>
        <div className="app-header">
          <h1>Build Hackathon - Free Ice Cream</h1>
          <div className="time-estimate">
            <span className="clock-icon">⏱</span>
            <span>1 minute estimated time to complete</span>
          </div>
        </div>
      </header>

      <section className="instructions">
        <h2>Instructions</h2>
        <p>
          Please note that by submitting this form, you agree to share your email with the team at MACS-Delivery for purposes of education.
        </p>
      </section>

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="name">1. Name</label>
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
          <label htmlFor="email">2. Email</label>
          <input
            type="email"
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