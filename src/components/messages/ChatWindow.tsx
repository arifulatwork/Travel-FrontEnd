import React, { useState, useRef, useEffect } from 'react';
import { Phone, Video, MoreVertical, Send, Image, Paperclip, Smile } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  id: string;
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
  user_id?: string;
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
    if (user) {
      fetchMessages();
      subscribeToMessages();
      markMessagesAsRead();
    }
  }, [chatId, user]);

  const fetchMessages = async () => {
    try {
      if (!user) {
        setError('Please log in to view messages');
        return;
      }

      // Get the actual UUID for the chat participant
      let receiverId = chatData.user_id;
      
      if (!receiverId) {
        // If no user_id is provided, use a default support account ID
        // In a real application, you would have a proper way to handle this
        // For now, we'll use a placeholder message
        setMessages([{
          id: 'welcome',
          content: `Welcome to ${chatData.type === 'support' ? 'customer support' : chatData.type} chat! How can we help you today?`,
          sender_id: 'system',
          receiver_id: user.id,
          created_at: new Date().toISOString(),
          read: false
        }]);
        return;
      }

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    if (!user) return;

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(sender_id=eq.${user.id},receiver_id=eq.${user.id})`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markMessagesAsRead = async () => {
    if (!user) return;

    await supabase
      .from('messages')
      .update({ read: true })
      .eq('receiver_id', user.id)
      .eq('read', false);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      // Get the actual UUID for the chat participant
      let receiverId = chatData.user_id;
      
      if (!receiverId) {
        // If no user_id is provided, show a message to the user
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          content: newMessage,
          sender_id: user.id,
          receiver_id: 'system',
          created_at: new Date().toISOString(),
          read: false
        }, {
          id: 'response-' + Date.now().toString(),
          content: "Thank you for your message. A representative will get back to you soon.",
          sender_id: 'system',
          receiver_id: user.id,
          created_at: new Date().toISOString(),
          read: false
        }]);
        setNewMessage('');
        return;
      }

      const { error } = await supabase
        .from('messages')
        .insert({
          content: newMessage,
          sender_id: user.id,
          receiver_id: receiverId,
          read: false
        });

      if (error) throw error;
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
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
      {/* Chat header */}
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
              <span className="text-purple-600 font-medium">
                {chatData.name.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-semibold">{chatData.name}</h3>
            <span className="text-sm text-green-500">Online</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Phone className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Video className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
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
              <span className={`text-xs mt-1 block ${
                message.sender_id === user.id ? 'text-purple-200' : 'text-gray-500'
              }`}>
                {new Date(message.created_at).toLocaleTimeString([], { 
                  hour: '2-digit',
                  minute: '2-digit'
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
                <button className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                  <Image className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                  <Paperclip className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                  <Smile className="h-5 w-5 text-gray-600" />
                </button>
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