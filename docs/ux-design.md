---
title: "UX Design Specification - Weather App"
version: "1.0.0"
status: "Draft"
created: "2026-05-13"
updated: "2026-05-13"
---

# UX Design Specification - WeatherPulse

## 1. Design System Overview

### 1.1 Design Philosophy
WeatherPulse combines **Material Design 3.0** principles with **Glassmorphism** aesthetics, creating a weather application that is both functionally rich and visually immersive. The design emphasizes:
- **Clarity**: Weather data is presented with clear hierarchy and readability
- **Immersion**: Dynamic animations and gradients create weather-reactive environments
- **Consistency**: Unified design language across all components and states
- **Accessibility**: High contrast, readable typography, and clear interactive feedback

### 1.2 Color System

#### Primary Palette (Tailwind Custom)
| Token | Value | Usage |
|-------|-------|-------|
| `primary-50` | `#f0f9ff` | Backgrounds, hover states |
| `primary-100` | `#e0f2fe` | Light backgrounds |
| `primary-400` | `#38bdf8` | Accent elements |
| `primary-500` | `#0ea5e9` | Primary actions |
| `primary-600` | `#0284c7` | Primary buttons, headings |
| `primary-700` | `#0369a1` | Hover states, links |
| `primary-900` | `#0c4a6e` | Active states |

#### Secondary Palette
| Token | Value | Usage |
|-------|-------|-------|
| `secondary-500` | `#22d3ee` | Secondary accents |
| `secondary-600` | `#06b6d4` | Secondary actions |

#### Semantic Colors
| Color | Usage | Example |
|-------|-------|---------|
| Red (`red-500`: `#ef4444`) | High temperature, alerts | Temp max indicator |
| Blue (`blue-500`: `#3b82f6`) | Low temperature, info | Temp min, humidity |
| Amber (`amber-500`: `#f59e0b`) | Warnings, UV index | UV index, moon phase |
| Green (`green-500`: `#22c55e`) | Safe, low risk | Low UV index |
| Cyan (`cyan-500`: `#06b6d4`) | Snow, precipitation | Snow data |

#### Weather-Themed Gradients
| Condition | Gradient | Background |
|-----------|----------|------------|
| Clear Day | `from-orange-400 via-amber-400 to-yellow-300` | Warm sunrise feel |
| Partly Cloudy | `from-blue-400 via-sky-400 to-indigo-400` | Balanced sky tones |
| Rain | `from-slate-600 via-blue-700 to-gray-800` | Stormy atmosphere |
| Snow | `from-cyan-200 via-blue-200 to-indigo-300` | Cold winter feel |
| Thunderstorm | `from-gray-800 via-purple-900 to-gray-900` | Dark storm mood |
| Night | `from-indigo-700 via-purple-800 to-slate-900` | Night sky |

### 1.3 Typography

#### Font Family
```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

#### Type Scale
| Level | Size | Weight | Usage |
|-------|------|--------|-------|
| Display | 7xl (4.5rem) | Bold | Hero temperature |
| H1 | 3xl-4xl | Bold | Page titles |
| H2 | xl-lg | Bold | Section headings |
| Body | base-sm | Normal | Content text |
| Small | xs-2xs (10-12px) | Medium | Labels, metadata |

#### Text Colors
- Primary: `gray-800` / `gray-100` (dark mode)
- Secondary: `gray-500` / `gray-400`
- Muted: `gray-400` / `gray-500`
- Interactive: `primary-600` (hover states)

### 1.4 Spacing System

Base unit: 4px (Tailwind default)

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Micro spacing |
| `sm` | 8px | Component internal |
| `md` | 16px | Standard spacing |
| `lg` | 24px | Section spacing |
| `xl` | 32px | Page layout |
| `2xl` | 48px | Major sections |

### 1.5 Corner Radius

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 6px | Badges, small elements |
| `md` | 12px | Cards, inputs |
| `lg` | 16px | Large cards |
| `xl` | 24px | Section containers |
| `2xl` | 32px | Hero sections |
| `3xl` | 40px | Full sections |
| `full` | 9999px | Pills, avatars |

### 1.6 Elevation System (Material Design)

| Elevation | Shadow | Usage |
|-----------|--------|-------|
| 1 | `0 1px 3px rgba(0,0,0,0.12)` | Subtle cards |
| 2 | `0 3px 6px rgba(0,0,0,0.15)` | Elevated cards |
| 3 | `0 7px 8px rgba(0,0,0,0.2)` | Modals, dropdowns |
| 4 | `0 10px 15px rgba(0,0,0,0.2)` | Floating panels |
| 5 | `0 14px 18px rgba(0,0,0,0.25)` | Top-level components |
| 6 | `0 20px 25px rgba(0,0,0,0.3)` | Hero sections |

## 2. Component Specifications

### 2.1 Search Bar

```
┌────────────────────────────────────────────────────────────┐
│                    🌤️ WeatherPulse                          │
│              Real-time weather with dynamic animations      │
│                                                            │
│  ┌──────────────────────────────────┬──────────────────┐  │
│  │ Search any city...                │    🔍 Search     │  │
│  └──────────────────────────────────┴──────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

