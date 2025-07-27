import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@/configs/index';

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
  token: string | null;
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
  // makeAuthenticatedRequest: (url: string, options?: any) => Promise<any>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const systemColorScheme = useColorScheme();
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
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
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { token: authToken, user: userData } = response.data.data;
      
      // Store token and user data
      await AsyncStorage.setItem('authToken', authToken);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      
      // Update state
      setToken(authToken);
      setUser(userData);
      setIsLoggedIn(true);
      
      // Configure axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      
      showNotification('Connexion réussie !', 'success');
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      showNotification('Email ou mot de passe incorrect', 'error');
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      const { token: authToken, user: userData } = response.data.data;
      
      // Store token and user data
      await AsyncStorage.setItem('authToken', authToken);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      
      // Update state
      setToken(authToken);
      setUser(userData);
      setIsLoggedIn(true);
      
      // Configure axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      
      showNotification('Inscription réussie ! Bienvenue !', 'success');
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'inscription';
      showNotification(errorMessage, 'error');
      return false;
    }
  };

  const logout = async () => {
    try {
      // Clear stored data
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      
      // Clear axios default headers
      delete axios.defaults.headers.common['Authorization'];
      
      // Update state
      setToken(null);
      setUser(null);
      setIsLoggedIn(false);
      
      showNotification('Déconnexion réussie', 'success');
    } catch (error: any) {
      console.error('Logout error:', error);
    }
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
    
    try {
      const updateData: any = { name };
      if (password) {
        updateData.password = password;
      }

      const response = await axios.put(`${API_URL}/user/profile`, {
        data: updateData,
      });
      
      const updatedUser = { ...user, ...response.data.user };
      
      // Update stored user data
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      showNotification('Profil mis à jour avec succès', 'success');
      return true;
    } catch (error: any) {
      console.error('Update profile error:', error);
      showNotification('Erreur lors de la mise à jour du profil', 'error');
      return false;
    }
  };

  const deleteAccount = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // await makeAuthenticatedRequest(`${API_URL}/user/account`, {
      //   method: 'DELETE',
      // });
      
      // Clear all data after successful deletion
      await logout();
      showNotification('Compte supprimé avec succès', 'success');
      return true;
    } catch (error: any) {
      console.error('Delete account error:', error);
      showNotification('Erreur lors de la suppression du compte', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      isLoggedIn,
      token,
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
      deleteAccount,
      // makeAuthenticatedRequest
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