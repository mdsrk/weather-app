import express from 'express';
import { fetchWeather } from '../services/weatherService.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const location = req.query.location;

    if (!location) {
      return res.status(400).json({ error: 'Location query parameter is required' });
    }

    const weatherData = await fetchWeather(location);
    res.json(weatherData);
  } catch (error) {
    next(error);
  }
});

export default router;