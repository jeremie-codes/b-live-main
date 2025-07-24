import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Zap, TrendingUp } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { mockEvents } from '@/data/events';
import EventCard from '@/components/EventCard';
import CategoryFilter from '@/components/CategoryFilter';

export default function HomeScreen() {
  const { currentTheme, showNotification } = useApp();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  const filteredEvents = selectedCategory === 'Tous' 
    ? mockEvents 
    : mockEvents.filter(event => event.category === selectedCategory);

  const liveEvents = filteredEvents.filter(event => event.isLive);
  const upcomingEvents = filteredEvents.filter(event => !event.isLive);

  return (
    <SafeAreaView className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4">
          <Text className={`font-montserrat-bold text-2xl mb-2 ${
            currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Bienvenue
          </Text>
          <Text className={`font-montserrat text-base mb-6 ${
            currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Découvrez les meilleurs événements en direct
          </Text>
        </View>

        <CategoryFilter 
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {liveEvents.length > 0 && (
          <View className="mb-6">
            <View className="flex-row items-center px-4 mb-4">
              <Zap size={20} color="#EF4444" />
              <Text className={`ml-2 font-montserrat-bold text-lg ${
                currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                En Direct
              </Text>
            </View>
            
            <View className="px-4">
              {liveEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onPress={() => router.push(`/event/${event.id}`)}
                />
              ))}
            </View>
          </View>
        )}

        {upcomingEvents.length > 0 && (
          <View className="mb-6">
            <View className="flex-row items-center px-4 mb-4">
              <TrendingUp size={20} color="#EAB308" />
              <Text className={`ml-2 font-montserrat-bold text-lg ${
                currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Événements à Venir
              </Text>
            </View>
            
            <View className="px-4">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onPress={() => router.push(`/event/${event.id}`)}
                />
              ))}
            </View>
          </View>
        )}

        {filteredEvents.length === 0 && (
          <View className="px-4 py-8 items-center">
            <Text className={`font-montserrat text-center ${
              currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Aucun événement trouvé dans cette catégorie
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}