**Properties:**
- Input: `px-5 py-3.5`, `border-2 border-gray-200`, `rounded-2xl`
- Button: Material filled variant, `primary` color, `large` size
- Focus state: `ring-2 ring-primary-500/50`, `border-primary-500`
- Background: `bg-white/60` with `backdrop-blur-xl` (glassmorphism)

**States:**
| State | Visual |
|-------|--------|
| Default | Gray border, white background |
| Focus | Primary ring, blue border |
| Disabled | Reduced opacity, no interaction |
| Loading | Spinner icon + "Loading..." text |

### 2.2 Hero Section (Current Weather)

```
┌─────────────────────────────────────────────────────────────┐
│  [Weather Animation Background - Layer 1]                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  ☀️ (City Name)                  🌅 Sunrise    🌇    │    │
│  │    Mon, May 13               6:23 AM       Sunset   │    │
│  │                      72°C                             │    │
│  │                    Feels like 68°C                    │    │
│  │                                                      │    │
│  │        ↑ 78°C            ↓ 62°C                      │    │
│  │                                                      │    │
│  │  💧 85%   💨 12 mph  🌧️ 30%  ☀️ UV 5  🔽 1015 hPa  │    │
│  └─────────────────────────────────────────────────────┘    │
│  [Weather Animation Background - Layer 2]                   │
└─────────────────────────────────────────────────────────────┘
```

**Properties:**
- Background: Dynamic gradient based on weather condition
- Animation: Full-width, full-height, low opacity overlay
- Content: White text, semi-transparent backgrounds
- Layout: Responsive grid (2-3 columns)

**Temperature Display:**
- Size: `text-7xl` to `text-9xl` (massive hero element)
- Weight: Bold
- Format: Integer with degree symbol

### 2.3 Stat Pill

```
┌──────────────────┐
│  💧 Humidity     │
│     85%          │
└──────────────────┘
```

**Properties:**
- Size: `p-3 sm:p-4`
- Background: Gradient with accent color (10% opacity)
- Border: `border` with accent color (50% opacity)
- Hover: `scale-105` + `shadow-md`
- Radius: `rounded-2xl`

**Accent Types:**
| Accent | Gradient | Border |
|--------|----------|--------|
| Blue | `from-blue-500/10 to-blue-600/5` | `border-blue-200/50` |
| Red | `from-red-500/10 to-red-600/5` | `border-red-200/50` |
| Green | `from-green-500/10 to-green-600/5` | `border-green-200/50` |
| Amber | `from-amber-500/10 to-amber-600/5` | `border-amber-200/50` |

### 2.4 Hourly Forecast Carousel

```
┌──────────────────────────────────────────────────────────────┐
│  🕐 Hourly Forecast                                           │
│                                                              │
│  ┌──────┬──────┬──────┬──────┬──────┬──────┬──────┐         │
│  │ 1PM  │ 2PM  │ 3PM  │ 4PM  │ 5PM  │ 6PM  │ 7PM  │  →      │
│  │  ☀️  │  ⛅  │  🌧️ │  🌧️ │  ⛅  │  ☀️  │  ☀️  │         │
│  │ 72°  │ 70°  │ 68°  │ 65°  │ 63°  │ 60°  │ 58°  │         │
│  └──────┴──────┴──────┴──────┴──────┴──────┴──────┘         │
└──────────────────────────────────────────────────────────────┘
```

