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
  position: [number, number];
  description: string;
  rating?: number;
  price?: string;
  image?: string;
  bookingUrl?: string;
  schedule?: string;
  amenities?: string[];
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

  // Function to format image URL - KEEP points-of-interest/ in the path
  const formatImageUrl = (imagePath: string | undefined): string | undefined => {
    if (!imagePath) return undefined;
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If it's just a filename, prepend the points-of-interest path
    if (!imagePath.includes('/')) {
      return `http://127.0.0.1:8000/storage/points-of-interest/${imagePath}`;
    }
    
    // If it already contains points-of-interest/, use it as is with the base URL
    if (imagePath.includes('points-of-interest/')) {
      // Extract the path after points-of-interest/ if it's a full encoded string
      const parts = imagePath.split('points-of-interest/');
      const filename = parts[1] || parts[0];
      return `http://127.0.0.1:8000/storage/points-of-interest/${filename}`;
    }
    
    // Default case - assume it's a filename and add the full path
    return `http://127.0.0.1:8000/storage/points-of-interest/${imagePath}`;
  };

  // Function to format price with euro symbol
  const formatPrice = (price: string | undefined): string | undefined => {
    if (!price) return undefined;
    
    // If price already starts with €, return as is
    if (price.startsWith('€')) {
      return price;
    }
    
    // Add € before the price
    return `€${price}`;
  };

  // Default points of interest (updated with proper image URLs)
  const defaultPOIs: PointOfInterest[] = [
    {
      id: 'a1',
      name: 'City Apartments',
      type: 'accommodation',
      position: [parsedCenter.lat + 0.002, parsedCenter.lng + 0.002],
      description: 'Comfortable serviced apartments near the center.',
      rating: 4.6,
      price: '€€',
      image: formatImageUrl('accommodation.jpg'),
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
      image: formatImageUrl('restaurant.jpg'),
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
      image: formatImageUrl('bar.jpg')
    },
    {
      id: 'ev1',
      name: 'City Festival Stage',
      type: 'event',
      position: [parsedCenter.lat - 0.0015, parsedCenter.lng - 0.0015],
      description: 'Open-air stage for live performances.',
      rating: 4.7,
      price: 'Free',
      image: formatImageUrl('event.jpg')
    },
    {
      id: 'att1',
      name: 'Old Town Gate',
      type: 'attraction',
      position: [parsedCenter.lat + 0.0025, parsedCenter.lng - 0.0005],
      description: 'Historic city gate and photo spot.',
      rating: 4.4,
      image: formatImageUrl('attraction.jpg')
    },
    {
      id: 'act1',
      name: 'Riverside Kayaking',
      type: 'activity',
      position: [parsedCenter.lat - 0.002, parsedCenter.lng + 0.0025],
      description: 'Guided kayaking along the river.',
      rating: 4.6,
      price: '€€',
      image: formatImageUrl('activity.jpg')
    },
    {
      id: 'sh1',
      name: 'Airport Shuttle Stop',
      type: 'shuttle',
      position: [parsedCenter.lat + 0.0005, parsedCenter.lng + 0.0005],
      description: 'Express shuttle to/from the airport.',
      price: '€€',
      image: formatImageUrl('shuttle.jpg'),
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
      rating: 4.8,
      image: formatImageUrl('legal.jpg')
    },
    {
      id: 'nie1',
      name: 'NIE/TIE Support Desk',
      type: 'NIE/TIE',
      position: [parsedCenter.lat - 0.0025, parsedCenter.lng - 0.0008],
      description: 'Documentation support for NIE/TIE (Spain).',
      rating: 4.7,
      image: formatImageUrl('nie.jpg')
    }
  ];

  const pointsOfInterest = propPOIs ? 
    propPOIs.map(poi => ({
      ...poi,
      image: formatImageUrl(poi.image),
      price: formatPrice(poi.price)
    })) : 
    defaultPOIs;

  const getMarkerIcon = (type: string) => {
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
  ];

  // Add error handling for images
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
  };

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

            {/* REMOVED default center marker - only show circle */}
            <LayerGroup>
              <Circle
                center={[parsedCenter.lat, parsedCenter.lng]}
                radius={500}
                pathOptions={{ color: 'purple', fillColor: 'purple', fillOpacity: 0.1 }}
              />
              {/* Default marker removed from here */}
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
                    {poi.image && (
                      <img 
                        src={poi.image} 
                        alt={poi.name}
                        className="w-full h-20 object-cover rounded mt-2"
                        onError={handleImageError}
                      />
                    )}
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
                  onError={handleImageError}
                />
              )}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {getTypeIcon(selectedPOI.type)}
                  <h3 className="font-semibold text-lg">{selectedPOI.name}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-3">{selectedPOI.description}</p>

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