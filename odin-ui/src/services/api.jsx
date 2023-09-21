import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchSARImage = async () => {
    const response = await axios.get(`${API_BASE_URL}/api/sar-image`, { responseType: 'arraybuffer' });
    return response.data;
};

export const fetchLighthouses = async () => {
    const response = await axios.get(`${API_BASE_URL}/api/lighthouses`);
    console.log("Inside fetchLighthouses...");
    return response.data;
};

