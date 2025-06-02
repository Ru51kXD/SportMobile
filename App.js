import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Импортируем экраны
import HomeScreen from './src/screens/HomeScreen';
import EventDetailsScreen from './src/screens/EventDetailsScreen';
import BookingsScreen from './src/screens/BookingsScreen';
import StatsScreen from './src/screens/StatsScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import CreateEventScreen from './src/screens/CreateEventScreen';
import SeatSelectionScreen from './src/screens/SeatSelectionScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import SupportScreen from './src/screens/SupportScreen';
import BonusScreen from './src/screens/BonusScreen';
import AuthScreen from './src/screens/AuthScreen';
// Следующие экраны будут созданы далее:
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import UserStorage from './src/data/UserStorage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Основная навигация с табами
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Bookings') {
            iconName = focused ? 'ticket' : 'ticket-outline';
          } else if (route.name === 'Create') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Главная',
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsScreen}
        options={{
          tabBarLabel: 'Билеты',
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateEventScreen}
        options={{
          tabBarLabel: 'Создать',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Профиль',
        }}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!UserStorage.getCurrentUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.setIsLoggedIn = setIsLoggedIn;
    // Автоматический вход
    (async () => {
      const ok = await UserStorage.loadFromStorage();
      setIsLoggedIn(!!ok);
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) return null;

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      {isLoggedIn ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
          <Stack.Screen name="SeatSelection" component={SeatSelectionScreen} />
          <Stack.Screen name="Payment" component={PaymentScreen} />
          <Stack.Screen name="Stats" component={StatsScreen} />
          <Stack.Screen name="Favorites" component={FavoritesScreen} />
          <Stack.Screen name="Support" component={SupportScreen} />
          <Stack.Screen name="Bonus" component={BonusScreen} />
        </Stack.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}
