import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, Play } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

export default function LoginScreen() {
  const { currentTheme, login, isLoggedIn } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (isLoggedIn) {
      router.replace('/(tabs)');
    }
  }, [isLoggedIn]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      return;
    }

    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);

    if (success) {
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        // className="flex-1"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-1 justify-center px-6 pt-8">
            {/* Logo/Brand */}
            <View className="items-center mb-12">
              {/* Logo */}
              <View className={`w-24 h-24 rounded-full items-center justify-center mb-6 overflow-hidden ${
              currentTheme === 'dark' ? 'bg-primary-500/20' : 'bg-primary-500/10'
            }`}>
              <Image source={require('../assets/images/icon-app.png')} className='w-full h-full object-cover' />
            </View>
  
            {/* Title */}
            <Text className={`font-montserrat-bold text-4xl text-center mb-4 ${
              currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              B-Live
            </Text>
            <Text className={`font-montserrat text-center ${
              currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Découvrez les meilleurs événements en direct
            </Text>
          </View>

          {/* Login Form */}
          <View className={`rounded-2xl p-6 mb-6 ${
            currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <Text className={`font-montserrat-bold text-xl mb-6 text-center ${
              currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Connexion
            </Text>

            {/* Email Input */}
            <View className="mb-4">
              <Text className={`font-montserrat-medium mb-2 ${
                currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email
              </Text>
              <View className={`flex-row items-center px-4 py-3 rounded-xl border ${
                currentTheme === 'dark' 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <Mail size={20} color={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                <TextInput
                  placeholder="votre@email.com"
                  placeholderTextColor={currentTheme === 'dark' ? '#6B7280' : '#9CA3AF'}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  className={`flex-1 ml-3 font-montserrat ${
                    currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                />
              </View>
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className={`font-montserrat-medium mb-2 ${
                currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Mot de passe
              </Text>
              <View className={`flex-row items-center px-4 py-3 rounded-xl border ${
                currentTheme === 'dark' 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <Lock size={20} color={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                <TextInput
                  placeholder="Votre mot de passe"
                  placeholderTextColor={currentTheme === 'dark' ? '#6B7280' : '#9CA3AF'}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  className={`flex-1 ml-3 font-montserrat ${
                    currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="ml-2"
                >
                  {showPassword ? (
                    <EyeOff size={20} color={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                  ) : (
                    <Eye size={20} color={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading || !email.trim() || !password.trim()}
              className={`py-4 px-6 rounded-xl ${
                isLoading || !email.trim() || !password.trim()
                  ? 'bg-gray-400'
                  : 'bg-primary-500'
              }`}
            >
              <Text className="font-montserrat-bold text-white text-center text-lg">
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Register Link */}
          <View className="items-center">
            <Text className={`font-montserrat mb-2 ${
              currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Pas encore de compte ?
            </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text className="font-montserrat-semibold text-primary-500">
                Créer un compte
              </Text>
            </TouchableOpacity>
          </View>

          {/* Demo Credentials */}
          {/* <View className={`rounded-xl p-4 ${
            currentTheme === 'dark' ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'
          }`}>
            <Text className={`font-montserrat-bold text-sm mb-2 ${
              currentTheme === 'dark' ? 'text-blue-300' : 'text-blue-700'
            }`}>
              Compte de démonstration
            </Text>
            <Text className={`font-montserrat text-xs ${
              currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`}>
              Email : demo@example.com{'\n'}
              Mot de passe : demo123
            </Text>
          </View> */}
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}