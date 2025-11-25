import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, ShoppingCart, User2 } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import TicketItem from '@/components/TicketItem';
import PlaceHolder from '@/components/PlaceHolde';
import { TicketType } from '@/types';
import { getUserEvents } from '@/services/api';

export default function MyEventScreen() {
  const { currentTheme, user, showNotification } = useApp();
  const [myEvent, setMyEvents] = useState<TicketType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [lastPage, setLastPage] = useState<number>(0)
  const [hasMore, setHasMore] = useState<boolean>(false)
  const [refreshing, setRefreshing] = useState(false);
  
  const router = useRouter();
  
  const loadMyEvents = async (page: number | null) => {
    try { 
      setIsLoading(true);
      const data = await getUserEvents(page);
      setMyEvents(Array.isArray(data.data) ? data.data : [])
      setCurrentPage(data.current_page)
      setLastPage(data.last_page)
      setHasMore((data.has_more))
    } catch (error) {
      showNotification('Erreur lors du chargement de vos événement', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMyEvents(null);
  }, []);


  const onRefresh = async () => {
    setRefreshing(true);
    await loadMyEvents(null);
    setRefreshing(false);
  };
      
  if (isLoading) {
    return (
      <View className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <View className="px-4 pt-4">
          <Text className={`font-montserrat-bold text-2xl mb-2 ${
            currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Mes Événements
          </Text>
        </View>

        <View className="flex-1 px-4 pt-10">
          {['','',''].map((v, i)=> (<PlaceHolder key={i} />))}
        </View>

        <ActivityIndicator className='relative -top-6' size={'large'} />
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
            Veuillez vous connecter pour voir vos événements reservé(s)
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
            Mes Événements
          </Text>
          <Text className={`font-montserrat text-base mb-6 ${
            currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {myEvent.length} événement(s) reservé(s)
          </Text>
        </View>

        {myEvent.length > 0 ? (
          <View className="px-4">
            {myEvent.map((event) => (
              <View className="px4">
                <TicketItem key={event.id} ticket={event} />
              </View>
            ))}
          </View>
        ) : (
          <View className="items-center px-4 py-12">
            <Heart size={64} color={currentTheme === 'dark' ? '#4B5563' : '#9CA3AF'} />
            <Text className={`font-montserrat-bold text-lg mb-2 mt-4 ${
              currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Mes événement vide
            </Text>
            <Text className={`font-montserrat text-center mb-6 ${
              currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Reserver des événements pour les retrouver ici
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

        {lastPage > 1 && 
          <View className='flex-row items-center justify-center mb-4'>
            <TouchableOpacity
              className={`${currentPage != 1 ? 'border-orange-400/40': 'border-gray-600'} px-4 py-2 rounded-lg border `}
              disabled={currentPage == 1}
              onPress={()=> loadMyEvents(currentPage-1)}
            >
              <Text className={`${currentPage != 1 ? 'text-orange-300': 'text-gray-600'} font-['Montserrat-SemiBold']`}>
                Page reçente
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`${hasMore ? 'border-orange-400/40': 'border-gray-600'} px-4 py-2 rounded-lg border `}
              disabled={!hasMore}
              onPress={()=> loadMyEvents(currentPage+1)}
            >
              <Text className={`${hasMore ? 'text-orange-300': 'text-gray-600'} font-['Montserrat-SemiBold']`}>
                Page suivant
              </Text>
            </TouchableOpacity>
          </View>
        }

      </ScrollView>
    </View>
  );
}