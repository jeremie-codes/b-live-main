import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Play, Calendar } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { mockEvents } from '@/data/events';
import EventCard from '@/components/EventCard';

export default function MyEventsScreen() {
  const { currentTheme, user } = useApp();
  const router = useRouter();

  const purchasedEvents = mockEvents.filter(event => 
    user?.purchasedEvents.includes(event.id)
  );

  const liveEvents = purchasedEvents.filter(event => event.isLive);
  const pastEvents = purchasedEvents.filter(event => !event.isLive);

  if (!user) {
    return (
      <SafeAreaView className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <View className="flex-1 justify-center items-center px-4">
          <Text className={`font-montserrat-bold text-xl mb-4 ${
            currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Connexion requise
          </Text>
          <Text className={`font-montserrat text-center ${
            currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Veuillez vous connecter pour voir vos événements
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4">
          <Text className={`font-montserrat-bold text-2xl mb-2 ${
            currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Mes Événements
          </Text>
          <Text className={`font-montserrat text-base mb-6 ${
            currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {purchasedEvents.length} événement(s) acheté(s)
          </Text>
        </View>

        {liveEvents.length > 0 && (
          <View className="mb-6">
            <View className="flex-row items-center px-4 mb-4">
              <Play size={20} color="#EF4444" />
              <Text className={`ml-2 font-montserrat-bold text-lg ${
                currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Disponible Maintenant
              </Text>
            </View>
            
            <View className="px-4">
              {liveEvents.map((event) => (
                <TouchableOpacity
                  key={event.id}
                  onPress={() => router.push(`/live/${event.id}`)}
                >
                  <EventCard
                    event={event}
                    onPress={() => router.push(`/live/${event.id}`)}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {pastEvents.length > 0 && (
          <View className="mb-6">
            <View className="flex-row items-center px-4 mb-4">
              <Calendar size={20} color="#EAB308" />
              <Text className={`ml-2 font-montserrat-bold text-lg ${
                currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Événements Programmés
              </Text>
            </View>
            
            <View className="px-4">
              {pastEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onPress={() => router.push(`/event/${event.id}`)}
                />
              ))}
            </View>
          </View>
        )}

        {purchasedEvents.length === 0 && (
          <View className="px-4 py-12 items-center">
            <Calendar size={48} color={currentTheme === 'dark' ? '#4B5563' : '#9CA3AF'} />
            <Text className={`font-montserrat-bold text-lg mb-2 mt-4 ${
              currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Aucun événement acheté
            </Text>
            <Text className={`font-montserrat text-center ${
              currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Explorez notre catalogue d'événements en direct
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/')}
              className="bg-primary-500 px-6 py-3 rounded-xl mt-4"
            >
              <Text className="font-montserrat-semibold text-white">
                Découvrir les Événements
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}