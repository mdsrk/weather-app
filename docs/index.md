# Weather App - Project Documentation

## Overview

A full-stack weather dashboard application with Material Design UI, dynamic weather-reactive animations, and real-time forecasts. Built with React + Vite (frontend) and Express (backend), integrated with VisualCrossing API.

## Project Structure

```
weather-app/
├── backend/                 # Express.js backend API server
│   ├── .env                 # Environment variables (API keys)
│   ├── package.json         # Backend dependencies
│   ├── server.js            # Express server setup, routes, middleware
│   ├── routes/
│   │   └── weather.js       # Weather API route handlers
│   ├── services/
│   │   └── weatherService.js# VisualCrossing API integration, data normalization
│   └── utils/
│       ├── axiosInstance.js # Configured Axios client
│       └── errorHandler.js  # Centralized error handling middleware
├── frontend/                # React + Vite SPA
│   ├── index.html           # HTML entry point
│   ├── package.json         # Frontend dependencies
│   ├── postcss.config.js    # PostCSS configuration
│   ├── tailwind.config.js   # Tailwind CSS design tokens
│   ├── vite.config.js       # Vite build configuration
│   └── src/
│       ├── main.jsx         # React entry point, DOM render
│       ├── App.jsx          # Router setup, Layout wrapper
│       ├── index.css        # Global styles, animation keyframes
│       ├── components/
│       │   ├── AnimatedClouds.jsx   # Parallax cloud layers (3 layers)
│       │   ├── AnimatedRain.jsx     # 70 raindrop particles with splash effects
│       │   ├── AnimatedSnow.jsx     # 60 snowflakes with drift + accumulation
│       │   ├── AnimatedStorm.jsx    # Lightning flashes + heavy rain
│       │   ├── AnimatedSun.jsx      # Pulsing sun with rotating rays
│       │   ├── Error.jsx            # Error display with retry button
│       │   ├── Loading.jsx          # Loading spinner with message
│       │   ├── Layout.jsx           # Page layout with gradient background + glass footer
│       │   ├── MaterialButton.jsx   # Material button with ripple click effect
│       │   ├── MaterialCard.jsx     # Material card with ripple effect
│       │   ├── Navbar.jsx           # Glassmorphism navigation bar
│       │   └── WeatherAnimation.jsx # Smart animation selector
│       ├── hooks/
│       │   └── useWeatherTheme.js   # Hook returning weather-reactive theme
│       ├── pages/
│       │   └── Home.jsx           # Main weather dashboard page
│       └── services/
│           └── api.js             # API client for backend proxy
└── docs/
    └── index.md               # This file
```

## Backend Components

### Core Files

- **[server.js](./backend/server.js)** - Express server with CORS, JSON parsing, health endpoint, weather route, and error middleware
- **[package.json](./backend/package.json)** - Node.js module config (ES modules, Express + Axios + CORS + Dotenv dependencies)

### Services

- **[weatherService.js](./backend/services/weatherService.js)** - VisualCrossing API client with input validation, HTTP error handling, network error recovery, and response normalization to consistent data shape

### Routes

- **[weather.js](./backend/routes/weather.js)** - Express route definitions for weather endpoints

### Utilities

- **[axiosInstance.js](./backend/utils/axiosInstance.js)** - Pre-configured Axios instance with timeout and base URL
- **[errorHandler.js](./backend/utils/errorHandler.js)** - Centralized Express error handling middleware

### Configuration

- **[.env](./backend/.env)** - Backend environment variables (PORT, VISUALCROSSING_API_KEY)

## Frontend Components

### Entry Points

- **[index.html](./frontend/index.html)** - HTML entry point with Tailwind CSP meta tag
- **[main.jsx](./frontend/src/main.jsx)** - React 18 entry point, renders App into #root
- **[App.jsx](./frontend/src/App.jsx)** - React Router setup with BrowserRouter, Route definitions, Layout wrapper

### Pages

- **[Home.jsx](./frontend/src/pages/Home.jsx)** - Main weather dashboard with search, current conditions hero, hourly forecast carousel, 14-day forecast grid, stats grid, and raw data viewer

### Reusable Components