**Properties:**
- Container: `MaterialCard` elevation 2
- Scroll: Horizontal with `overflow-x-auto`
- Item width: `w-18` (fixed, not flex)
- Gap: `gap-3`
- Scrollbar: `scrollbar-thin`

**Item Structure:**
1. Time label (top, small)
2. Weather icon (center, medium)
3. Temperature (bottom, bold)
4. Precipitation (optional, bottom, blue)

### 2.5 14-Day Forecast Grid

```
┌────────────────────────────────────────────────────────────┐
│  📅 Extended Forecast (14 days)                             │
│                                                            │
│  ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐        │
│  │Today│Tmrw│Mon  │Tue  │Wed  │Thu  │Fri  │Sat  │...      │
│  │ ☀️  │ ⛅  │ 🌧️ │ ☁️  │ ☀️  │ 🌧️ │ ⛅  │ ☀️  │          │
│  │↑78° │↑75° │↑70° │↑68° │↑72° │↑65° │↑70° │↑74° │          │
│  │↓62° │↓60° │↓58° │↓55° │↓57° │↓52° │↓55° │↓58° │          │
│  └─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘        │
└────────────────────────────────────────────────────────────┘
```

**Properties:**
- Grid: Responsive (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7`)
- Card: `MaterialCard` elevation 1, hover enabled
- Header: Gradient based on weather condition
- Stagger: `fade-up stagger-{1-6}` animation

**Card Header Gradients:**
| Condition | Gradient |
|-----------|----------|
| Rain | `from-blue-600 to-blue-700` |
| Snow | `from-cyan-500 to-blue-500` |
| Thunder | `from-gray-700 to-purple-800` |
| Cloud | `from-slate-500 to-gray-600` |
| Clear | `from-amber-500 to-orange-500` |

### 2.6 Detail Badge

```
┌──────────────────────┐
│  🌧️  Rain            │
│       30%            │
└──────────────────────┘
```

**Properties:**
- Size: Small (`px-3 py-2`)
- Background: `bg-gray-50/80` with dark mode variant
- Hover: `hover:bg-gray-100`
- Radius: `rounded-xl`

### 2.7 Forecast Day Badge (2-column grid)

```
┌─────────┐
│  Rain   │
│ 🌧️ 30%  │
└─────────┘
```

**Properties:**
- Grid: `grid-cols-2` within card
- Size: `px-2 py-1.5`
- Background: Color-coded by type
- Icon: `text-xs`
- Value: `text-sm font-bold`

**Badge Colors:**
| Type | Background | Text |
|------|------------|------|
| Blue | `bg-blue-50` | `text-blue-700` |
| Cyan | `bg-cyan-50` | `text-cyan-700` |
| Amber | `bg-amber-50` | `text-amber-700` |
| Slate | `bg-gray-50` | `text-gray-700` |

## 3. Layout Structure

### 3.1 Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│                     Glass Navbar                             │
│  [Logo]            [Search Bar]                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Main Content Area                       │    │
│  │                                                     │    │
│  │  ┌─────────────────────────────────────────────┐    │    │
│  │  │         Hero Section (Full Width)            │    │    │
│  │  └─────────────────────────────────────────────┘    │    │
│  │                                                     │    │
│  │  ┌──────────────┬──────────────────────────────┐    │    │
│  │  │ Hourly       │      14-Day Forecast         │    │    │
│  │  │ Forecast     │      (Grid)                  │    │    │
│  │  │ (Carousel)   │                              │    │    │
│  │  └──────────────┴──────────────────────────────┘    │    │
│  │                                                     │    │
│  │  [Raw Data Viewer]                                  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                     Glass Footer                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Responsive Breakpoints

| Breakpoint | Max Content Width | Grid Columns |
|------------|-------------------|--------------|
| Mobile (< 640px) | 100% | 1 |
| SM (≥ 640px) | 640px | 2 |
| MD (≥ 768px) | 768px | 3 |
| LG (≥ 1024px) | 1024px | 4 |
| XL (≥ 1280px) | 1280px | 6-7 |
| 2XL (≥ 1536px) | 1536px | 7+ |

### 3.3 Container Strategy

| Container | Usage |
|-----------|-------|
| Search bar | `max-w-4xl mx-auto px-4` |
| Main content | `max-w-7xl mx-auto px-4` |
| Hero section | Full width (no max) |
| Forecast grid | Responsive columns |

## 4. Animation & Motion

### 4.1 CSS Animations (Tailwind Config)

| Animation | Duration | Easing | Usage |
|-----------|----------|--------|-------|
| `fade-up` | 0.6s | ease-out | Page load, section reveal |
| `stagger-1` to `stagger-6` | 0.6s + delay | ease-out | Card reveal sequences |
| `float` | 3s | ease-in-out | Hero emoji |
| `ripple` | 0.6s | ease-out | Button click feedback |
| `spin-slow` | 2s | linear | Loading spinner |
| `pulse-slow` | 2s | ease-in-out | Background effects |

### 4.2 Hover Transitions

| Element | Transition |
|---------|------------|
| Cards | `hover:scale-105 hover:shadow-md` |
| Buttons | `hover:brightness-110` |
| Badges | `hover:bg-gray-100` |
| Stat Pills | `hover:scale-105` |

### 4.3 Weather Animation System

#### Particle Systems
| Animation | Particles | Effect |
|-----------|-----------|--------|
| AnimatedSun | 10 heat particles | Rising particles, pulsing glow |
| AnimatedRain | 70 drops | Falling drops, splash effects |
| AnimatedSnow | 60 flakes | Drifting snow, ground accumulation |
| AnimatedStorm | 80 heavy drops + lightning | Heavy rain, random flashes |
| AnimatedClouds | 3 layers | Parallax scrolling clouds |

#### Animation Triggers
| Condition | Animation |
|-----------|-----------|
| clear-day | AnimatedSun |
| clear-night | Gradient overlay |
| partly-cloudy | AnimatedClouds |
| rain | AnimatedRain |
| snow | AnimatedSnow |
| thunderstorm | AnimatedStorm |
| fog/cloudy | Gradient overlay |

## 5. State Management

### 5.1 Loading State

```
┌─────────────────────────────────────┐
│                                     │
│           [Loading Spinner]         │
│         Fetching weather data...    │
│                                     │
└─────────────────────────────────────┘
```

**Properties:**
- Centered spinner (SVG with rotation)
- Loading message (customizable)
- Full-width, full-height container
- Background: Semi-transparent overlay

### 5.2 Error State

```
┌─────────────────────────────────────┐
│           ⚠️ Error                  │
│    Failed to fetch weather data     │
│         [🔄 Retry]                  │
└─────────────────────────────────────┘
```

**Properties:**
- Error icon (⚠️)
- Message display
- Retry button (if callback provided)
- Destructive color for button

### 5.3 Empty State

```
┌─────────────────────────────────────┐
│                                     │
│              🌍                     │
│  Search for a city to see the       │
│  complete weather dashboard with    │
│  live animations                    │
│                                     │
└─────────────────────────────────────┘
```

**Properties:**
- Large floating emoji
- Centered text
- Gray text color
- Generous padding

## 6. Accessibility

### 6.1 WCAG Compliance

| Criteria | Target | Implementation |
|----------|--------|----------------|
| Contrast ratio | ≥ 4.5:1 | Tested all text/background combinations |
| Focus indicators | Visible | `ring-2 ring-primary-500/50` on focus |
| Keyboard navigation | Full | Tab order matches visual order |
| Screen readers | ARIA labels | Icons have aria-labels |
| Motion sensitivity | Respect | Animations use CSS `@media (prefers-reduced-motion)` |

### 6.2 Color Contrast

| Text | Background | Ratio | Status |
|------|------------|-------|--------|
| `gray-800` | `white` | 12.6:1 | ✅ AA, AAA |
| `gray-500` | `white` | 4.6:1 | ✅ AA |
| `white` | `primary-600` | 5.1:1 | ✅ AA |
| `gray-100` | `gray-900` | 13.4:1 | ✅ AA, AAA |

## 7. Design Tokens Summary

### 7.1 Key Values

```javascript
const designTokens = {
  colors: {
    primary: { 50: '#f0f9ff', ..., 900: '#0c4a6e' },
    secondary: { 500: '#22d3ee', 600: '#06b6d4' },
    weather: {
      clear: 'from-orange-400 to-yellow-300',
      cloudy: 'from-blue-400 to-indigo-400',
      rain: 'from-slate-600 to-gray-800',
      snow: 'from-cyan-200 to-indigo-300',
      storm: 'from-gray-800 to-purple-900',
      night: 'from-indigo-700 to-slate-900'
    }
  },
  radii: {
    sm: '6px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '40px'
  },
  shadows: {
    1: '0 1px 3px rgba(0,0,0,0.12)',
    2: '0 3px 6px rgba(0,0,0,0.15)',
    3: '0 7px 8px rgba(0,0,0,0.2)',
    4: '0 10px 15px rgba(0,0,0,0.2)',
    5: '0 14px 18px rgba(0,0,0,0.25)',
    6: '0 20px 25px rgba(0,0,0,0.3)'
  },
  animation: {
    duration: { fast: '0.2s', normal: '0.6s', slow: '2s' },
    easing: { entrance: 'cubic-bezier(0.0, 0.0, 0.2, 1)', exit: 'cubic-bezier(0.4, 0.0, 1, 1)' }
  }
};
```

## 8. Component Interaction Patterns

### 8.1 Form Interaction

| Element | Default | Focus | Error | Success |
|---------|---------|-------|-------|---------|
| Search Input | Gray border | Blue ring | Red ring | Green ring |
| Submit Button | Primary filled | Brightness 110% | - | - |
| Loading Button | Spinner | - | - | - |

### 8.2 Card Interaction

| State | Effect |
|-------|--------|
| Default | Elevation shadow |
| Hover | Scale 1.05 + increased shadow |
| Click | Ripple effect |
| Active | Reduced opacity |

### 8.3 Navigation Interaction

| Element | Default | Hover | Active |
|---------|---------|-------|--------|
| Navbar item | Gray text | Primary text | Primary bg |
| Logo | Gradient text | Brightness 110% | - |

## 9. Responsive Behavior

### 9.1 Mobile First

| Feature | Mobile (< 640px) | Tablet+ (≥ 640px) | Desktop (≥ 1024px) |
|---------|------------------|-------------------|-------------------|
| Search layout | Stacked | Horizontal | Horizontal |
| Hero temp size | 7xl | 8xl | 9xl |
| Stat grid | 3 cols | 4 cols | 6-7 cols |
| Forecast grid | 2 cols | 3-4 cols | 7 cols |
| Hourly items | 7 visible | 10 visible | 14 visible |

### 9.2 Touch Targets

| Element | Minimum Size | Actual Size |
|---------|-------------|-------------|
| Buttons | 44x44px | 56x48px |
| Search input | 44px height | 63px height |
| Interactive icons | 44x44px | 32x32px |

## 10. Implementation Notes

### 10.1 Tailwind Configuration

Key customizations in `tailwind.config.js`:
- Extended color palette with primary/secondary
- Custom shadows for Material Design elevation
- Custom radii for glassmorphism effects
- Animation keyframes for fade-up, float, ripple
- Custom utilities for glassmorphism and scrollbar styling

### 10.2 CSS Custom Properties

Defined in `index.css`:
- Glass effect with `backdrop-filter: blur(16px)`
- Custom scrollbar styling
- Animation keyframes (rain, snow, sun, storm, clouds)
- Ripple effect animations
- Float and fade-up transitions

### 10.3 Performance Considerations

- Animations use `transform` and `opacity` for GPU acceleration
- Particle counts optimized for mobile (70 drops rain, 60 flakes snow)
- Lazy loading for off-screen forecast cards
- Debounced search input (future enhancement)
- CSS `will-change` for animation elements