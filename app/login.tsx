import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, Smartphone, Phone, RefreshCw, X, ArrowLeft } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

export default function LoginScreen() {
  const { currentTheme, login, isLoggedIn, loginOtp, resendOtp } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'mobile'>('email');
  const [isLoadingResendOtp, setIsLoadingResendOtp] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  // Redirect if already logged in
  React.useEffect(() => {
    if (isLoggedIn) {
      router.replace('/(tabs)');
    }
  }, [isLoggedIn]);

  const handleLogin = async () => {
    if (loginMethod === 'email' && (!email.trim() || !password.trim())) {
      return;
    }

    if (loginMethod === 'mobile' && !email.trim()) {
      return;
    }

    setIsLoading(true);
    const { success, redirect } = await login(email, password, loginMethod);
    setIsLoading(false);

    if (loginMethod === 'mobile') {
      
      if (redirect) {
        setIsOtpSent(true);
      } else {
        return;
      }

    } else if (loginMethod === 'email' && success && !redirect) {
      router.replace('/(tabs)');
    }
  };

  const handleResendOtp = async () => {
    setIsLoadingResendOtp(true);
    await resendOtp('login');
    setIsLoadingResendOtp(false);
  };
  
  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      return;
    }

    setIsLoading(true);
    const success = await loginOtp(otp);
    setIsLoading(false);

    if (success) {
      router.replace('/(tabs)');
    }
  };

  const isOtpValid = otp.trim().length === 6;

  const isPhoneValid = email.trim().length >= 12 && email.trim().length <= 13;

  return (
    <SafeAreaView className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        // className="flex-1"
      >
        <ScrollView showsVerticalScrollIndicator={false}>

          <View className={`flex-row items-center px-4 py-3 ${
              currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
            <TouchableOpacity onPress={() => router.back()} className="mr-3">
              <ArrowLeft size={24} color={currentTheme === 'dark' ? '#FFFFFF' : '#000000'} />
            </TouchableOpacity>
          </View>

          {!isOtpSent && (<View className="flex-1 justify-center px-6 pt-8">
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


          <View className={`rounded-2xl p-6 mb-6 ${
            currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            {/* Login Form */}
            <View className={`${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} gap-2 rounded-lg p-2 flex-row items-center justify-center mb-6`} >
              <Pressable
                onPress={() => setLoginMethod('email')}
                className={`flex-1 py-2 px-4 rounded-lg flex-row gap-2 items-center justify-center ${
                  loginMethod === 'email' ? 'bg-primary-500' : (currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white')
                }`}
              >
                <Mail size={20} color={currentTheme === 'dark' ? '#374151' : '#6B7280'} />
                <Text
                  className={`font-montserrat-semibold text-lg ${
                    loginMethod === 'email' ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  Email
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setLoginMethod('mobile')}
                className={`flex-1 py-2 px-4 rounded-lg flex-row gap-2 items-center justify-center ${
                  loginMethod === 'mobile' ? 'bg-primary-500' : 'bg-gray-800'
                }`}
              >
                <Smartphone size={20} color={currentTheme === 'dark' ? '#374151' : '#6B7280'} />
                <Text
                  className={`font-montserrat-semibold text-lg ${
                    loginMethod === 'mobile' ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  Phone
                </Text>
              </Pressable>
            </View>

            {loginMethod === 'email' && (
              /* Email Input */
              <View>

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
    
              </View>
            )}
            {loginMethod === 'mobile' && (
              /* Mobile Input */
              <View className="mb-4">
                  <Text className={`font-montserrat-medium mb-2 ${
                    currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Numéro de téléphone
                  </Text>
                  <View className={`flex-row items-center px-4 py-3 rounded-xl border ${
                    currentTheme === 'dark' 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <Phone size={20} color={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                    <TextInput
                      placeholder="234 xxx xxx xxx"
                      placeholderTextColor={currentTheme === 'dark' ? '#6B7280' : '#9CA3AF'}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="phone-pad"
                      autoCapitalize="none"
                      autoCorrect={false}
                      className={`flex-1 ml-3 font-montserrat ${
                        currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    />
                  </View>
              </View>
            )}

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading || (loginMethod === 'mobile' && !isPhoneValid) || (loginMethod === 'email' && !password.trim())}
              className={`py-4 px-6 rounded-xl ${
                isLoading || (loginMethod === 'mobile' && !isPhoneValid) || (loginMethod === 'email' && !password.trim())
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
          </View>)}

          {isOtpSent && (<View className="flex-1 justify-center px-6 pt-8">
            {/* Registration Form */}
            <View className={`rounded-2xl p-6 mb-6 ${
              currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <Text className={`font-montserrat-bold text-xl mb-6 text-center ${
                currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Vérification OTP
              </Text>

              {/* OTP Input */}
              <View className="mb-4">
                <Text className={`font-montserrat-medium mb-2 ${
                  currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Entrez le code OTP envoyé par SMS {`\n`} au : {email}
                </Text>
                <View className={`flex-row items-center px-4 py-3 rounded-xl border ${
                  currentTheme === 'dark' 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  
                  <TextInput
                    placeholder="Ex: 123456"
                    placeholderTextColor={currentTheme === 'dark' ? '#6B7280' : '#9CA3AF'}
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                    autoCorrect={false}
                    className={`flex-1 ml-3 font-montserrat ${
                      currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                  />
                </View>

                <View className='flex-row items-center justify-between'>
                  <TouchableOpacity
                    onPress={() => setIsOtpSent(false)}
                    className={`py-4 flex-row items-center`}
                  >
                    <X size={20} color={currentTheme === 'dark' ? '#ef4444' : '#ef4444'} />
                    <Text className={`font-montserrat-medium text-red-500`}>
                      Annuler
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleResendOtp}
                    className={`py-4 flex-row items-center`}
                  >
                    {!isLoadingResendOtp ? <RefreshCw size={20} color={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'} /> : <ActivityIndicator size={'small'} color={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'} />}
                    <Text className={`font-montserrat-medium ${
                      currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                      {isLoadingResendOtp ? 'Envoi en cours...' : 'Re-envoyer le code'}
                    </Text>
                  </TouchableOpacity>
                </View>
                
              </View>

              {/* Register Button */}
              <TouchableOpacity
                onPress={handleVerifyOtp}
                disabled={isLoading || !isOtpValid}
                className={`py-4 px-6 rounded-xl ${
                  isLoading || !isOtpValid
                    ? 'bg-gray-400'
                    : 'bg-primary-500'
                }`}
              >
                <Text className="font-montserrat-bold text-white text-center text-lg">
                  {isLoading ? 'Vérification...' : 'Vérifier'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}