import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-white/20 shadow-glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <span className="text-white text-xl">🌤️</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              WeatherPulse
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all duration-200"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}