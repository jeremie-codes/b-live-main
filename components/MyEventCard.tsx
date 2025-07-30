import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Calendar, Tag, Heart } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { EventType } from '@/types';

interface EventCardProps {
  event: EventType;
  paid?: string;
  favoris?: boolean | undefined | string;
  unFavoris?: (id: number) => void | boolean;
  onPress?: () => void;
}

export default function EventCard({ event, onPress, favoris, unFavoris, paid }: EventCardProps) {
  const { currentTheme } = useApp();
  
  const mediaUrl = event?.media?.[1]?.original_url || event?.media?.[0]?.original_url || null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isLiveEvent = (event: EventType): boolean => {
    const isStarted = event?.is_started === 1;
    const isLive = event?.is_live === 1;

    return isStarted || isLive;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`mb-4 rounded-xl overflow-hidden shadow-lg flex-row justify-between ${
        currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <View className="relative justify-center">
          {mediaUrl ? (
            <View className={'w-32 h-28 bg-gray-900 rounded-lg overflow-hidden'} >
              <Image
                source={{ uri: mediaUrl }}
                className={'w-full h-full'}
                style={{ resizeMode: 'cover' }}
              />
            </View>
          ) : (
            <View className={'w-36 h-32 bg-gray-900'} />
          )}

        {isLiveEvent(event) && (
          <View className="absolute top-3 left-3 bg-red-500 px-3 py-1 rounded-full flex-row items-center">
            <View className="w-2 h-2 bg-white rounded-full mr-2" />
            <Text className="text-white font-montserrat-semibold text-xs">EN DIRECT</Text>
          </View>
        )}

        {favoris && (
          <TouchableOpacity className="absolute bottom-3 right-3 bg-white p-1 rounded-full" onPress={() => unFavoris ? unFavoris(event.id) : {}}>
            <Heart size={18} color="#FF0000" fill={'#FF0000'} />
          </TouchableOpacity>
        )}
      </View>
      
      <View className="p-4">

        {paid && 
          <Text className={`font-montserrat-bold text-lg mb-2 ${
            currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {paid}
        </Text>}

        <Text className={`font-montserrat-bold text-lg mb-2 ${
          currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {event.title}
        </Text>
      
        <View className="flex-row items-center gap-1">
          <Tag 
            size={16} 
            color={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'} 
          />
          <Text className={`ml-1 mr-1 font-montserrat text-sm ${
            currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {event?.category?.name}
          </Text>

          <Calendar 
            size={16} 
            color={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'} 
          />
          <Text className={`ml-2 font-montserrat text-sm ${
            currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {formatDate(event.date)}
          </Text>
        </View>
        
        <View className="flex-row justify-between items-center">

          <Text className={`font-montserrat text-sm mb-3 mt-2 ${
            currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`} numberOfLines={2}>
            {event?.description ? event.description.slice(0, 10) + '...' : ''}
          </Text>
          
          <Text className="ml-1 font-montserrat-bold text-primary-500">
            {event.price} {event.currency}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}