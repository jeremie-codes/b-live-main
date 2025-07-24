import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, Shield, Lock } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { mockEvents } from '@/data/events';

export default function PaymentScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { currentTheme, user, setUser, showNotification } = useApp();
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const event = mockEvents.find(e => e.id === parseInt(id as string));
  
  if (!event) {
    return (
      <SafeAreaView className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <View className="flex-1 justify-center items-center">
          <Text className={`font-montserrat-bold text-xl ${
            currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Événement non trouvé
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handlePayment = async () => {
    if (!cardNumber || !expiryDate || !cvv || !name) {
      showNotification('Veuillez remplir tous les champs', 'error');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      if (user) {
        setUser({
          ...user,
          purchasedEvents: [...user.purchasedEvents, event.id]
        });
      }
      
      setIsProcessing(false);
      showNotification('Paiement réussi ! Accès autorisé', 'success');
      
      setTimeout(() => {
        if (event.isLive) {
          router.replace(`/live/${event.id}`);
        } else {
          router.replace('/my-events');
        }
      }, 1500);
    }, 2000);
  };

  return (
    <SafeAreaView className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <View className={`flex-row items-center px-4 py-3 ${
        currentTheme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}>
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ArrowLeft size={24} color={currentTheme === 'dark' ? '#FFFFFF' : '#000000'} />
        </TouchableOpacity>
        <Text className={`font-montserrat-bold text-lg ${
          currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Paiement Sécurisé
        </Text>
      </View>

      <View className="flex-1 px-4 pt-6">
        {/* Event Summary */}
        <View className={`rounded-xl p-4 mb-6 ${
          currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-sm`}>
          <Text className={`font-montserrat-bold text-lg mb-2 ${
            currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Récapitulatif
          </Text>
          <Text className={`font-montserrat-medium mb-1 ${
            currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {event.title}
          </Text>
          <Text className={`font-montserrat-bold text-xl text-primary-500`}>
            {event.price.toFixed(2)}€
          </Text>
        </View>

        {/* Security Notice */}
        <View className={`flex-row items-center p-4 mb-6 rounded-xl ${
          currentTheme === 'dark' ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'
        }`}>
          <Shield size={20} color="#10B981" />
          <Text className={`ml-3 font-montserrat text-sm ${
            currentTheme === 'dark' ? 'text-green-300' : 'text-green-700'
          }`}>
            Paiement 100% sécurisé et crypté
          </Text>
        </View>

        {/* Payment Form */}
        <View className={`rounded-xl p-4 ${
          currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-sm`}>
          <View className="flex-row items-center mb-4">
            <CreditCard size={20} color={currentTheme === 'dark' ? '#E5E7EB' : '#374151'} />
            <Text className={`ml-2 font-montserrat-bold text-lg ${
              currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Informations de Paiement
            </Text>
          </View>

          <View className="space-y-4">
            <View>
              <Text className={`font-montserrat-medium mb-2 ${
                currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Numéro de carte
              </Text>
              <TextInput
                placeholder="1234 5678 9012 3456"
                placeholderTextColor={currentTheme === 'dark' ? '#6B7280' : '#9CA3AF'}
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="numeric"
                maxLength={19}
                className={`p-4 rounded-lg border font-montserrat ${
                  currentTheme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              />
            </View>

            <View className="flex-row space-x-4">
              <View className="flex-1">
                <Text className={`font-montserrat-medium mb-2 ${
                  currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Date d'expiration
                </Text>
                <TextInput
                  placeholder="MM/AA"
                  placeholderTextColor={currentTheme === 'dark' ? '#6B7280' : '#9CA3AF'}
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                  maxLength={5}
                  className={`p-4 rounded-lg border font-montserrat ${
                    currentTheme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                />
              </View>

              <View className="flex-1">
                <Text className={`font-montserrat-medium mb-2 ${
                  currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  CVV
                </Text>
                <TextInput
                  placeholder="123"
                  placeholderTextColor={currentTheme === 'dark' ? '#6B7280' : '#9CA3AF'}
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                  className={`p-4 rounded-lg border font-montserrat ${
                    currentTheme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                />
              </View>
            </View>

            <View>
              <Text className={`font-montserrat-medium mb-2 ${
                currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Nom sur la carte
              </Text>
              <TextInput
                placeholder="Jean Dupont"
                placeholderTextColor={currentTheme === 'dark' ? '#6B7280' : '#9CA3AF'}
                value={name}
                onChangeText={setName}
                className={`p-4 rounded-lg border font-montserrat ${
                  currentTheme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              />
            </View>
          </View>
        </View>

        {/* Payment Button */}
        <TouchableOpacity
          onPress={handlePayment}
          disabled={isProcessing}
          className={`mx-4 mt-6 mb-8 py-4 px-6 rounded-xl ${
            isProcessing ? 'bg-gray-400' : 'bg-primary-500'
          }`}
        >
          <View className="flex-row items-center justify-center">
            <Lock size={20} color="#FFFFFF" />
            <Text className="ml-2 font-montserrat-bold text-white text-lg">
              {isProcessing ? 'Traitement...' : `Payer ${event.price.toFixed(2)}€`}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}