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
import RegisterForm from './components/auth/RegisterForm';
import ForgotPasswordForm from './components/auth/ForgotPasswordForm';

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
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'forgot' | string>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

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

    if (!isAuthenticated && tab !== 'login' && tab !== 'signup' && tab !== 'forgot') {
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
            onForgotPassword={() => setActiveTab('forgot')}
            onSignUp={() => setActiveTab('signup')}
          />
        </div>
      );
    }

    if (activeTab === 'signup') {
      return (
        <div className="p-4">
          <RegisterForm onRegisterSuccess={() => setActiveTab('login')} />
        </div>
      );
    }

    if (activeTab === 'forgot') {
      return (
        <div className="p-4">
          <ForgotPasswordForm onBackToLogin={() => setActiveTab('login')} />
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
        <div className={`min-h-screen flex flex-col md:flex-row ${settings.appearance.darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
          {/* Navigation Sidebar / Bottom Navigation */}
          <Navigation
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            darkMode={settings.appearance.darkMode}
            translations={TRANSLATIONS.en}
          />

          {/* Main Content */}
          <main className={`flex-1 p-4 md:p-8 md:ml-64 ${settings.appearance.darkMode ? 'text-white' : 'text-gray-900'}`}>
            {renderContent()}
          </main>
        </div>
      </Elements>
    </Router>
  );
}

export default App;
