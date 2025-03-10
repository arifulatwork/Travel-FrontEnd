import React from 'react';
import { User } from 'lucide-react';

interface Chat {
  id: string;
  name: string;
  avatar?: string;
  type: 'guide' | 'support' | 'traveler';
}

interface ChatListProps {
  selectedChat: string | null;
  onSelectChat: (chatId: string) => void;
  searchQuery: string;
}

const ChatList: React.FC<ChatListProps> = ({ selectedChat, onSelectChat, searchQuery }) => {
  const chats: Chat[] = [
    {
      id: 'guide-1',
      name: 'Maria Garcia',
      type: 'guide',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80'
    },
    {
      id: 'support-1',
      name: 'Support Team',
      type: 'support'
    },
    {
      id: 'traveler-1',
      name: 'Alex Thompson',
      type: 'traveler',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&h=120&q=80'
    }
  ];

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="divide-y divide-gray-100">
        {filteredChats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 transition-colors ${
              selectedChat === chat.id ? 'bg-purple-50' : ''
            }`}
          >
            <div className="relative flex-shrink-0">
              {chat.avatar ? (
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-purple-600" />
                </div>
              )}
              {chat.type === 'guide' && (
                <div className="absolute -top-1 -right-1 bg-green-500 text-xs text-white px-2 py-0.5 rounded-full">
                  Guide
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h4 className="font-medium text-gray-900 truncate">{chat.name}</h4>
              </div>
              <p className="text-sm text-gray-600 truncate">
                {chat.type === 'guide' && 'Tour Guide'}
                {chat.type === 'support' && 'Customer Support'}
                {chat.type === 'traveler' && 'Fellow Traveler'}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatList;