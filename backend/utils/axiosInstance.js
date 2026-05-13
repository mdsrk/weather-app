import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default axiosInstance;