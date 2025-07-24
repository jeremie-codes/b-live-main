import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { mockEvents, categories } from '@/data/events';
import EventCard from '@/components/EventCard';

export default function SearchScreen() {
  const { currentTheme } = useApp();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [dateFilter, setDateFilter] = useState('Tous');

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || event.category === selectedCategory;
    const matchesDate = dateFilter === 'Tous' || 
                       (dateFilter === 'Live' && event.isLive) ||
                       (dateFilter === 'À venir' && !event.isLive);
    
    return matchesSearch && matchesCategory && matchesDate;
  });

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
        <View className="flex-row mb-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1">
            <View className="flex-row">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  className={`mr-3 px-4 py-2 rounded-full ${
                    selectedCategory === category
                      ? 'bg-primary-500'
                      : currentTheme === 'dark'
                      ? 'bg-gray-700'
                      : 'bg-gray-100'
                  }`}
                >
                  <Text className={`font-montserrat-medium text-sm ${
                    selectedCategory === category
                      ? 'text-white'
                      : currentTheme === 'dark'
                      ? 'text-gray-300'
                      : 'text-gray-700'
                  }`}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Date Filter */}
        <View className="flex-row mb-6">
          {['Tous', 'Live', 'À venir'].map((filter) => (
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

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
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

          {filteredEvents.length === 0 && (
            <View className="py-8 items-center">
              <Text className={`font-montserrat text-center ${
                currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Aucun événement trouvé pour ces critères
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}