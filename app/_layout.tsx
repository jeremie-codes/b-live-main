import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import { 
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold
} from '@expo-google-fonts/montserrat';
import { AppProvider, useApp } from '@/contexts/AppContext';
import { SplashScreen } from 'expo-router';
import NotificationBanner from '@/components/NotificationBanner';
import '../global.css';
import { SafeAreaView } from 'react-native-safe-area-context';

function RootLayoutNav() {
const { currentTheme} = useApp();

  return (
    <SafeAreaView className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="welcome" 
          options={{ 
            headerShown: false,
            gestureEnabled: false 
          }} 
        />
        <Stack.Screen 
          name="login" 
          options={{ 
            headerShown: false,
            gestureEnabled: true 
          }} 
        />
        <Stack.Screen 
          name="register" 
          options={{ 
            headerShown: false,
            gestureEnabled: true 
          }} 
        />
        <Stack.Screen 
          name="edit-profile" 
          options={{ 
            headerShown: false,
            gestureEnabled: true 
          }}
        />
        <Stack.Screen 
          name="(tabs)" 
        
        />
        <Stack.Screen name="event/[id]" 
          
        />
        <Stack.Screen name="payment/[id]" />
        <Stack.Screen name="live/[id]" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </SafeAreaView>
  );
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Montserrat-Regular': Montserrat_400Regular,
    'Montserrat-Medium': Montserrat_500Medium,
    'Montserrat-SemiBold': Montserrat_600SemiBold,
    'Montserrat-Bold': Montserrat_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AppProvider>
      <RootLayoutNav />
      <NotificationBanner />
      <StatusBar style="auto" />
    </AppProvider>
  );
}