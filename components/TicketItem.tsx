import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { Calendar, Clock } from 'lucide-react-native';
import { TicketType } from '@/types';
import { formatDate, formatTime } from '@/utils/formatters';
import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';

interface TicketItemProps {
  ticket: TicketType;
}

export default function TicketItem({ ticket }: TicketItemProps) {
  const [state, setState] = useState<string>('')
  const handlePress = () => {
    if (ticket.success) router.push(`/event/${ticket.event.id}`);
  };
  const { currentTheme } = useApp();

  const mediaUrl = ticket?.event?.media?.[1]?.original_url || ticket?.event?.media?.[0]?.original_url || null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paie. réussi':
        return 'bg-green-500/10 border-green-500';
      case 'en attente':
        return 'bg-yellow-500/10 border-yellow-500';
      case 'expiré':
        return 'bg-red-400/10 border-red-400';
      case 'échoué':
        return 'bg-red-500/10 border-red-500';
      default:
        return 'bg-gray-500/10 border-gray-500';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'paie. réussi':
        return 'text-green-500';
      case 'en attente':
        return 'text-yellow-400';
      case 'expiré':
        return 'text-red-400';
      case 'échoué':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  useEffect(() => {
    console.log(ticket)
    
    if ( ticket.success === null) {
      setState('en attente');
    } else if (ticket.success) {
      setState('paie. réussi');
    } else if (!ticket.success) {
      setState('échoué');
    } 
  }, [ticket])

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      className={`mb-4 rounded-xl overflow-hidden shadow-lg w-full ${
        currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}
      style={styles.card}
      key={ticket.id}
    >
      <View className={`p-2 border-b w-full ${
        currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-100'
      }`}>
        <View className="flex-row items-center">
          {mediaUrl ? (
            <View className={'w-32 h-28 bg-gray-900 rounded-lg overflow-hidden'} >
              <Image
                source={{ uri: mediaUrl }}
                className={'w-full h-full'}
                style={{ resizeMode: 'cover' }}
              />
            </View>
          ) : (
            <View className={'w-36 h-32 bg-gray-900'} />
          )}

          <View className='ml-2'>
            <View className="flex-row gap-3 justify-between items-center mb-3">
              <Text className="text-white font-['Montserrat-Bold'] text-lg">
                {ticket?.event?.title.slice(0, 13)}...
              </Text>

              <View className={`ml-1 px-3 py-1 rounded-full border ${getStatusColor(state)}`}>
                <Text className={`font-['Montserrat-Medium'] text-xs ${getStatusTextColor(state.toLowerCase())}`}>
                  {state.charAt(0).toUpperCase() + state.slice(1)}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center mb-2">
              <Calendar size={14} color={currentTheme === 'dark' ? '#d1d5db' : '#111827'} className="mr-2" />
              <Text className="text-gray-300 font-['Montserrat-Regular']">
                { ' ' + formatDate(ticket.event.date)}
              </Text>
            </View>

            <View className="flex-row items-center">
              <Clock size={14} color={currentTheme === 'dark' ? '#d1d5db' : '#111827'} className="mr-2" />
              <Text className="text-gray-300 font-['Montserrat-Regular']">
                { ' ' + formatTime(ticket.event.date)}
              </Text>
            </View>

          </View>
        </View>
      </View>

      <View className="px-4 py-1 flex-row justify-between items-center">
        <View>
          <Text className={`font-montserrat mt-1 ${
              currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-900'
            }`}>
            Ticket Réf
          </Text>
          <Text className={`font-montserrat-medium  mb-2 ${
              currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-900'
            }`}>
            #{ticket.reference}
          </Text>
        </View>

        <TouchableOpacity
          className={`px-4 py-2 rounded-lg border border-orange-400`}
          onPress={handlePress}
        >
          <Text className="text-orange-300 font-['Montserrat-SemiBold']">
            Voir l'événement
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});