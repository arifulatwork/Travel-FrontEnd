import React from 'react';
import { Tag, Clock } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'offer' | 'reminder' | 'system';
  timestamp: string;
}

const NotificationsScreen = () => {
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Special Offer!',
      message: 'Sagrada Familia tickets 20% off this weekend',
      type: 'offer',
      timestamp: '2h ago'
    },
    {
      id: '2',
      title: 'Booking Reminder',
      message: 'Your hostel booking in Barcelona starts tomorrow',
      type: 'reminder',
      timestamp: '1d ago'
    }
  ];

  return (
    <div className="p-2 sm:p-4">
      <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6">Notifications</h2>
      <div className="space-y-2 sm:space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="bg-white p-2 sm:p-4 rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <div className="flex items-center space-x-2 sm:space-x-3">
                {notification.type === 'offer' ? (
                  <Tag className="text-green-500" />
                ) : (
                  <Clock className="text-blue-500" />
                )}
                <div>
                  <h3 className="font-semibold text-sm sm:text-base">{notification.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{notification.message}</p>
                </div>
              </div>
              <span className="text-xs sm:text-sm text-gray-500">{notification.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsScreen;