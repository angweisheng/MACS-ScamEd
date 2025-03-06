import axios from "axios";
// import { ParticipantInit } from "../lib/types";

export const BASE_SERVER_URL = process.env.REACT_APP_BASE_SERVER_URL || "http://localhost:8000"
export const PARTICIPANTS_PATH = "/participants"
export const OTP_PATH = "/otp"

export const createParticipant = async (email: string) => {
    try {
        const api = BASE_SERVER_URL + PARTICIPANTS_PATH;
        const response = await axios.post(api, { email });
        console.log('Participant Registered: ', response.data);
        return response.data;
    } catch (error: any) {
        // Log more detailed error information
        if (error.response) {
            console.error(`Error registering email (${error.response.status}): ${error.response.data?.message || 'Unknown error'}`);
        } else {
            console.error('Error registering email: ' + error.message);
        }
        throw error;
    }
}
export const sendOTP = async (email: string) => {
    try {
        const api = BASE_SERVER_URL + OTP_PATH + '/send';
        const response = await axios.post(api, { email });
        console.log('OTP SENT: ', response.data);
        return response.data;
    } catch (error: any) {
        // Log more detailed error information
        if (error.response) {
            console.error(`Error sending OTP (${error.response.status}): ${error.response.data?.message || 'Unknown error'}`);
        } else {
            console.error('Error sending OTP: ' + error.message);
        }
        throw error;
    }
}
export const verifyOTP = async (email: string, otp: string) => {
    try {
        const api = BASE_SERVER_URL + OTP_PATH + '/verify';
        const response = await axios.post(api, { email, otp });
        console.log('OTP Verified: ', response.data);
        return response.data;
    } catch (error: any) {
        // Log more detailed error information
        if (error.response) {
            console.error(`Error verifying OTP (${error.response.status}): ${error.response.data?.message || 'Unknown error'}`);
        } else {
            console.error('Error verifying OTP: ' + error.message);
        }
        throw error;
    }
}

export const updateConfidence = async (email: string, confidence: number) => {
    try {
        const api = BASE_SERVER_URL + PARTICIPANTS_PATH + '/confidence';
        const response = await axios.patch(api, { email, confidence });
        console.log('Confidence Updated: ', response.data);
        return response.data;
    } catch (error: any) {
        // Log more detailed error information
        if (error.response) {
            console.error(`Error updating confidence (${error.response.status}): ${error.response.data?.message || 'Unknown error'}`);
        } else {
            console.error('Error updating confidence: ' + error.message);
        }
        throw error;
    }
}

