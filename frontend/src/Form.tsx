import { useState, ChangeEvent, FormEvent } from "react";
import "./Form.css";
import sgLogo from "./sg-logo.png";
import { TermsModal } from "./components/TermsModal";
import { createParticipant, sendOTP, verifyOTP } from "./api/apiFactory";

const useOtp = (email: string) => {
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

    // First try to create participant - but continue even if it fails
    await createParticipant(email).catch(() => {
      // Silently ignore registration errors
      console.log('Participant might already exist - continuing with OTP');
    });

    try {
      // Always attempt to send OTP regardless of registration status
      await sendOTP(email);
      setOtpSent(true);
      return true;
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
      <label htmlFor="otp">2. Enter OTP</label>
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



const Form = () => {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    otpSent,
    otpError,
    isLoading: otpLoading,
    otpValue,
    setOtpValue,
    sendOtp
  } = useOtp(formData.email);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    try {
      // Verify OTP
      await verifyOTP(formData.email, otpValue);
      
      alert("YOU COULD HAVE BEEN SCAMMED PLACEHOLDER");
    } catch (error) {
      setSubmitError("Failed to submit form. Please try again.");
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <header className="header">
        <div className="logo-container">
          <img src={sgLogo} alt="Singapore Government Logo" className="sg-logo" />
          <span className="gov-text">A Singapore Government Agency Website</span>
          <a href="#" className="identify-link">How to identify ▼</a>
        </div>
        <div className="app-header">
          <h1>GovTech &#123;build&#125; Hackathon - Free Ice Cream</h1>
          <div className="time-estimate">
            <span className="clock-icon">⏱</span>
            <span>2 minutes estimated time to complete</span>
          </div>
        </div>
      </header>

      <section className="instructions">
        <h2>Instructions</h2>
        <p>
          Thank you for participating in anti-scam survey! Please fill in your email to register for a free McDonald's Vanilla Cone.
        </p>
      </section>

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="email">1. Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <OtpInput
          value={otpValue}
          onChange={setOtpValue}
          onSendOtp={sendOtp}
          otpSent={otpSent}
          isLoading={otpLoading}
          error={otpError}
        />

        <button
          type="submit"
          className="submit-button"
          disabled={!otpSent || otpValue.length !== 6 || otpLoading || isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Continue to Survey"}
        </button>
        {submitError && <p className="error-message">{submitError}</p>}
        <p className="terms-text">
          By submitting this form, you agree to our{' '}
          <button 
            className="terms-link"
            onClick={(e) => {
              e.preventDefault();
              setIsTermsModalOpen(true);
            }}
          >
            terms and conditions
          </button>
        </p>
      </form>

      <div className="help-button">?</div>
      
      <TermsModal 
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
    </div>
  );
};

export default Form;