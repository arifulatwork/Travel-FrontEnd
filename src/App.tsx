import React, { useState } from 'react';
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
import AuthModal from './components/auth/AuthModal';
import { useSettings } from './contexts/SettingsContext';
import { useAuth } from './contexts/AuthContext';

const TRANSLATIONS = {
  en: {
    explore: 'Explore',
    profile: 'Profile',
    tokens: 'Tokens',
    weather: 'Weather',
    messages: 'Messages',
    settings: 'Settings',
    networking: 'Networking',
    premium: 'Premium'
  },
  es: {
    explore: 'Explorar',
    profile: 'Perfil',
    tokens: 'Tokens',
    weather: 'Clima',
    messages: 'Mensajes',
    settings: 'Ajustes',
    networking: 'Networking',
    premium: 'Premium'
  },
  fr: {
    explore: 'Explorer',
    profile: 'Profil',
    tokens: 'Jetons',
    weather: 'Météo',
    messages: 'Messages',
    settings: 'Paramètres',
    networking: 'Réseautage',
    premium: 'Premium'
  },
  de: {
    explore: 'Erkunden',
    profile: 'Profil',
    tokens: 'Token',
    weather: 'Wetter',
    messages: 'Nachrichten',
    settings: 'Einstellungen',
    networking: 'Networking',
    premium: 'Premium'
  }
};

function App() {
  const { settings } = useSettings();
  const { showAuthModal, setShowAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState('explore');

  const t = TRANSLATIONS[settings.language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

  const renderContent = () => {
    switch (activeTab) {
      case 'explore':
        return <ExploreSection />;
      case 'profile':
        return <ProfileSection />;
      case 'tokens':
        return <TokensScreen />;
      case 'weather':
        return <WeatherScreen />;
      case 'messages':
        return <MessagesScreen />;
      case 'settings':
        return <SettingsScreen settings={settings} onSettingsChange={() => {}} />;
      case 'networking':
        return <NetworkingScreen />;
      case 'premium':
        return <PremiumSection />;
      default:
        return <ExploreSection />;
    }
  };

  return (
    <Router>
      <div className={`min-h-screen ${settings.appearance.darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        <Navigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          darkMode={settings.appearance.darkMode}
          translations={t}
        />
        <main className={`flex-1 p-8 ml-64 ${settings.appearance.darkMode ? 'text-white' : 'text-gray-900'}`}>
          {renderContent()}
        </main>

        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    </Router>
  );
}

export default App;