import React from 'react';
import './TermsModal.css';
import { termsAndConditions } from '../termsAndConditions';

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{termsAndConditions.title}</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <pre className="modal-terms-content">{termsAndConditions.content}</pre>
                </div>
            </div>
        </div>
    );
};
