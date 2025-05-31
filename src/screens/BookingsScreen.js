import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Простое хранилище бронирований
const mockBookings = [
  {
    id: 1,
    event_title: 'UFC 301: Pereira vs Prochazka',
    date: '2024-06-29',
    time: '20:00',
    venue: 'T-Mobile Arena, Las Vegas',
    user_name: 'Александр Петров',
    user_email: 'user@example.com',
    tickets_count: 2,
    total_price: 150000,
    status: 'confirmed',
    booking_date: '2024-06-15',
    sport_color: '#C8102E',
    sport_name: 'UFC'
  },
  {
    id: 2,
    event_title: 'NBA Finals 2024: Game 7',
    date: '2024-06-21',
    time: '21:00',
    venue: 'Chase Center, San Francisco',
    user_name: 'Мария Иванова',
    user_email: 'maria@example.com',
    tickets_count: 1,
    total_price: 225000,
    status: 'pending',
    booking_date: '2024-06-10',
    sport_color: '#1D428A',
    sport_name: 'NBA'
  }
];

const BookingsScreen = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      // Симуляция загрузки данных
      setTimeout(() => {
        setBookings(mockBookings);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading bookings:', error);
      setBookings([]);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    return timeString ? timeString.slice(0, 5) : '00:00';
  };

  const formatPrice = (price) => {
    return `${price.toLocaleString('ru-RU')} ₸`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'cancelled':
        return '#f44336';
      default:
        return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Подтверждено';
      case 'pending':
        return 'Ожидает';
      case 'cancelled':
        return 'Отменено';
      default:
        return status;
    }
  };

  const BookingCard = ({ booking, index }) => {
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const slideAnim = React.useRef(new Animated.Value(50)).current;

    React.useEffect(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          delay: index * 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          delay: index * 150,
          useNativeDriver: true,
        })
      ]).start();
    }, []);

    return (
      <Animated.View style={[styles.bookingCard, {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }]}>
        <TouchableOpacity activeOpacity={0.9}>
          <LinearGradient
            colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
            style={styles.cardGradient}
          >
            {/* Header */}
            <View style={styles.cardHeader}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '20' }]}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(booking.status) }]} />
                <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                  {getStatusText(booking.status)}
                </Text>
              </View>
              <Text style={styles.bookingId}>#{booking.id}</Text>
            </View>

            {/* Event Info */}
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle} numberOfLines={2}>
                {booking.event_title}
              </Text>
              <View style={styles.eventDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="calendar" size={14} color="#666" />
                  <Text style={styles.detailText}>
                    {formatDate(booking.date)} в {formatTime(booking.time)}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="location" size={14} color="#666" />
                  <Text style={styles.detailText} numberOfLines={1}>
                    {booking.venue}
                  </Text>
                </View>
              </View>
            </View>

            {/* Booking Details */}
            <View style={styles.bookingDetails}>
              <View style={styles.bookingInfo}>
                <Text style={styles.customerName}>{booking.user_name}</Text>
                <Text style={styles.customerEmail}>{booking.user_email}</Text>
              </View>
              
              <View style={styles.ticketInfo}>
                <View style={styles.ticketCount}>
                  <Ionicons name="ticket" size={16} color="#667eea" />
                  <Text style={styles.ticketCountText}>
                    {booking.tickets_count} {booking.tickets_count === 1 ? 'билет' : 'билетов'}
                  </Text>
                </View>
                <Text style={styles.totalPrice}>{formatPrice(booking.total_price)}</Text>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.cardFooter}>
              <Text style={styles.bookingDate}>
                Забронировано {formatDate(booking.booking_date)}
              </Text>
              <View style={[styles.sportBadge, { backgroundColor: booking.sport_color + '20' }]}>
                <Text style={[styles.sportText, { color: booking.sport_color }]}>
                  {booking.sport_name}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderBooking = ({ item, index }) => <BookingCard booking={item} index={index} />;

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="ticket-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>Нет бронирований</Text>
      <Text style={styles.emptySubtitle}>
        Ваши бронирования будут отображаться здесь
      </Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => navigation.navigate('Home')}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.exploreButtonGradient}
        >
          <Text style={styles.exploreButtonText}>Найти события</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      {/* Header */}
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Мои бронирования</Text>
            <Text style={styles.headerSubtitle}>
              {bookings.length} {bookings.length === 1 ? 'бронирование' : 'бронирований'}
            </Text>
          </View>
          
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      {/* Bookings List */}
      <FlatList
        data={bookings}
        renderItem={renderBooking}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#667eea']}
            tintColor="#667eea"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyState />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerText: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  headerSpacer: {
    width: 40,
  },
  listContent: {
    padding: 16,
  },
  bookingCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  cardGradient: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bookingId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  eventInfo: {
    marginBottom: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 8,
    lineHeight: 24,
  },
  eventDetails: {
    gap: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    flex: 1,
  },
  bookingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  bookingInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
  },
  customerEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  ticketInfo: {
    alignItems: 'flex-end',
  },
  ticketCount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ticketCountText: {
    fontSize: 14,
    color: '#667eea',
    marginLeft: 4,
    fontWeight: '600',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  bookingDate: {
    fontSize: 12,
    color: '#999',
  },
  sportBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sportText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  exploreButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  exploreButtonGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BookingsScreen; 