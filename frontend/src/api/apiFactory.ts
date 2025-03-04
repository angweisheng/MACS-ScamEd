import axios from "axios";

export const BASE_SERVER_URL = process.env.BASE_SERVER_URL || "http://localhost:8000"
export const PARTICIPANTS_PATH = "/participants"

export const createParticipant = async (inputEmail: ParticipantInit) => {
    try {
        const api = BASE_SERVER_URL + PARTICIPANTS_PATH;
        const response = await axios.post(api, inputEmail);
        console.log('Participant Registered: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error registering email, ' + error);
        throw error;
    }
}

