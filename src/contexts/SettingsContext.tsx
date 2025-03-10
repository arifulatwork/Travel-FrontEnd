import React, { createContext, useContext, useState, useEffect } from 'react';

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

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Settings) => void;
}

const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'it', 'pt'];

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem('userSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      notifications: {
        push: true,
        email: true,
        marketing: false,
      },
      appearance: {
        darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
        fontSize: 'medium',
      },
      language: 'en',
      currency: 'EUR',
    };
  });

  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify(settings));

    // Apply font size
    const fontSizes = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    document.documentElement.style.fontSize = fontSizes[settings.appearance.fontSize];

    // Apply dark mode
    if (settings.appearance.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply language
    document.documentElement.lang = settings.language;

    // Apply currency formatting
    const currencyFormatter = new Intl.NumberFormat(settings.language, {
      style: 'currency',
      currency: settings.currency
    });
    (window as any).formatCurrency = (amount: number) => currencyFormatter.format(amount);
  }, [settings]);

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};