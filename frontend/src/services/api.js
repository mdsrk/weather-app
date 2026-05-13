import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function getCurrentWeather(city) {
  const response = await api.get('/api/weather/current', {
    params: { city },
  });
  return response.data;
}

export default api;