import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import { ArrowLeft, Maximize, Minimize, User } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { EventType } from '@/types';
import { getEventById, toggleFavorite } from '@/services/api';

export default function LiveStreamScreen() {
const { id } = useLocalSearchParams<{ id: any }>();
  const router = useRouter();
  const { currentTheme, user, showNotification } = useApp();
  const [isFullscreen, setIsFullscreen] = useState(false);
  // const [viewerCount] = useState(Math.floor(Math.random() * 1000) + 200);
  const [event, setEvent] = useState<EventType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
   
  useEffect(() => {
    const loadEvent = async () => {
      if (!id) return;
      
      try {
        const data = await getEventById(id);
        setEvent(data);
      } catch (error) {
        showNotification('Erreur de chargement de l\'evénément !', 'error');
      } finally {
        setIsLoading(false);
      }
    };

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
 
  const { width, height } = Dimensions.get('window');
  
  if (!event) {
    return (
      <SafeAreaView className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <View className="flex-1 justify-center items-center">
          <Text className={`font-montserrat-bold text-xl ${
            currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Événement non trouvé
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (event.is_paid) {
    return (
      <SafeAreaView className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <View className="flex-1 justify-center items-center px-4">
          <Text className={`font-montserrat-bold text-xl mb-4 ${
            currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Accès non autorisé
          </Text>
          <Text className={`font-montserrat text-center mb-6 ${
            currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Vous devez acheter cet événement pour y accéder
          </Text>
          <TouchableOpacity
            onPress={() => router.replace(`/event/${event.id}`)}
            className="bg-primary-500 px-6 py-3 rounded-xl"
          >
            <Text className="font-montserrat-semibold text-white">
              Acheter l'Accès
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
  
  const videoHeight = isFullscreen ? height : 250;

  return (
    <SafeAreaView className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      {!isFullscreen && (
        <View className={`flex-row items-center px-4 py-3 ${
          currentTheme === 'dark' ? 'bg-gray-900' : 'bg-white'
        }`}>
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <ArrowLeft size={24} color={currentTheme === 'dark' ? '#FFFFFF' : '#000000'} />
          </TouchableOpacity>

          <Text className={`font-montserrat-bold text-lg ${
            currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Stream Live
          </Text>
        </View>
      )}

      {/* Video Player */}
      <View style={{ height: videoHeight }} className="relative">
        {event?.link  ? (
          <WebView
            source={{ uri: event?.link }}
            style={{ flex: 1 }}
            allowsFullscreenVideo
            mediaPlaybackRequiresUserAction={false}
          />
        ) : (
          <View className={'w-full h-64 bg-gray-900'} />
        )}
        
        {/* Overlay Controls */}
        <View className="absolute top-4 right-4 flex-row">
          <TouchableOpacity
            onPress={() => setIsFullscreen(!isFullscreen)}
            className="bg-black/50 p-2 rounded-lg mr-2"
          >
            {isFullscreen ? (
              <Minimize size={20} color="#FFFFFF" />
            ) : (
              <Maximize size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>

        {/* Live Indicator */}
        {isLiveEvent(event) && (
          <View className="absolute top-4 left-4 bg-red-500 px-3 py-1 rounded-full flex-row items-center">
            <View className="w-2 h-2 bg-white rounded-full mr-2" />
            <Text className="text-white font-montserrat-bold text-xs">LIVE</Text>
          </View>
        )}

        <View className="absolute top-4 left-4 bg-gray-500 px-3 py-1 rounded-full flex-row items-center">
          <View className="w-2 h-2 bg-white rounded-full mr-2" />
          <Text className="text-white font-montserrat-bold text-xs">RÉDIFFUSION</Text>
        </View>
        
      </View>

      {!isFullscreen && (
        <View className="flex-1 p-4">
          {/* Event Info */}
          <Text className={`font-montserrat-bold text-xl mb-2 ${
            currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {event.title}
          </Text>
          
          <View className="flex-row items-center mb-4">
            <User size={16} color={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'} />
            <Text className={`ml-2 font-montserrat text-sm ${
              currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Vous suivez en tant que spectateur
            </Text>
          </View>

          {/* Chat Placeholder */}
          <View className={`flex-1 rounded-xl p-4 ${
            currentTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
          }`}>
            

            <View className="flex-1 justify-center items-center">

              <Text className={`font-montserrat text-center mt-4 ${
                currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Profitez de vos moments des lives en direct
              </Text>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}