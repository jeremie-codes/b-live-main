import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Image, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Zap, TrendingUp, TrendingDown } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { getEvents } from '@/services/api';
import EventCard from '@/components/EventCard';
import { EventType } from '@/types';
import CategoryFilter from '@/components/CategoryFilter';

export default function HomeScreen() {
  const { currentTheme, user, showNotification } = useApp();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<EventType[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [lastPage, setLastPage] = useState(1);
  const [page, setPage] = useState(1);

  const isLiveEvent = (event: EventType): boolean => {
    const isStarted = event?.is_started;
    const isLive = event?.is_live;

    return isStarted || isLive;
  };

  const isUpcomingEvent = (event: EventType): boolean => {
    const eventDate = new Date(event.date);
    const today = new Date();

    // Ignore time, compare just the dates
    const eventOnlyDate = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    const todayOnlyDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    return eventOnlyDate > todayOnlyDate;
  };

  const isOldEvent = (event: EventType): boolean => {
    const eventDate = new Date(event.date);
    const now = new Date();

    const eventTime = eventDate.getTime();
    const nowTime = now.getTime();

    // On extrait uniquement la date sans l’heure
    const eventOnlyDate = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    const todayOnlyDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const isBeforeToday = eventOnlyDate < todayOnlyDate;
    const isTodayButPast = eventOnlyDate.getTime() === todayOnlyDate.getTime() && eventTime < nowTime;
    const isFinished = event?.is_finished;

    return isBeforeToday || isTodayButPast || isFinished;
  };

  const filteredEvents = selectedCategory === 'Tous' 
    ? data
    : data.filter(event => event.category.name === selectedCategory);

  const liveEvents = filteredEvents.filter(event => isLiveEvent(event));
  const upcomingEvents = filteredEvents.filter(event => isUpcomingEvent(event));
  const oldEvents = filteredEvents.filter(event => isOldEvent(event));

  const loadEvents = async () => {
    try {
      const { data, has_more, last_page }: any = await getEvents(page);

      setData(Array.isArray(data) ? data : []);
      setHasMore(has_more);
      setLastPage(last_page);

    } catch (error) {
      showNotification('Chargement des événements échoué !', 'error');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // console.log(user?.id)
    loadEvents();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadEvents();
  };
  
  return (
    <View className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ScrollView showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#8b5cf6"
            colors={["#8b5cf6"]}
          />
        }>
          
        <View className="flex-row items-center justify-between px-4 py-8 ">
          <View className='w-24' style={{ height: 50 }}>
            <Image source={require('@/assets/images/bliveo.png')} className='object-contain w-full h-full' />
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

        {isLoading && (
          <View className="items-center justify-center flex-1">
            <ActivityIndicator size="large" color="#8b5cf6" />
          </View>
        )}

        {upcomingEvents.length > 0 && (
          <View className="mb-6">
            <View className="flex-row items-center px-4 mb-4">
              <TrendingUp size={20} color="#fdba74" />
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
                Événements Terminés
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
          <View className="items-center px-4 py-8">
            <Text className={`font-montserrat text-center ${
              currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Aucun événement trouvé
            </Text>
          </View>
        )}

        {/* Pagination */}
        <View className="px-4 pb-4">
          <View className="flex-row items-center justify-between">
            
            {page > 1 && <TouchableOpacity onPress={() => setPage(page - 1)} disabled={page === 1} className='px-4 py-2 border border-primary-500 rounded-xl'>
              <Text className={`font-montserrat-medium ${
                currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Page précédente</Text>
            </TouchableOpacity>}
            
            {page < lastPage && <TouchableOpacity onPress={() => setPage(page + 1)} disabled={page === lastPage} className='px-4 py-2 bg-primary-500 rounded-xl'>
              <Text className={`font-montserrat-medium ${
                currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Page suivante</Text>
            </TouchableOpacity>}

          </View>

          <Text className={`font-montserrat-medium mt-1 text-center ${
            currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Page {page} sur {lastPage}
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}