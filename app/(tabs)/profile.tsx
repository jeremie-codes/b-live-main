import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Mail, Calendar, CreditCard, ChevronRight } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

export default function ProfileScreen() {
  const { currentTheme, user, showNotification } = useApp();

  if (!user) {
    return (
      <SafeAreaView className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <View className="flex-1 justify-center items-center px-4">
          <User size={64} color={currentTheme === 'dark' ? '#4B5563' : '#9CA3AF'} />
          <Text className={`font-montserrat-bold text-xl mb-4 mt-4 ${
            currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Non connecté
          </Text>
          <Text className={`font-montserrat text-center mb-6 ${
            currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Connectez-vous pour accéder à votre profil
          </Text>
          <TouchableOpacity
            onPress={() => showNotification('Fonctionnalité en développement', 'info')}
            className="bg-primary-500 px-6 py-3 rounded-xl"
          >
            <Text className="font-montserrat-semibold text-white">Se connecter</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const menuItems = [
    {
      icon: Mail,
      title: 'Email',
      subtitle: user.email,
      onPress: () => showNotification('Fonctionnalité en développement', 'info')
    },
    {
      icon: Calendar,
      title: 'Mes Événements',
      subtitle: `${user.purchasedEvents.length} événement(s) acheté(s)`,
      onPress: () => showNotification('Consulter l\'onglet Mes Événements', 'info')
    },
    {
      icon: CreditCard,
      title: 'Moyens de Paiement',
      subtitle: 'Gérer vos cartes',
      onPress: () => showNotification('Fonctionnalité en développement', 'info')
    }
  ];

  return (
    <SafeAreaView className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <View className="px-4 pt-4">
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
            <Text className={`font-montserrat-bold text-xl mb-1 ${
              currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {user.name}
            </Text>
            <Text className={`font-montserrat ${
              currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Membre depuis janvier 2025
            </Text>
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

        {/* Logout Button */}
        <TouchableOpacity
          onPress={() => showNotification('Déconnexion simulée', 'success')}
          className={`mt-6 p-4 rounded-xl border ${
            currentTheme === 'dark' 
              ? 'border-red-800 bg-red-900/20' 
              : 'border-red-200 bg-red-50'
          }`}
        >
          <Text className="font-montserrat-semibold text-red-500 text-center">
            Se déconnecter
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}