import React, { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Calendar } from 'lucide-react';

interface WeatherWidgetProps {
  city: string;
}

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: [{
    main: string;
    description: string;
  }];
}

interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
    };
    weather: [{
      main: string;
      description: string;
    }];
  }>;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ city }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`;

        const [weatherResponse, forecastResponse] = await Promise.all([
          fetch(weatherUrl).then(res => {
            if (!res.ok) throw new Error('Weather data not available');
            return res.json();
          }),
          fetch(forecastUrl).then(res => {
            if (!res.ok) throw new Error('Forecast data not available');
            return res.json();
          })
        ]);

        setWeather(weatherResponse);
        setForecast(forecastResponse);
      } catch (err) {
        setError('Could not fetch weather data. Please try again later.');
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (city) {
      fetchWeather();
    }
  }, [city]);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'rain':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      case 'snow':
        return <CloudSnow className="h-8 w-8 text-blue-300" />;
      case 'thunderstorm':
        return <CloudLightning className="h-8 w-8 text-purple-500" />;
      default:
        return <Cloud className="h-8 w-8 text-gray-500" />;
    }
  };

  const getDayName = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-16 bg-gray-200 rounded mb-4"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="text-red-500">{error}</p>
        <p className="text-sm text-gray-600 mt-2">Please check the city name and try again.</p>
      </div>
    );
  }

  if (!weather || !forecast) return null;

  // Get next 3 days forecast (at 12:00)
  const dailyForecast = forecast.list
    .filter(item => new Date(item.dt * 1000).getHours() === 12)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {getWeatherIcon(weather.weather[0].main)}
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{city}</h3>
              <p className="text-gray-600 capitalize">{weather.weather[0].description}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">
              {Math.round(weather.main.temp)}°C
            </p>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-sm text-gray-600">Humidity</p>
            <p className="text-lg font-medium">{weather.main.humidity}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Wind Speed</p>
            <p className="text-lg font-medium">{Math.round(weather.wind.speed)} m/s</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="text-purple-600" />
          <h3 className="font-semibold">3-Day Forecast</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {dailyForecast.map((day, index) => (
            <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-700 mb-2">{getDayName(day.dt)}</p>
              {getWeatherIcon(day.weather[0].main)}
              <p className="mt-2 text-lg font-semibold">{Math.round(day.main.temp)}°C</p>
              <p className="text-sm text-gray-600 capitalize">{day.weather[0].description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;