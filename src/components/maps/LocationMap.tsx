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
  BadgeCheck,   // used for "NIE/TIE"
  Calendar,
  ArrowLeft,
  CheckCircle
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

interface AppointmentFormData {
  appointment_date: string;
  end_date?: string;
  number_of_guests: number;
  special_requests: string;
  appointment_details: {
    room_type?: string;
    cuisine_preferences?: string;
    duration?: string;
    equipment_rental?: boolean;
    consultation_type?: string;
    document_preparation?: boolean;
    service_type?: string;
    documents?: string[];
    ticket_type?: string;
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

type ViewMode = 'details' | 'appointment' | 'success';

const LocationMap: React.FC<LocationMapProps> = ({ center, zoom = 14, pointsOfInterest: propPOIs }) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedPOI, setSelectedPOI] = useState<PointOfInterest | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appointmentFormData, setAppointmentFormData] = useState<AppointmentFormData>({
    appointment_date: '',
    end_date: '',
    number_of_guests: 1,
    special_requests: '',
    appointment_details: {}
  });

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

  // Check if POI type supports appointments - ONLY ACCOMMODATION FOR NOW
  const supportsAppointments = (type: string): boolean => {
    return type === 'accommodation'; // Only accommodation for now
  };

  // Handle appointment submission
  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPOI) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          point_of_interest_id: selectedPOI.id,
          ...appointmentFormData
        }),
      });

      if (response.ok) {
        setViewMode('success');
        // Reset form
        setAppointmentFormData({
          appointment_date: '',
          end_date: '',
          number_of_guests: 1,
          special_requests: '',
          appointment_details: {}
        });
      } else {
        throw new Error('Failed to create appointment');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Failed to create appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setAppointmentFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDetailsChange = (field: string, value: any) => {
    setAppointmentFormData(prev => ({
      ...prev,
      appointment_details: {
        ...prev.appointment_details,
        [field]: value
      }
    }));
  };

  const handleMakeAppointment = () => {
    setViewMode('appointment');
  };

  const handleBackToDetails = () => {
    setViewMode('details');
    setIsSubmitting(false);
  };

  const handleNewAppointment = () => {
    setViewMode('appointment');
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

  // Render different content based on view mode
  const renderDetailsPanelContent = () => {
    if (!selectedPOI) {
      return (
        <div className="h-full flex items-center justify-center text-gray-500">
          Select a point of interest to see details
        </div>
      );
    }

    if (viewMode === 'success') {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-4">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Appointment Booked!</h3>
          <p className="text-gray-600 mb-6">Your appointment has been successfully scheduled.</p>
          <div className="flex gap-3 w-full max-w-xs">
            <button
              onClick={handleNewAppointment}
              className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              New Appointment
            </button>
            <button
              onClick={handleBackToDetails}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Back to Details
            </button>
          </div>
        </div>
      );
    }

    if (viewMode === 'appointment') {
      return (
        <div className="h-full overflow-y-auto">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b">
            <button
              onClick={handleBackToDetails}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-semibold">Book Accommodation</h3>
          </div>

          {/* Show image in appointment view */}
          {selectedPOI.image && (
            <img
              src={selectedPOI.image}
              alt={selectedPOI.name}
              className="w-full h-32 object-cover rounded-lg mb-4"
              onError={handleImageError}
            />
          )}

          <div className="flex items-center gap-2 mb-4">
            {getTypeIcon(selectedPOI.type)}
            <h4 className="font-semibold text-gray-800">{selectedPOI.name}</h4>
          </div>

          <form onSubmit={handleAppointmentSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in Date
                </label>
                <input
                  type="date"
                  required
                  value={appointmentFormData.appointment_date}
                  onChange={(e) => handleInputChange('appointment_date', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-out Date
                </label>
                <input
                  type="date"
                  required
                  value={appointmentFormData.end_date}
                  onChange={(e) => handleInputChange('end_date', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Type
              </label>
              <select
                required
                value={appointmentFormData.appointment_details.room_type || ''}
                onChange={(e) => handleDetailsChange('room_type', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select room type</option>
                <option value="single">Single Room</option>
                <option value="double">Double Room</option>
                <option value="twin">Twin Room</option>
                <option value="suite">Suite</option>
                <option value="apartment">Apartment</option>
                <option value="studio">Studio</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Guests
              </label>
              <select
                required
                value={appointmentFormData.number_of_guests}
                onChange={(e) => handleInputChange('number_of_guests', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="5">5+ Guests</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Special Requests
              </label>
              <textarea
                rows={3}
                value={appointmentFormData.special_requests}
                onChange={(e) => handleInputChange('special_requests', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Any special requirements, early check-in, late check-out, etc."
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Accommodation Details</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Property:</span>
                  <span className="font-medium">{selectedPOI.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rating:</span>
                  <span className="text-yellow-500">★ {selectedPOI.rating}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price Range:</span>
                  <span className="font-medium">{selectedPOI.price}</span>
                </div>
                {selectedPOI.amenities && (
                  <div className="flex justify-between">
                    <span>Amenities:</span>
                    <span className="font-medium">{selectedPOI.amenities.slice(0, 2).join(', ')}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSubmitting ? 'Booking...' : 'Confirm Booking'}
              </button>
              <button
                type="button"
                onClick={handleBackToDetails}
                className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      );
    }

    // Default details view
    return (
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

          <div className="space-y-2">
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
            
            {supportsAppointments(selectedPOI.type) && (
              <button
                onClick={handleMakeAppointment}
                className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Calendar className="h-4 w-4" />
                Book Accommodation
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

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
                  click: () => {
                    setSelectedPOI(poi);
                    setViewMode('details');
                  }
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
                    {supportsAppointments(poi.type) && (
                      <button
                        onClick={() => {
                          setSelectedPOI(poi);
                          setViewMode('appointment');
                        }}
                        className="w-full mt-2 bg-green-600 text-white py-1 px-3 rounded text-xs hover:bg-green-700 transition-colors"
                      >
                        Book Now
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Details Panel */}
        <div className="bg-white p-4 rounded-xl shadow-sm h-[500px] overflow-y-auto">
          {renderDetailsPanelContent()}
        </div>
      </div>
    </div>
  );
};

export default LocationMap;