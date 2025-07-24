import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Moon, Sun, Smartphone, Globe, Shield, ChevronRight } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

export default function SettingsScreen() {
  const { currentTheme, theme, setTheme, showNotification } = useApp();

  const settingsItems = [
    {
      icon: Globe,
      title: 'Langue',
      subtitle: 'Français',
      onPress: () => showNotification('Fonctionnalité en développement', 'info'),
      showArrow: true
    },
    {
      icon: Shield,
      title: 'Confidentialité',
      subtitle: 'Gérer vos données',
      onPress: () => showNotification('Fonctionnalité en développement', 'info'),
      showArrow: true
    }
  ];

  return (
    <SafeAreaView className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <View className="px-4 pt-4">
        <Text className={`font-montserrat-bold text-2xl mb-8 ${
          currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Paramètres
        </Text>

        {/* Theme Section */}
        <View className={`rounded-xl p-4 mb-6 ${
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
              className={`flex-row items-center p-3 rounded-lg ${
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
              className={`flex-row items-center p-3 rounded-lg ${
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

        {/* Settings Items */}
        <View className={`rounded-xl overflow-hidden ${
          currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-sm`}>
          {settingsItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              className={`flex-row items-center p-4 ${
                index < settingsItems.length - 1 
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
              
              {item.showArrow && (
                <ChevronRight size={20} color={currentTheme === 'dark' ? '#6B7280' : '#9CA3AF'} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* About */}
        <View className={`rounded-xl p-4 mt-6 ${
          currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-sm`}>
          <Text className={`font-montserrat-bold text-lg mb-2 ${
            currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            À Propos
          </Text>
          <Text className={`font-montserrat text-sm ${
            currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Version 1.0.0
          </Text>
          <Text className={`font-montserrat text-sm ${
            currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            © 2025 StreamEvents
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}