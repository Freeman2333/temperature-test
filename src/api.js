import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_WEATHER_API_URL,
});

api.interceptors.request.use(
  (config) => {
    config.params.access_key = process.env.REACT_APP_WEATHER_API_KEY;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
