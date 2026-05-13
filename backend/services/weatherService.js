import axios from 'axios';

// ─── Configuration ───────────────────────────────────────────────────────────
const CONFIG = {
  BASE_URL: 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline',
  TIMEOUT_MS: 15000,
  UNIT_GROUP: 'metric',
  DEFAULT_DAYS: 14,
};

// ─── Logger ──────────────────────────────────────────────────────────────────
function log(context, data) {
  console.log(`[WeatherService] ${context}`, data ?? '');
}

function warn(context, data) {
  console.warn(`[WeatherService] ${context}`, data ?? '');
}

function err(context, data) {
  console.error(`[WeatherService] ${context}`, data ?? '');
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Fetch weather data for a location from VisualCrossing.
 *
 * @param {string} location - City name or address
 * @param {number} days - Number of forecast days (default 5)
 * @returns {Promise<WeatherResponse>}
 */
export async function fetchWeather(location, days = CONFIG.DEFAULT_DAYS) {
  // ── 1. Validate inputs ────────────────────────────────────────────────────
  if (!location || typeof location !== 'string' || location.trim().length === 0) {
    throw createAppError(400, 'Invalid location: must be a non-empty string');
  }

  if (!days || days < 1 || days > 365) {
    throw createAppError(400, 'Days must be between 1 and 365');
  }

  const apiKey = process.env.VISUALCROSSING_API_KEY;
  if (!apiKey) {
    err('API_KEY_MISSING', 'Check that backend/.env contains VISUALCROSSING_API_KEY');
    throw createAppError(500, 'API key not configured. Ensure backend/.env has VISUALCROSSING_API_KEY');
  }

  const trimmedLocation = location.trim();
  log('FETCH_START', { location: trimmedLocation, days, baseUrl: CONFIG.BASE_URL });

  // ── 2. Build request URL with days parameter ──────────────────────────────
  const url = `${CONFIG.BASE_URL}/${encodeURIComponent(trimmedLocation)}`;

  // ── 3. Make API call ──────────────────────────────────────────────────────
  try {
    const response = await axios.get(url, {
      params: {
        unitGroup: CONFIG.UNIT_GROUP,
        key: apiKey,
        contentType: 'json',
        days: days,
      },
      timeout: CONFIG.TIMEOUT_MS,
    });

    log('API_RESPONSE', { status: response.status, location: trimmedLocation, days: response.data.days ? response.data.days.length : 'N/A' });

    // ── 4. Normalize & return ───────────────────────────────────────────────
    return normalizeResponse(response.data, trimmedLocation);

  } catch (error) {
    // ── Axios returned a response (non-2xx) ─────────────────────────────────
    if (error.response) {
      return handleHttpError(error, trimmedLocation);
    }

    // ── No response received – network / DNS / timeout ──────────────────────
    return handleNetworkError(error, trimmedLocation);
  }
}

// ─── Error Handlers ──────────────────────────────────────────────────────────

function handleHttpError(error, location) {
  const status = error.response.status;
  const body = error.response.data;
  const message = body?.message || body?.details || error.response.statusText;

  warn('HTTP_ERROR', { location, status, message });

  switch (status) {
    case 400:
      throw createAppError(400, `Bad request: ${message}`);
    case 403:
      err('API_KEY_INVALID', 'Verify the key in backend/.env is correct and active');
      throw createAppError(403, 'Invalid API key. Get a free key at https://www.visualcrossing.com/weather-api');
    case 404:
      throw createAppError(404, `Location not found: "${location}". Try a different city name.`);
    case 429:
      throw createAppError(429, 'Rate limit exceeded. Please wait a moment and try again.');
    case 503:
      throw createAppError(503, 'VisualCrossing service is temporarily unavailable. Try again later.');
    default:
      throw createAppError(status, `API error (${status}): ${message}`);
  }
}

function handleNetworkError(error, location) {
  const code = error.code;

  // ── DNS failure ───────────────────────────────────────────────────────────
  if (code === 'ENOTFOUND') {
    err('DNS_ERROR', `Cannot resolve weather.visualcrossing.com`);
    throw createAppError(503,
      'Cannot connect to weather service. Check your internet connection and DNS settings.\n' +
      'Troubleshooting: Run "ping weather.visualcrossing.com" to verify DNS resolution.\n' +
      'Or try: ipconfig /flushdns'
    );
  }

  // ── Connection refused / timeout ──────────────────────────────────────────
  if (code === 'ECONNABORTED') {
    warn('TIMEOUT', { location });
    throw createAppError(504, 'Request timed out. The API may be slow — try again.');
  }

  if (code === 'ECONNREFUSED') {
    err('CONNECTION_REFUSED', 'Could not reach weather.visualcrossing.com');
    throw createAppError(503, 'Cannot reach the weather service. Check your network or firewall.');
  }

  // ── Unknown network error ─────────────────────────────────────────────────
  warn('UNKNOWN_NETWORK_ERROR', { code, message: error.message, location });
  throw createAppError(500, `Network error: ${error.message}`);
}

// ─── Response Normalization ──────────────────────────────────────────────────

/**
 * Convert raw VisualCrossing response to a consistent shape.
 *
 * @param {object} raw - Raw API response
 * @param {string} fallbackLocation - Used when resolvedAddress is missing
 * @returns {WeatherResponse}
 */
function normalizeResponse(raw, fallbackLocation) {
  // VisualCrossing returns data in "days" array for timeline requests
  const allDays = raw.days || raw.values;
  if (!allDays || !Array.isArray(allDays) || allDays.length === 0) {
    warn('EMPTY_RESPONSE', { fallbackLocation, hasValues: !!raw.values, hasDays: !!raw.days });
    return emptyResponse(fallbackLocation);
  }

  const { resolvedAddress, areaName, contentType } = raw;
  const today = allDays[0];
  const forecastDays = allDays.slice(1);

  // Extract current weather from first day
  const current = {
    // Location info
    resolvedAddress: resolvedAddress || fallbackLocation,
    areaName: areaName || '',
    dateTime: today.datetime || raw.dateTime || '',
    icon: today.icon || 'unknown',
    conditions: today.conditions || 'Unknown',

    // Temperature
    temp: today.temp ?? today.temperature ?? null,
    feelsLike: today.feelslike ?? null,
    tempMax: today.tempmax ?? today.templow ?? null,
    tempMin: today.tempmin ?? today.templow ?? null,

    // Wind
    windSpeed: today.windspeed ?? null,
    windGust: today.windgust ?? null,
    windDirection: today.winddir ?? null,
    windDeg: today.winddeg ?? null,

    // Precipitation
    precipProb: today.precipprob ?? null,
    precip: today.precip ?? null,
    snow: today.snow ?? null,
    snowDepth: today.snowdepth ?? null,

    // Atmosphere
    humidity: today.humidity ?? null,
    pressure: today.pressure ?? null,
    dew: today.dew ?? null,
    dewPoint: today.dewpoint ?? today.dew ?? null,
    cloudCover: today.cloudcover ?? null,
    visibility: today.visibility ?? null,
    uvIndex: today.uvindex ?? today.uvindex ?? null,

    // Solar
    sunrise: today.sunrise ?? null,
    sunset: today.sunset ?? null,
    moonPhase: today.moonphase ?? null,

    // Additional fields from API
    windGustSpeed: today.windgustspeed ?? null,
    evaporativeDemand: today.evapdemand ?? null,
    comfortIndex: today.comfortindex ?? null,
    freezeThaw: today.freezethaw ?? null,
  };

  // Build forecast array (skip first day which is today)
  const forecast = forecastDays.map(extractForecastDay);

  // Build hourly data from today's hours array
  const hourly = today.hours ? today.hours.map(extractHourlyData) : [];

  return {
    // Location
    location: {
      resolvedAddress: resolvedAddress || areaName || fallbackLocation,
      areaName: areaName || '',
      country: raw.country || '',
      latitude: raw.latitude || raw.latitudeResolved || null,
      longitude: raw.longitude || raw.longitudeResolved || null,
      timezone: raw.timezone || '',
      tz: raw.tz || '',
    },

    // Current weather
    current: current,

    // Today's full data (includes hours)
    today: {
      ...today,
      hourly: hourly,
    },

    // Forecast array
    forecast: forecast,

    // Full raw response for debugging
    raw: raw,

    // Metadata
    metadata: {
      unitGroup: raw.unitGroup || CONFIG.UNIT_GROUP,
      daysRequested: raw.days || CONFIG.DEFAULT_DAYS,
      timezone: raw.timezone || '',
      tz: raw.tz || '',
      sunriseThreshold: raw.sunriseThreshold ?? null,
      sunsetThreshold: raw.sunsetThreshold ?? null,
      latitude: raw.latitude || null,
      longitude: raw.longitude || null,
      resolvedAddress: resolvedAddress || fallbackLocation,
      location: raw.location || {},
    },
  };
}

function extractForecastDay(day) {
  return {
    dateTime: day.datetime ?? null,
    temp: day.temp ?? day.temperature ?? null,
    tempMax: day.tempmax ?? null,
    tempMin: day.tempmin ?? null,
    feelsLike: day.feelslike ?? null,
    feelsLikeMax: day.feelslikemax ?? null,
    feelsLikeMin: day.feelslikemin ?? null,
    windSpeed: day.windspeed ?? null,
    windGust: day.windgust ?? null,
    windDirection: day.winddir ?? null,
    windDeg: day.winddeg ?? null,
    humidity: day.humidity ?? null,
    precipProb: day.precipprob ?? null,
    precip: day.precip ?? null,
    snow: day.snow ?? null,
    snowDepth: day.snowdepth ?? null,
    conditions: day.conditions ?? 'Unknown',
    icon: day.icon ?? 'unknown',
    cloudCover: day.cloudcover ?? null,
    visibility: day.visibility ?? null,
    uvIndex: day.uvindex ?? null,
    pressure: day.pressure ?? null,
    dew: day.dew ?? null,
    sunrise: day.sunrise ?? null,
    sunset: day.sunset ?? null,
    moonPhase: day.moonphase ?? null,
    windGustSpeed: day.windgustspeed ?? null,
  };
}

function extractHourlyData(hour) {
  return {
    dateTime: hour.datetime ?? null,
    temp: hour.temp ?? hour.temperature ?? null,
    feelsLike: hour.feelslike ?? null,
    windSpeed: hour.windspeed ?? null,
    windGust: hour.windgust ?? null,
    windDirection: hour.winddir ?? null,
    windDeg: hour.winddeg ?? null,
    humidity: hour.humidity ?? null,
    precipProb: hour.precipprob ?? null,
    precip: hour.precip ?? null,
    conditions: hour.conditions ?? 'Unknown',
    icon: hour.icon ?? 'unknown',
    cloudCover: hour.cloudcover ?? null,
    visibility: hour.visibility ?? null,
    uvIndex: hour.uvindex ?? null,
    pressure: hour.pressure ?? null,
    dew: hour.dew ?? null,
  };
}

function emptyResponse(location) {
  return {
    location: { resolvedAddress: location },
    current: {
      conditions: 'No data available',
      icon: 'unknown',
    },
    today: { hourly: [] },
    forecast: [],
    metadata: {},
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Create a structured error with HTTP status.
 *
 * @param {number} status - HTTP status code
 * @param {string} message - Human-friendly message
 * @returns {Error}
 */
function createAppError(status, message) {
  const error = new Error(message);
  error.status = status;
  error.isOperational = true;
  return error;
}

export default { fetchWeather, CONFIG };