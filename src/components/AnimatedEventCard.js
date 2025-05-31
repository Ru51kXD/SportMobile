import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const AnimatedEventCard = ({ event, onPress, index = 0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Анимация появления с задержкой
    const delay = index * 200;
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        delay,
        useNativeDriver: true,
      })
    ]).start();

    // Shimmer анимация для горячих событий
    if (event.isHot) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          })
        ])
      ).start();
    }
  }, [index]);

  const handlePress = () => {
    // Анимация нажатия
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();

    if (onPress) {
      onPress(event, 'selectSeats');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    });
  };

  const formatTime = (timeString) => {
    return timeString ? timeString.slice(0, 5) : '19:00';
  };

  const formatPrice = (price) => {
    return `${price.toLocaleString('ru-RU')} ₸`;
  };

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <Animated.View style={[
      styles.container,
      {
        opacity: fadeAnim,
        transform: [
          { translateY: slideAnim },
          { scale: scaleAnim }
        ]
      }
    ]}>
      <TouchableOpacity
        style={styles.card}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
          style={styles.cardGradient}
        >
          {/* Background Image */}
          <View style={styles.imageContainer}>
            {event.image ? (
              <Image source={{ uri: event.image }} style={styles.backgroundImage} />
            ) : (
              <LinearGradient
                colors={[event.sport_color || '#667eea', (event.sport_color || '#667eea') + '80']}
                style={styles.backgroundGradient}
              >
                <Ionicons 
                  name={event.sport_icon || 'trophy'} 
                  size={40} 
                  color="rgba(255,255,255,0.8)" 
                />
              </LinearGradient>
            )}
            
            {/* Shimmer Effect для горячих событий */}
            {event.isHot && (
              <Animated.View style={[
                styles.shimmerOverlay,
                {
                  transform: [{ translateX: shimmerTranslate }]
                }
              ]} />
            )}
          </View>

          {/* Hot Badge */}
          {event.isHot && (
            <View style={styles.hotBadge}>
              <LinearGradient
                colors={['#FF6B6B', '#FF8E8E']}
                style={styles.hotBadgeGradient}
              >
                <Ionicons name="flame" size={12} color="white" />
                <Text style={styles.hotBadgeText}>HOT</Text>
              </LinearGradient>
            </View>
          )}

          {/* Discount Badge */}
          {event.discount && (
            <View style={styles.discountBadge}>
              <LinearGradient
                colors={['#4CAF50', '#66BB6A']}
                style={styles.discountBadgeGradient}
              >
                <Text style={styles.discountText}>-{event.discount}%</Text>
              </LinearGradient>
            </View>
          )}

          {/* Content */}
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.eventInfo}>
                <View style={[styles.sportBadge, { backgroundColor: (event.sport_color || '#667eea') + '20' }]}>
                  <Text style={[styles.sportText, { color: event.sport_color || '#667eea' }]}>
                    {event.sport}
                  </Text>
                </View>
                
                <Text style={styles.title} numberOfLines={2}>
                  {event.title}
                </Text>
                
                <Text style={styles.location} numberOfLines={1}>
                  📍 {event.location}
                </Text>
              </View>
            </View>

            <View style={styles.details}>
              <View style={styles.dateTimeContainer}>
                <View style={styles.dateTime}>
                  <Ionicons name="calendar-outline" size={14} color="#667eea" />
                  <Text style={styles.dateText}>
                    {formatDate(event.date)}
                  </Text>
                </View>
                
                <View style={styles.dateTime}>
                  <Ionicons name="time-outline" size={14} color="#667eea" />
                  <Text style={styles.timeText}>
                    {formatTime(event.time)}
                  </Text>
                </View>
              </View>

              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>от</Text>
                <Text style={styles.price}>
                  {formatPrice(event.price)}
                </Text>
              </View>
            </View>

            {/* Select Seats Button */}
            <TouchableOpacity
              style={styles.selectSeatsButton}
              onPress={handlePress}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.selectSeatsGradient}
              >
                <Ionicons name="checkmark-circle" size={16} color="white" />
                <Text style={styles.selectSeatsText}>Выбрать места</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Rating */}
            {event.rating && event.rating > 0 && (
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text style={styles.ratingText}>
                  {event.rating.toFixed(1)} ({event.reviews_count || 0})
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.85,
    marginRight: 20,
    marginVertical: 8,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  cardGradient: {
    flex: 1,
  },
  imageContainer: {
    height: 120,
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backgroundGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: 100,
  },
  hotBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  hotBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  hotBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  discountBadgeGradient: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  discountText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  eventInfo: {
    flex: 1,
  },
  sportBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  sportText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a202c',
    lineHeight: 22,
    marginBottom: 6,
  },
  location: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  dateTimeContainer: {
    flex: 1,
  },
  dateTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#667eea',
    marginLeft: 4,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 12,
    color: '#667eea',
    marginLeft: 4,
    fontWeight: '600',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 10,
    color: '#718096',
    marginBottom: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  selectSeatsButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  selectSeatsGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  selectSeatsText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#718096',
    marginLeft: 4,
  },
});

export default AnimatedEventCard; 