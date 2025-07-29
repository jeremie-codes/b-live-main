import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '@/contexts/AppContext';
import { EventType, CategoryType, WishlistItem } from '@/types';
import { API_URL } from '@/configs/index';


// Events functions
export const getEvents = async () => {

  try {
    const response = await axios.get(`${API_URL}/event/recents`);
    const { recentEvents } = response.data;
    // console.log(recentEvents)
    return recentEvents;
  } catch (error: any) {
    console.log(error.response?.data?.message || 'Register failed');
  }
};

// Events functions
export const getEventsPopular = async () => {
  // await delay(1000); // Simulate API delay
  // In a real app, this would be a GET request to the API
  // return mockEvents;
  try {

    const response = await axios.get(`${API_URL}/favorites/popular`);

    const { data } = response.data;

    return data;
  } catch (error: any) {
    console.log(error.response?.data?.message || 'Register failed');
  }
};

export const getEventById = async (id: string) => {
  // await delay(800); // Simulate API delay
  // In a real app, this would be a GET request to the API
   try {

    const response = await axios.get(`${API_URL}/events/${id}`);
    const event = response.data.data;
    // console.log(event)

    // const event = mockEvents.find(event => event.id === id);
    if (!event) {
      throw new Error('Evénement non trouvé !');
    }
    return event;
  } catch (error: any) {
    console.log(error.response?.data?.message || 'Loading failed');
  }
};

// Favorites functions
export const getFavorites = async () => {
  try {

    const response = await axios.get(`${API_URL}/favorites/list`);
    const { data } = response.data;

    return data.data;
  } catch (error: any) {
    console.log(error.response?.data?.message || 'Loading failed');
  }
};

export const toggleFavorite = async (eventId: number, isFavorite: boolean) => {
  // In a real app, this would be a POST request to the API
  try {
    let response;

    if (isFavorite) {
      response = await axios.post(`${API_URL}/favorites/remove/${eventId}`);
        const { event } = response.data.data;
        return { isFavorite: false }; 
    }

    response = await axios.post(`${API_URL}/favorites/add/${eventId}`);
    const { event } = response.data.data;
    return { isFavorite: true };   

  } catch (error: any) {
    console.log(error.response?.data?.message || 'Loading failed');
    throw new Error('Evénement non trouvé');
  }
};

// Categories functions
export const getCategories = async () => {

  try {

    const response = await axios.get(`${API_URL}/categories`);
    const { categories } = response.data;
    
    return categories;
  } catch (error: any) {
    console.log(error.response?.data?.message || 'Loading failed');
  }
};

// Tickets functions
export const getUserTickets = async () => {
  try {

    const response = await axios.get(`${API_URL}/tickets`);
    const { data } = response.data;
        
    return data.data;
  } catch (error: any) {
    console.log(error.response?.data?.message || 'Loading failed');
  }
};

export const getTicketById = async (id: string) => {
   try {

    const response = await axios.get(`${API_URL}/tickets/${id}`);
    const { data } = response.data;
    
    // console.log(data)
    
    return data;
  } catch (error: any) {
    console.log(error.response?.data?.message || 'Loading failed');
  }
};

// Payment function
export const processPayment = async (paymentData: any) => {
  // console.log(paymentData)
  try {
    const response = await axios.post(`${API_URL}/payTicket`, paymentData);
    const { data } = response;
    return { success: data.success, data };
  } catch (error: any) {
    console.log(error.response?.data || 'Payment failed');
    throw error;
  }
};

// Payment function
export const getPayToken = async () => {
  // console.log(paymentData)
  try {
    const response = await axios.get(`${API_URL}/token`);
    const { success, token } = response.data.data;
    // console.log(token)
    return { success, token };
  } catch (error: any) {
    console.log(error.response?.data || 'Get token Pay failed');
    throw error;
  }
};

