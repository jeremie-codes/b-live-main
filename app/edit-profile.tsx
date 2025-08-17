import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Lock, Eye, EyeOff, Save, Trash2, Mail } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

export default function EditProfileScreen() {
  const { currentTheme, user, updateProfile, deleteAccount, showNotification } = useApp();
  const router = useRouter();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      showNotification('Le nom ne peut pas être vide', 'error');
      return;
    }

    if (password && password !== confirmPassword) {
      showNotification('Les mots de passe ne correspondent pas', 'error');
      return;
    }

    if (password && password.length < 6) {
      showNotification('Le mot de passe doit contenir au moins 6 caractères', 'error');
      return;
    }

    setIsLoading(true);
    const success = await updateProfile(name.trim(), email.trim(), password || undefined);
    setIsLoading(false);

    if (success) {
      router.back();
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Supprimer le compte',
      'Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible et vous perdrez tous vos événements achetés.',
      [
        {
          text: 'Annuler',
          style: 'cancel'
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            setIsDeletingAccount(true);
            const success = await deleteAccount();
            setIsDeletingAccount(false);
            
            if (success) {
              router.replace('/welcome');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
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
              Modifier le Profil
            </Text>
          </View>

          <View className="flex-1 px-6 py-8">
            {/* Profile Form */}
            <View className={`rounded-2xl p-6 mb-6 ${
              currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <Text className={`font-montserrat-bold text-xl mb-6 text-center ${
                currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Informations Personnelles
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
                    placeholder="Votre nom complet"
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

              {/* Email Display (Read-only) */}
              <View className="mb-6">
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
                    placeholder="Votre email"
                    placeholderTextColor={currentTheme === 'dark' ? '#6B7280' : '#9CA3AF'}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    autoCorrect={false}
                    className={`flex-1 ml-3 font-montserrat ${
                      currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                  />
                </View>
              </View>

              {/* Password Section */}
              <Text className={`font-montserrat-bold text-lg mb-4 ${
                currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Changer le Mot de Passe (Optionnel)
              </Text>

              {/* New Password Input */}
              <View className="mb-4">
                <Text className={`font-montserrat-medium mb-2 ${
                  currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Nouveau mot de passe
                </Text>
                <View className={`flex-row items-center px-4 py-3 rounded-xl border ${
                  currentTheme === 'dark' 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <Lock size={20} color={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                  <TextInput
                    placeholder="Laisser vide pour ne pas changer"
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
              {password.length > 0 && (
                <View className="mb-6">
                  <Text className={`font-montserrat-medium mb-2 ${
                    currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Confirmer le nouveau mot de passe
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
                      placeholder="Confirmez votre nouveau mot de passe"
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
              )}

              {/* Save Button */}
              <TouchableOpacity
                onPress={handleSave}
                disabled={isLoading || !name.trim() || (password.length > 0 && password !== confirmPassword)}
                className={`py-4 px-6 rounded-xl ${
                  isLoading || !name.trim() || (password.length > 0 && password !== confirmPassword)
                    ? 'bg-gray-400'
                    : 'bg-primary-500'
                }`}
              >
                <View className="flex-row items-center justify-center">
                  <Save size={20} color="#FFFFFF" />
                  <Text className="ml-2 font-montserrat-bold text-white text-lg">
                    {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Delete Account Section */}
            <View className={`rounded-2xl p-6 mt-6 ${
              currentTheme === 'dark' ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'
            }`}>
              <Text className={`font-montserrat-bold text-lg mb-4 ${
                currentTheme === 'dark' ? 'text-red-300' : 'text-red-700'
              }`}>
                Zone de Danger
              </Text>
              
              <Text className={`font-montserrat text-sm mb-4 ${
                currentTheme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`}>
                La suppression de votre compte est définitive. Vous perdrez tous vos événements achetés et vos données personnelles.
              </Text>

              <TouchableOpacity
                onPress={handleDeleteAccount}
                disabled={isDeletingAccount}
                className={`py-3 px-4 rounded-xl border ${
                  isDeletingAccount
                    ? 'bg-gray-400 border-gray-400'
                    : currentTheme === 'dark'
                    ? 'bg-red-800 border-red-700'
                    : 'bg-red-500 border-red-500'
                }`}
              >
                <View className="flex-row items-center justify-center">
                  <Trash2 size={18} color="#FFFFFF" />
                  <Text className="ml-2 font-montserrat-semibold text-white">
                    {isDeletingAccount ? 'Suppression...' : 'Supprimer mon compte'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}