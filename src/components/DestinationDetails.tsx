import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, CreditCard, Info, Sun, Moon, Coffee, Music, Utensils, Palette, Search, X, Check, Star } from 'lucide-react';
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
  country: string;
  city: string;
  description?: string;
  coordinates: Coordinates;
  image: string;
  pointsOfInterest: PointOfInterest[];
  attractions: Attraction[];
  visitType: 'individual' | 'group';
  maxPrice?: number;
}

const DestinationDetails: React.FC<DestinationDetailsProps> = ({
  country,
  city,
  description,
  coordinates,
  image,
  pointsOfInterest,
  attractions,
  visitType,
  maxPrice = Infinity
}) => {
  const [groupSize, setGroupSize] = useState<number>(0);
  const [showGroupSizeError, setShowGroupSizeError] = useState(false);

  const minGroupSize = Math.min(...attractions.map(a => a.minGroupSize || 0));
  const maxGroupSize = Math.max(...attractions.map(a => a.maxGroupSize || 0));

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

  const filteredAttractions = attractions.filter(attraction => 
    (visitType === 'group' && attraction.groupPrice ? attraction.groupPrice : attraction.price) <= maxPrice
  );

  return (
    <div className="space-y-8">
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
              <span className="font-medium capitalize">{visitType} Visit</span>
            </div>
          </div>
        </div>

        {description && (
          <p className="text-gray-600 mb-6">{description}</p>
        )}

        {visitType === 'group' && (
          <div className="mb-6 bg-gray-50 rounded-lg overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Group Size & Pricing Calculator
              </h3>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min={minGroupSize}
                  max={maxGroupSize}
                  value={groupSize || ''}
                  onChange={(e) => handleGroupSizeChange(Number(e.target.value))}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter size"
                />
                <span className="text-sm text-gray-600">
                  {minGroupSize}-{maxGroupSize} people
                </span>
              </div>
              {showGroupSizeError && (
                <p className="text-red-500 text-sm mt-2">
                  Please enter a group size between {minGroupSize} and {maxGroupSize} people
                </p>
              )}
            </div>
          </div>
        )}

        <LocationMap 
          center={coordinates} 
          zoom={13} 
          pointsOfInterest={pointsOfInterest}
        />
      </div>

      {filteredAttractions.length > 0 ? (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-semibold">Attractions & Activities</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAttractions.map((attraction, index) => (
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
                {visitType === 'group' && attraction.minGroupSize && attraction.maxGroupSize && (
                  <div className="flex items-center text-gray-500 mt-1">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{attraction.minGroupSize}-{attraction.maxGroupSize} people</span>
                  </div>
                )}
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
                            {attraction.guide.name.charAt(0)}
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

                {/* Key Highlights Section */}
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

                <div className="flex items-center justify-between mt-4">
                  <span className="text-purple-600 font-semibold">
                    €{attraction.price}
                    {visitType === 'group' && attraction.groupPrice && groupSize >= minGroupSize && (
                      <span className="text-sm text-gray-500"> (€{attraction.groupPrice} pp)</span>
                    )}
                  </span>
                  <button 
                    className={`px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 ${
                      visitType === 'group' && (!groupSize || groupSize < minGroupSize || groupSize > maxGroupSize)
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                    disabled={visitType === 'group' && (!groupSize || groupSize < minGroupSize || groupSize > maxGroupSize)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 p-6 rounded-xl text-center">
          <p className="text-yellow-700">No activities found within the selected price range.</p>
        </div>
      )}
    </div>
  );
};

export default DestinationDetails;