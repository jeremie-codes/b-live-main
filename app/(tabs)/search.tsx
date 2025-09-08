import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { getEvents } from '@/services/api';
import EventCard from '@/components/EventCard';
import { EventType } from '@/types';
import CategoryFilter from '@/components/CategoryFilter';

export default function SearchScreen() {
  const { currentTheme, showNotification } = useApp();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<EventType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [dateFilter, setDateFilter] = useState('Tous');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [lastPage, setLastPage] = useState(1);
  const [page, setPage] = useState(1);

  const isLiveEvent = (event: EventType): boolean => {
    const isStarted = event?.is_started === true;
    const isLive = event?.is_live === true;

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
    const isFinished = event?.is_finished === true;

    return isBeforeToday || isTodayButPast || isFinished;
  };
  
  const filteredEvents = data.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || event.category.name === selectedCategory;
    const matchesDate = dateFilter === 'Tous' || 
                       (dateFilter === 'Live' && isLiveEvent(event)) ||
                       (dateFilter === 'À venir' && isUpcomingEvent(event))||
                       (dateFilter === 'Passé' && isOldEvent(event));

    return matchesSearch && matchesCategory && matchesDate;
  });
  
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
    loadEvents();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadEvents();
  };

  return (
    <SafeAreaView className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <View className="px-4 pt-4">
        <Text className={`font-montserrat-bold text-2xl mb-6 ${
          currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Recherche
        </Text>

        {/* Search Bar */}
        <View className={`flex-row items-center mb-4 px-4 py-3 rounded-xl ${
          currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-sm`}>
          <Search size={20} color={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'} />
          <TextInput
            placeholder="Rechercher un événement..."
            placeholderTextColor={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            className={`flex-1 ml-3 font-montserrat text-base ${
              currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          />
        </View>

        {/* Filters */}
        {/* <View className="flex-row mb-4 border border-gray-200 "> */}
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />  
        {/* </View> */}

        {/* Date Filter */}
        <View className="flex-row mb-6">
          {['Tous', 'Live', 'À venir', 'Passé'].map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setDateFilter(filter)}
              className={`mr-3 px-4 py-2 rounded-full border ${
                dateFilter === filter
                  ? 'bg-primary-500 border-primary-500'
                  : currentTheme === 'dark'
                  ? 'border-gray-600 bg-gray-800'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <Text className={`font-montserrat-medium text-sm ${
                dateFilter === filter
                  ? 'text-white'
                  : currentTheme === 'dark'
                  ? 'text-gray-300'
                  : 'text-gray-700'
              }`}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#8b5cf6"
            colors={["#8b5cf6"]}
          />
        }>
        <View className="px-4">
          <Text className={`font-montserrat-medium text-sm mb-4 ${
            currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {filteredEvents.length} événement(s) trouvé(s)
          </Text>
          
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() => router.push(`/event/${event.id}`)}
            />
          ))}

          {isLoading && (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#8b5cf6" />
            </View>
          )}

          {filteredEvents.length === 0 && (
            <View className="py-8 items-center">
              <Text className={`font-montserrat text-center ${
                currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Aucun événement trouvé pour ces critères
              </Text>
            </View>
          )}

          {/* Pagination */}
          <View className="px-4 pb-4">
            <View className="flex-row items-center justify-between">
              
              {page > 1 && <TouchableOpacity onPress={() => setPage(page - 1)} disabled={page === 1} className='border-primary-500 border py-2 px-4 rounded-xl'>
                <Text className={`font-montserrat-medium ${
                  currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Page précédente</Text>
              </TouchableOpacity>}
              
              {page < lastPage && <TouchableOpacity onPress={() => setPage(page + 1)} disabled={page === lastPage} className='bg-primary-500 py-2 px-4 rounded-xl'>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}