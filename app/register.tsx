import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, Play, User, ArrowLeft } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

export default function RegisterScreen() {
  const { currentTheme, register, isLoggedIn } = useApp();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (isLoggedIn) {
      router.replace('/(tabs)');
    }
  }, [isLoggedIn]);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    setIsLoading(true);
    const success = await register(name, email, password);
    setIsLoading(false);

    if (success) {
      router.replace('/(tabs)');
    }
  };

  const isFormValid = name.trim() && email.trim() && password.trim() && 
                     confirmPassword.trim() && password === confirmPassword;

  return (
    <SafeAreaView className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className={`flex-row items-center px-4 py-3 ${
            currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
          }`}>
            <TouchableOpacity onPress={() => router.back()} className="mr-3">
              <ArrowLeft size={24} color={currentTheme === 'dark' ? '#FFFFFF' : '#000000'} />
            </TouchableOpacity>
            <Text className={`font-montserrat-bold text-lg ${
              currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Inscription
            </Text>
          </View>

          <View className="flex-1 justify-center px-6 py-8">
            {/* Logo/Brand */}
            <View className="items-center mb-8">
              
              <Text className={`font-montserrat-bold text-3xl mb-2 ${
                currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Rejoignez B-Live
              </Text>
              <Text className={`font-montserrat text-center ${
                currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Créez votre compte pour accéder aux événements en direct
              </Text>
            </View>

            {/* Registration Form */}
            <View className={`rounded-2xl p-6 mb-6 ${
              currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <Text className={`font-montserrat-bold text-xl mb-6 text-center ${
                currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Créer un compte
              </Text>

              {/* Name Input */}
              <View className="mb-4">
                <Text className={`font-montserrat-medium mb-2 ${
                  currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Nom complet
                </Text>
                <View className={`flex-row items-center px-4 py-3 rounded-xl border ${
                  currentTheme === 'dark' 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <User size={20} color={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                  <TextInput
                    placeholder="Jean Dupont"
                    placeholderTextColor={currentTheme === 'dark' ? '#6B7280' : '#9CA3AF'}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    autoCorrect={false}
                    className={`flex-1 ml-3 font-montserrat ${
                      currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                  />
                </View>
              </View>

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
              <View className="mb-4">
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
                    placeholder="Minimum 6 caractères"
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

              {/* Confirm Password Input */}
              <View className="mb-6">
                <Text className={`font-montserrat-medium mb-2 ${
                  currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Confirmer le mot de passe
                </Text>
                <View className={`flex-row items-center px-4 py-3 rounded-xl border ${
                  currentTheme === 'dark' 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                } ${
                  confirmPassword && password !== confirmPassword 
                    ? 'border-red-500' 
                    : ''
                }`}>
                  <Lock size={20} color={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                  <TextInput
                    placeholder="Confirmez votre mot de passe"
                    placeholderTextColor={currentTheme === 'dark' ? '#6B7280' : '#9CA3AF'}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    className={`flex-1 ml-3 font-montserrat ${
                      currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="ml-2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                    ) : (
                      <Eye size={20} color={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                    )}
                  </TouchableOpacity>
                </View>
                {confirmPassword && password !== confirmPassword && (
                  <Text className="text-red-500 font-montserrat text-sm mt-1">
                    Les mots de passe ne correspondent pas
                  </Text>
                )}
              </View>

              {/* Register Button */}
              <TouchableOpacity
                onPress={handleRegister}
                disabled={isLoading || !isFormValid}
                className={`py-4 px-6 rounded-xl ${
                  isLoading || !isFormValid
                    ? 'bg-gray-400'
                    : 'bg-primary-500'
                }`}
              >
                <Text className="font-montserrat-bold text-white text-center text-lg">
                  {isLoading ? 'Inscription...' : 'Créer mon compte'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login Link */}
            <View className="items-center">
              <Text className={`font-montserrat mb-2 ${
                currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Vous avez déjà un compte ?
              </Text>
              <TouchableOpacity onPress={() => router.replace('/login')}>
                <Text className="font-montserrat-semibold text-primary-500">
                  Se connecter
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}