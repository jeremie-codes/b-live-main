import { useEffect } from 'react';
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
import { AppProvider } from '@/contexts/AppContext';
import { SplashScreen } from 'expo-router';
import NotificationBanner from '@/components/NotificationBanner';
import { useApp } from '@/contexts/AppContext';
import '../global.css';

function RootLayoutNav() {
  const { isLoggedIn } = useApp();

  return (
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
        redirect={!isLoggedIn}
      />
      <Stack.Screen name="event/[id]" redirect={!isLoggedIn} />
      <Stack.Screen name="payment/[id]" redirect={!isLoggedIn} />
      <Stack.Screen name="live/[id]" redirect={!isLoggedIn} />
      <Stack.Screen name="+not-found" />
    </Stack>
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