import React, { useEffect } from 'react';
import { MapPin, Gift } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DestinationCardProps {
  country: string;
  city: string;
  image: string;
  services: any[];
  onViewDetails: () => void;
  visitType: 'individual' | 'group' | 'company';
  metadata?: {
    highlights?: string[];
    cuisine?: string[];
  };
}

const DestinationCard: React.FC<DestinationCardProps> = ({ 
  country, 
  city, 
  image, 
  onViewDetails,
  metadata
}) => {
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://127.0.0.1:8000/api/auth/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log('✅ Authenticated user (DestinationCard):', data);
      } catch (err) {
        console.error('❌ Error fetching user in DestinationCard:', err);
      }
    };

    fetchUser();
  }, []);

  // Prepend the base URL to the image path
  const getFullImageUrl = (imgPath: string) => {
    const baseUrl = 'http://127.0.0.1:8000/storage/';
    // Remove any leading slashes from the image path to avoid double slashes
    const cleanedPath = imgPath.replace(/^\//, '');
    return `${baseUrl}${cleanedPath}`;
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow max-w-full sm:max-w-xs md:max-w-sm w-full mx-auto">
      <div 
        className="h-40 sm:h-48 bg-cover bg-center cursor-pointer"
        style={{ backgroundImage: `url(${getFullImageUrl(image)})` }}
        onClick={onViewDetails}
      >
        <div className="h-full w-full bg-gradient-to-b from-transparent to-black/30 p-2 sm:p-4 flex flex-col justify-end">
          <h3 className="text-white text-base sm:text-lg font-semibold">{country}</h3>
          <p className="text-white/90 text-xs sm:text-sm">{city}</p>
        </div>
      </div>
      <div className="p-2 sm:p-4">
        {metadata && (
          <div className="mt-4 space-y-2 text-xs sm:text-sm">
            {metadata.highlights && (
              <div>
                <h5 className="font-medium text-gray-700">Highlights</h5>
                <div className="flex flex-wrap gap-1 mt-1">
                  {metadata.highlights.map((highlight: string) => (
                    <span key={highlight} className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-[10px] sm:text-xs">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {metadata.cuisine && (
              <div>
                <h5 className="font-medium text-gray-700">Local Cuisine</h5>
                <div className="flex flex-wrap gap-1 mt-1">
                  {metadata.cuisine.map((dish: string) => (
                    <span key={dish} className="px-2 py-1 bg-orange-50 text-orange-700 rounded-full text-[10px] sm:text-xs">
                      {dish}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <button
            onClick={onViewDetails}
            className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-xs sm:text-base"
          >
            View Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle gift functionality
              console.log('Gift travel for:', city);
            }}
            className="bg-gradient-to-br from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors flex items-center gap-2 text-xs sm:text-base"
          >
            <Gift className="h-4 w-4" />
            Gift
          </button>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;