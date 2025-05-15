import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Users, Check, Star } from 'lucide-react';
import LocationMap from './maps/LocationMap';

interface Coordinates {
  lat: number;
  lng: number;
}

interface PointOfInterest {
  name: string;
  coordinates: Coordinates;
  type: string;
}

interface Guide {
  name: string;
  avatar?: string;
  rating: number;
  reviews: number;
  experience: string;
  languages: string[];
}

interface Attraction {
  name: string;
  type: string;
  duration: string;
  price: number;
  groupPrice?: number;
  minGroupSize?: number;
  maxGroupSize?: number;
  image: string;
  guide?: Guide;
  highlights?: string[];
}

interface DestinationDetailsProps {
  id: number; // Only ID passed now
}

const DestinationDetails: React.FC<DestinationDetailsProps> = ({ id }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [destination, setDestination] = useState<any>(null);
  const [groupSize, setGroupSize] = useState<number>(0);
  const [showGroupSizeError, setShowGroupSizeError] = useState(false);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/destinations/${id}`)
      .then((res) => res.json())
      .then((data) => {
        // Parse JSON fields
        data.highlights = JSON.parse(data.highlights);
        data.cuisine = JSON.parse(data.cuisine);
        data.points_of_interest = data.points_of_interest.map((poi: any) => ({
          name: poi.name,
          coordinates: { lat: parseFloat(poi.latitude), lng: parseFloat(poi.longitude) },
          type: poi.type,
        }));
        data.attractions = data.attractions.map((a: any) => ({
          name: a.name,
          type: a.type,
          duration: a.duration,
          price: parseFloat(a.price),
          groupPrice: a.group_price ? parseFloat(a.group_price) : undefined,
          minGroupSize: a.min_group_size,
          maxGroupSize: a.max_group_size,
          image: a.image,
          highlights: a.highlights ? JSON.parse(a.highlights) : undefined,
          guide: a.guide
            ? {
                name: a.guide.name,
                avatar: a.guide.avatar,
                rating: parseFloat(a.guide.rating),
                reviews: a.guide.reviews,
                experience: a.guide.experience,
                languages: JSON.parse(a.guide.languages),
              }
            : undefined,
        }));
        setDestination(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load destination', err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="p-6 text-center">Loading destination details...</div>;
  }

  if (error || !destination) {
    return <div className="p-6 text-center text-red-600">Failed to load destination.</div>;
  }

  const { country, city, coordinates, description, points_of_interest, attractions } = destination;

  const minGroupSize = Math.min(...attractions.map((a: any) => a.minGroupSize || 0));
  const maxGroupSize = Math.max(...attractions.map((a: any) => a.maxGroupSize || 0));

  const handleGroupSizeChange = (size: number) => {
    if (size >= minGroupSize && size <= maxGroupSize) {
      setGroupSize(size);
      setShowGroupSizeError(false);
    } else {
      setShowGroupSizeError(true);
    }
  };

  const getDefaultHighlights = (attractionName: string, type: string) => {
    if (attractionName.toLowerCase().includes('sagrada familia')) {
      return [
        'Masterpiece of Modernist architecture',
        'Religious symbolism and artistic details',
        'Gaudi\'s innovative architectural techniques',
        'UNESCO World Heritage site exploration',
        'Fascinating construction history since 1882'
      ];
    }
    if (attractionName.toLowerCase().includes('gothic quarter')) {
      return [
        'Roman and Medieval architectural heritage',
        'Historic Jewish quarter exploration',
        'Ancient Roman wall remains',
        'Gothic cathedral and churches',
        'Medieval palaces and hidden squares'
      ];
    }
    if (type.toLowerCase().includes('museum')) {
      return [
        'Curated historical collections',
        'Interactive cultural exhibits',
        'Artistic masterpieces showcase',
        'Historical artifact displays',
        'Cultural context and interpretation'
      ];
    }
    if (type.toLowerCase().includes('monument') || type.toLowerCase().includes('historic')) {
      return [
        'Architectural significance exploration',
        'Historical context and stories',
        'Cultural heritage preservation',
        'Period-specific design elements',
        'Local historical importance'
      ];
    }
    return [
      'Cultural heritage interpretation',
      'Historical significance exploration',
      'Architectural details and context',
      'Local traditions and customs',
      'Authentic cultural experience'
    ];
  };

  return (
    <div className="space-y-8">
      {/* Destination Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{city}, {country}</h1>
            {coordinates && (
              <div className="flex items-center text-gray-600 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span>Coordinates: {coordinates.lat}, {coordinates.lng}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg">
              <Users className="h-5 w-5" />
              <span className="font-medium capitalize">Visit</span>
            </div>
          </div>
        </div>

        {description && (
          <p className="text-gray-600 mb-6">{description}</p>
        )}

        {/* Location Map */}
        <LocationMap 
          center={coordinates} 
          zoom={13} 
          pointsOfInterest={points_of_interest}
        />
      </div>

      {/* Attractions */}
      {attractions.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-semibold">Attractions & Activities</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {attractions.map((attraction: Attraction, index: number) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <img
                  src={attraction.image}
                  alt={attraction.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold text-lg mb-2">{attraction.name}</h3>
                <p className="text-gray-600">{attraction.type}</p>
                <div className="flex items-center text-gray-500 mt-2">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{attraction.duration}</span>
                </div>

                {/* Guide Info */}
                {attraction.guide && (
                  <div className="mt-2 p-2 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {attraction.guide.avatar ? (
                        <img 
                          src={attraction.guide.avatar} 
                          alt={attraction.guide.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-medium">
                            {attraction.guide.name?.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium">{attraction.guide.name}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="text-yellow-500 mr-1">★</span>
                          {attraction.guide.rating} ({attraction.guide.reviews} reviews)
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      <p>Experience: {attraction.guide.experience}</p>
                      <p>Languages: {attraction.guide.languages.join(', ')}</p>
                    </div>
                  </div>
                )}

                {/* Highlights */}
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-purple-600" />
                    <h4 className="font-medium text-purple-900">Cultural & Historical Highlights</h4>
                  </div>
                  <ul className="space-y-1">
                    {(attraction.highlights || getDefaultHighlights(attraction.name, attraction.type)).map((highlight, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-purple-700">
                        <Check className="h-4 w-4 text-purple-600 flex-shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Booking */}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-purple-600 font-semibold">
                    €{attraction.price}
                  </span>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    Book Now
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationDetails;
