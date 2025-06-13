import React, { useState } from 'react';
import {
  Search, MessageCircle, Check, UserPlus, Lightbulb
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import TravelTipsSection from './TravelTipsSection';

interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  type: 'traveler' | 'guide' | 'support';
  user_id: string;
}

const MessagesScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'chats' | 'tips'>('chats');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [selectedChatUser, setSelectedChatUser] = useState<ChatUser | null>(null);
  const [showInviteToChat, setShowInviteToChat] = useState(false);
  const [showInviteSuccess, setShowInviteSuccess] = useState(false);

  return (
    <div className="max-w-7xl mx-auto p-4">
      {showInviteSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5" />
            <span>Chat invitations sent successfully!</span>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Messages</h2>
          <button
            onClick={() => setShowInviteToChat(true)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            <UserPlus className="h-4 w-4" />
            Invite to Chat
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        <button
          onClick={() => setActiveSection('chats')}
          className={`px-4 py-2 font-medium ${
            activeSection === 'chats'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Messages
        </button>
        <button
          onClick={() => setActiveSection('tips')}
          className={`px-4 py-2 font-medium flex items-center gap-2 ${
            activeSection === 'tips'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Lightbulb className="h-4 w-4" />
          Travel Tips & Insurance
        </button>
      </div>

      {activeSection === 'chats' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chat list */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <ChatList
              selectedChat={selectedChat}
              onSelectChat={(chatId, userData) => {
                setSelectedChat(chatId);
                setSelectedChatUser(userData);
              }}
              searchQuery={searchQuery}
            />
          </div>

          {/* Chat window */}
          {selectedChat && selectedChatUser ? (
            <div className="md:col-span-2">
              <ChatWindow
                chatId={selectedChat}
                chatData={selectedChatUser}
                onClose={() => {
                  setSelectedChat(null);
                  setSelectedChatUser(null);
                }}
              />
            </div>
          ) : (
            <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center">
              <MessageCircle className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Chat Selected</h3>
              <p className="text-gray-600">
                Select a chat from the list to start messaging
              </p>
            </div>
          )}
        </div>
      ) : (
        <TravelTipsSection />
      )}
    </div>
  );
};

export default MessagesScreen;
