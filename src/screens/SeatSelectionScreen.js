import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function SeatSelectionScreen({ navigation, route }) {
  const { event } = route.params || {};
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatingMap, setSeatingMap] = useState([]);
  const [venueConfig, setVenueConfig] = useState(null);

  // Определяем конфигурацию площадки в зависимости от вида спорта
  const getVenueConfig = (sport) => {
    switch (sport?.toLowerCase()) {
      case 'ufc':
      case 'mma':
        return {
          name: 'ОКТАГОН',
          icon: 'shield-outline',
          colors: ['#C8102E', '#FF4444'],
          type: 'octagon',
          sections: [
            { name: 'Cage Side', rows: 2, seats: 16, basePrice: 35000, color: '#FFD700' },
            { name: 'Floor A', rows: 3, seats: 18, basePrice: 25000, color: '#FF6B35' },
            { name: 'Floor B', rows: 4, seats: 20, basePrice: 18000, color: '#4ECDC4' },
            { name: 'Lower Bowl', rows: 5, seats: 22, basePrice: 12000, color: '#45B7D1' },
            { name: 'Upper Bowl', rows: 6, seats: 24, basePrice: 8000, color: '#96CEB4' },
          ]
        };
      
      case 'fifa':
      case 'uefa':
      case 'футбол':
        return {
          name: 'ФУТБОЛЬНОЕ ПОЛЕ',
          icon: 'football-outline',
          colors: ['#326295', '#4CAF50'],
          type: 'stadium',
          sections: [
            { name: 'VIP North', side: 'north', rows: 6, seats: 25, basePrice: 28000, color: '#FFD700' },
            { name: 'North Stand', side: 'north', rows: 12, seats: 30, basePrice: 18000, color: '#FF6B35' },
            { name: 'VIP South', side: 'south', rows: 6, seats: 25, basePrice: 28000, color: '#FFD700' },
            { name: 'South Stand', side: 'south', rows: 12, seats: 30, basePrice: 18000, color: '#FF6B35' },
            { name: 'East Stand', side: 'east', rows: 10, seats: 20, basePrice: 15000, color: '#4ECDC4' },
            { name: 'West Stand', side: 'west', rows: 10, seats: 20, basePrice: 15000, color: '#45B7D1' },
          ]
        };
      
      case 'nba':
      case 'баскетбол':
        return {
          name: 'БАСКЕТБОЛЬНАЯ АРЕНА',
          icon: 'basketball-outline',
          colors: ['#1D428A', '#FF8C00'],
          type: 'arena',
          sections: [
            { name: 'Courtside', rows: 2, seats: 12, basePrice: 50000, color: '#FFD700' },
            { name: 'Lower Level', rows: 6, seats: 18, basePrice: 30000, color: '#FF6B35' },
            { name: 'Club Level', rows: 5, seats: 16, basePrice: 22000, color: '#4ECDC4' },
            { name: 'Upper Level', rows: 8, seats: 20, basePrice: 15000, color: '#45B7D1' },
            { name: 'Nosebleeds', rows: 6, seats: 24, basePrice: 8000, color: '#96CEB4' },
          ]
        };
      
      default:
        return {
          name: 'АРЕНА',
          icon: 'trophy',
          colors: ['#667eea', '#764ba2'],
          type: 'arena',
          sections: [
            { name: 'VIP', rows: 3, seats: 16, basePrice: 25000, color: '#FFD700' },
            { name: 'Premium', rows: 6, seats: 20, basePrice: 18000, color: '#FF6B35' },
            { name: 'Standard', rows: 8, seats: 24, basePrice: 12000, color: '#4ECDC4' },
            { name: 'Economy', rows: 10, seats: 28, basePrice: 8000, color: '#96CEB4' },
          ]
        };
    }
  };

  useEffect(() => {
    const config = getVenueConfig(event?.sport || event?.category);
    setVenueConfig(config);
    generateSeatingMap(config);
  }, [event]);

  const generateSeatingMap = (config) => {
    const map = [];
    
    // Простая схема рядов мест по порядку
    const totalRows = 15;
    const seatsPerRow = 12;
    
    for (let row = 1; row <= totalRows; row++) {
      for (let seat = 1; seat <= seatsPerRow; seat++) {
        // Расположение мест в прямоугольной сетке
        const x = (seat - seatsPerRow / 2 - 0.5) * 2; // Отступы между местами
        const y = (row - totalRows / 2 - 0.5) * 2; // Отступы между рядами
        
        // Определяем секцию по ряду
        let section, color, price;
        if (row <= 3) {
          section = 'VIP';
          color = '#FFD700';
          price = 25000;
        } else if (row <= 6) {
          section = 'Premium';
          color = '#FF6B35';
          price = 18000;
        } else if (row <= 10) {
          section = 'Standard';
          color = '#4ECDC4';
          price = 12000;
        } else {
          section = 'Economy';
          color = '#96CEB4';
          price = 8000;
        }
        
        map.push({
          id: `${section}-${row}-${seat}`,
          section: section,
          row,
          seat,
          x,
          y,
          price: price,
          color: color,
          status: Math.random() < 0.25 ? 'occupied' : 'available',
        });
      }
    }
    
    setSeatingMap(map);
  };

  const handleSeatPress = (seat) => {
    if (seat.status === 'occupied') {
      Alert.alert('Недоступно', 'Это место уже занято');
      return;
    }

    const isSelected = selectedSeats.includes(seat.id);
    
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(id => id !== seat.id));
    } else {
      if (selectedSeats.length >= 8) {
        Alert.alert('Ограничение', 'Можно выбрать максимум 8 мест');
        return;
      }
      setSelectedSeats([...selectedSeats, seat.id]);
    }
  };

  const getSeatColor = (seat) => {
    if (seat.status === 'occupied') return '#BDBDBD';
    if (selectedSeats.includes(seat.id)) return '#FF6B6B';
    return seat.color;
  };

  const getTotalPrice = () => {
    return seatingMap
      .filter(seat => selectedSeats.includes(seat.id))
      .reduce((total, seat) => total + seat.price, 0);
  };

  const handleBookSeats = () => {
    if (selectedSeats.length === 0) {
      Alert.alert('Ошибка', 'Выберите хотя бы одно место');
      return;
    }

    const bookingData = {
      event: event?.title || 'Спортивное мероприятие',
      seats: selectedSeats,
      total: getTotalPrice(),
      date: new Date().toISOString(),
      eventDetails: event,
    };

    navigation.navigate('Payment', { bookingData });
  };

  const renderVenueCenter = () => {
    if (!venueConfig) return null;

    let centerStyle = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      zIndex: 15,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    };

    if (venueConfig.type === 'octagon') {
      Object.assign(centerStyle, {
        width: 140,
        height: 140,
        marginLeft: -70,
        marginTop: -70,
        borderRadius: 25,
        transform: [{ rotate: '22.5deg' }],
      });
    } else if (venueConfig.type === 'stadium') {
      Object.assign(centerStyle, {
        width: 180,
        height: 120,
        marginLeft: -90,
        marginTop: -60,
        borderRadius: 8,
      });
    } else {
      Object.assign(centerStyle, {
        width: 160,
        height: 120,
        marginLeft: -80,
        marginTop: -60,
        borderRadius: 20,
      });
    }

    return (
      <View style={centerStyle}>
        <LinearGradient
          colors={venueConfig.colors}
          style={styles.venueCenterGradient}
        >
          {venueConfig.type === 'stadium' ? (
            <View style={styles.footballField}>
              <View style={styles.centerCircle} />
              <View style={styles.centerLine} />
              <View style={styles.penaltyArea1} />
              <View style={styles.penaltyArea2} />
              <Ionicons name={venueConfig.icon} size={32} color="white" style={styles.fieldIcon} />
              <Text style={styles.venueCenterText}>{venueConfig.name}</Text>
            </View>
          ) : venueConfig.type === 'octagon' ? (
            <View style={styles.octagonRing}>
              <View style={styles.innerOctagon} />
              <Ionicons name={venueConfig.icon} size={32} color="white" />
              <Text style={styles.venueCenterText}>{venueConfig.name}</Text>
            </View>
          ) : (
            <>
              <Ionicons name={venueConfig.icon} size={32} color="white" />
              <Text style={styles.venueCenterText}>{venueConfig.name}</Text>
            </>
          )}
        </LinearGradient>
      </View>
    );
  };

  const renderSectionLegend = () => {
    const sections = [
      { name: 'VIP', basePrice: 25000, color: '#FFD700' },
      { name: 'Premium', basePrice: 18000, color: '#FF6B35' },
      { name: 'Standard', basePrice: 12000, color: '#4ECDC4' },
      { name: 'Economy', basePrice: 8000, color: '#96CEB4' },
    ];

    return (
      <View style={styles.sectionLegend}>
        {sections.map((section, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: section.color }]} />
            <Text style={styles.legendText}>{section.name}</Text>
            <Text style={styles.legendPrice}>{(section.basePrice / 1000)}k ₸</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderSeatingMap = () => {
    if (!seatingMap.length) return null;

    const mapWidth = width - 40;
    const mapHeight = height * 0.6; // Увеличили высоту
    const scale = 12; // Фиксированный масштаб

    return (
      <View style={styles.mapContainer}>
        <ScrollView
          style={styles.mapScrollView}
          contentContainerStyle={{
            width: mapWidth * 1.2,
            height: mapHeight * 1.2,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          minimumZoomScale={0.8}
          maximumZoomScale={2.0}
          bouncesZoom={true}
          pinchGestureEnabled={true}
        >
          <View style={[styles.mapContent, { width: mapWidth, height: mapHeight }]}>
            
            {/* Сцена/Экран */}
            <View style={styles.stage}>
              <Text style={styles.stageText}>СЦЕНА / ЭКРАН</Text>
            </View>
            
            {/* Места */}
            {seatingMap.map((seat, index) => {
              const seatX = (seat.x * scale) + mapWidth / 2;
              const seatY = (seat.y * scale) + mapHeight / 2 + 40; // Смещение от сцены
              
              return (
                <TouchableOpacity
                  key={seat.id}
                  style={[
                    styles.seatButton,
                    {
                      left: seatX - 12,
                      top: seatY - 12,
                      backgroundColor: getSeatColor(seat),
                      borderColor: selectedSeats.includes(seat.id) ? '#FF6B6B' : 'rgba(255,255,255,0.5)',
                      borderWidth: selectedSeats.includes(seat.id) ? 2.5 : 1,
                      transform: selectedSeats.includes(seat.id) ? [{ scale: 1.2 }] : [{ scale: 1 }],
                    }
                  ]}
                  onPress={() => handleSeatPress(seat)}
                  disabled={seat.status === 'occupied'}
                >
                  <Text style={[
                    styles.seatNumber,
                    {
                      color: seat.status === 'occupied' ? '#666' : 'white',
                      fontSize: selectedSeats.includes(seat.id) ? 10 : 8,
                      fontWeight: selectedSeats.includes(seat.id) ? 'bold' : '600'
                    }
                  ]}>
                    {seat.seat}
                  </Text>
                </TouchableOpacity>
              );
            })}
            
            {/* Подписи рядов */}
            <View style={styles.rowLabels}>
              <Text style={styles.rowLabelText}>Ряд 1-3: VIP</Text>
              <Text style={styles.rowLabelText}>Ряд 4-6: Premium</Text>
              <Text style={styles.rowLabelText}>Ряд 7-10: Standard</Text>
              <Text style={styles.rowLabelText}>Ряд 11-15: Economy</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Выбор мест</Text>
        <View style={styles.sportIndicator}>
          <Ionicons name="trophy" size={20} color="white" />
        </View>
      </LinearGradient>

      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{event?.title || 'Мероприятие'}</Text>
        <Text style={styles.eventDetails}>
          {event?.date || 'Дата не указана'} • {event?.location || event?.venue || 'Место не указано'}
        </Text>
      </View>

      {renderSectionLegend()}

      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>
          👆 Нажмите на места для выбора • 🔍 Используйте жесты для масштабирования
        </Text>
        {selectedSeats.length > 0 && (
          <Text style={styles.selectedHint}>
            ✨ Выбрано: {selectedSeats.length} {selectedSeats.length === 1 ? 'место' : selectedSeats.length < 5 ? 'места' : 'мест'}
          </Text>
        )}
      </View>

      {renderSeatingMap()}

      {selectedSeats.length > 0 && (
        <View style={styles.bookingFooter}>
          <View style={styles.bookingInfo}>
            <Text style={styles.selectedCount}>
              Выбрано: {selectedSeats.length} {selectedSeats.length === 1 ? 'место' : selectedSeats.length < 5 ? 'места' : 'мест'}
            </Text>
            <Text style={styles.totalPrice}>
              {getTotalPrice().toLocaleString('ru-RU')} ₸
            </Text>
          </View>
          <TouchableOpacity style={styles.bookButton} onPress={handleBookSeats}>
            <LinearGradient
              colors={venueConfig ? venueConfig.colors : ['#667eea', '#764ba2']}
              style={styles.bookButtonGradient}
            >
              <Ionicons name="arrow-forward" size={20} color="white" />
              <Text style={styles.bookButtonText}>К оплате</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 0 : 25,
    paddingBottom: 15,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  sportIndicator: {
    width: 40,
    alignItems: 'center',
  },
  eventInfo: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  eventDetails: {
    fontSize: 14,
    color: '#666',
  },
  sectionLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 4,
    marginVertical: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  legendText: {
    fontSize: 9,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  legendPrice: {
    fontSize: 8,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#f8f9fa',
    marginTop: -80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapScrollView: {
    flex: 1,
  },
  mapContent: {
    position: 'relative',
    backgroundColor: 'transparent',
  },
  seatButton: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  seatNumber: {
    color: 'white',
    fontSize: 8,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  instructionContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  selectedHint: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 4,
  },
  bookingFooter: {
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookingInfo: {
    flex: 1,
    marginRight: 15,
  },
  selectedCount: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  totalPrice: {
    fontSize: 18,
    color: '#2a5298',
    fontWeight: 'bold',
    marginTop: 2,
  },
  bookButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  bookButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  venueCenterGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  venueCenterText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  sectionLabel: {
    position: 'absolute',
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 80,
  },
  sectionLabelText: {
    color: '#333',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionPriceText: {
    color: '#666',
    fontSize: 9,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
  },
  footballField: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#4CAF50', // Зеленый цвет поля
  },
  centerCircle: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: '45%',
  },
  centerLine: {
    width: '100%',
    height: 2,
    backgroundColor: 'white',
    position: 'absolute',
    top: '50%',
    borderRadius: 1,
  },
  penaltyArea1: {
    width: 30,
    height: 20,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: '15%',
    borderRadius: 2,
  },
  penaltyArea2: {
    width: 30,
    height: 20,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: '15%',
    borderRadius: 2,
  },
  fieldIcon: {
    position: 'absolute',
    bottom: 15,
  },
  octagonRing: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  innerOctagon: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: 'white',
    backgroundColor: 'rgba(255,255,255,0.1)',
    position: 'absolute',
    top: '25%',
  },
  stadiumLabel: {
    position: 'absolute',
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 80,
  },
  stadiumLabelText: {
    color: '#333',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  stage: {
    position: 'absolute',
    top: 20,
    left: '50%',
    marginLeft: -100,
    width: 200,
    height: 40,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  stageText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  rowLabels: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  rowLabelText: {
    color: '#333',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 2,
  },
}); 