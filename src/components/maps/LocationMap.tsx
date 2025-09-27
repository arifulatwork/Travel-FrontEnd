import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayerGroup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

// Icons
import {
  Hotel,        // used for "accommodation"
  Coffee,       // used for "bar"
  Landmark,     // used for "attraction"
  Utensils,     // used for "restaurant"
  Tent,         // could be used for "activity"
  Camera,       // could be used for "activity"
  Ticket,       // used for "event"
  Bus,          // used for "shuttle"
  Gavel,        // used for "legal advice"
  BadgeCheck    // used for "NIE/TIE"
} from 'lucide-react';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

interface PointOfInterest {
  id: string;
  name: string;
  // ✅ Kept types
  type:
    | 'event'
    | 'restaurant'
    | 'bar'
    | 'attraction'
    | 'activity'
    | 'shuttle'
    | 'accommodation'
    | 'legal advice'
    | 'NIE/TIE';
  // ❌ Commented (removed) types:
  // 'flight' | 'museum' | 'hotel'
  position: [number, number];
  description: string;
  rating?: number;
  price?: string;
  image?: string;
  bookingUrl?: string;
  schedule?: string;
  amenities?: string[];
  // ❌ Commented (removed) flight-specific details
  // flightDetails?: {
  //   departure: string;
  //   arrival: string;
  //   airline: string;
  //   flightNumber: string;
  // };
  // Kept shuttle details
  shuttleDetails?: {
    frequency: string;
    capacity: number;
    duration: string;
  };
}

interface LocationMapProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  pointsOfInterest?: PointOfInterest[];
}

