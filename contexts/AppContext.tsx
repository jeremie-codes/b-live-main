import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

interface User {
  id: string;
  name: string;
  email: string;
  purchasedEvents: number[];
}

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error';
  visible: boolean;
}

interface AppContextType {
  user: User | null;
  theme: 'light' | 'dark' | 'system';
  currentTheme: 'light' | 'dark';
  notification: Notification | null;
  setUser: (user: User | null) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  showNotification: (message: string, type: 'info' | 'success' | 'error') => void;
  hideNotification: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const systemColorScheme = useColorScheme();
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    purchasedEvents: [1, 4, 6]
  });
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [notification, setNotification] = useState<Notification | null>(null);

  const currentTheme = theme === 'system' ? (systemColorScheme || 'light') : theme;

  const showNotification = (message: string, type: 'info' | 'success' | 'error') => {
    const id = Date.now().toString();
    setNotification({
      id,
      message,
      type,
      visible: true
    });

    // Auto-hide after 3.5 seconds
    setTimeout(() => {
      hideNotification();
    }, 3500);
  };

  const hideNotification = () => {
    setNotification(prev => prev ? { ...prev, visible: false } : null);
    setTimeout(() => {
      setNotification(null);
    }, 300);
  };

  return (
    <AppContext.Provider value={{
      user,
      theme,
      currentTheme,
      notification,
      setUser,
      setTheme,
      showNotification,
      hideNotification
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}