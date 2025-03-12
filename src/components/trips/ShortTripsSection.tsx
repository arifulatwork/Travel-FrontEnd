import React, { useState, useEffect, useMemo } from 'react';
import { Gift, Tag, Hotel, Check } from 'lucide-react';
import TripCard from './TripCard';
import TripDetails from './TripDetails';

const API_BASE_URL = "http://127.0.0.1:8000/api";

const ShortTripsSection = ({ maxPrice, selectedType, searchQuery }) => {
  const [trips, setTrips] = useState([]);
  const [accommodationOffers, setAccommodationOffers] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showAccommodationOffers, setShowAccommodationOffers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchTripsAndAccommodations = async () => {
      try {
        setLoading(true);
        const [tripsRes, accommodationsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/trips`, { signal: controller.signal }),
          fetch(`${API_BASE_URL}/accommodation-offers`, { signal: controller.signal })
        ]);
        
        if (!tripsRes.ok || !accommodationsRes.ok) throw new Error("Failed to fetch data");

        const [tripsData, accommodationsData] = await Promise.all([
          tripsRes.json(),
          accommodationsRes.json()
        ]);

        const formattedTrips = tripsData.map(trip => ({
          ...trip,
          highlights: typeof trip.highlights === "string" ? JSON.parse(trip.highlights) : trip.highlights || [],
          included: typeof trip.included === "string" ? JSON.parse(trip.included) : trip.included || [],
        }));

        setTrips(formattedTrips);
        setAccommodationOffers(accommodationsData || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Failed to load data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTripsAndAccommodations();
    return () => controller.abort();
  }, []);

  const filteredTrips = useMemo(() => {
    return trips
      .filter(trip => !selectedType || trip.type === selectedType)
      .filter(trip => parseFloat(trip.price) <= maxPrice)
      .filter(trip => trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      trip.description.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [trips, maxPrice, selectedType, searchQuery]);

  if (loading) return <p className="text-gray-600">Loading trips...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  if (selectedTrip) {
    const trip = trips.find(t => t.id === selectedTrip);
    if (!trip) return null;

    return (
      <div className="p-4">
        <button
          onClick={() => setSelectedTrip(null)}
          className="mb-6 text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2"
        >
          ← Back to All Trips
        </button>
        <TripDetails {...trip} />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Gift className="h-6 w-6" /> Special Offers & Discounts
          </h3>
          <p>Limited-time deals on trips and accommodations</p>
        </div>
        <button
          onClick={() => setShowAccommodationOffers(!showAccommodationOffers)}
          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <Hotel className="h-5 w-5" /> View Hotel Deals
        </button>
      </div>

      {showAccommodationOffers && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accommodationOffers.map(offer => (
            <AccommodationCard key={offer.id} {...offer} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrips.length > 0 ? (
          filteredTrips.map(trip => (
            <div key={trip.id} className="relative">
              {trip.discount_percentage > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Tag className="h-4 w-4" /> {trip.discount_percentage}% OFF
                </div>
              )}
              <TripCard {...trip} onClick={() => setSelectedTrip(trip.id)} />
            </div>
          ))
        ) : (
          <p className="text-gray-600">No trips found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

const AccommodationCard = ({ name, image, price, original_price, discount, description, valid_until }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-gray-600">{description}</p>
        <div className="flex items-center justify-between mt-4">
          <p className="text-2xl font-bold text-purple-600">€{price}</p>
          <p className="text-sm text-gray-500 line-through">€{original_price}</p>
        </div>
        <div className="text-red-600 text-sm mt-2 flex items-center gap-1">
          <Check className="h-4 w-4 text-green-500" /> {discount}% OFF
        </div>
        <p className="text-xs text-gray-500 mt-1">Valid until {new Date(valid_until).toLocaleDateString()}</p>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg mt-4 transition-colors">Book Now</button>
      </div>
    </div>
  );
};

export default ShortTripsSection;