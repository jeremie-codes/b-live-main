import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, ShoppingCart, User2 } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import MyEventCard from '@/components/MyEventCard';
import { EventType } from '@/types';
import { getFavorites, toggleFavorite } from '@/services/api';

export default function FavorisScreen() {
  const { currentTheme, user, favoriteRefreshKey, showNotification } = useApp();
  const [favoris, setFavorites] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const router = useRouter();
  
  const loadFavorites = async () => {
    try { 
      const data = await getFavorites();
      setFavorites(Array.isArray(data) ? data : [])
    } catch (error) {
      showNotification('Erreur lors du chargement de favoris', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [favoriteRefreshKey]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };
      
  if (isLoading) {
    return (
      <View className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size="large" color="#8b5cf6" />
        </View>
      </View>
    );
  }

  if (!user) {
    return (
      <View className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <View className="items-center justify-center flex-1 px-4">
          <User2 size={64} color={currentTheme === 'dark' ? '#4B5563' : '#9CA3AF'} />
          <Text className={`font-montserrat-bold text-xl mb-4 mt-4 ${
            currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Connexion requise
          </Text>
          <Text className={`font-montserrat text-center ${
            currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Veuillez vous connecter pour voir votre favoris
          </Text>

          <TouchableOpacity onPress={() => router.push('/login')} className='px-4 py-2 mt-4 bg-primary-500 rounded-xl'>
            <Text className={`font-montserrat-bold text-xl mb-1 ${
              currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Se connecter
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const unFavoris = async (eventId: number): Promise<boolean | void> => {
    await toggleFavorite(eventId, true);
    setFavorites((prevFavorites) => prevFavorites.filter((event) => event.id !== eventId));
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
        <View className="px-4 pt-4">
          <Text className={`font-montserrat-bold text-2xl mb-2 ${
            currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Mes favoris ❤️
          </Text>
          <Text className={`font-montserrat text-base mb-6 ${
            currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {favoris.length} événement(s) dans vos favoris
          </Text>
        </View>

        {favoris.length > 0 ? (
          <View className="px-4">
            {favoris.map((event) => (
              <MyEventCard
                key={event.id}
                event={event}
                favoris={true}
                unFavoris={unFavoris}
                onPress={() => router.push(`/event/${event.id}`)}
              />
            ))}
          </View>
        ) : (
          <View className="items-center px-4 py-12">
            <Heart size={64} color={currentTheme === 'dark' ? '#4B5563' : '#9CA3AF'} />
            <Text className={`font-montserrat-bold text-lg mb-2 mt-4 ${
              currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Favoris vide
            </Text>
            <Text className={`font-montserrat text-center mb-6 ${
              currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Ajoutez des événements à vos favoris pour les retrouver facilement
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/')}
              className="flex-row items-center px-6 py-3 bg-primary-500 rounded-xl"
            >
              <ShoppingCart size={20} color="#FFFFFF" />
              <Text className="ml-2 text-white font-montserrat-semibold">
                Découvrir les Événements
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}