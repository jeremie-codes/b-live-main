                                      import React from 'react';import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Heart, ShoppingCart } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { mockEvents } from '@/data/events';
import EventCard from '@/components/EventCard';

export default function WishlistScreen() {
  const { currentTheme, user } = useApp();
  const router = useRouter();

  if (!user) {
    return (
      <SafeAreaView className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <View className="flex-1 justify-center items-center px-4">
          <Heart size={64} color={currentTheme === 'dark' ? '#4B5563' : '#9CA3AF'} />
          <Text className={`font-montserrat-bold text-xl mb-4 mt-4 ${
            currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Connexion requise
          </Text>
          <Text className={`font-montserrat text-center ${
            currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Veuillez vous connecter pour voir votre wishlist
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const wishlistEvents = mockEvents.filter(event => 
    user.wishlist.includes(event.id)
  );

  return (
    <SafeAreaView className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4">
          <Text className={`font-montserrat-bold text-2xl mb-2 ${
            currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Ma Wishlist ❤️
          </Text>
          <Text className={`font-montserrat text-base mb-6 ${
            currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {wishlistEvents.length} événement(s) dans votre wishlist
          </Text>
        </View>

        {wishlistEvents.length > 0 ? (
          <View className="px-4">
            {wishlistEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => router.push(`/event/${event.id}`)}
              />
            ))}
          </View>
        ) : (
          <View className="px-4 py-12 items-center">
            <Heart size={64} color={currentTheme === 'dark' ? '#4B5563' : '#9CA3AF'} />
            <Text className={`font-montserrat-bold text-lg mb-2 mt-4 ${
              currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Wishlist vide
            </Text>
            <Text className={`font-montserrat text-center mb-6 ${
              currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Ajoutez des événements à votre wishlist pour les retrouver facilement
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/')}
              className="bg-primary-500 px-6 py-3 rounded-xl flex-row items-center"
            >
              <ShoppingCart size={20} color="#FFFFFF" />
              <Text className="font-montserrat-semibold text-white ml-2">
                Découvrir les Événements
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}