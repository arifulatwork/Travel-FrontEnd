import { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

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
import RegisterForm from './components/auth/RegisterForm'; // ✅ Make sure it's imported
import { useSettings } from './contexts/SettingsContext';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_yourKeyHere');

interface Translations {
  explore: string;
  profile: string;
  tokens: string;
  weather: string;
  messages: string;
  settings: string;
  networking: string;
  premium: string;
  login: string;
  logout: string;
  loginRequired: string;
}

const TRANSLATIONS: Record<string, Translations> = {
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
};

function App() {
  const { settings } = useSettings();
  const [activeTab, setActiveTab] = useState('explore');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    if (!token) {
      setActiveTab('login');
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setActiveTab('explore');
    setShowLoginPrompt(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setActiveTab('login');
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'logout') {
      handleLogout();
      return;
    }
    // Route protection: only allow access to main tabs if authenticated
    if (!isAuthenticated && tab !== 'login' && tab !== 'signup') {
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
          <LoginForm 
            onLoginSuccess={handleLoginSuccess} 
            onForgotPassword={() => {}} 
            onSignUp={() => setActiveTab('signup')} 
          />
        </div>
      );
    }
    if (activeTab === 'signup') {
      return (
        <div className="p-4">
          <RegisterForm 
            onRegisterSuccess={() => setActiveTab('login')} 
          />
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
      <Elements stripe={stripePromise}>
        <div className={`min-h-screen ${settings.appearance.darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
          {(activeTab !== 'login' && activeTab !== 'signup') && (
            <Navigation 
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              darkMode={settings.appearance.darkMode}
              translations={TRANSLATIONS.en}
            />
          )}
          <main
            className={
              activeTab === 'login' || activeTab === 'signup'
                ? 'flex-1 w-full min-h-screen flex justify-center items-center p-0'
                : `flex-1 w-full p-4 sm:p-8 ${settings.appearance.darkMode ? 'text-white' : 'text-gray-900'}`
            }
          >
            {renderContent()}
          </main>
        </div>
      </Elements>
    </Router>
  );
}

export default App;
