import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const EventCard = ({ event, onPress }) => {
  if (!event) return null;

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

  const getAvailabilityColor = () => {
    const percentage = (event.capacity - event.available_tickets) / event.capacity * 100;
    if (percentage >= 90) return '#f44336';
    if (percentage >= 70) return '#FFD700';
    return '#4CAF50';
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={i} name="star" size={12} color="#FFD700" />);
    }

    if (hasHalfStar) {
      stars.push(<Ionicons key="half" name="star-half" size={12} color="#FFD700" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={12} color="#ccc" />);
    }

    return stars;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(event)} activeOpacity={0.8}>
      <ImageBackground
        source={{ uri: event.image || event.image_url }}
        style={styles.backgroundImage}
        imageStyle={styles.imageStyle}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
          style={styles.overlay}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.sportBadge, { backgroundColor: event.sport_color + '20' }]}>
              <Text style={[styles.sportText, { color: event.sport_color }]}>
                {event.sport}
              </Text>
            </View>
            
            {event.isHot && (
              <View style={styles.hotBadge}>
                <Ionicons name="flame" size={12} color="white" />
                <Text style={styles.hotText}>HOT</Text>
              </View>
            )}
          </View>

          {/* Event Info */}
          <View style={styles.eventInfo}>
            <Text style={styles.title} numberOfLines={2}>
              {event.title}
            </Text>

            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
                <Text style={styles.detailText}>
                  {formatDate(event.date)}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.detailText} numberOfLines={1}>
                  {event.location}
                </Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.priceSection}>
              <Text style={styles.priceLabel}>от</Text>
              <Text style={styles.price}>
                {formatPrice(event.price)}
              </Text>
            </View>

            <View style={styles.availabilitySection}>
              <View style={[
                styles.availabilityDot,
                { backgroundColor: getAvailabilityColor() }
              ]} />
              <Text 
                style={[
                  styles.availabilityText,
                  { color: (event.available_tickets || 0) > 0 ? '#4CAF50' : '#f44336' }
                ]}
              >
                {(event.available_tickets || 0) > 0 ? 'Доступно' : 'Нет мест'}
              </Text>
              <Text 
                style={[
                  styles.availabilityCount,
                  { color: (event.available_tickets || 0) > 0 ? '#4CAF50' : '#f44336' }
                ]}
              >
                {event.available_tickets || 0}
              </Text>
            </View>
          </View>

          {/* Rating */}
          {event.rating && (
            <View style={styles.ratingRow}>
              <View style={styles.stars}>
                {renderStars(event.rating)}
              </View>
              <Text style={styles.ratingText}>
                {event.rating.toFixed(1)} ({event.reviews_count || 0})
              </Text>
            </View>
          )}
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  backgroundImage: {
    height: 200,
  },
  imageStyle: {
    borderRadius: 16,
  },
  overlay: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sportBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sportText: {
    fontSize: 12,
    fontWeight: '600',
  },
  hotBadge: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  hotText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  eventInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 12,
    lineHeight: 24,
  },
  detailsRow: {
    gap: 8,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceSection: {
    alignItems: 'flex-start',
  },
  priceLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
  },
  availabilitySection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '500',
    marginRight: 4,
  },
  availabilityCount: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
  },
});

export default EventCard; 