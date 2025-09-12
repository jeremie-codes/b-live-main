import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Mail, Calendar, CreditCard, ChevronRight, UserPlus, UserCog } from 'lucide-react-native';
import { Moon, Sun, Smartphone, Globe, Shield } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { currentTheme, theme, setTheme, user, logout } = useApp();
    const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const menuItems = [
    {
      icon: UserCog,
      title: 'Modifier le profil',
      subtitle: user?.email || 'Connexion requise',
      onPress: () => router.push('/edit-profile')
    },
    {
      icon: Calendar,
      title: 'Mes Événements',
      subtitle: Array.isArray(user?.purchasedEvents) ? `${user?.purchasedEvents.length} événement(s) reservé(s)` : 'Aucun événement reservé',
      onPress: () => router.push('/(tabs)/my-events')
    }
  ];

  return (
    <SafeAreaView className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ScrollView className="px-4 pt-4">
        <Text className={`font-montserrat-bold text-2xl mb-8 ${
          currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Profil
        </Text>

        {/* Profile Header */}
        <View className={`rounded-xl p-6 mb-6 ${
          currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-sm`}>
          <View className="items-center">
            <View className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${
              currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <User size={32} color={currentTheme === 'dark' ? '#E5E7EB' : '#374151'} />
            </View>
            {user && <Text className={`font-montserrat-bold text-xl mb-1 ${
              currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {user?.name}
            </Text>}
            {!user && <View className='flex-col items-center'>
              <Text className={`font-montserrat-medium text-lg mb-1 ${
                currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Vous n'êtes pas connecté
              </Text>

              <TouchableOpacity onPress={() => router.push('/login')} className='bg-primary-500 py-2 px-4 rounded-xl mt-4'>
                <Text className={`font-montserrat-bold text-xl mb-1 ${
                  currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Se connecter
                </Text>
              </TouchableOpacity>
              </View>}
            {user && <Text className={`font-montserrat ${
              currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Membre depuis le {new Date(user?.created_at || '').toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>}
          </View>
        </View>

        {/* Menu Items */}
        <View className={`rounded-xl overflow-hidden ${
          currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-sm`}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              className={`flex-row items-center p-4 ${
                index < menuItems.length - 1 
                  ? currentTheme === 'dark' 
                    ? 'border-b border-gray-700' 
                    : 'border-b border-gray-100'
                  : ''
              }`}
            >
              <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
                currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <item.icon size={20} color={currentTheme === 'dark' ? '#E5E7EB' : '#374151'} />
              </View>
              
              <View className="flex-1">
                <Text className={`font-montserrat-semibold ${
                  currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {item.title}
                </Text>
                <Text className={`font-montserrat text-sm ${
                  currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {item.subtitle}
                </Text>
              </View>
              
              <ChevronRight size={20} color={currentTheme === 'dark' ? '#6B7280' : '#9CA3AF'} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Theme Section */}
        <View className={`rounded-xl p-4 mb-6 mt-4 ${
          currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-sm`}>
          <Text className={`font-montserrat-bold text-lg mb-4 ${
            currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Apparence
          </Text>

          <View className="space-y-3">
            <TouchableOpacity
              onPress={() => setTheme('light')}
              className={`flex-row items-center p-3 rounded-lg mb-2 ${
                theme === 'light' 
                  ? 'bg-primary-500' 
                  : currentTheme === 'dark' 
                  ? 'bg-gray-700' 
                  : 'bg-gray-50'
              }`}
            >
              <Sun size={20} color={theme === 'light' ? '#FFFFFF' : currentTheme === 'dark' ? '#E5E7EB' : '#374151'} />
              <Text className={`ml-3 font-montserrat-medium ${
                theme === 'light' 
                  ? 'text-white' 
                  : currentTheme === 'dark' 
                  ? 'text-gray-200' 
                  : 'text-gray-700'
              }`}>
                Thème Clair
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setTheme('dark')}
              className={`flex-row items-center p-3 rounded-lg mb-2 ${
                theme === 'dark' 
                  ? 'bg-primary-500' 
                  : currentTheme === 'dark' 
                  ? 'bg-gray-700' 
                  : 'bg-gray-50'
              }`}
            >
              <Moon size={20} color={theme === 'dark' ? '#FFFFFF' : currentTheme === 'dark' ? '#E5E7EB' : '#374151'} />
              <Text className={`ml-3 font-montserrat-medium ${
                theme === 'dark' 
                  ? 'text-white' 
                  : currentTheme === 'dark' 
                  ? 'text-gray-200' 
                  : 'text-gray-700'
              }`}>
                Thème Sombre
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setTheme('system')}
              className={`flex-row items-center p-3 rounded-lg ${
                theme === 'system' 
                  ? 'bg-primary-500' 
                  : currentTheme === 'dark' 
                  ? 'bg-gray-700' 
                  : 'bg-gray-50'
              }`}
            >
              <Smartphone size={20} color={theme === 'system' ? '#FFFFFF' : currentTheme === 'dark' ? '#E5E7EB' : '#374151'} />
              <Text className={`ml-3 font-montserrat-medium ${
                theme === 'system' 
                  ? 'text-white' 
                  : currentTheme === 'dark' 
                  ? 'text-gray-200' 
                  : 'text-gray-700'
              }`}>
                Automatique
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        {user && <TouchableOpacity
          disabled={isLoading}
          onPress={async () => {
             setIsLoading(true);
            const success = await logout();
            if (success) {
              router.replace('/welcome');
            }
            setIsLoading(false);
          }}
          className={`mt-2 mb-12 p-4 rounded-xl border ${
            currentTheme === 'dark' 
              ? 'border-red-800 bg-red-900/20' 
              : 'border-red-200 bg-red-50'
          }`}
        >
          <Text className="font-montserrat-semibold text-red-500 text-center">
            Se déconnecter {isLoading && <ActivityIndicator size="small" color="#FF0000" />}
          </Text>
        </TouchableOpacity>}
      </ScrollView>
    </SafeAreaView>
  );
}