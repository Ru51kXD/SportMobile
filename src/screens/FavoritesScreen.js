import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { worldEvents } from '../data/WorldEvents';

const { width } = Dimensions.get('window');

const FavoritesScreen = ({ route, navigation }) => {
  const { favoriteIds } = route.params || { favoriteIds: [] };
  const [favoriteEvents, setFavoriteEvents] = useState([]);

  useEffect(() => {
    // Фильтруем события, которые есть в избранном
    const favorites = worldEvents.filter(event => favoriteIds.includes(event.id));
    setFavoriteEvents(favorites);
  }, [favoriteIds]);

  const renderEventCard = (event) => (
    <TouchableOpacity
      key={event.id}
      style={styles.eventCard}
      onPress={() => navigation.navigate('EventDetails', { event })}
    >
      <LinearGradient
        colors={[event.sport_color || '#667eea', event.sport_color + '80' || '#764ba2']}
        style={styles.eventGradient}
      >
        <View style={styles.eventContent}>
          <View style={styles.eventHeader}>
            <Text style={styles.eventSport}>{event.sport}</Text>
            <Text style={styles.eventPrice}>{event.price.toLocaleString('ru-RU')} ₸</Text>
          </View>
          
          <Text style={styles.eventTitle} numberOfLines={2}>
            {event.title}
          </Text>
          
          <View style={styles.eventFooter}>
            <View style={styles.eventInfo}>
              <Ionicons name="calendar" size={16} color="white" />
              <Text style={styles.eventDate}>{event.date}</Text>
            </View>
            
            <View style={styles.eventInfo}>
              <Ionicons name="location" size={16} color="white" />
              <Text style={styles.eventLocation}>{event.location}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      {/* Header below notch */}
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Избранное</Text>
          
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {favoriteEvents.length > 0 ? (
          favoriteEvents.map(renderEventCard)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={64} color="#667eea" />
            <Text style={styles.emptyStateText}>
              У вас пока нет избранных событий
            </Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => navigation.navigate('MainTabs')}
            >
              <Text style={styles.browseButtonText}>Смотреть события</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerSafeArea: {
    backgroundColor: '#667eea',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 32 : 24,
    backgroundColor: '#667eea',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  eventCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventGradient: {
    padding: 16,
  },
  eventContent: {
    gap: 12,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventSport: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  eventPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    lineHeight: 24,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventDate: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  eventLocation: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#667eea',
    marginTop: 16,
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default FavoritesScreen; 