import axios from 'axios';

const API_KEY = '69b45e877038ef619acc6f1f88e62476';
const BASE_URL = 'http://api.weatherstack.com'; // Switching to HTTP for Free Plan compatibility

const apiClient = axios.create({
    baseURL: BASE_URL,
    params: {
        access_key: API_KEY,
    },
});

export const weatherService = {
    getCurrent: async (query) => {
        const response = await apiClient.get('/current', { params: { query } });
        return response.data;
    },

    getForecast: async (query, days = 7) => {
        const response = await apiClient.get('/forecast', { params: { query, forecast_days: days, hourly: 1 } });
        return response.data;
    },

    getHistorical: async (query, date) => {
        const response = await apiClient.get('/historical', { params: { query, historical_date: date, hourly: 1 } });
        return response.data;
    },

    getMarine: async (latitude, longitude) => {
        const response = await apiClient.get('/marine', { params: { latitude, longitude, hourly: 1 } });
        return response.data;
    },

    getAutocomplete: async (query) => {
        const response = await apiClient.get('/autocomplete', { params: { query } });
        return response.data;
    }
};