const LocationMap: React.FC<LocationMapProps> = ({ center, zoom = 14, pointsOfInterest: propPOIs }) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedPOI, setSelectedPOI] = useState<PointOfInterest | null>(null);

  // Parse coordinates from point format if needed
  const parseCoordinates = (coords: any) => {
    if (typeof coords === 'string' && coords.startsWith('(') && coords.endsWith(')')) {
      const [lat, lng] = coords.slice(1, -1).split(',').map(Number);
      return { lat, lng };
    }
    return coords;
  };

  const parsedCenter = parseCoordinates(center);

  // Default points of interest (updated to new types)
  const defaultPOIs: PointOfInterest[] = [
    {
      id: 'a1',
      name: 'City Apartments',
      type: 'accommodation',
      position: [parsedCenter.lat + 0.002, parsedCenter.lng + 0.002],
      description: 'Comfortable serviced apartments near the center.',
      rating: 4.6,
      price: '€€',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
      bookingUrl: '#',
      amenities: ['Kitchen', 'WiFi', 'Washer/Dryer']
    },
    {
      id: 'r1',
      name: 'Local Bistro',
      type: 'restaurant',
      position: [parsedCenter.lat - 0.001, parsedCenter.lng + 0.001],
      description: 'Traditional local cuisine.',
      rating: 4.5,
      price: '€€',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      bookingUrl: '#'
    },
    {
      id: 'b1',
      name: 'Corner Bar',
      type: 'bar',
      position: [parsedCenter.lat + 0.0015, parsedCenter.lng - 0.001],
      description: 'Cozy bar with signature coffees and mocktails.',
      rating: 4.3,
      price: '€',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'ev1',
      name: 'City Festival Stage',
      type: 'event',
      position: [parsedCenter.lat - 0.0015, parsedCenter.lng - 0.0015],
      description: 'Open-air stage for live performances.',
      rating: 4.7,
      price: 'Free'
    },
    {
      id: 'att1',
      name: 'Old Town Gate',
      type: 'attraction',
      position: [parsedCenter.lat + 0.0025, parsedCenter.lng - 0.0005],
      description: 'Historic city gate and photo spot.',
      rating: 4.4
    },
    {
      id: 'act1',
      name: 'Riverside Kayaking',
      type: 'activity',
      position: [parsedCenter.lat - 0.002, parsedCenter.lng + 0.0025],
      description: 'Guided kayaking along the river.',
      rating: 4.6,
      price: '€€'
    },
    {
      id: 'sh1',
      name: 'Airport Shuttle Stop',
      type: 'shuttle',
      position: [parsedCenter.lat + 0.0005, parsedCenter.lng + 0.0005],
      description: 'Express shuttle to/from the airport.',
      price: '€€',
      shuttleDetails: {
        frequency: 'Every 30 min',
        capacity: 40,
        duration: '35 min'
      }
    },
    {
      id: 'law1',
      name: 'Legal Aid Center',
      type: 'legal advice',
      position: [parsedCenter.lat + 0.001, parsedCenter.lng + 0.003],
      description: 'Consultations on visas and residence permits.',
      rating: 4.8
    },
    {
      id: 'nie1',
      name: 'NIE/TIE Support Desk',
      type: 'NIE/TIE',
      position: [parsedCenter.lat - 0.0025, parsedCenter.lng - 0.0008],
      description: 'Documentation support for NIE/TIE (Spain).',
      rating: 4.7
    }
    // ❌ Commented (removed) examples for flights/museum/hotels
    // { id: 'f1', name: 'Flight XYZ', type: 'flight', ... }
    // { id: 'm1', name: 'City Museum', type: 'museum', ... }
    // { id: 'h1', name: 'Grand Hotel', type: 'hotel', ... }
  ];

  const pointsOfInterest = propPOIs || defaultPOIs;

  const getMarkerIcon = (type: string) => {
    // Assign distinct marker colors to allowed types
    const color =
      type === 'accommodation' ? 'red' :
      type === 'restaurant'    ? 'orange' :
      type === 'bar'           ? 'green' :
      type === 'attraction'    ? 'yellow' :
      type === 'activity'      ? 'blue' :
      type === 'event'         ? 'violet' :
      type === 'shuttle'       ? 'grey' :
      type === 'legal advice'  ? 'black' :
      type === 'NIE/TIE'       ? 'gold' : 'grey';

    const iconUrl = `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`;

    return new Icon({
      iconUrl,
      shadowUrl: iconShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'accommodation':
        return <Hotel className="h-4 w-4" />;
      case 'restaurant':
        return <Utensils className="h-4 w-4" />;
      case 'bar':
        return <Coffee className="h-4 w-4" />;
      case 'attraction':
        return <Landmark className="h-4 w-4" />;
      case 'activity':
        // Pick either Tent or Camera (or both based on context)
        return <Tent className="h-4 w-4" />;
      case 'event':
        return <Ticket className="h-4 w-4" />;
      case 'shuttle':
        return <Bus className="h-4 w-4" />;
      case 'legal advice':
        return <Gavel className="h-4 w-4" />;
      case 'NIE/TIE':
        return <BadgeCheck className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const filteredPOIs = selectedType
    ? pointsOfInterest.filter(poi => poi.type === selectedType)
    : pointsOfInterest;

  const categories = [
    { type: 'accommodation', label: 'Accommodation' },
    { type: 'restaurant',    label: 'Restaurants' },
    { type: 'bar',           label: 'Bars' },
    { type: 'attraction',    label: 'Attractions' },
    { type: 'activity',      label: 'Activities' },
    { type: 'event',         label: 'Events' },
    { type: 'shuttle',       label: 'Airport Shuttle' },
    { type: 'legal advice',  label: 'Legal Advice' },
    { type: 'NIE/TIE',       label: 'NIE/TIE' }
    // ❌ Commented (removed) categories:
    // { type: 'flight', label: 'Flights' },
    // { type: 'museum', label: 'Museums' },
    // { type: 'hotel',  label: 'Hotels' }
  ];

  // Ensure we have valid coordinates
  if (!parsedCenter?.lat || !parsedCenter?.lng) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Invalid coordinates provided
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {categories.map(({ type, label }) => (
          <button
            key={type}
            onClick={() => setSelectedType(selectedType === type ? null : type)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
              selectedType === type
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {getTypeIcon(type)}
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <MapContainer
            center={[parsedCenter.lat, parsedCenter.lng]}
            zoom={zoom}
            className="w-full h-[500px] rounded-xl"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Main location marker with radius */}
            <LayerGroup>
              <Circle
                center={[parsedCenter.lat, parsedCenter.lng]}
                radius={500}
                pathOptions={{ color: 'purple', fillColor: 'purple', fillOpacity: 0.1 }}
              />
              <Marker position={[parsedCenter.lat, parsedCenter.lng]} icon={defaultIcon}>
                <Popup>
                  <div className="font-semibold">City Center</div>
                </Popup>
              </Marker>
            </LayerGroup>

            {/* Points of interest markers */}
            {filteredPOIs.map((poi) => (
              <Marker
                key={poi.id}
                position={poi.position}
                icon={getMarkerIcon(poi.type)}
                eventHandlers={{
                  click: () => setSelectedPOI(poi)
                }}
              >
                <Popup>
                  <div className="p-2">
                    <div className="flex items-center gap-2 mb-1">
                      {getTypeIcon(poi.type)}
                      <h3 className="font-semibold">{poi.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{poi.description}</p>
                    <div className="flex items-center justify-between mt-2 text-sm">
                      {poi.rating && (
                        <span className="text-yellow-500">★ {poi.rating}</span>
                      )}
                      {poi.price && (
                        <span className="text-gray-600">{poi.price}</span>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Details Panel */}
        <div className="bg-white p-4 rounded-xl shadow-sm h-[500px] overflow-y-auto">
          {selectedPOI ? (
            <div className="space-y-4">
              {selectedPOI.image && (
                <img
                  src={selectedPOI.image}
                  alt={selectedPOI.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {getTypeIcon(selectedPOI.type)}
                  <h3 className="font-semibold text-lg">{selectedPOI.name}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-3">{selectedPOI.description}</p>

                {/* ❌ Commented (removed) flight details block */}
                {/* {selectedPOI.type === 'flight' && selectedPOI.flightDetails && ( ... )} */}

                {selectedPOI.type === 'shuttle' && selectedPOI.shuttleDetails && (
                  <div className="space-y-2 text-sm">
                    <p><strong>Frequency:</strong> {selectedPOI.shuttleDetails.frequency}</p>
                    <p><strong>Capacity:</strong> {selectedPOI.shuttleDetails.capacity} passengers</p>
                    <p><strong>Duration:</strong> {selectedPOI.shuttleDetails.duration}</p>
                  </div>
                )}

                {selectedPOI.amenities && (
                  <div className="flex flex-wrap gap-2 my-3">
                    {selectedPOI.amenities.map((amenity, index) => (
                      <span key={index} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
                        {amenity}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm mb-4">
                  {selectedPOI.rating && (
                    <span className="text-yellow-500">★ {selectedPOI.rating}</span>
                  )}
                  {selectedPOI.price && (
                    <span className="text-gray-600">{selectedPOI.price}</span>
                  )}
                </div>
                {selectedPOI.bookingUrl && (
                  <a
                    href={selectedPOI.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-purple-600 text-white text-center py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Book Now
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a point of interest to see details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationMap;
