import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
  Modal,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { favoriteStorage } from '../data/FavoriteStorage';

const { width, height } = Dimensions.get('window');

// Простое хранилище данных только для отзывов
const storage = {
  reviews: [],
  
  addReview: (eventId, userName, rating, comment) => {
    const review = {
      id: Date.now(),
      eventId,
      userName,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };
    storage.reviews.push(review);
    return review;
  },
  
  getReviews: (eventId) => {
    return storage.reviews.filter(review => review.eventId === eventId);
  }
};

const EventDetailsScreen = ({ route, navigation }) => {
  const { event } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [ticketsCount, setTicketsCount] = useState(1);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('user@example.com');
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviews, setReviews] = useState([]);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const heartAnim = useRef(new Animated.Value(1)).current;
  const successAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkIfFavorite();
    loadReviews();
    
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const checkIfFavorite = () => {
    setIsFavorite(favoriteStorage.isFavorite(event.id));
  };

  const loadReviews = () => {
    const eventReviews = storage.getReviews(event.id);
    setReviews(eventReviews);
  };

  const toggleFavorite = () => {
    // Анимация сердечка
    Animated.sequence([
      Animated.timing(heartAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(heartAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start();

    if (isFavorite) {
      favoriteStorage.removeFavorite(event.id);
      setIsFavorite(false);
    } else {
      favoriteStorage.addFavorite(event.id);
      setIsFavorite(true);
    }
  };

  const handleBooking = async () => {
    if (!userName.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, введите ваше имя');
      return;
    }

    if (ticketsCount > event.available_tickets) {
      Alert.alert('Ошибка', 'Недостаточно доступных билетов');
      return;
    }

    // Анимация успеха
    Animated.sequence([
      Animated.timing(successAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
      Animated.timing(successAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();

    setModalVisible(false);
    
    setTimeout(() => {
      navigation.navigate('SeatSelection', { event });
    }, 500);
  };

  const handleReview = async () => {
    if (rating === 0) {
      Alert.alert('Ошибка', 'Пожалуйста, поставьте оценку');
      return;
    }

    const newReview = storage.addReview(event.id, userName || 'Анонимный пользователь', rating, reviewComment);
    
    // Анимация добавления отзыва
    Animated.sequence([
      Animated.timing(successAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
      Animated.timing(successAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();

    setReviewModalVisible(false);
    setRating(0);
    setReviewComment('');
    loadReviews();

    setTimeout(() => {
      Alert.alert('Успех! ⭐', 'Ваш отзыв добавлен');
    }, 500);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    });
  };

  const formatTime = (timeString) => {
    return timeString ? timeString.slice(0, 5) : '00:00';
  };

  const formatPrice = (price) => {
    return `${price.toLocaleString('ru-RU')} ₸`;
  };

  const getCapacityPercentage = () => {
    return ((event.capacity - event.available_tickets) / event.capacity) * 100;
  };

  const getRatingStars = (ratingValue, size = 16, onPress) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => onPress && onPress(i)}
          disabled={!onPress}
        >
          <Ionicons
            name={i <= ratingValue ? "star" : "star-outline"}
            size={size}
            color={i <= ratingValue ? '#FFD700' : '#ccc'}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  const ReviewItem = ({ review, index }) => {
    const reviewAnim = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
      Animated.timing(reviewAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View style={[styles.reviewItem, { 
        opacity: reviewAnim,
        transform: [{ translateY: reviewAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        })}]
      }]}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewerName}>{review.userName}</Text>
          <View style={styles.reviewRating}>
            {getRatingStars(review.rating, 12)}
          </View>
        </View>
        {review.comment && (
          <Text style={styles.reviewComment}>{review.comment}</Text>
        )}
        <Text style={styles.reviewDate}>
          {new Date(review.createdAt).toLocaleDateString('ru-RU')}
        </Text>
      </Animated.View>
    );
  };

  const BookingModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalContent, {
          transform: [{ scale: scaleAnim }]
        }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Бронирование билетов</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Text style={styles.inputLabel}>Ваше имя</Text>
            <TextInput
              style={styles.input}
              value={userName}
              onChangeText={setUserName}
              placeholder="Введите ваше имя"
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>Количество билетов</Text>
            <View style={styles.ticketsSelector}>
              <TouchableOpacity
                style={styles.ticketButton}
                onPress={() => setTicketsCount(Math.max(1, ticketsCount - 1))}
              >
                <Ionicons name="remove" size={20} color="#667eea" />
              </TouchableOpacity>
              <Text style={styles.ticketsCount}>{ticketsCount}</Text>
              <TouchableOpacity
                style={styles.ticketButton}
                onPress={() => setTicketsCount(Math.min(event.available_tickets, ticketsCount + 1))}
              >
                <Ionicons name="add" size={20} color="#667eea" />
              </TouchableOpacity>
            </View>

            <View style={styles.totalPrice}>
              <Text style={styles.totalPriceLabel}>Итого к оплате:</Text>
              <Text style={styles.totalPriceValue}>
                {formatPrice(ticketsCount * event.price)}
              </Text>
            </View>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.bookingButton} onPress={handleBooking}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.bookingButtonGradient}
              >
                <Text style={styles.bookingButtonText}>Выбрать места</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );

  const ReviewModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={reviewModalVisible}
      onRequestClose={() => setReviewModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalContent, {
          transform: [{ scale: scaleAnim }]
        }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Оставить отзыв</Text>
            <TouchableOpacity onPress={() => setReviewModalVisible(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Text style={styles.inputLabel}>Ваша оценка</Text>
            <View style={styles.ratingSelector}>
              {getRatingStars(rating, 32, setRating)}
            </View>

            <Text style={styles.inputLabel}>Комментарий (необязательно)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={reviewComment}
              onChangeText={setReviewComment}
              placeholder="Поделитесь вашими впечатлениями..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.reviewButton} onPress={handleReview}>
              <LinearGradient
                colors={['#FF6B6B', '#FF8E8E']}
                style={styles.reviewButtonGradient}
              >
                <Text style={styles.reviewButtonText}>Отправить отзыв</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.headerSafeArea}>
        <Animated.View style={[styles.heroContainer, { opacity: fadeAnim }]}>
          <LinearGradient
            colors={[event.sport_color || '#667eea', event.sport_color + '80' || '#764ba2']}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroSport}>{event.sport}</Text>
              <Text style={styles.heroTitle}>{event.title}</Text>
            </View>
          </LinearGradient>
          {/* Header Overlay */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Animated.View style={{ transform: [{ scale: heartAnim }] }}>
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={toggleFavorite}
              >
                <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={24}
                  color={isFavorite ? '#FF6B6B' : 'white'}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      </SafeAreaView>
      {/* Content */}
      <Animated.View style={[styles.content, {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }]}>
        {/* Title and Rating */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{event.title}</Text>
          
          {event.rating > 0 && (
            <View style={styles.ratingContainer}>
              <View style={styles.stars}>
                {getRatingStars(event.rating)}
              </View>
              <Text style={styles.ratingText}>
                {event.rating.toFixed(1)} ({event.reviews_count} отзывов)
              </Text>
            </View>
          )}
        </View>

        {/* Sport Badge */}
        <View style={[styles.sportBadge, { backgroundColor: event.sport_color + '20' }]}>
          <Text style={[styles.sportText, { color: event.sport_color }]}>
            {event.sport_name}
          </Text>
        </View>

        {/* Event Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar" size={20} color="#667eea" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Дата и время</Text>
              <Text style={styles.infoValue}>
                {formatDate(event.date)} в {formatTime(event.time)}
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="location" size={20} color="#667eea" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Место проведения</Text>
              <Text style={styles.infoValue}>{event.venue || event.location}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="ticket" size={20} color="#667eea" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Доступно билетов</Text>
              <Text style={[
                styles.infoValue,
                { color: event.available_tickets > 0 ? '#4CAF50' : '#f44336' }
              ]}>
                {event.available_tickets} из {event.capacity}
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        {event.description && (
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Описание</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>
        )}

        {/* Capacity Progress */}
        <View style={styles.capacitySection}>
          <Text style={styles.sectionTitle}>Заполненность</Text>
          <View style={styles.capacityBar}>
            <View
              style={[
                styles.capacityFill,
                { 
                  width: `${getCapacityPercentage()}%`,
                  backgroundColor: getCapacityPercentage() > 90 ? '#f44336' : 
                                 getCapacityPercentage() > 70 ? '#FFD700' : '#4CAF50'
                }
              ]}
            />
          </View>
          <Text style={styles.capacityText}>
            {Math.round(getCapacityPercentage())}% заполнено
          </Text>
        </View>

        {/* Reviews Section */}
        <View style={styles.reviewsSection}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Отзывы ({reviews.length})</Text>
            <TouchableOpacity onPress={() => setReviewModalVisible(true)}>
              <Text style={styles.addReviewButton}>Добавить отзыв</Text>
            </TouchableOpacity>
          </View>
          
          {reviews.length > 0 ? (
            reviews.slice(0, 3).map((review, index) => (
              <ReviewItem key={review.id} review={review} index={index} />
            ))
          ) : (
            <TouchableOpacity
              style={styles.addFirstReviewButton}
              onPress={() => setReviewModalVisible(true)}
            >
              <Ionicons name="star-outline" size={20} color="#667eea" />
              <Text style={styles.addFirstReviewText}>Оставить первый отзыв</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Footer */}
      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Цена билета:</Text>
          <Text style={styles.price}>{formatPrice(event.price)}</Text>
        </View>
        
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => setModalVisible(true)}
          disabled={event.available_tickets === 0}
        >
          <LinearGradient
            colors={event.available_tickets > 0 ? ['#667eea', '#764ba2'] : ['#ccc', '#999']}
            style={styles.footerButtonGradient}
          >
            <Text style={styles.footerButtonText}>
              {event.available_tickets > 0 ? "Забронировать" : "Билетов нет"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Success Animation */}
      <Animated.View style={[styles.successOverlay, {
        opacity: successAnim,
        transform: [{ scale: successAnim }]
      }]}>
        <View style={styles.successContent}>
          <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
          <Text style={styles.successText}>Успешно!</Text>
        </View>
      </Animated.View>

      <BookingModal />
      <ReviewModal />
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
  heroContainer: {
    height: 300,
    position: 'relative',
  },
  heroGradient: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroSport: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 32 : 24,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
    marginTop: -20,
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  titleSection: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a202c',
    lineHeight: 32,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stars: {
    flexDirection: 'row',
  },
  ratingText: {
    fontSize: 14,
    color: '#667eea',
  },
  sportBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 24,
  },
  sportText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoSection: {
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#667eea',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#667eea',
    lineHeight: 24,
  },
  capacitySection: {
    marginBottom: 24,
  },
  capacityBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
  },
  capacityFill: {
    height: '100%',
    borderRadius: 4,
  },
  capacityText: {
    fontSize: 14,
    color: '#667eea',
    textAlign: 'center',
  },
  reviewsSection: {
    marginBottom: 24,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addReviewButton: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  reviewItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: 14,
    color: '#667eea',
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: '#667eea',
  },
  addFirstReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#667eea20',
    borderStyle: 'dashed',
  },
  addFirstReviewText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: '#667eea',
    marginBottom: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#667eea',
  },
  footerButton: {
    flex: 1,
    marginLeft: 16,
  },
  footerButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '100%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  modalBody: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1a202c',
    backgroundColor: '#f8fafc',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  ticketsSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
  },
  ticketButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#667eea20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketsCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a202c',
    marginHorizontal: 24,
    minWidth: 40,
    textAlign: 'center',
  },
  totalPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    padding: 16,
    backgroundColor: '#667eea10',
    borderRadius: 12,
  },
  totalPriceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
  },
  totalPriceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#667eea',
  },
  ratingSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  modalFooter: {
    padding: 20,
  },
  bookingButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  bookingButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  bookingButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  reviewButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  reviewButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  reviewButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContent: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 16,
  },
});

export default EventDetailsScreen; 