import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEventListener } from 'expo';
import { ArrowLeft, Maximize, Minimize, User } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { EventType } from '@/types';
import { getEventById, toggleFavorite } from '@/services/api';
import { useVideoPlayer, VideoView } from 'expo-video';

export default function LiveStreamScreen() {
const { id } = useLocalSearchParams<{ id: any }>();
  const router = useRouter();
  const { currentTheme, showNotification } = useApp();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [event, setEvent] = useState<EventType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<string | null>(null);

  useEffect(() => {
    const loadEvent = async () => {
      if (!id) return;
      
      try {
        const data = await getEventById(id);
        setEvent(data);
        
        const muxId = data.link.split('/').pop(); // Récupère uniquement l’ID
        const hlsUrl = `https://stream.mux.com/${muxId}.m3u8`;
        setVideoUrl(hlsUrl);
      } catch (error) {
        showNotification('Erreur de chargement de l\'evénément !', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  const player = useVideoPlayer(videoUrl || '', (player) => {
    player.loop = true;
    if(event?.is_paid && event?.is_live) player.play();
  });

  useEventListener(player, 'statusChange', ({ status, error }) => {
    setLoadingState(status);

    if (error) {
      console.error('Player error:', error);
      showNotification('Erreur de lecture de la vidéo', 'error');
    }
  });
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

  if (!event.is_paid) {
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

  const isLiveEvent = (event: EventType): boolean => {
    const isStarted = event?.is_started;
    const isLive = event?.is_live;

    return isStarted || isLive;
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
        {event?.link ? (
        <>
          <VideoView
            style={{ width: '100%', height: '100%' }}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
          />
          {!loadingState || loadingState === 'loading' && (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.3)',
              }}
              className='inset-0 absolute flex-1'
            >
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}
        </>
      ) : (
        <View style={{ width: '100%', height: 300, backgroundColor: '#111' }} />
      )}
        
        {/* Overlay Controls */}
        {/* <View className="absolute top-4 right-4 flex-row">
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
        </View> */}

        {/* Live Indicator */}
        {isLiveEvent(event) && (
          <View className="absolute top-8 left-4 bg-red-500 px-3 py-1 rounded-full flex-row items-center">
            <View className="w-2 h-2 bg-white rounded-full mr-2" />
            <Text className="text-white font-montserrat-bold text-xs">LIVE</Text>
          </View>
        )}

        {!isLiveEvent(event) && (
          <View className="absolute top-8 left-4 bg-gray-500 px-3 py-1 rounded-full flex-row items-center">
            <View className="w-2 h-2 bg-white rounded-full mr-2" />
            <Text className="text-white font-montserrat-bold text-xs">RÉDIFFUSION</Text>
          </View>
        )}
        
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
            <User size={16} color={'#22c55e'} />
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