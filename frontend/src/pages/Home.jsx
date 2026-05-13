import { useState } from 'react';
import { getCurrentWeather } from '../services/api';
import WeatherAnimation from '../components/WeatherAnimation';
import MaterialCard from '../components/MaterialCard';
import MaterialButton from '../components/MaterialButton';
import { useWeatherTheme } from '../hooks/useWeatherTheme';
import Loading from '../components/Loading';
import Error from '../components/Error';

/* ─── Weather Icon Mapping ──────────────────────────────────── */
function getWeatherIcon(icon, size = 'md') {
  const sizes = { sm: 'text-2xl', md: 'text-4xl', lg: 'text-5xl', xl: 'text-7xl', '2xl': 'text-8xl' };
  const icons = {
    'clear-day': '☀️', 'clear-night': '🌙',
    'partly-cloudy-day': '⛅', 'partly-cloudy-night': '☁️',
    'cloudy': '☁️', 'rain': '🌧️', 'snow': '🌨️',
    'sleet': '🌧️', 'hail': '🌨️', 'thunderstorm': '⛈️',
    'fog': '🌫️', 'drizzle': '🌦️', 'wind': '💨', 'unknown': '🌡️',
  };
  return `<span class="${sizes[size] || sizes.md} select-none">${icons[icon] || icons.unknown}</span>`;
}

/* ─── Time/Date Formatters ──────────────────────────────────── */
function formatTime(isoStr) {
  if (!isoStr) return '--:--';
  try {
    if (isoStr.includes(':') && isoStr.length <= 8) return isoStr.substring(0, 5);
    if (isoStr.includes('T')) {
      const d = new Date(isoStr);
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    }
    return isoStr.substring(0, 5);
  } catch { return isoStr.substring(0, 5) || '--:--'; }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  } catch { return dateStr; }
}

/* ─── Sub-Components ────────────────────────────────────────── */
function WindCompass({ degrees }) {
  if (!degrees) return null;
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" className="inline-block ml-1" style={{ transform: `rotate(${degrees}deg)` }}>
      <path d="M10 2 L12 10 L10 18 L8 10 Z" fill="currentColor" />
    </svg>
  );
}

