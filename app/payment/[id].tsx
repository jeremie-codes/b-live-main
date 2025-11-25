import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Platform, TextInput, Modal, ActivityIndicator
  , ScrollView, KeyboardAvoidingView, Dimensions, Animated, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, Shield, Lock, Smartphone } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { getEventById, processPayment } from '@/services/api';
import { WebView } from 'react-native-webview';
import { EventType, EventPromos } from '@/types';
const { height } = Dimensions.get('window');

export default function PaymentScreen() {
  const { id } = useLocalSearchParams<{ id: any }>();
  const router = useRouter();
  const { currentTheme, showNotification } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [inProgress, setInProgress] = useState(false);
  const [event, setEvent] = useState<EventType | null>(null);
  const [isWebViewReady, setIsWebViewReady] = useState(false);

  const [promos, setPromos] = useState<EventPromos[]>([]);
  const [codepromoEntry, setCodepromoEntry] = useState<string | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile'>('card');
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const [paymentUrl, setPaymentUrl] = useState(null);    
  
  useEffect(() => {
    const loadEvent = async () => {
      if (!id) return;
      
      try {
        const data = await getEventById(id);
        setEvent(data);
        // console.log(parseFloat(data.price));
      } catch (error) {
        showNotification('Erreur de chargement de l\'evénément !', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  useEffect(() => {
    setPromos(event?.promos ?? [])
  }, [event])
  
  if (isLoading) {
    return (
      <View className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <View className="items-center justify-center flex-1">
            <ActivityIndicator size="large" color="#8b5cf6" />
        </View>
      </View>
    );
  }

  if (inProgress) {
    return (
      <View className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <View className="items-center justify-center flex-1">
            <ActivityIndicator size="large" color="#8b5cf6" />
            <Text className={`font-montserrat-bold text-xl ${
              currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              En attente de validation...
            </Text>
        </View>
      </View>
    );
  }

  const isLiveEvent = (event: EventType): boolean => {
    const isStarted = event?.is_started === true;
    const isLive = event?.is_live === true;

    return isStarted || isLive;
  };

  const isOldEvent = (event: EventType): boolean => {
    const eventDate = new Date(event.date);
    const now = new Date();

    const eventTime = eventDate.getTime();
    const nowTime = now.getTime();

    // On extrait uniquement la date sans l’heure
    const eventOnlyDate = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    const todayOnlyDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const isBeforeToday = eventOnlyDate < todayOnlyDate;
    const isTodayButPast = eventOnlyDate.getTime() === todayOnlyDate.getTime() && eventTime < nowTime;
    const isFinished = event?.is_finished === true;

    return isBeforeToday || isTodayButPast || isFinished;
  };
  
  if (!event) {
    return (
      <View className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <View className="items-center justify-center flex-1">
          <Text className={`font-montserrat-bold text-xl ${
            currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Événement non trouvé
          </Text>

          <TouchableOpacity 
            onPress={() => router.back()}
            className="px-6 py-3 mt-4 bg-primary-600 rounded-xl"
          >
            <Text className="text-white font-['Montserrat-SemiBold']">
              Revenir en arrière
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const redirectToEvent = () => {
    if (isLiveEvent(event) || isOldEvent(event)) {
      console.log('redirecting to live event');
      router.replace(`/event/${event.id}`);
    }
    else {
      console.log('redirecting to event details');
      router.replace(`/event/`);
    }

  }

  const handlePayment = async () => {
    if (!event) return;

    // Basic validation
    if (paymentMethod === 'mobile') {
      if (!mobileNumber) {
        showNotification('Veuillez saisir votre numéro de téléphone !', 'error');
        return;
      }
    }

    let amount = parseFloat(event.price);
    let currency = event.currency.toUpperCase();
    let promo_id = undefined;

    if (currency == "USD" && amount < 2) {
      showNotification('Vous ne pouvez pas reserver par carte avec moins de 2$', 'info')
      return
    }

    if (codepromoEntry) {
      const promoCode = promos.find(promo => promo.code == codepromoEntry);

      if (promoCode) {

        promo_id =  promoCode.id
        
        if (promoCode.type.toLowerCase() === 'amount' )
        {
          if (currency === 'USD' )
          {

            const resPercent = parseInt(promoCode.value_usd);
            amount = amount - resPercent;
            
          } else {

            const resPercent = parseInt(promoCode.value_cdf);
            amount = amount - resPercent;
          
          }

        } else
        {

          const resPercent = (amount * parseInt(promoCode.value_percentage)) / 100;
          amount = amount - resPercent;

        }
      }

      else {
        showNotification(`Code promo non trouvé !`, 'error');
        return;
      }

    }
    
    setIsProcessing(true);
    try {

      const paymentData = {
        event_id: event.id,
        amount,
        promo_id,
        currency,
        quantity: 1,
        type: paymentMethod,
        phone: paymentMethod == 'mobile' ? mobileNumber : undefined
      };

      const result = await processPayment(paymentData);
      
      if (paymentMethod == 'card') {
        setPaymentUrl(result.data.redirect.url)
        openModal()
      }
      else {
        setInProgress(true)
        setTimeout(() => {
          setInProgress(false);
          showNotification('Actualisez la page pour voir les changements !', 'info');
          redirectToEvent()
        }, 20000);
        
      }

      showNotification('Réservation en cours, veillez finaliser votre paiement !', 'success');
    } catch (error) {
      showNotification('Une erreur s\'est produit, Réservation échoué', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePhoneChange = (text: string) => {
    const digitsOnly = text.replace(/\D/g, '');
    setMobileNumber(digitsOnly);

    if (digitsOnly.length != 12 && !digitsOnly.startsWith('243') && digitsOnly != "" || digitsOnly.length == 12 && !digitsOnly.startsWith('243') && digitsOnly != "") {
      setError("Le numéro doit commencer par '243'");
    } else {
      setError('');
    }
  };

  const openModal = () => {
    setShowModal(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowModal(false));
  };

  return (
    <View className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <KeyboardAvoidingView
        className={`${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <StatusBar style="light" />

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

        <ScrollView showsVerticalScrollIndicator={false}>

          <View className="px-4 pt-6 ">
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
                {event.price} {event.currency}
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
                Paiement 100% sécurisé
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
                  Méthode de Paiement
                </Text>
              </View>

              <View className="space-y-4">
                

                  <View >
                    <View className="flex-row gap-4 mb-6">
                      <TouchableOpacity 
                        onPress={() => setPaymentMethod('card')}
                        className={`flex-1 p-4 rounded-xl flex-row items-center justify-center ${
                          paymentMethod === 'card' ? 'bg-primary-500' : 'bg-gray-900'
                        }`}
                      >
                        <CreditCard size={20} color={paymentMethod === 'card' ? '#fff' : 'gray'} className="mr-2" /> 
                        <Text className={`font-['Montserrat-SemiBold'] pl-1 ${
                          paymentMethod === 'card' ? 'text-white' : 'text-gray-300'
                        }`}>
                          Carte
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        onPress={() => setPaymentMethod('mobile')}
                        className={`flex-1 p-4 rounded-xl flex-row items-center justify-center ${
                          paymentMethod === 'mobile' ? 'bg-primary-500' : 'bg-gray-900'
                        }`}
                      >
                        <Smartphone size={20} color={paymentMethod === 'mobile' ? '#fff' : 'gray'} className="mr-2" />
                        <Text className={`font-['Montserrat-SemiBold'] ${
                          paymentMethod === 'mobile' ? 'text-white' : 'text-gray-300'
                        }`}>
                          Mobile
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Payment Form */}
                    {paymentMethod === 'card' ? (
                      <View className="gap-4 mb-8"></View>
                    ) : (
                      <View className="mb-8">
                        <Text className="text-white font-['Montserrat-Medium'] mb-2">Numéro de Téléphone</Text>
                        <TextInput
                          value={mobileNumber}
                          onChangeText={handlePhoneChange}
                          placeholder="Exemple : 243xxxxxxxxx"
                          placeholderTextColor="#6b7280"
                          maxLength={12}
                          className={`p-4 rounded-lg border font-montserrat ${
                            currentTheme === 'dark' 
                              ? 'bg-gray-700 border-gray-500 text-white' 
                              : 'bg-gray-50 border-gray-200 text-gray-900'
                          }`}
                          keyboardType="phone-pad"
                        />
                        {error ? (
                          <Text className="px-1 mt-1 text-sm text-red-500">{error}</Text>
                        ) : null}
                      </View>
                    )}

                    <View className="mb-8">
                      <Text className="text-white font-['Montserrat-Medium'] mb-2">Code Promo (Optionel)</Text>
                      <TextInput
                        value={codepromoEntry}
                        onChangeText={setCodepromoEntry}
                        placeholder="Entrer le code promo sinon laissez vide"
                        placeholderTextColor="#6b7280"
                        maxLength={12}
                        className={`p-4 rounded-lg border font-montserrat ${
                          currentTheme === 'dark' 
                            ? 'bg-gray-700 border-gray-500 text-white' 
                            : 'bg-gray-50 border-gray-200 text-gray-900'
                        }`}
                      />
                      {error ? (
                        <Text className="px-1 mt-1 text-sm text-red-500">{error}</Text>
                      ) : null}
                    </View>
                  </View>
                {/* </ScrollView> */}
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
                <Text className="ml-2 text-lg text-white font-montserrat-bold">
                  {isProcessing ? 'Traitement...' : `Payer ${event.price} ${event.currency}`}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

        </ScrollView>
        
        {paymentUrl && (
          <Modal transparent visible={showModal} animationType="none">
            <Pressable className="flex-1 bg-black/40" onPress={closeModal} />
            
            <Animated.View
              style={{ transform: [{ translateY: slideAnim }], height: height * 0.9 }}
              className="absolute bottom-0 w-full overflow-hidden bg-white rounded-t-2xl"
            >
              <View className="w-16 h-1.5 bg-gray-300 rounded-full self-center mt-2" />

              {/* Spinner pendant chargement */}
              {!isWebViewReady && (
                <View className="items-center justify-center flex-1 ">
                  <ActivityIndicator size="large" color="#000" />
                </View>
              )}

              {/* WebView seulement si prêt */}
              <WebView
                source={{ uri: paymentUrl }}
                className={`flex-1 ${isWebViewReady ? '' : 'hidden'}`}
                onLoadEnd={() => {
                  console.log('WebView loaded');
                  setIsWebViewReady(true);
                }}
                onNavigationStateChange={(navState) => {
                  const url = navState.url;

                  if (url.includes('/approve')) {
                    closeModal();
                    redirectToEvent();
                    showNotification("Paiement Approuvé !", 'success');
                  } else if (url.includes('/cancel')) {
                    closeModal();
                    showNotification("Paiement Annulé !", 'error');
                  } else if (url.includes('/decline')) {
                    closeModal();
                    showNotification("Paiement Refusé !", 'error');
                  }
                }}
              />

              
            </Animated.View>
          </Modal>
        )}

      </KeyboardAvoidingView>
    </View>
  );

}