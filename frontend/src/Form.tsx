import { useState, ChangeEvent, FormEvent } from "react";
import "./Form.css";

const useOtp = (email: string, sendOtpFn: (email: string) => Promise<boolean>) => {
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpValue, setOtpValue] = useState('');

  const sendOtp = async () => {
    if (!email) {
      setOtpError('Please enter a valid email');
      return false;
    }

    setIsLoading(true);
    setOtpError('');

    try {
      const success = await sendOtpFn(email);
      setOtpSent(success);
      return success;
    } catch (error) {
      setOtpError('Failed to send OTP');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    otpSent,
    otpError,
    isLoading,
    otpValue,
    setOtpValue,
    sendOtp
  };
};

// input OTP
const OtpInput = ({
  value,
  onChange,
  onSendOtp,
  otpSent,
  isLoading,
  error
}: {
  value: string;
  onChange: (value: string) => void;
  onSendOtp: () => void;
  otpSent: boolean;
  isLoading: boolean;
  error?: string;
}) => {
  return (
    <div className="form-field">
      <label htmlFor="otp">3. Enter OTP</label>
      <div className="otp-input-container">
        <input
          type="text"
          id="otp"
          name="otp"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={6}
          className="otp-input"
          placeholder="Enter 6-digit OTP"
          required
        />
        <button
          type="button"
          onClick={onSendOtp}
          className="send-otp-button"
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : (otpSent ? 'Resend OTP' : 'Send OTP')}
        </button>
      </div>
      {error && (
        <p className="otp-error">
          {error}
        </p>
      )}
      {otpSent && !error && (
        <p className="otp-success">
          OTP sent
        </p>
      )}
    </div>
  );
};

// weisheng can help with this pls
const sendOtpToEmail = async (email: string): Promise<boolean> => {

  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`OTP sent to ${email}`);
      resolve(true);
    }, 1000);
  });
};

const Form = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const {
    otpSent,
    otpError,
    isLoading: otpLoading,
    otpValue,
    setOtpValue,
    sendOtp
  } = useOtp(formData.email, sendOtpToEmail);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", { ...formData, otp: otpValue });
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
            <span>2 minutes estimated time to complete</span>
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

        {formData.email && (
          <OtpInput
            value={otpValue}
            onChange={setOtpValue}
            onSendOtp={sendOtp}
            otpSent={otpSent}
            isLoading={otpLoading}
            error={otpError}
          />
        )}

        <button
          type="submit"
          className="submit-button"
          disabled={!otpSent || otpValue.length !== 6 || otpLoading}
        >
          Submit now
        </button>
      </form>

      <div className="help-button">?</div>
    </div>
  );
};

export default Form;