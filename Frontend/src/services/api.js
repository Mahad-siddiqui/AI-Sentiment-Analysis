// Frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const sentimentAPI = {
  trainModel: async () => {
    const response = await axios.post(`${API_BASE_URL}/sentiment/train`);
    return response.data;
  },

  predictSentiment: async (text) => {
    const response = await axios.post(`${API_BASE_URL}/sentiment/predict`, { text });
    return response.data;
  },

  getModelInfo: async () => {
    const response = await axios.get(`${API_BASE_URL}/sentiment/info`);
    return response.data;
  }
};
