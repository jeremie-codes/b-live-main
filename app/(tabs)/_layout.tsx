import { Tabs } from 'expo-router';
import { Chrome as Home, Search, User, Calendar, Heart } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

export default function TabLayout() {
  const { currentTheme } = useApp();

  const tabBarStyle = {
    backgroundColor: currentTheme === 'dark' ? '#1F2937' : '#FFFFFF',
    borderTopColor: currentTheme === 'dark' ? '#374151' : '#E5E7EB',
    paddingBottom: 8,
    paddingTop: 8,
    height: 64,
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: '#fdba74',
        tabBarInactiveTintColor: currentTheme === 'dark' ? '#9CA3AF' : '#6B7280',
        tabBarLabelStyle: {
          fontFamily: 'Montserrat-Medium',
          fontSize: 11,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Recherche',
          tabBarIcon: ({ size, color }) => (
            <Search size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: 'Wishlist',
          tabBarIcon: ({ size, color }) => (
            <Heart size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-events"
        options={{
          title: 'Mes Événements',
          tabBarIcon: ({ size, color }) => (
            <Calendar size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}