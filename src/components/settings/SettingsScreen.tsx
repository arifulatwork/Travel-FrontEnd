import React from 'react';
import { Bell, Globe, Moon, Sun, Languages, Shield, Lock, Smartphone, Laptop, Tablet, Info } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

interface Settings {
  notifications: {
    push: boolean;
    email: boolean;
    marketing: boolean;
  };
  appearance: {
    darkMode: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
  language: string;
  currency: string;
}

interface SettingsScreenProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ settings, onSettingsChange }) => {
  const { updateSettings } = useSettings();

  const handleNotificationChange = (key: keyof Settings['notifications']) => {
    onSettingsChange({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    });
  };

  const handleAppearanceChange = (key: keyof Settings['appearance'], value: any) => {
    const newSettings = {
      ...settings,
      appearance: {
        ...settings.appearance,
        [key]: value,
      },
    };
    onSettingsChange(newSettings);
    updateSettings(newSettings);
  };

  const handleRegionChange = (key: 'language' | 'currency', value: string) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  const sections = [
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-gray-500">Receive instant updates about your bookings</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.push}
                onChange={() => handleNotificationChange('push')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-gray-500">Get important updates via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={() => handleNotificationChange('email')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Marketing Communications</p>
              <p className="text-sm text-gray-500">Receive promotional offers and updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.marketing}
                onChange={() => handleNotificationChange('marketing')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      ),
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: settings.appearance.darkMode ? Moon : Sun,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium dark:text-white">Dark Mode</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Toggle dark mode theme</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.appearance.darkMode}
                onChange={(e) => handleAppearanceChange('darkMode', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div>
            <p className="font-medium mb-2 dark:text-white">Font Size</p>
            <select
              value={settings.appearance.fontSize}
              onChange={(e) => handleAppearanceChange('fontSize', e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div className="flex flex-col space-y-2">
            <p className="font-medium dark:text-white">Preview</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center justify-center">
                <Smartphone className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="flex items-center justify-center">
                <Tablet className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="flex items-center justify-center">
                <Laptop className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'language',
      title: 'Language & Region',
      icon: Languages,
      content: (
        <div className="space-y-4">
          <div>
            <p className="font-medium mb-2">Language</p>
            <select
              value={settings.language}
              onChange={(e) => handleRegionChange('language', e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="it">Italiano</option>
              <option value="pt">Português</option>
            </select>
          </div>

          <div>
            <p className="font-medium mb-2">Currency</p>
            <select
              value={settings.currency}
              onChange={(e) => handleRegionChange('currency', e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="EUR">Euro (EUR)</option>
              <option value="USD">US Dollar (USD)</option>
              <option value="GBP">British Pound (GBP)</option>
              <option value="JPY">Japanese Yen (JPY)</option>
              <option value="AUD">Australian Dollar (AUD)</option>
              <option value="CAD">Canadian Dollar (CAD)</option>
            </select>
          </div>

          <div className="pt-4">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Region Settings</p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Your language and currency settings will be applied across the platform. Some content may not be available in all languages.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-gray-500">Add an extra layer of security</p>
            </div>
            <button className="text-purple-600 hover:text-purple-700 font-medium">
              Enable
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Privacy Mode</p>
              <p className="text-sm text-gray-500">Hide your profile from other users</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="pt-4">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-purple-600" />
                <p className="text-sm text-purple-600 font-medium">Security Tips</p>
              </div>
              <ul className="mt-2 space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <Info className="h-4 w-4 text-purple-600" />
                  <span>Use a strong, unique password</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Info className="h-4 w-4 text-purple-600" />
                  <span>Enable two-factor authentication</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Info className="h-4 w-4 text-purple-600" />
                  <span>Regularly review your privacy settings</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-2 sm:px-4 md:px-6 py-4">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 md:mb-6">Settings</h2>
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        {sections.map(section => (
          <div key={section.id} className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6">
            <div className="flex items-center gap-2 mb-1 sm:mb-2 md:mb-4">
              <section.icon className="text-purple-600" />
              <h3 className="font-semibold text-base sm:text-lg md:text-xl">{section.title}</h3>
            </div>
            {/* Responsive content */}
            <div className="text-xs sm:text-sm md:text-base">
              {section.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsScreen;