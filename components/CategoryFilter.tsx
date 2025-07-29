import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { getCategories } from '@/services/api';
import { CategoryType } from '@/types';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const { currentTheme, showNotification } = useApp();
  const [categoryFilter, setCategoryFilter] = useState<CategoryType[]>([]);

  const loadEvents = async () => {
      try {
        const data = await getCategories();

        setCategoryFilter(Array.isArray(data) ? data : []);

      } catch (error) {
        showNotification('Chargement des événements échoué !', 'error');
      } 
    };
  
    useEffect(() => {
      loadEvents();
    }, []);

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      className="mb-4"
    >
      <View className="flex-row ">
        <TouchableOpacity
            key={'Tous'}
            onPress={() => onSelectCategory('Tous')}
            className={`mr-3 px-4 py-2 rounded-full ${
              selectedCategory === 'Tous'
                ? 'bg-yellow-500'
                : currentTheme === 'dark'
                ? 'bg-gray-700'
                : 'bg-gray-100'
            }`}
          >
            <Text className={`font-montserrat-medium text-sm ${
              selectedCategory === 'Tous'
                ? 'text-white'
                : currentTheme === 'dark'
                ? 'text-gray-300'
                : 'text-gray-700'
            }`}>
              {'Tous'}
            </Text>
          </TouchableOpacity>
        {categoryFilter.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => onSelectCategory(category.name)}
            className={`mr-3 px-4 py-2 rounded-full ${
              selectedCategory === category.name
                ? 'bg-yellow-500'
                : currentTheme === 'dark'
                ? 'bg-gray-700'
                : 'bg-gray-100'
            }`}
          >
            <Text className={`font-montserrat-medium text-sm ${
              selectedCategory === category.name
                ? 'text-white'
                : currentTheme === 'dark'
                ? 'text-gray-300'
                : 'text-gray-700'
            }`}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}