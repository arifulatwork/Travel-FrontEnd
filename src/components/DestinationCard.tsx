import React, { useEffect, useState } from 'react';
import { Gift } from 'lucide-react';

const DestinationCard: React.FC = () => {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/destinations')
      .then((response) => response.json())
      .then((data) => setDestinations(data));
  }, []);

  const handleViewDetails = (city: string) => {
    console.log("View details clicked for:", city);
  };

  const handleGiftClick = (e: React.MouseEvent, city: string) => {
    e.stopPropagation();
    console.log("Gift travel for:", city);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {destinations.map(({ id, country, city, image, highlights, cuisine }) => (
        <div
          key={id}
          className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <div
            className="h-48 bg-cover bg-center cursor-pointer"
            style={{ backgroundImage: `url(${image})` }}
            onClick={() => handleViewDetails(city)}
          >
            <div className="h-full w-full bg-gradient-to-b from-transparent to-black/30 p-4 flex flex-col justify-end">
              <h3 className="text-white text-xl font-semibold">{country}</h3>
              <p className="text-white/90">{city}</p>
            </div>
          </div>
          <div className="p-4">
            <div className="mt-4 space-y-2 text-sm">
              <div>
                <h5 className="font-medium text-gray-700">Highlights</h5>
                <div className="flex flex-wrap gap-1 mt-1">
                  {JSON.parse(highlights).map((highlight) => (
                    <span
                      key={highlight}
                      className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="font-medium text-gray-700">Local Cuisine</h5>
                <div className="flex flex-wrap gap-1 mt-1">
                  {JSON.parse(cuisine).map((dish) => (
                    <span
                      key={dish}
                      className="px-2 py-1 bg-orange-50 text-orange-700 rounded-full text-xs"
                    >
                      {dish}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleViewDetails(city)}
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
              >
                View Details
              </button>
              <button
                onClick={(e) => handleGiftClick(e, city)}
                className="bg-gradient-to-br from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors flex items-center gap-2"
              >
                <Gift className="h-4 w-4" />
                Gift
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DestinationCard;