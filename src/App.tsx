import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navigation from './components/Navigation';
import ExploreSection from './components/ExploreSection';
import ProfileSection from './components/ProfileSection';
import TokensScreen from './components/tokens/TokensScreen';
import WeatherScreen from './components/weather/WeatherScreen';
import MessagesScreen from './components/messages/MessagesScreen';
import SettingsScreen from './components/settings/SettingsScreen';
import NetworkingScreen from './components/networking/NetworkingScreen';
import PremiumSection from './components/premium/PremiumSection';
import LoginForm from './components/auth/LoginForm';
import { useSettings } from './contexts/SettingsContext';

const TRANSLATIONS = {
  en: {
    explore: 'Explore',
    profile: 'Profile',
    tokens: 'Tokens',
    weather: 'Weather',
    messages: 'Messages',
    settings: 'Settings',
    networking: 'Networking',
    premium: 'Premium',
    login: 'Login',
    logout: 'Logout',
    loginRequired: 'Please login first'
  },
  // ... other languages
};

function App() {
  const { settings } = useSettings();
  const [activeTab, setActiveTab] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Check auth status on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      setActiveTab('explore');
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setActiveTab('explore');
    setShowLoginPrompt(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setActiveTab('login');
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'logout') {
      handleLogout();
      return;
    }
    
    if (!isAuthenticated && tab !== 'login') {
      setShowLoginPrompt(true);
      setActiveTab('login');
      return;
    }
    
    setActiveTab(tab);
  };

  const renderContent = () => {
    if (activeTab === 'login') {
      return (
        <div className="p-4">
          {showLoginPrompt && (
            <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded">
              {TRANSLATIONS.en.loginRequired}
            </div>
          )}
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        </div>
      );
    }

    switch (activeTab) {
      case 'explore': return <ExploreSection />;
      case 'profile': return <ProfileSection />;
      case 'tokens': return <TokensScreen />;
      case 'weather': return <WeatherScreen />;
      case 'messages': return <MessagesScreen />;
      case 'settings': return <SettingsScreen settings={settings} onSettingsChange={() => {}} />;
      case 'networking': return <NetworkingScreen />;
      case 'premium': return <PremiumSection />;
      default: return <ExploreSection />;
    }
  };

  return (
    <Router>
      <div className={`min-h-screen ${settings.appearance.darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        <Navigation 
          activeTab={activeTab} 
          setActiveTab={handleTabChange}
          darkMode={settings.appearance.darkMode}
          translations={{
            ...TRANSLATIONS.en,
            login: isAuthenticated ? 'Logout' : 'Login'
          }}
        />
        
        <main className={`flex-1 p-8 ml-64 ${settings.appearance.darkMode ? 'text-white' : 'text-gray-900'}`}>
          {renderContent()}
        </main>
      </div>
    </Router>
  );
}

export default App;