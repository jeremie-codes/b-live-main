import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Users, DollarSign, Play, Clock } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { mockEvents } from '@/data/events';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { currentTheme, user, showNotification } = useApp();
  
  const event = mockEvents.find(e => e.id === parseInt(id as string));
  
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

  const isPurchased = user?.purchasedEvents.includes(event.id);
  
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

  const handleAccess = () => {
    if (isPurchased) {
      if (event.isLive) {
        router.push(`/live/${event.id}`);
      } else {
        showNotification('Événement pas encore commencé', 'info');
      }
    } else {
      router.push(`/payment/${event.id}`);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <View className={`flex-row items-center px-4 py-3 ${
        currentTheme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}>
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ArrowLeft size={24} color={currentTheme === 'dark' ? '#FFFFFF' : '#000000'} />
        </TouchableOpacity>
        <Text className={`font-montserrat-bold text-lg ${
          currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Détails de l'Événement
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Event Image */}
        <View className="relative">
          <Image
            source={{ uri: event.image }}
            className="w-full h-64"
            resizeMode="cover"
          />
          
          {event.isLive && (
            <View className="absolute top-4 left-4 bg-red-500 px-3 py-2 rounded-full flex-row items-center">
              <View className="w-2 h-2 bg-white rounded-full mr-2" />
              <Text className="text-white font-montserrat-bold text-sm">EN DIRECT</Text>
            </View>
          )}
          
          <View className="absolute top-4 right-4 bg-black/70 px-3 py-2 rounded-full">
            <Text className="text-white font-montserrat-medium text-sm">{event.category}</Text>
          </View>
        </View>

        <View className="p-6">
          {/* Title and Description */}
          <Text className={`font-montserrat-bold text-2xl mb-3 ${
            currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {event.title}
          </Text>
          
          <Text className={`font-montserrat text-base leading-6 mb-6 ${
            currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {event.description}
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
              <DollarSign size={20} color="#EAB308" />
              <Text className={`ml-3 font-montserrat-bold text-primary-500`}>
                {event.price.toFixed(2)}€
              </Text>
            </View>

            <View className="flex-row items-center">
              <Users size={20} color={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'} />
              <Text className={`ml-3 font-montserrat ${
                currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {Math.floor(Math.random() * 500) + 100} participants
              </Text>
            </View>
          </View>

          {/* Status and Action */}
          {isPurchased && (
            <View className={`rounded-xl p-4 mb-4 ${
              event.isLive ? 'bg-green-100 border border-green-200' : 'bg-blue-100 border border-blue-200'
            }`}>
              <Text className={`font-montserrat-semibold ${
                event.isLive ? 'text-green-800' : 'text-blue-800'
              }`}>
                {event.isLive ? '✅ Accès autorisé - En direct' : '📅 Accès autorisé - Programmé'}
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={handleAccess}
            className={`py-4 px-6 rounded-xl ${
              isPurchased 
                ? event.isLive 
                  ? 'bg-green-500' 
                  : 'bg-gray-400'
                : 'bg-primary-500'
            }`}
          >
            <View className="flex-row items-center justify-center">
              {isPurchased ? (
                event.isLive ? (
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
                    Acheter l'Accès - {event.price.toFixed(2)}€
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