- **[AnimatedClouds.jsx](./frontend/src/components/AnimatedClouds.jsx)** - Parallax cloud layers (3 layers at different speeds)
- **[AnimatedRain.jsx](./frontend/src/components/AnimatedRain.jsx)** - Rain particle system with 70 drops, varying sizes, splash effects
- **[AnimatedSnow.jsx](./frontend/src/components/AnimatedSnow.jsx)** - Snow particle system with 60 flakes, drift animation, ground accumulation
- **[AnimatedStorm.jsx](./frontend/src/components/AnimatedStorm.jsx)** - Storm animation with lightning flashes, 80 heavy rain drops
- **[AnimatedSun.jsx](./frontend/src/components/AnimatedSun.jsx)** - Sun animation with pulsing glow, rotating rays, heat particles
- **[MaterialButton.jsx](./frontend/src/components/MaterialButton.jsx)** - Material Design button with ripple effect, variants (filled/outlined/text), colors, sizes
- **[MaterialCard.jsx](./frontend/src/components/MaterialCard.jsx)** - Material Design card with elevation shadows, ripple click effect, hover animations
- **[Navbar.jsx](./frontend/src/components/Navbar.jsx)** - Glassmorphism navigation bar with gradient logo
- **[Error.jsx](./frontend/src/components/Error.jsx)** - Error display component with message and optional retry button
- **[Layout.jsx](./frontend/src/components/Layout.jsx)** - Page layout wrapper with dynamic gradient background and glass footer
- **[Loading.jsx](./frontend/src/components/Loading.jsx)** - Loading spinner with customizable message
- **[WeatherAnimation.jsx](./frontend/src/components/WeatherAnimation.jsx)** - Smart animation selector based on weather conditions (clear-day, clear-night, partly-cloudy, rain, snow, thunderstorm, fog, cloudy)

### Hooks

- **[useWeatherTheme.js](./frontend/src/hooks/useWeatherTheme.js)** - Returns weather-reactive theme config (gradient, accent colors, animation type)

### Services

- **[api.js](./frontend/src/services/api.js)** - Axios-based API client for backend proxy (avoids CORS issues)

### Styling

- **[index.css](./frontend/src/index.css)** - Global styles, animation keyframes (rain, snow, sun, storm, clouds, ripple, float, fade-up, stagger), custom utilities (glass, scrollbar)
- **[tailwind.config.js](./frontend/tailwind.config.js)** - Design tokens: Material Design colors, shadows (elevation 1-6), radii (rounded-2xl to rounded-[40px]), animation keyframes (20+), custom utilities

### Configuration

- **[postcss.config.js](./frontend/postcss.config.js)** - PostCSS config with Tailwind and Autoprefixer
- **[tailwind.config.js](./frontend/tailwind.config.js)** - Tailwind CSS customization with design tokens
- **[vite.config.js](./frontend/vite.config.js)** - Vite build config with React plugin and proxy setup
- **[package.json](./frontend/package.json)** - Node.js module config (React 18, Vite, Tailwind, Axios, React Router dependencies)

## Architecture

### Data Flow

```
User searches city
       │
       ▼
Frontend (Home.jsx) ──► api.js ──► Backend (/api/weather/current)
       │                              │
       │                              ▼
       │                        weatherService.js (VisualCrossicalCrossing API)
       │                              │
       │                              ▼
       │                         normalizeResponse()
       │                              │
       │                              ▼
       │                         server.js (response JSON)
       │                              │
       ▼                              ▼
Frontend receives data
       │
       ▼
useWeatherTheme() ──► selects theme + animation
       │
       ▼
WeatherAnimation.jsx ──► renders appropriate particle animation
```

### Key Design Decisions

1. **Backend Proxy**: All VisualCrossicalCrossing API calls go through the backend to avoid CORS issues and protect API keys
2. **Component Composition**: WeatherAnimation acts as a dispatcher, selecting the correct particle component based on weather conditions
3. **Data Normalization**: weatherService.js transforms raw VisualCrossicalCrossing API responses into a consistent shape
4. **Material Design**: Custom Tailwind tokens implement Material Design elevation, ripple effects, and color system
5. **Reactive Theming**: useWeatherTheme hook provides weather-reactive gradients and animation selection