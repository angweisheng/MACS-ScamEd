import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import "./Form.css";
import sgLogo from "./sg-logo.png";
import { TermsModal } from "./components/TermsModal";
import { createParticipant, sendOTP, verifyOTP, updateConfidence } from "./api/apiFactory";
import ScamAlert from "./ScamAlert";

// Email validation function
const validateEmail = (email: string): boolean => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
};

// OTP validation function
const validateOtp = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

const useOtp = (email: string) => {
  const [otpSent, setOtpSent] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState('');

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  const sendOtp = async () => {
    // Clear previous messages
    setEmailError('');
    setOtpError('');
    setOtpSuccess('');
    
    if (!email) {
      setEmailError('Please enter your email');
      return false;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    
    if (countdown > 0) {
      setEmailError(`Please wait ${countdown} seconds before requesting another OTP`);
      return false;
    }

    setIsLoading(true);
    setEmailError('');

    try {
      // First, try to create a participant - but continue even if it fails due to duplicate email
      try {
        await createParticipant(email);
        console.log('New participant registered successfully');
      } catch (regError: any) {
        // If error is not 500 (e.g., 409 Conflict for duplicate email), log and continue
        // If it's a 500 error, we'll still try to send OTP
        console.log('Participant might already exist - continuing with OTP');
      }
      
      // Always attempt to send OTP regardless of registration status
      await sendOTP(email);
      setOtpSent(true);
      setCountdown(30); // Start 30-second countdown for resend
      return true;
    } catch (error: any) {
      // Only set error if the OTP sending fails
      setEmailError('Failed to send OTP. Please try again.');
      console.error('Error sending OTP:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP input with validation
  const handleOtpChange = (value: string) => {
    // Only allow numeric input and max 6 digits
    const numericValue = value.replace(/[^0-9]/g, '');
    setOtpValue(numericValue.slice(0, 6));
  };
  
  // Verify OTP
  const verifyOtp = async () => {
    // Clear previous messages
    setOtpError('');
    setOtpSuccess('');
    
    if (!email) {
      setOtpError('Please enter your email first');
      return false;
    }
    
    if (!otpValue) {
      setOtpError('Please enter the OTP sent to your email');
      return false;
    }
    
    if (!validateOtp(otpValue)) {
      setOtpError('OTP must be 6 digits');
      return false;
    }
    
    setIsVerifying(true);
    
    try {
      await verifyOTP(email, otpValue);
      setOtpVerified(true);
      return true;
    } catch (error: any) {
      // Handle specific error codes from backend
      if (error.response) {
        switch (error.response.status) {
          case 400:
            setOtpError("Invalid OTP. Please check and try again.");
            break;
          case 404:
            setOtpError("OTP expired or not found. Please request a new OTP.");
            break;
          default:
            setOtpError("Failed to verify OTP. Please try again.");
        }
      } else {
        setOtpError("Network error. Please check your connection and try again.");
      }
      console.error('Error verifying OTP:', error);
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    otpSent,
    emailError,
    otpError,
    otpSuccess,
    isLoading,
    isVerifying,
    otpValue,
    otpVerified,
    setOtpValue: handleOtpChange,
    sendOtp,
    verifyOtp,
    countdown
  };
};

// Email input with OTP button
const EmailInput = ({
  value,
  onChange,
  onSendOtp,
  otpSent,
  isLoading,
  error,
  success,
  countdown
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendOtp: () => void;
  otpSent: boolean;
  isLoading: boolean;
  error?: string;
  success?: string;
  countdown: number;
}) => {
  return (
    <div className="form-field">
      <label htmlFor="email">1. Your Email Address</label>
      <div className="email-input-container">
        <input
          type="email"
          id="email"
          name="email"
          className="email-input"
          value={value}
          onChange={onChange}
          placeholder="Enter your email"
          required
        />
        <button
          type="button"
          onClick={onSendOtp}
          className="send-otp-button"
          disabled={isLoading || countdown > 0}
        >
          {isLoading ? 'Sending...' : 
           (otpSent ? 
            (countdown > 0 ? `Resend OTP (${countdown}s)` : 'Resend OTP') : 
            'Send OTP')}
        </button>
      </div>
      {error && (
        <p className="otp-error">
          {error}
        </p>
      )}
      {success && (
        <p className="otp-success">
          {success}
        </p>
      )}
    </div>
  );
};

// OTP input with verify button
const OtpInput = ({
  value,
  onChange,
  onVerifyOtp,
  isVerifying,
  otpSent,
  error,
  success,
  verified
}: {
  value: string;
  onChange: (value: string) => void;
  onVerifyOtp: () => void;
  isVerifying: boolean;
  otpSent: boolean;
  error?: string;
  success?: string;
  verified: boolean;
}) => {
  if (!otpSent) return null; // Hide OTP field until OTP is requested
  
  return (
    <div className="form-field">
      <label htmlFor="otp">Enter the OTP sent to your email</label>
      <div className="otp-input-container">
        <input
          type="text"
          id="otp"
          className="otp-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          disabled={verified}
          required
        />
        <button
          type="button"
          onClick={onVerifyOtp}
          className="verify-otp-button"
          disabled={isVerifying || value.length !== 6 || verified}
        >
          {isVerifying ? 'Verifying...' : (verified ? 'Verified' : 'Verify OTP')}
        </button>
      </div>
      {error && (
        <p className="otp-error">
          {error}
        </p>
      )}
      {success && (
        <p className="otp-success">
          {success}
        </p>
      )}
    </div>
  );
};



const Form = () => {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    confidence: "",
  });
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showScamAlert, setShowScamAlert] = useState(false);

  const {
    otpSent,
    emailError,
    otpError,
    otpSuccess,
    isLoading: otpLoading,
    isVerifying,
    otpValue,
    otpVerified,
    setOtpValue,
    sendOtp,
    verifyOtp,
    countdown
  } = useOtp(formData.email);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
    // Clear submit error when user makes changes
    if (submitError) setSubmitError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");
    
    // Form validation before submission
    if (!formData.email) {
      setSubmitError("Please enter your email address");
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setSubmitError("Please enter a valid email address");
      return;
    }
    
    if (!otpVerified) {
      setSubmitError("Please verify your OTP first");
      return;
    }
    
    if (!formData.confidence) {
      setSubmitError("Please rate your confidence in identifying scams");
      return;
    }
    
    setIsSubmitting(true);

    try {
      // OTP is already verified, just update confidence rating
      await updateConfidence(formData.email, parseInt(formData.confidence));
      
      // Show scam alert instead of placeholder alert
      setShowScamAlert(true);
    } catch (error: any) {
      // Handle specific error codes from backend
      if (error.response) {
        switch (error.response.status) {
          case 400:
            setSubmitError("Invalid data. Please check and try again.");
            break;
          case 404:
            setSubmitError("Email not found. Please check your email address.");
            break;
          default:
            setSubmitError("Failed to submit form. Please try again.");
        }
      } else {
        setSubmitError("Network error. Please check your connection and try again.");
      }
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
        <EmailInput
          value={formData.email}
          onChange={handleChange}
          onSendOtp={sendOtp}
          otpSent={otpSent}
          isLoading={otpLoading}
          error={emailError}
          success={otpSent && !emailError ? 'OTP sent successfully. Please check your email.' : ''}
          countdown={countdown}
        />

        <OtpInput
          value={otpValue}
          onChange={setOtpValue}
          onVerifyOtp={verifyOtp}
          isVerifying={isVerifying}
          otpSent={otpSent}
          error={otpError}
          success={otpVerified ? 'OTP verified successfully!' : ''}
          verified={otpVerified}
        />
        
        <div className="form-field">
          <label htmlFor="confidence">{otpVerified ? "3" : "2"}. How confident are you in identifying scams?</label>
          <div className="radio-group">
            <div className="radio-option">
              <input
                type="radio"
                id="confidence-5"
                name="confidence"
                value="5"
                checked={formData.confidence === "5"}
                onChange={handleChange}
                required
              />
              <label htmlFor="confidence-5">5 - Very confident</label>
            </div>
            
            <div className="radio-option">
              <input
                type="radio"
                id="confidence-4"
                name="confidence"
                value="4"
                checked={formData.confidence === "4"}
                onChange={handleChange}
                required
              />
              <label htmlFor="confidence-4">4 - Confident</label>
            </div>
            
            <div className="radio-option">
              <input
                type="radio"
                id="confidence-3"
                name="confidence"
                value="3"
                checked={formData.confidence === "3"}
                onChange={handleChange}
                required
              />
              <label htmlFor="confidence-3">3 - Neutral</label>
            </div>
            
            <div className="radio-option">
              <input
                type="radio"
                id="confidence-2"
                name="confidence"
                value="2"
                checked={formData.confidence === "2"}
                onChange={handleChange}
                required
              />
              <label htmlFor="confidence-2">2 - Prone to scams</label>
            </div>
            
            <div className="radio-option">
              <input
                type="radio"
                id="confidence-1"
                name="confidence"
                value="1"
                checked={formData.confidence === "1"}
                onChange={handleChange}
                required
              />
              <label htmlFor="confidence-1">1 - Very prone to scams</label>
            </div>
          </div>
        </div>

        {submitError && <p className="error-message">{submitError}</p>}
        
        <button
          type="submit"
          className="submit-button"
          disabled={!formData.email || !validateEmail(formData.email) || !otpVerified || !formData.confidence || otpLoading || isVerifying || isSubmitting}
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
      
      {/* Scam Alert Overlay */}
      <ScamAlert 
        isVisible={showScamAlert} 
        onClose={() => setShowScamAlert(false)}
        surveyUrl="https://form.gov.sg/67c97a6a16f914ed6bc31f27"
      />
    </div>
  );
};

export default Form;