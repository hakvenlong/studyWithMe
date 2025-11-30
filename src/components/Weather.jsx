// WeatherApp.tsx
import { useState, useEffect } from 'react';
import './style/weather.css';
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || import.meta.env.REACT_APP_OPENWEATHER_API_KEY;

const icons = {
  '01d': '☀️', '01n': '🌙',
  '02d': '⛅', '02n': '☁️🌙',
  '03d': '☁️', '03n': '☁️',
  '04d': '☁️☁️', '04n': '☁️☁️',
  '09d': '🌧', '09n': '🌧',
  '10d': '🌦', '10n': '🌧🌙',
  '11d': '⛈', '11n': '⛈',
  '13d': '❄️', '13n': '❄️🌙',
  '50d': '🌫', '50n': '🌫'
};

export default function WeatherApp() {
  const [city, setCity] = useState('Berlin');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchByCoords = async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error('Unable to fetch weather data');
      const json = await res.json();
      setData(json);
      setCity(`${json.city.name}, ${json.city.country}`);
    } catch (err) {
      setError('Failed to load weather for your location');
      // Fallback to Berlin
      fetchByCity('Berlin');
    } finally {
      setLoading(false);
    }
  };

  const fetchByCity = async (location) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error('City not found');
      const json = await res.json();
      setData(json);
      setCity(`${json.city.name}, ${json.city.country}`);
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const getLocationAndFetch = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      fetchByCity('Berlin');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchByCoords(latitude, longitude);
      },
      () => {
        // User denied location or error → fallback to Berlin
        setError('Location access denied – showing Berlin');
        fetchByCity('Berlin');
      }
    );
  };

  useEffect(() => {
    getLocationAndFetch();
  }, []);

  if (loading) return <div className="loading">Detecting your location…</div>;
  if (error && !data) return <div className="loading">{error}</div>;
  if (!data) return null;

  const current = data.list[0];
  const daily = data.list
    .filter((_, i) => i % 8 === 0)
    .slice(1, 5);

  return (
    <div className="app position-absolute top-0 end-0">
      <div className="glass-card">
        {/* Header now only shows the city (no search) */}
        <div className="header">
          <h3>{city}</h3>
          {/* Optional: small button to retry location */}
          <button onClick={getLocationAndFetch} className="geo">
            Refresh Location
          </button>
        </div>

        <div className="main">
          <div>
            <h1>{Math.round(current.main.temp)}°</h1>
            <p className="description">{current.weather[0].description}</p>
            <div className="details">
              <span>Humidity {current.main.humidity}%</span>
              <span>Wind {current.wind.speed} m/s</span>
            </div>
          </div>
          <div className="icon">
            {icons[current.weather[0].icon] || '☀️'}
          </div>
        </div>

        <div className="forecast">
          {daily.map((day, i) => (
            <div key={i} className="day">
              <p>{new Date(day.dt * 1000).toLocaleDateString('en', { weekday: 'short' })}</p>
              <div>{icons[day.weather[0].icon] || '☁️'}</div>
              <strong>{Math.round(day.main.temp)}°</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}