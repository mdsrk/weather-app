import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fetchWeather } from './services/weatherService.js';
import errorHandler from './utils/errorHandler.js';
import weatherRoutes from './routes/weather.js';

dotenv.config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).send('Server is healthy');
});

app.get('/api/weather/current', async (req, res, next) => {
  try {
    const city = req.query.city;
    const days = parseInt(req.query.days) || 5;

    if (!city) {
      return res.status(400).json({ error: 'City query parameter is required' });
    }

    const weatherData = await fetchWeather(city, days);

    if (weatherData.current?.conditions === 'No data available') {
      return res.status(404).json({ error: `Weather data not available for: ${city}` });
    }

    // Return only relevant fields (exclude raw for production)
    res.json({
      location: weatherData.location,
      current: weatherData.current,
      today: {
        ...weatherData.today,
        hourly: weatherData.today?.hourly || [],
      },
      forecast: weatherData.forecast,
      country: weatherData.location?.country || '',
      latitude: weatherData.location?.latitude || null,
      longitude: weatherData.location?.longitude || null,
      timezone: weatherData.location?.timezone || weatherData.metadata?.timezone || '',
    });
  } catch (error) {
    next(error);
  }
});

// Debug endpoint that returns full raw data
app.get('/api/weather/debug/:city', async (req, res, next) => {
  try {
    const city = req.params.city;
    const weatherData = await fetchWeather(city);
    res.json(weatherData);
  } catch (error) {
    next(error);
  }
});

app.use('/weather', weatherRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});