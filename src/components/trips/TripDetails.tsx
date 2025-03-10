import React from 'react';
import { Calendar, Clock, MapPin, Users, CreditCard, Info, Tag } from 'lucide-react';

interface Activity {
  time: string;
  activity: string;
  description: string;
}

interface DayActivities {
  day: number;
  activities: Activity[];
}

interface TripDetailsProps {
  title: string;
  description: string;
  duration: string;
  price: number;
  originalPrice?: number;
  image: string;
  startTime?: string;
  endTime?: string;
  highlights: (DayActivities | Activity)[];
  included: string[];
  meetingPoint?: string;
  maxParticipants: number;
  specialOffer?: {
    type: string;
    validUntil: string;
    description: string;
  };
  onBook: () => void;
}

const TripDetails: React.FC<TripDetailsProps> = ({
  title,
  description,
  duration,
  price,
  originalPrice,
  image,
  startTime,
  endTime,
  highlights = [], // Provide default empty array
  included = [], // Provide default empty array
  meetingPoint,
  maxParticipants,
  specialOffer,
  onBook
}) => {
  // Check if the highlights array contains day-based activities
  const isMultiDay = highlights.length > 0 && 'day' in highlights[0];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div className="relative h-96">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
        {specialOffer && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg">
            <div className="font-bold">{specialOffer.type}</div>
            <div className="text-sm">{specialOffer.description}</div>
          </div>
        )}
      </div>

      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold dark:text-white mb-2">{title}</h1>
          <p className="text-gray-600 dark:text-gray-300">{description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Clock className="h-5 w-5 text-purple-600" />
              <span>Duration: {duration}</span>
            </div>
            {startTime && endTime && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span>{startTime} - {endTime}</span>
              </div>
            )}
            {meetingPoint && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <MapPin className="h-5 w-5 text-purple-600" />
                <span>Meeting Point: {meetingPoint}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Users className="h-5 w-5 text-purple-600" />
              <span>Maximum {maxParticipants} participants</span>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
            <div className="mb-4">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                €{price}
              </div>
              {originalPrice && (
                <div className="text-gray-500 line-through">€{originalPrice}</div>
              )}
              <div className="text-sm text-gray-600 dark:text-gray-400">per person</div>
            </div>
            <button
              onClick={onBook}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Book Now
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Detailed Itinerary</h2>
          <div className="space-y-6">
            {isMultiDay ? (
              // Multi-day itinerary
              highlights.map((day, index) => (
                'day' in day && (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 dark:text-white">Day {day.day}</h3>
                    <div className="space-y-4">
                      {day.activities?.map((activity, actIndex) => (
                        <div key={actIndex} className="flex gap-4">
                          <div className="w-20 text-purple-600 dark:text-purple-400 font-medium">
                            {activity.time}
                          </div>
                          <div>
                            <div className="font-medium dark:text-white">{activity.activity}</div>
                            <div className="text-gray-600 dark:text-gray-300 text-sm">
                              {activity.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))
            ) : (
              // Single-day itinerary
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <div className="space-y-4">
                  {highlights.map((activity, index) => (
                    'time' in activity && (
                      <div key={index} className="flex gap-4">
                        <div className="w-20 text-purple-600 dark:text-purple-400 font-medium">
                          {activity.time}
                        </div>
                        <div>
                          <div className="font-medium dark:text-white">{activity.activity}</div>
                          <div className="text-gray-600 dark:text-gray-300 text-sm">
                            {activity.description}
                          </div>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {included.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">What's Included</h2>
            <ul className="grid grid-cols-2 gap-4">
              {included.map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Info className="h-5 w-5 text-purple-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripDetails;