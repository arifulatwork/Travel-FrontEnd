import React from 'react';
import { Clock, MapPin, Users, Calendar, Tag, Check } from 'lucide-react';

interface Activity {
  time: string;
  activity: string;
  description: string;
}

interface DayActivities {
  day: number;
  activities: Activity[];
}

interface TripCardProps {
  title: string;
  description: string;
  durationDays: number;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  image: string;
  startTime?: string;
  meetingPoint?: string;
  maxParticipants: number;
  highlights?: (DayActivities | Activity)[];
  specialOffer?: {
    type: string;
    validUntil: string;
    description: string;
  };
  onClick: () => void;
  isBooked?: boolean;
}

const TripCard: React.FC<TripCardProps> = ({
  title,
  description,
  durationDays,
  price,
  originalPrice,
  discountPercentage,
  image,
  startTime,
  meetingPoint,
  maxParticipants,
  highlights = [],
  specialOffer,
  onClick,
  isBooked = false
}) => {
  const previewHighlights = highlights
    .slice(0, 2)
    .map(item => {
      if ('day' in item) {
        return item.activities[0]?.activity || '';
      }
      return 'activity' in item ? item.activity : '';
    })
    .filter(Boolean);

  const durationText = durationDays === 1 ? '1 day' : `${durationDays} days`;

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer relative w-full max-w-full sm:max-w-md mx-auto"
      onClick={!isBooked ? onClick : undefined}
    >
      {/* Discount badge */}
      {discountPercentage && discountPercentage > 0 && (
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
          {discountPercentage}% OFF
        </div>
      )}

      {/* Booked badge */}
      {isBooked && (
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10 bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1">
          <Check className="h-4 w-4" />
          Booked
        </div>
      )}

      <div 
        className="h-40 sm:h-48 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="h-full w-full bg-gradient-to-b from-transparent to-black/30 p-2 sm:p-4 flex flex-col justify-end">
          {previewHighlights.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {previewHighlights.map((highlight, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-white/90 dark:bg-gray-800/90 rounded-full text-[10px] sm:text-xs font-medium"
                >
                  {highlight}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-2 sm:p-4">
        <h3 className="text-base sm:text-xl font-semibold mb-1 sm:mb-2 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-4 gap-1 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {durationText}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Max {maxParticipants}
            </span>
          </div>
        </div>

        {meetingPoint && (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1 sm:mb-2">
            <MapPin className="h-4 w-4" />
            {meetingPoint}
          </div>
        )}

        {startTime && (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1 sm:mb-2">
            <Calendar className="h-4 w-4" />
            Starts at {startTime}
          </div>
        )}

        {specialOffer && (
          <div className="bg-red-50 dark:bg-red-900/20 p-2 sm:p-3 rounded-lg mb-2 sm:mb-4">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-xs sm:text-sm font-medium mb-1">
              <Tag className="h-4 w-4" />
              {specialOffer.type}
            </div>
            <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">
              {specialOffer.description}
            </p>
            <p className="text-[10px] sm:text-xs text-red-500 dark:text-red-300 mt-1">
              Valid until {new Date(specialOffer.validUntil).toLocaleDateString()}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0">
          <div>
            <p className="text-lg sm:text-2xl font-bold text-purple-600">€{Number(price).toFixed(2)}</p>
            {originalPrice && originalPrice > price && (
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-through">
                €{originalPrice.toFixed(2)}
              </p>
            )}
          </div>
          {isBooked ? (
            <button 
              className="px-4 py-2 bg-green-500 text-white rounded-lg cursor-not-allowed text-xs sm:text-base"
              disabled
            >
              Already Booked
            </button>
          ) : (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs sm:text-base"
            >
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripCard;