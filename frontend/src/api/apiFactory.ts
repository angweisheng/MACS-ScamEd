import axios from "axios";
// import { ParticipantInit } from "../lib/types";

export const BASE_SERVER_URL = process.env.BASE_SERVER_URL || "http://localhost:8000"
export const PARTICIPANTS_PATH = "/participants"
export const OTP_PATH = "/otp"

export const createParticipant = async (email: string) => {
    try {
        const api = BASE_SERVER_URL + PARTICIPANTS_PATH;
        const response = await axios.post(api, email);
        console.log('Participant Registered: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error registering email, ' + error);
        throw error;
    }
}
export const sendOTP = async (email: string) => {
    try {
        const api = BASE_SERVER_URL + OTP_PATH + '/send';
        const response = await axios.post(api, email);
        console.log('OTP SENT: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending OTP, ' + error);
        throw error;
    }
}
export const verify = async (email: string) => {
    try {
        const api = BASE_SERVER_URL + OTP_PATH + '/verify';
        const response = await axios.post(api, email);
        console.log('OTP Verified: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error verifying OTP, ' + error);
        throw error;
    }
}

