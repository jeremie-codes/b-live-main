import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
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
      <View className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <View className="items-center justify-center flex-1">
            <ActivityIndicator size="large" color="#8b5cf6" />
        </View>
      </View>
    );
  }
 
  const { width, height } = Dimensions.get('window');
  
  if (!event) {
    return (
      <View className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <View className="items-center justify-center flex-1">
          <Text className={`font-montserrat-bold text-xl ${
            currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Événement non trouvé
          </Text>
        </View>
      </View>
    );
  }

  if (!event.is_paid) {
    return (
      <View className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <View className="items-center justify-center flex-1 px-4">
          <Text className={`font-montserrat-bold text-xl mb-4 ${
            currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Accès non autorisé
          </Text>
          <Text className={`font-montserrat text-center mb-6 ${
            currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Vous devez reserver cet événement pour y accéder
          </Text>
          <TouchableOpacity
            onPress={() => router.replace(`/event/${event.id}`)}
            className="px-6 py-3 bg-primary-500 rounded-xl"
          >
            <Text className="text-white font-montserrat-semibold">
              Reserver l'Accès
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const isLiveEvent = (event: EventType): boolean => {
    const isStarted = event?.is_started;
    const isLive = event?.is_live;

    return isStarted || isLive;
  };
  
  const videoHeight = isFullscreen ? height : 250;

  return (
    <View className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
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
      <View style={{ height: videoHeight }} className="relative flex-row items-center justify-center flex-1">
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
              className='absolute inset-0 flex-1'
            >
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}
        </>
        ) : (
          <View style={{ width: '100%', height: 300, backgroundColor: '#111' }} />
        )}
        
        {/* Overlay Controls */}

        {/* Live Indicator */}
        {isLiveEvent(event) && (
          <View className="absolute flex-row items-center px-3 py-1 bg-red-500 rounded-full top-8 left-4">
            <View className="w-2 h-2 mr-2 bg-white rounded-full" />
            <Text className="text-xs text-white font-montserrat-bold">LIVE</Text>
          </View>
        )}

        {!isLiveEvent(event) && (
          <View className="absolute flex-row items-center px-3 py-1 bg-gray-500 rounded-full top-8 left-4">
            <View className="w-2 h-2 mr-2 bg-white rounded-full" />
            <Text className="text-xs text-white font-montserrat-bold">RÉDIFFUSION</Text>
          </View>
        )}
        
      </View>

      <View className="p-4 h-36">
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
            
        </View>
    </View>
  );
}