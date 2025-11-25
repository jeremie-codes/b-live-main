import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Play, Zap, Users, Star } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

export default function WelcomeScreen() {
  const { currentTheme } = useApp();
  const router = useRouter();

  const features = [
    {
      icon: Zap,
      title: "Événements en Direct",
      description: "Regardez vos événements préférés en temps réel"
    },
    {
      icon: Users,
      title: "Communauté Active",
      description: "Rejoignez des milliers de spectateurs passionnés"
    },
  ];

  return (
    <View className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <View className="flex-1 px-6 py-8">
        {/* Hero Section */}
        <View className="items-center justify-center flex-1">
          {/* Logo */}
          <View className={`w-24 h-24 rounded-full items-center justify-center mb-6 overflow-hidden ${
              currentTheme === 'dark' ? 'bg-primary-500/20' : 'bg-primary-500/10'
            }`}>
              <Image source={require('../assets/images/icon-app.png')} className='object-cover w-full h-full' />
            </View>

          {/* Title */}
          <Text className={`font-montserrat-bold text-4xl text-center mb-4 ${
            currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            B-Live
          </Text>

          {/* Subtitle */}
          <Text className={`font-montserrat text-lg text-center mb-12 ${
            currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Vivez l'expérience ultime des événements en streaming
          </Text>

          {/* Features */}
          <View className="w-full">
            {features.map((feature, index) => (
              <View key={index} className="flex-row items-center mb-6">
                <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${
                  currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } shadow-sm`}>
                  <feature.icon size={24} color="#fdba74" />
                </View>
                <View className="flex-1">
                  <Text className={`font-montserrat-semibold text-base mb-1 ${
                    currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {feature.title}
                  </Text>
                  <Text className={`font-montserrat text-sm ${
                    currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {feature.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View className="space-y-4">
          <TouchableOpacity
            onPress={() => router.push('/login')}
            className="px-6 py-4 bg-primary-500 rounded-xl"
          >
            <Text className="text-lg text-center text-white font-montserrat-bold">
              Se connecter
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(tabs)')}
            className={`py-4 px-6 rounded-xl border-2 border-primary-500 mt-2 ${
              currentTheme === 'dark' ? 'bg-transparent' : 'bg-transparent'
            }`}
          >
            <Text className="text-lg text-center font-montserrat-bold text-primary-500">
              Découvrir
            </Text>
          </TouchableOpacity>

          <View className="pt-4">
            <Text className={`font-montserrat text-xs text-center ${
              currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              En continuant, vous acceptez nos conditions d'utilisation
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}