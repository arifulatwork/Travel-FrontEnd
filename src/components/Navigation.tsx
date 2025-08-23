import React from 'react';
import { Map, MessageCircle, User, Cloud, Settings, Users, Crown } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  translations: {
    explore: string;
    profile: string;
    tokens: string;
    weather: string;
    messages: string;
    settings: string;
    networking: string;
    premium: string;
  };
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, darkMode, translations }) => {
  const tabs = [
    { id: 'explore', icon: Map, label: translations.explore },
    { id: 'profile', icon: User, label: translations.profile },
    { id: 'weather', icon: Cloud, label: translations.weather },
    { id: 'messages', icon: MessageCircle, label: translations.messages },
    { id: 'networking', icon: Users, label: translations.networking },
    { id: 'premium', icon: Crown, label: translations.premium },
    { id: 'settings', icon: Settings, label: translations.settings }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className={`hidden md:flex fixed left-0 top-0 bottom-0 w-64 
        ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
        border-r p-6`}>
        <div className="flex flex-col h-full">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-purple-600">Community</h1>
          </div>
          <div className="space-y-2">
            {tabs.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === id
                    ? 'text-purple-600 bg-purple-50 dark:bg-purple-900/20'
                    : `text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50 ${
                        darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                      }`
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-50 
        ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
        border-t flex justify-around items-center p-2`}>
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-col items-center space-y-1 text-xs ${
              activeTab === id
                ? 'text-purple-600'
                : 'text-gray-500 dark:text-gray-300'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </>
  );
};

export default Navigation;
