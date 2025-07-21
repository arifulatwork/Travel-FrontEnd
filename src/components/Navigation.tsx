import React from 'react';
import { Map, MessageCircle, User, CreditCard, Cloud, Settings, Users, Crown } from 'lucide-react';

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
    // { id: 'tokens', icon: CreditCard, label: translations.tokens },
    { id: 'weather', icon: Cloud, label: translations.weather },
    { id: 'messages', icon: MessageCircle, label: translations.messages },
    { id: 'networking', icon: Users, label: translations.networking },
    { id: 'premium', icon: Crown, label: translations.premium },
    { id: 'settings', icon: Settings, label: translations.settings }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className={`hidden md:fixed md:left-0 md:top-0 md:bottom-0 md:w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r p-4 md:p-6 flex-col h-full md:flex`}>
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-purple-600">Community</h1>
        </div>
        <div className="space-y-1 md:space-y-2">
          {tabs.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center space-x-2 md:space-x-3 px-2 md:px-4 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base ${
                activeTab === id
                  ? 'text-purple-600 bg-purple-50 dark:bg-purple-900/20'
                  : `text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50 ${
                      darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                    }`
              }`}
            >
              <Icon className="h-5 w-5 md:h-6 md:w-6" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>
      {/* Mobile Bottom Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 z-50 flex md:hidden justify-around bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-1 sm:py-2`}>
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-col items-center flex-1 px-0.5 sm:px-1 py-0.5 sm:py-1 ${
              activeTab === id
                ? 'text-purple-600'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 mb-0.5 sm:mb-1" />
            <span className="text-[10px] sm:text-xs">{label}</span>
          </button>
        ))}
      </nav>
    </>
  );
};

export default Navigation;