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

  const animatedStyle = {
    opacity: fadeAnim,
    transform: [
      { translateY: slideAnim },
      { scale: scaleAnim }
    ]
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        style={styles.touchable}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <View style={[styles.sportBadge, { backgroundColor: event.sport_color + '40' }]}>
              <Text style={[styles.sportText, { color: event.sport_color }]}>
                {event.sport}
              </Text>
            </View>
            {event.isHot && (
              <View style={styles.hotBadge}>
                <Text style={styles.hotText}>HOT</Text>
              </View>
            )}
          </View>

          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={2}>
              {event.title}
            </Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={16} color="white" />
              <Text style={styles.location} numberOfLines={1}>
                {event.location}
              </Text>
            </View>
            <View style={styles.dateTimeContainer}>
              <View style={styles.dateTimeItem}>
                <Ionicons name="calendar" size={16} color="white" />
                <Text style={styles.dateTimeText}>
                  {formatDate(event.date)}
                </Text>
              </View>
              <View style={styles.dateTimeItem}>
                <Ionicons name="time" size={16} color="white" />
                <Text style={styles.dateTimeText}>
                  {formatTime(event.time)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>
                {formatPrice(event.price)}
              </Text>
              {event.originalPrice && (
                <Text style={styles.originalPrice}>
                  {formatPrice(event.originalPrice)}
                </Text>
              )}
            </View>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>
                {event.rating.toFixed(1)} ({event.reviews_count || 0})
              </Text>
            </View>
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
  touchable: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sportBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  sportText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  hotBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  hotText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a202c',
    lineHeight: 22,
    marginBottom: 6,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 12,
    color: '#718096',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeText: {
    fontSize: 12,
    color: '#667eea',
    marginLeft: 4,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  originalPrice: {
    fontSize: 12,
    color: '#718096',
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    color: '#718096',
    marginLeft: 4,
  },
});

export default AnimatedEventCard; 