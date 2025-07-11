import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  id: number | string;
  content: string;
  sender_id: string | number;
  receiver_id: string | number;
  created_at: string;
  read: boolean;
}

interface ChatData {
  id: string;
  name: string;
  avatar?: string;
  type: 'guide' | 'support' | 'traveler';
  user_id: string;
}

interface ChatWindowProps {
  chatId: string;
  chatData: ChatData;
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatId, chatData }) => {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom helper
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Scroll only if user is near bottom
  useEffect(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const nearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight < 50;

      if (nearBottom) {
        scrollToBottom('auto');
      }
    }
  }, [messages]);

  useEffect(() => {
    if (user && chatData?.user_id) {
      fetchMessages();
    }
  }, [chatId, user]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/auth/messages/${chatData.user_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setMessages(response.data);
      setTimeout(() => scrollToBottom('auto'), 100);
    } catch (err) {
      console.error('Failed to load messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/auth/messages/send`,
        {
          receiver_id: chatData.user_id,
          content: newMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setMessages((prev) => [...prev, response.data]);
      setNewMessage('');
      scrollToBottom();
    } catch (err) {
      console.error(err);
      setError('Failed to send message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Extract numeric ID from UUID (e.g., '00000000-0000-0000-0000-000000000001' -> '1')
  const extractNumericId = (uuid: string): string => {
    return uuid.slice(-12).replace(/^0+/, '') ?? '';
  };

  // True if message is from the current user
  const isOwnMessage = (senderId: string | number): boolean => {
    const currentUserId = extractNumericId(user?.id || '');
    return String(senderId) === currentUserId;
  };

  if (!user) {
    return (
      <div className="flex-1 bg-white rounded-xl shadow-sm p-6 flex items-center justify-center">
        <p className="text-center text-gray-600">Please log in to view messages</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 bg-white rounded-xl shadow-sm p-6 flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-md">
          <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm flex flex-col max-h-[calc(100vh-200px)]">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-3">
          {chatData.avatar ? (
            <img
              src={chatData.avatar}
              alt={chatData.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-purple-600 font-medium">{chatData.name.charAt(0)}</span>
            </div>
          )}
          <div>
            <h3 className="font-semibold">{chatData.name}</h3>
            <p className="text-xs text-gray-500 capitalize">{chatData.type}</p>
          </div>
        </div>
      </div>

      {/* Message List */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message) => {
          const own = isOwnMessage(message.sender_id);
          return (
            <div
              key={message.id}
              className={`flex ${own ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-lg p-3 ${
                  own ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm break-words">{message.content}</p>
                <span
                  className={`text-xs mt-1 block text-right ${
                    own ? 'text-purple-200' : 'text-gray-500'
                  }`}
                >
                  {new Date(message.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t flex-shrink-0">
        {error && (
          <div className="text-red-500 text-sm mb-2 text-center">{error}</div>
        )}
        <div className="flex items-end space-x-4">
          <div className="flex-1 bg-gray-100 rounded-lg p-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full bg-transparent resize-none focus:outline-none min-h-[40px] max-h-32"
              rows={1}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
