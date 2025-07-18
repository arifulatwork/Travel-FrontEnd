import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from 'lucide-react';

interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  type: 'traveler' | 'guide' | 'support';
  user_id: string;
}

interface ChatListProps {
  selectedChat: string | null;
  onSelectChat: (chatId: string, chatUser: ChatUser) => void;
  searchQuery: string;
}

const ChatList: React.FC<ChatListProps> = ({ selectedChat, onSelectChat, searchQuery }) => {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        let userId = localStorage.getItem('user_id');
        const token = localStorage.getItem('token');

        if (!userId && token) {
          const userResponse = await axios.get('http://127.0.0.1:8000/api/auth/user', {
            headers: { Authorization: `Bearer ${token}` }
          });
          userId = userResponse.data.id.toString();
          localStorage.setItem('user_id', userId);
        }

        const response = await axios.get('http://127.0.0.1:8000/api/auth/network/connections', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const connections = response.data;

        const users: ChatUser[] = connections.map((conn: any) => {
          const isRequester = conn.requester_id.toString() === userId;
          const user = isRequester ? conn.receiver : conn.requester;

          return {
            id: conn.id.toString(),
            name: `${user.first_name} ${user.last_name}`,
            avatar: user.avatar_url,
            type: 'traveler',
            user_id: user.id.toString()
          };
        });

        setChatUsers(users);
      } catch (err) {
        console.error('Failed to fetch connections:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  const filteredChats = chatUsers.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
      <div className="divide-y divide-gray-100">
        {loading ? (
          <p className="p-4 text-sm text-gray-500">Loading chats...</p>
        ) : filteredChats.length === 0 ? (
          <p className="p-4 text-sm text-gray-500">No connections found</p>
        ) : (
          filteredChats.map((chat) => (
            <button
              key={chat.user_id}
              onClick={() => onSelectChat(chat.user_id, chat)}
              className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 transition-colors ${
                selectedChat === chat.user_id ? 'bg-purple-50' : ''
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
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">{chat.name}</h4>
                <p className="text-sm text-gray-600 truncate">Traveler</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;