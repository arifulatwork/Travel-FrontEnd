import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Phone, Video, MoreVertical, Send, Image, Paperclip, Smile
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  id: number | string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read: boolean;
}

interface ChatData {
  id: string;
  name: string;
  avatar?: string;
  type: 'guide' | 'support' | 'traveler';
  user_id: string; // ✅ required for Laravel endpoint
}

interface ChatWindowProps {
  chatId: string;
  chatData: ChatData;
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatId, chatData, onClose }) => {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user && chatData?.user_id) {
      fetchMessages();
      markMessagesAsRead();
    }
  }, [chatId, user]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/messages/${chatData.user_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setMessages(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/messages/mark-read`, // if you implement it
        { sender_id: chatData.user_id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
    } catch (err) {
      console.warn('Failed to mark messages as read');
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

  if (!user) {
    return (
      <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
        <p className="text-center text-gray-600">Please log in to view messages</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center justify-between">
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
            <span className="text-sm text-green-500">Online</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Phone className="h-5 w-5 text-gray-600" />
          <Video className="h-5 w-5 text-gray-600" />
          <MoreVertical className="h-5 w-5 text-gray-600" />
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender_id === user.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <span
                className={`text-xs mt-1 block ${
                  message.sender_id === user.id ? 'text-purple-200' : 'text-gray-500'
                }`}
              >
                {new Date(message.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t">
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
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <div className="flex space-x-2">
                <Image className="h-5 w-5 text-gray-600" />
                <Paperclip className="h-5 w-5 text-gray-600" />
                <Smile className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
