import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

export default function NotificationBanner() {
  const { notification, hideNotification, currentTheme } = useApp();
  const slideAnim = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (notification?.visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else if (notification && !notification.visible) {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [notification]);

  if (!notification) return null;

  const getIcon = () => {
    const iconProps = {
      size: 20,
      color: currentTheme === 'dark' ? '#FFFFFF' : '#1F2937'
    };

    switch (notification.type) {
      case 'success':
        return <CheckCircle {...iconProps} color="#10B981" />;
      case 'error':
        return <AlertCircle {...iconProps} color="#EF4444" />;
      default:
        return <Info {...iconProps} color="#3B82F6" />;
    }
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case 'success':
        return 'border-green-500';
      case 'error':
        return 'border-red-500';
      default:
        return 'border-blue-500';
    }
  };

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }],
        position: 'absolute',
        top: 50,
        left: 16,
        right: 16,
        zIndex: 1000,
      }}
      className={`${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'} 
                  rounded-lg border-l-4 ${getBorderColor()} 
                  shadow-lg flex-row items-center p-4`}
    >
      <View className="mr-3">
        {getIcon()}
      </View>
      
      <Text className={`flex-1 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} 
                        font-montserrat text-sm`}>
        {notification.message}
      </Text>
      
      <TouchableOpacity
        onPress={hideNotification}
        className="ml-3 p-1"
      >
        <X 
          size={18} 
          color={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'} 
        />
      </TouchableOpacity>
    </Animated.View>
  );
}