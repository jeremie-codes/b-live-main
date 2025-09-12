import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Users, DollarSign, Play, Clock, Heart } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { getEventById, toggleFavorite } from '@/services/api';
import { EventType } from '@/types';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: any }>();
  const router = useRouter();
  const { currentTheme, user, showNotification, triggerAddToFavoriteRefresh } = useApp();
  const [event, setEvent] = useState<EventType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const loadEvent = async () => {
    if (!id) return;
    
    try {
      const data = await getEventById(id);
      setEvent(data);
      setIsFavorite(data.is_favorite);
    } catch (error) {
      showNotification('Erreur de chargement de l\'evénément !', 'error');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEvent();
  }, [id]);

  if (isLoading) {
    return (
      <SafeAreaView className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#8b5cf6" />
        </View>
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <View className="flex-1 justify-center items-center">
          <Text className={`font-montserrat-bold text-xl ${
            currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Événement non trouvé
          </Text>

          <TouchableOpacity 
            onPress={() => router.back()}
            className="mt-4 bg-primary-600 px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-['Montserrat-SemiBold']">
              Revenir en arrière
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isPurchased = event?.is_paid || null
  
  const mediaUrl = event?.media?.[1]?.original_url || event?.media?.[0]?.original_url || null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isLiveEvent = (event: EventType): boolean => {
    const isStarted = event?.is_started;
    const isLive = event?.is_live;

    return isStarted || isLive;
    // return true;
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

  const handleAccess = () => {
    if (!user) {
      showNotification('Veuillez vous connecter pour reserver cet événement', 'error');
      return;
    }

    if (isPurchased) {
      if (isLiveEvent(event) || isOldEvent(event)) {
        router.push(`/live/${event.id}`);
      } else {
        showNotification('Événement pas encore commencé', 'info');
      }
    } else {
      router.push(`/payment/${event.id}`);
    }
  };
  
  const handleFavoriteToggle = async () => {
    if (!user) {
      showNotification('Veuillez vous connecter pour utiliser la Favorite', 'error');
      return;
    }

    setIsTogglingFavorite(true);
    try {
      const result = await toggleFavorite(event.id, isInFavorite);
      setIsFavorite(result.isFavorite);
      showNotification(
        result.isFavorite ? 'Évenément ajouté dans la list de souhait' : 'Évenément supprimer dans la list de souhait',
        'success'
      );
      triggerAddToFavoriteRefresh();
    } catch (error) {
      showNotification('Error de mise à jour des souhaits', 'error');
    } finally {
      setIsTogglingFavorite(false);
    }

  };

  const onRefresh = () => {
    setRefreshing(true);
    loadEvent();
  };

  return (
    <SafeAreaView className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <View className={`flex-row items-center px-4 py-5 ${
        currentTheme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}>
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ArrowLeft size={24} color={currentTheme === 'dark' ? '#FFFFFF' : '#000000'} />
        </TouchableOpacity>
        <Text className={`font-montserrat-bold text-lg flex-1 ${
          currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Détails de l'Événement
        </Text>
        <TouchableOpacity
          onPress={handleFavoriteToggle}
          disabled={isTogglingFavorite}
          className="ml-3"
        >
          {isTogglingFavorite ? (
            <ActivityIndicator size="small" color="#8b5cf6" />
          ) : (
            <Heart 
              size={24} 
              color={isInFavorite ? '#EF4444' : (currentTheme === 'dark' ? '#6B7280' : '#9CA3AF')}
              fill={isInFavorite ? '#EF4444' : 'transparent'}
            />
          )}
  
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#8b5cf6"
            colors={["#8b5cf6"]}
          />
        }>
        {/* Event Image */}
        <View className="relative">
          {mediaUrl ? (
            <Image
              source={{ uri: mediaUrl }}
              className={'w-full h-64'}
              style={{ resizeMode: 'cover' }}
            />
          ) : (
            <View className={'w-full h-64 bg-gray-900'} />
          )}
          
          {isLiveEvent(event) && (
            <View className="absolute top-4 left-4 bg-red-500 px-3 py-2 rounded-full flex-row items-center">
              <View className="w-2 h-2 bg-white rounded-full mr-2" />
              <Text className="text-white font-montserrat-bold text-sm">EN DIRECT</Text>
            </View>
          )}
          
          <View className="absolute top-4 right-4 bg-black/70 px-3 py-2 rounded-full">
            <Text className="text-white font-montserrat-medium text-sm">{event?.category?.name}</Text>
          </View>
        </View>

        <View className="p-6">
          {/* Title and Description */}
          <Text className={`font-montserrat-bold text-2xl mb-3 ${
            currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {event?.title}
          </Text>
          
          <Text className={`font-montserrat text-base leading-6 mb-6 ${
            currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {event?.description}
          </Text>

          {/* Event Info */}
          <View className={`rounded-xl p-4 mb-6 ${
            currentTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
          }`}>
            <View className="flex-row items-center mb-3">
              <Calendar size={20} color={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'} />
              <Text className={`ml-3 font-montserrat ${
                currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {formatDate(event.date)}
              </Text>
            </View>
            
            <View className="flex-row items-center mb-3">
              <DollarSign size={20} color="#fdba74" />
              <Text className={`ml-3 font-montserrat-bold text-primary-500`}>
                {event.price} {event.currency}
              </Text>
            </View>

            <View className="flex-row items-center">
              <Users size={20} color={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'} />
              <Text className={`ml-3 font-montserrat ${
                currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Rejoignez d'autres participants
              </Text>
            </View>
          </View>

          {/* Status and Action */}
          {isPurchased && (
            <View className={`rounded-xl p-4 mb-4 ${
              isLiveEvent(event) || isOldEvent(event) ? 'bg-green-100 border border-green-200' : 'bg-blue-100 border border-blue-200'
            }`}>
              <Text className={`font-montserrat-semibold ${
                isLiveEvent(event) || isOldEvent(event) ? 'text-green-800' : 'text-blue-800'
              }`}>
                {isLiveEvent(event) || isOldEvent(event) ? '✅ Accès autorisé - En direct' : '📅 Accès autorisé - Programmé'}
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={handleAccess}
            className={`py-4 px-6 rounded-xl ${
              isPurchased 
                ? isLiveEvent(event) || isOldEvent(event)
                  ? 'bg-green-500' 
                  : 'bg-gray-400'
                : 'bg-primary-500'
            }`}
          >
            <View className="flex-row items-center justify-center">
              {isPurchased ? (
                isLiveEvent(event) || isOldEvent(event) ? (
                  <>
                    <Play size={20} color="#FFFFFF" />
                    <Text className="ml-2 font-montserrat-bold text-white text-lg">
                      Regarder Maintenant
                    </Text>
                  </>
                ) : (
                  <>
                    <Clock size={20} color="#FFFFFF" />
                    <Text className="ml-2 font-montserrat-bold text-white text-lg">
                      Bientôt Disponible
                    </Text>
                  </>
                )
              ) : (
                <>
                  <DollarSign size={20} color="#FFFFFF" />
                  <Text className="ml-2 font-montserrat-bold text-white text-lg">
                    Reserver l'Accès - {event.price} {event.currency}
                  </Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}