function DetailBadge({ icon, label, value }) {
  if (value === null || value === undefined) return null;
  return (
    <div className="flex items-center gap-2 bg-gray-50/80 dark:bg-gray-700/50 rounded-xl px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors">
      <span className="text-lg">{icon}</span>
      <div>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-medium leading-none">{label}</p>
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 leading-none mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function StatPill({ icon, label, value, unit, sub, accent }) {
  const accentClasses = {
    blue: 'from-blue-500/10 to-blue-600/5 border-blue-200/50 dark:border-gray-700/30',
    red: 'from-red-500/10 to-red-600/5 border-red-200/50',
    green: 'from-green-500/10 to-green-600/5 border-green-200/50',
    amber: 'from-amber-500/10 to-amber-600/5 border-amber-200/50',
  };
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${accentClasses[accent] || accentClasses.blue} backdrop-blur-sm border rounded-2xl p-3 sm:p-4 transition-all hover:scale-105 hover:shadow-md`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base sm:text-lg">{icon}</span>
        <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">{label}</p>
      </div>
      <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
        {value != null ? value : '--'} {unit}
      </p>
      {sub && <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
    </div>
  );
}

function HourlyForecast({ hourly, theme }) {
  if (!hourly || hourly.length === 0) return null;
  return (
    <MaterialCard elevation={2} className="fade-up">
      <div className="p-5 sm:p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          🕐 Hourly Forecast
        </h3>
        <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-thin">
          {hourly.slice(0, 24).map((h, i) => (
            <div key={i} className="flex-shrink-0 w-18 text-center flex flex-col items-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">{formatTime(h.dateTime)}</p>
              <div className="text-2xl mb-2 select-none" dangerouslySetInnerHTML={{ __html: getWeatherIcon(h.icon, 'sm') }} />
              <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{h.temp != null ? Math.round(h.temp) : '--'}°</p>
              {h.precipProb != null && h.precipProb > 0 && (
                <p className="text-xs text-blue-500 mt-1">🌧️{h.precipProb}%</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </MaterialCard>
  );
}

function ForecastDayCard({ day, index }) {
  const headerGradient = day.icon?.includes('rain') ? 'from-blue-600 to-blue-700' :
    day.icon?.includes('snow') ? 'from-cyan-500 to-blue-500' :
    day.icon?.includes('thunder') ? 'from-gray-700 to-purple-800' :
    day.icon?.includes('cloud') ? 'from-slate-500 to-gray-600' :
    'from-amber-500 to-orange-500';

  return (
    <MaterialCard
      elevation={1}
      hover
      className={`fade-up stagger-${Math.min(index % 6 + 1, 6)} h-full flex flex-col`}
    >
      {/* Header - Date + Icon */}
      <div className={`bg-gradient-to-br ${headerGradient} text-white rounded-t-2xl p-3`}>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">{formatDate(day.dateTime)}</p>
          <div className="text-3xl select-none" dangerouslySetInnerHTML={{ __html: getWeatherIcon(day.icon, 'lg') }} />
        </div>
      </div>

      {/* Body */}
      <div className="p-3 flex-1 flex flex-col">
        {/* Temperature */}
        <div className="flex items-center justify-center gap-3 mb-2 pb-2 border-b border-gray-100 dark:border-gray-700">
          <span className="text-xl font-bold text-red-500">↑{day.tempMax != null ? Math.round(day.tempMax) : '--'}</span>
          <span className="text-xl font-bold text-blue-500">↓{day.tempMin != null ? Math.round(day.tempMin) : '--'}</span>
        </div>

        {/* Condition */}
        <p className="text-xs text-gray-600 dark:text-gray-300 text-center font-medium mb-2 truncate">{day.conditions}</p>

        {/* Detail Badges - 2 columns */}
        <div className="grid grid-cols-2 gap-1.5 flex-1">
          <Badge2 icon="🌧️" label="Rain" value={day.precipProb != null ? `${day.precipProb}%` : '--'} color="blue" />
          <Badge2 icon="💧" label="Precip" value={day.precip != null ? `${day.precip} mm` : '--'} color="cyan" />
          <Badge2 icon="❄️" label="Snow" value={day.snow != null ? `${day.snow} cm` : '--'} color="cyan" />
          <Badge2 icon="💨" label="Wind" value={day.windSpeed != null ? `${Math.round(day.windSpeed)}` : '--'} color="slate" />
          <Badge2 icon="💧" label="Humidity" value={day.humidity != null ? `${Math.round(day.humidity)}%` : '--'} color="blue" />
          <Badge2 icon="☀️" label="UV" value={day.uvIndex != null ? `${Math.round(day.uvIndex)}` : '--'} color="amber" />
          <Badge2 icon="👁️" label="Visib." value={day.visibility != null ? `${Math.round(day.visibility)}` : '--'} color="slate" />
          <Badge2 icon="🔽" label="Press." value={day.pressure != null ? `${Math.round(day.pressure)}` : '--'} color="slate" />
        </div>
      </div>
    </MaterialCard>
  );
}

function Badge2({ icon, label, value, color }) {
  const bgColors = {
    blue: 'bg-blue-50 dark:bg-blue-900/30',
    cyan: 'bg-cyan-50 dark:bg-cyan-900/30',
    amber: 'bg-amber-50 dark:bg-amber-900/30',
    slate: 'bg-gray-50 dark:bg-gray-700/50',
    red: 'bg-red-50 dark:bg-red-900/30',
    green: 'bg-green-50 dark:bg-green-900/30',
  };
  const textColors = {
    blue: 'text-blue-700 dark:text-blue-300',
    cyan: 'text-cyan-700 dark:text-cyan-300',
    amber: 'text-amber-700 dark:text-amber-300',
    slate: 'text-gray-700 dark:text-gray-200',
    red: 'text-red-700 dark:text-red-300',
    green: 'text-green-700 dark:text-green-300',
  };
  return (
    <div className={`${bgColors[color] || bgColors.slate} rounded-lg px-2 py-1.5 flex flex-col items-center justify-center`}>
      <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase leading-none mb-0.5">{label}</span>
      <div className="flex items-center gap-1 justify-center">
        <span className="text-xs">{icon}</span>
        <span className={`text-sm font-bold ${textColors[color] || textColors.slate} leading-none`}>{value}</span>
      </div>
    </div>
  );
}

function RawDataViewer({ data }) {
  const [open, setOpen] = useState(false);
  return (
    <MaterialCard elevation={1}>
      <div className="p-5">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-lg font-bold text-gray-700 dark:text-gray-200 hover:text-primary-600 transition-colors w-full"
        >
          📊 Raw API Response {open ? '▲' : '▼'}
        </button>
        {open && (
          <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl text-xs text-gray-700 dark:text-gray-300 overflow-auto max-h-96 mt-4 whitespace-pre-wrap font-mono">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </MaterialCard>
  );
}

/* ─── Main Home Page ────────────────────────────────────────── */
export default function Home() {
  const [city, setCity] = useState('');
  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!city.trim()) return;
    setLoading(true);
    setError(null);
    setRawData(null);
    try {
      const data = await getCurrentWeather(city.trim());
      setRawData(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }

  // Extract data from backend response
  // Backend uses camelCase: windSpeed, tempMax, tempMin, precipProb, uvIndex, cloudCover, windGust, moonPhase
  const current = rawData?.current || {};
  const forecast = rawData?.forecast || [];
  const resolvedAddress = rawData?.location?.resolvedAddress || rawData?.location?.areaName || city;

  // Build "today" from current + today's hourly, normalizing camelCase to kebab-case
  const today = rawData?.today ? {
    ...current,
    // Backend camelCase -> frontend kebab-case aliases
    tempmax: current.tempMax ?? current.temp,
    tempmin: current.tempMin ?? current.temp,
    windspeed: current.windSpeed ?? null,
    winddeg: current.windDeg ?? null,
    windgust: current.windGust ?? null,
    precipprob: current.precipProb ?? null,
    uvindex: current.uvIndex ?? null,
    cloudcover: current.cloudCover ?? null,
    moonphase: current.moonPhase ?? null,
    // Hours
    hours: rawData.today?.hourly || [],
  } : null;

  const hourly = today?.hours || [];

  // Get theme based on current weather
  const theme = useWeatherTheme(today?.conditions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Search Section */}
      <div className="relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-b border-white/30 dark:border-gray-700/30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
              🌤️ WeatherPulse
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
              Real-time weather with dynamic animations
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search any city..."
              className="flex-1 px-5 py-3.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-gray-800 dark:text-gray-100 placeholder-gray-400"
            />
            <MaterialButton
              type="submit"
              variant="filled"
              color="primary"
              size="large"
              disabled={loading || !city.trim()}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Loading...
                </span>
              ) : 'Search'}
            </MaterialButton>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {loading && <Loading message="Fetching weather data..." />}

        {error && (
          <Error
            message={error}
            onRetry={() => { setError(null); if (city.trim()) handleSubmit({ preventDefault: () => {} }); }}
          />
        )}

        {rawData && today && (
          <div className="space-y-6">
            {/* ─── Hero: Current Weather ────────────────────────────── */}
            <div className={`relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br ${theme.gradient} text-white`}>
              {/* Weather Animation Background */}
              <WeatherAnimation conditions={today?.conditions} />

              <div className="relative p-6 sm:p-8 lg:p-10 z-10">
                {/* Location & Condition */}
                <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 mb-8">
                  <div className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                      <div className="text-6xl sm:text-7xl select-none" dangerouslySetInnerHTML={{ __html: getWeatherIcon(today?.icon, '2xl') }} />
                      <div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">{resolvedAddress}</h2>
                        {rawData.country && (
                          <span className="inline-block mt-1 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                            {rawData.country}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-lg text-white/80 mt-2 font-medium">{today?.conditions}</p>
                    <div className="mt-5">
                      <p className="text-7xl sm:text-8xl lg:text-9xl font-bold tracking-tight">
                        {today?.temp != null ? Math.round(today.temp) : '--'}°
                      </p>
                      <p className="text-xl text-white/80 mt-1">
                        Feels like {today?.feelsLike != null ? Math.round(today.feelsLike) : '--'}°C
                      </p>
                    </div>
                  </div>

                  {/* Sunrise/Sunset */}
                  <div className="flex gap-6 sm:gap-8 text-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4">
                      <p className="text-3xl mb-1">🌅</p>
                      <p className="text-xs text-white/60 uppercase tracking-wider">Sunrise</p>
                      <p className="text-lg font-bold">{formatTime(today?.sunrise)}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4">
                      <p className="text-3xl mb-1">🌇</p>
                      <p className="text-xs text-white/60 uppercase tracking-wider">Sunset</p>
                      <p className="text-lg font-bold">{formatTime(today?.sunset)}</p>
                    </div>
                  </div>
                </div>

                {/* High/Low */}
                <div className="flex justify-center gap-4 mb-8">
                  <span className="flex items-center gap-2 bg-red-500/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                    ↑ {today?.tempmax != null ? Math.round(today.tempmax) : '--'}°C
                  </span>
                  <span className="flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                    ↓ {today?.tempmin != null ? Math.round(today.tempmin) : '--'}°C
                  </span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                  <StatPill icon="💧" label="Humidity" value={today?.humidity != null ? `${Math.round(today.humidity)}%` : '--'} accent="blue" />
                  <StatPill
                    icon="💨"
                    label="Wind"
                    value={today?.windspeed != null ? `${Math.round(today.windspeed)} km/h` : '--'}
                    sub={today?.winddeg != null ? <WindCompass degrees={today.winddeg} /> : undefined}
                    accent="blue"
                  />
                  <StatPill icon="🌧️" label="Rain Prob." value={today?.precipprob != null ? `${today.precipprob}%` : '--'} accent="blue" />
                  <StatPill
                    icon="☀️"
                    label="UV Index"
                    value={today?.uvindex != null ? `${Math.round(today.uvindex)}` : '--'}
                    sub={today?.uvindex != null && today.uvindex >= 8 ? 'Very High' : today?.uvindex != null && today.uvindex >= 6 ? 'High' : today?.uvindex != null && today.uvindex >= 3 ? 'Moderate' : 'Low'}
                    accent={today?.uvindex != null && today.uvindex >= 8 ? 'red' : today?.uvindex != null && today.uvindex >= 6 ? 'amber' : 'green'}
                  />
                  <StatPill icon="🔽" label="Pressure" value={today?.pressure != null ? `${Math.round(today.pressure)} hPa` : '--'} accent="blue" />
                  <StatPill icon="👁️" label="Visibility" value={today?.visibility != null ? `${Math.round(today.visibility)} km` : '--'} accent="blue" />
                  <StatPill icon="🌡️" label="Dew Point" value={today?.dew != null ? `${Math.round(today.dew)}°C` : '--'} accent="amber" />
                  <StatPill icon="☁️" label="Cloud Cover" value={today?.cloudcover != null ? `${Math.round(today.cloudcover)}%` : '--'} accent="blue" />
                  <StatPill icon="🌪️" label="Wind Gust" value={today?.windgust != null ? `${Math.round(today.windgust)} km/h` : '--'} accent="blue" />
                  <StatPill icon="🌙" label="Moon Phase" value={today?.moonphase != null ? `${Math.round(today.moonphase * 100)}%` : '--'} accent="amber" />
                </div>
              </div>
            </div>

            {/* ─── Hourly Forecast ─────────────────────────────────── */}
            {hourly.length > 0 && (
              <HourlyForecast hourly={hourly} theme={theme} />
            )}

            {/* ─── 14-Day Forecast ─────────────────────────────────── */}
            {forecast.length > 0 && (
              <MaterialCard elevation={2} className="fade-up">
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-5 flex items-center gap-2">
                    📅 Extended Forecast <span className="text-sm font-normal text-gray-500">({forecast.length} days)</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
                    {forecast.map((day, i) => (
                      <ForecastDayCard key={i} day={day} index={i} />
                    ))}
                  </div>
                </div>
              </MaterialCard>
            )}

            {/* ─── Location Info ───────────────────────────────────── */}
            {rawData.latitude != null && (
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-4 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                <span>📍 {resolvedAddress}</span>
                <span>🌐 {rawData.latitude.toFixed(4)}°, {rawData.longitude?.toFixed(4) || '--'}°</span>
                {rawData.timezone && <span>🕐 {rawData.timezone}</span>}
              </div>
            )}

            {/* ─── Raw Data Viewer ─────────────────────────────────── */}
            <RawDataViewer data={rawData} />
          </div>
        )}

        {/* Empty State */}
        {!rawData && !loading && !error && (
          <div className="text-center py-20 sm:py-32">
            <div className="text-8xl sm:text-9xl mb-8 float">🌍</div>
            <p className="text-gray-500 dark:text-gray-400 text-xl sm:text-2xl max-w-xl mx-auto">
              Search for a city to see the complete weather dashboard with live animations
            </p>
          </div>
        )}
      </div>
    </div>
  );
}