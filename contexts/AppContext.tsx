import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

interface User {
  id: string;
  name: string;
  email: string;
  purchasedEvents: number[];
  wishlist: number[];
}

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error';
  visible: boolean;
}

interface AppContextType {
  user: User | null;
  isLoggedIn: boolean;
  theme: 'light' | 'dark' | 'system';
  currentTheme: 'light' | 'dark';
  notification: Notification | null;
  setUser: (user: User | null) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  showNotification: (message: string, type: 'info' | 'success' | 'error') => void;
  hideNotification: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addToWishlist: (eventId: number) => void;
  removeFromWishlist: (eventId: number) => void;
  updateProfile: (name: string, password?: string) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const systemColorScheme = useColorScheme();
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple validation for demo
    if (email && password) {
      const mockUser: User = {
        id: '1',
        name: 'Jean Dupont',
        email: email,
        purchasedEvents: [1, 4, 6],
        wishlist: [2, 5]
      };
      
      setUser(mockUser);
      setIsLoggedIn(true);
      showNotification('Connexion réussie !', 'success');
      return true;
    } else {
      showNotification('Email ou mot de passe incorrect', 'error');
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple validation for demo
    if (name.trim() && email.trim() && password.trim()) {
      if (password.length < 6) {
        showNotification('Le mot de passe doit contenir au moins 6 caractères', 'error');
        return false;
      }
      
      const mockUser: User = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim(),
        purchasedEvents: [],
        wishlist: []
      };
      
      setUser(mockUser);
      setIsLoggedIn(true);
      showNotification('Inscription réussie ! Bienvenue !', 'success');
      return true;
    } else {
      showNotification('Veuillez remplir tous les champs', 'error');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    showNotification('Déconnexion réussie', 'success');
  };

  const addToWishlist = (eventId: number) => {
    if (!user) return;
    
    if (!user.wishlist.includes(eventId)) {
      const updatedUser = {
        ...user,
        wishlist: [...user.wishlist, eventId]
      };
      setUser(updatedUser);
      showNotification('Événement ajouté à la wishlist', 'success');
    }
  };

  const removeFromWishlist = (eventId: number) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      wishlist: user.wishlist.filter(id => id !== eventId)
    };
    setUser(updatedUser);
    showNotification('Événement retiré de la wishlist', 'info');
  };

  const updateProfile = async (name: string, password?: string): Promise<boolean> => {
    if (!user) return false;
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedUser = {
      ...user,
      name: name
    };
    
    setUser(updatedUser);
    showNotification('Profil mis à jour avec succès', 'success');
    return true;
  };

  const deleteAccount = async (): Promise<boolean> => {
    if (!user) return false;
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Clear user data
    setUser(null);
    setIsLoggedIn(false);
    showNotification('Compte supprimé avec succès', 'success');
    return true;
  };

  return (
    <AppContext.Provider value={{
      user,
      isLoggedIn,
      theme,
      currentTheme,
      notification,
      setUser,
      setTheme,
      showNotification,
      hideNotification,
      login,
      register,
      logout,
      addToWishlist,
      removeFromWishlist,
      updateProfile,
      deleteAccount
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