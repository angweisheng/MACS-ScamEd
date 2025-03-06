import React, { useState, useEffect } from 'react';
import './ScamAlert.css';

interface ScamAlertProps {
  isVisible: boolean;
  onClose: () => void;
  surveyUrl: string;
}

const ScamAlert: React.FC<ScamAlertProps> = ({ isVisible, onClose, surveyUrl }) => {
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [animationActive, setAnimationActive] = useState(false);
  
  useEffect(() => {
    // Add glitch effect animation
    if (isVisible) {
      setAnimationActive(true);
      
      // Start glitch effect
      const glitchInterval = setInterval(() => {
        setGlitchEffect(prev => !prev);
      }, 200);
      
      // Stop animations after 1 second
      const animationTimer = setTimeout(() => {
        setAnimationActive(false);
        clearInterval(glitchInterval);
      }, 1000);
      
      return () => {
        clearInterval(glitchInterval);
        clearTimeout(animationTimer);
      };
    }
  }, [isVisible]);

  const handleRedirect = () => {
    window.location.href = surveyUrl;
  };

  if (!isVisible) return null;

  return (
    <div className={`scam-alert-overlay ${animationActive ? 'animate' : ''}`}>
      <div className={`scam-alert-content ${animationActive && glitchEffect ? 'glitch' : ''}`}>
        <div className="scam-alert-subtitle">Fake FormSG Alert</div>
        <h1 className="scam-alert-title">YOU COULD HAVE BEEN SCAMMED</h1>
        <p className="scam-alert-subtext">You may be prone to OTP or government impersonation scams</p>
        <button className="scam-alert-button" onClick={handleRedirect}>
          PROCEED TO SURVEY
        </button>
      </div>
    </div>
  );
};

export default ScamAlert;
