import React, { createContext, useContext } from 'react';

interface AuthContextType {
  user: { id: string } | null;
  loading: boolean;
  signOut: () => Promise<void>;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Create a mock user that's always logged in
  const mockUser = {
    id: '00000000-0000-0000-0000-000000000001'
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user: mockUser,
        loading: false,
        signOut: async () => {},
        showAuthModal: false,
        setShowAuthModal: () => {}
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};