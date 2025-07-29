import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Zap, TrendingUp, TrendingDown } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { getEvents } from '@/services/api';
import EventCard from '@/components/EventCard';
import { EventType } from '@/types';
import CategoryFilter from '@/components/CategoryFilter';

export default function HomeScreen() {
  const { currentTheme, showNotification } = useApp();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<EventType[]>([]);

  const isLiveEvent = (event: any): boolean => {
    const hasLink = !!event.link;

    const eventDate = new Date(event.date);
    const now = new Date();

    // Jour identique
    const isSameDay =
      eventDate.getFullYear() === now.getFullYear() &&
      eventDate.getMonth() === now.getMonth() &&
      eventDate.getDate() === now.getDate();

    // Heure déjà atteinte
    const isTimePassed = eventDate <= now;

    return hasLink && isSameDay && isTimePassed;
  };

  const isUpcomingEvent = (event: any): boolean => {
    const eventDate = new Date(event.date);
    const today = new Date();

    // Ignore time, compare just the dates
    const eventOnlyDate = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    const todayOnlyDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    return eventOnlyDate > todayOnlyDate;
  };

  const isOldEvent = (event: any): boolean => {
    const eventDate = new Date(event.date);
    const today = new Date();

    const eventOnlyDate = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    const todayOnlyDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    return eventOnlyDate < todayOnlyDate;
  };

  const filteredEvents = selectedCategory === 'Tous' 
    ? data
    : data.filter(event => event.category.name === selectedCategory);

  const liveEvents = filteredEvents.filter(event => isLiveEvent(event));
  const upcomingEvents = filteredEvents.filter(event => isUpcomingEvent(event));
  const oldEvents = filteredEvents.filter(event => isOldEvent(event));

  const loadEvents = async () => {
    try {
      const data = await getEvents();

      setData(Array.isArray(data) ? data : []);

    } catch (error) {
      showNotification('Chargement des événements échoué !', 'error');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadEvents();
  };


  return (
    <SafeAreaView className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ScrollView showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#8b5cf6"
            colors={["#8b5cf6"]}
          />
        }>
          
        <View className="flex-row items-center justify-between px-4 py-6 ">
          <View className='w-20 h-12 '>
            <Image source={require('@/assets/images/blive.png')} className='w-full h-full object-contain' />
          </View>

          <View className='' >
            <Text className={`font-montserrat-bold text-2xl text-right ${
              currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Bienvenue
            </Text>
            <Text className={`font-montserrat text-base ${
              currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Découvrez les événements en direct
            </Text>
          </View>
        </View>

        <View className='px-4'>
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </View>

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

        {oldEvents.length > 0 && (
          <View className="mb-6">
            <View className="flex-row items-center px-4 mb-4">
              <TrendingDown size={20} color="red" />
              <Text className={`ml-2 font-montserrat-bold text-lg ${
                currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Événements Passés
              </Text>
            </View>
            
            <View className="px-4">
              {oldEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onPress={() => router.push(`/event/${event.id}`)}
                />
              ))}
            </View>
          </View>
        )}

        {filteredEvents.length === 0  && (
          <View className="px-4 py-8 items-center">
            <Text className={`font-montserrat text-center ${
              currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Aucun événement trouvé
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}