import React, { useState } from 'react';
import WeatherWidget from './WeatherWidget';
import { Search, MapPin } from 'lucide-react';

const WeatherScreen = () => {
  const [city, setCity] = useState('Barcelona');
  const [searchInput, setSearchInput] = useState('');

  const popularCities = [
    'Barcelona',
    'Madrid',
    'Paris',
    'Rome',
    'Berlin',
    'Vienna',
    'Istra'
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCity(searchInput);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Weather Forecast</h2>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search city..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
      </form>

      <div className="space-y-6">
        <WeatherWidget city={city} />
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="text-purple-600" />
            <h3 className="font-semibold">Popular Destinations</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {popularCities.map((popularCity) => (
              <button
                key={popularCity}
                onClick={() => {
                  setSearchInput(popularCity);
                  setCity(popularCity);
                }}
                className="p-2 text-sm text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors"
              >
                {popularCity}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherScreen;