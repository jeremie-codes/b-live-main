import React from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { categories } from '@/data/events';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const { currentTheme } = useApp();

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      className="mb-4"
    >
      <View className="flex-row px-4">
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => onSelectCategory(category)}
            className={`mr-3 px-4 py-2 rounded-full ${
              selectedCategory === category
                ? 'bg-yellow-500'
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
  );
}