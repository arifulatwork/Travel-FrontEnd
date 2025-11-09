import React, { useEffect, useState } from 'react';
import { Plane, MapPin, Calendar, Users, ArrowRight } from 'lucide-react';
import ToursSection from './ToursSection';

const BASE_URL = 'http://127.0.0.1:8000';

interface TripCategory {
  id: number;
  key: string;
  title: string;
  description: string;
  image: string;             // e.g. "images/xyz.jpg" or "storage/images/xyz.jpg" or full URL
  duration: string | null;
  priceRange: string | null;
  destinations: string[];
}

// ✅ Always serve public-disk uploads from /storage/...
const buildImageUrl = (image?: string) => {
  if (!image) return '';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;

  // clean leading slashes
  const cleaned = image.replace(/^\/+/, '');

  // if already starts with storage/, keep it; otherwise prefix storage/
  const path = cleaned.startsWith('storage/') ? cleaned : `storage/${cleaned}`;

  return `${BASE_URL}/${path}`;
};

const TripSection: React.FC = () => {
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string | null>(null);
  const [categories, setCategories] = useState<TripCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        setLoading(true);
        const res = await fetch(`${BASE_URL}/api/tour-categories`);
        if (!res.ok) throw new Error(`Failed to load categories (${res.status})`);
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e?.message || 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (selectedCategoryKey) {
    const cat = categories.find((c) => c.key === selectedCategoryKey);
    if (cat) {
      return (
        <div className="p-4">
          <button
            onClick={() => setSelectedCategoryKey(null)}
            className="mb-6 text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2"
          >
            ← Back to All Trips
          </button>
          <ToursSection category={cat.key} title={cat.title} />
        </div>
      );
    }
  }

  return (
    <div className="p-4">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Plane className="h-8 w-8 text-purple-600" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">All Trips & Tours</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Discover our curated collection of multi-country tours and adventures
        </p>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading categories…</div>
      ) : error ? (
        <div className="text-center text-red-600">Error: {error}</div>
      ) : categories.length === 0 ? (
        <div className="text-center text-gray-500">No categories available yet.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.key}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedCategoryKey(category.key)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={buildImageUrl(category.image)}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 transition-colors duration-300">
                  {category.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {category.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>{category.duration ?? 'Flexible duration'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="h-4 w-4" />
                    <span>{category.priceRange ?? 'Varies by tour'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">
                      {category.destinations?.length ? category.destinations.join(', ') : 'Multiple destinations'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-purple-600 font-semibold">View Tours</span>
                  <ArrowRight className="h-5 w-5 text-purple-600 transform group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-8 text-center">
        <Plane className="h-12 w-12 text-purple-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Can't Find What You're Looking For?
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-2xl mx-auto">
          We specialize in creating custom itineraries tailored to your preferences.
          Contact us to design your perfect trip.
        </p>
        <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-300">
          Request Custom Trip
        </button>
      </div>
    </div>
  );
};

export default TripSection;
