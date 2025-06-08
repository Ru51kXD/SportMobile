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
  StatusBar,
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
            { name: 'Cage Side', rows: 1, seats: 12, basePrice: 35000, color: '#FFD700', shape: 'octagon' },
            { name: 'Floor A', rows: 1, seats: 16, basePrice: 25000, color: '#FF6B35', shape: 'octagon' },
            { name: 'Floor B', rows: 1, seats: 18, basePrice: 18000, color: '#4ECDC4', shape: 'octagon' },
            { name: 'Lower Bowl', rows: 1, seats: 20, basePrice: 12000, color: '#45B7D1', shape: 'octagon' },
            { name: 'Upper Bowl', rows: 1, seats: 24, basePrice: 8000, color: '#96CEB4', shape: 'octagon' },
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
            { name: 'Север A', side: 'north', rows: 2, seats: 15, basePrice: 28000, color: '#FF6B35', shape: 'rectangle' },
            { name: 'Север B', side: 'north', rows: 2, seats: 15, basePrice: 25000, color: '#FF6B35', shape: 'rectangle' },
            { name: 'Юг A', side: 'south', rows: 2, seats: 15, basePrice: 28000, color: '#FF6B35', shape: 'rectangle' },
            { name: 'Юг B', side: 'south', rows: 2, seats: 15, basePrice: 25000, color: '#FF6B35', shape: 'rectangle' },
            { name: 'Восток A', side: 'east', rows: 2, seats: 8, basePrice: 20000, color: '#45B7D1', shape: 'rectangle' },
            { name: 'Восток B', side: 'east', rows: 2, seats: 8, basePrice: 18000, color: '#45B7D1', shape: 'rectangle' },
            { name: 'Запад A', side: 'west', rows: 2, seats: 8, basePrice: 20000, color: '#45B7D1', shape: 'rectangle' },
            { name: 'Запад B', side: 'west', rows: 2, seats: 8, basePrice: 18000, color: '#45B7D1', shape: 'rectangle' },
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
            { name: 'Courtside', rows: 2, seats: 12, basePrice: 50000, color: '#FFD700', shape: 'rectangle' },
            { name: 'Lower Level', rows: 6, seats: 18, basePrice: 30000, color: '#FF6B35', shape: 'curve' },
            { name: 'Club Level', rows: 5, seats: 16, basePrice: 22000, color: '#4ECDC4', shape: 'curve' },
            { name: 'Upper Level', rows: 8, seats: 20, basePrice: 15000, color: '#45B7D1', shape: 'tier' },
            { name: 'Nosebleeds', rows: 6, seats: 24, basePrice: 8000, color: '#96CEB4', shape: 'tier' },
          ]
        };
      
      default:
        return {
          name: 'АРЕНА',
          icon: 'trophy',
          colors: ['#667eea', '#764ba2'],
          type: 'arena',
          sections: [
            { name: 'VIP', rows: 3, seats: 16, basePrice: 25000, color: '#FFD700', shape: 'circle' },
            { name: 'Premium', rows: 6, seats: 20, basePrice: 18000, color: '#FF6B35', shape: 'circle' },
            { name: 'Standard', rows: 8, seats: 24, basePrice: 12000, color: '#4ECDC4', shape: 'curve' },
            { name: 'Economy', rows: 10, seats: 28, basePrice: 8000, color: '#96CEB4', shape: 'curve' },
          ]
        };
    }
  };

  useEffect(() => {
    // Получаем конфигурацию площадки на основе типа спорта из события
    const sport = event?.sport || event?.category || 'футбол'; // По умолчанию используем футбол
    const config = getVenueConfig(sport);
    setVenueConfig(config);

    // Генерируем карту мест на основе конфигурации
    if (config) {
      generateSeatingMap(config);

      // Добавляем случайные занятые места (примерно 30%)
      setTimeout(() => {
        setSeatingMap(prevMap => {
          return prevMap.map(seat => {
            if (seat.type === 'seat' && Math.random() < 0.3) {
              return { ...seat, status: 'occupied' };
            }
            return seat;
          });
        });
      }, 500);
    }
  }, [event]);

  const generateSeatingMap = (config) => {
    if (!config) return;
    
    const newSeatingMap = [];
    const mapWidth = width - 40;
    const mapHeight = height * 0.6;
    const centerX = mapWidth / 2;
    const centerY = mapHeight / 2;
    
    config.sections.forEach((section, sectionIndex) => {
      const sectionSeats = [];
      
      // Определяем расположение и размер секции на основе её типа и конфигурации
      let sectionLeft, sectionTop, sectionWidth, sectionHeight;
      
      if (config.type === 'octagon') {
        // Октагон - секции располагаются по кругу, увеличиваясь
        const sectionPadding = 50 + (sectionIndex * 45); // Увеличиваем расстояние между кольцами
        sectionLeft = centerX - sectionPadding;
        sectionTop = centerY - sectionPadding;
        sectionWidth = sectionPadding * 2;
        sectionHeight = sectionPadding * 2;
      } else if (config.type === 'stadium') {
        // Футбольный стадион - секции расположены по 4 сторонам
        const fieldWidth = 180;
        const fieldHeight = 120;
        const seatSize = 15;
        const rowHeight = 18;
        
        if (section.side === 'north') {
          // Северная трибуна (верхняя)
          sectionWidth = fieldWidth + 160;
          sectionHeight = rowHeight * section.rows;
          sectionLeft = centerX - sectionWidth / 2;
          sectionTop = centerY - fieldHeight / 2 - sectionHeight - 10;
        } else if (section.side === 'south') {
          // Южная трибуна (нижняя)
          sectionWidth = fieldWidth + 160;
          sectionHeight = rowHeight * section.rows;
          sectionLeft = centerX - sectionWidth / 2;
          sectionTop = centerY + fieldHeight / 2 + 10;
        } else if (section.side === 'east') {
          // Восточная трибуна (правая)
          sectionWidth = rowHeight * section.rows;
          sectionHeight = fieldHeight + 80;
          sectionLeft = centerX + fieldWidth / 2 + 10;
          sectionTop = centerY - sectionHeight / 2;
        } else { // west
          // Западная трибуна (левая)
          sectionWidth = rowHeight * section.rows;
          sectionHeight = fieldHeight + 80;
          sectionLeft = centerX - fieldWidth / 2 - sectionWidth - 10;
          sectionTop = centerY - sectionHeight / 2;
        }
      } else {
        // Баскетбольная и другие арены - секции располагаются слоями
        const sectionPadding = 15 + (sectionIndex * 30);
        
        if (section.shape === 'rectangle') {
          // Прямоугольные секции у краев поля
          sectionLeft = sectionPadding;
          sectionTop = mapHeight / 4 - 20;
          sectionWidth = mapWidth - (sectionPadding * 2);
          sectionHeight = 60;
        } else if (section.shape === 'curve') {
          // Закругленные секции по бокам
          sectionLeft = sectionPadding;
          sectionTop = mapHeight / 8 + (sectionIndex * 25);
          sectionWidth = mapWidth - (sectionPadding * 2);
          sectionHeight = 70 + (sectionIndex * 15);
        } else if (section.shape === 'tier') {
          // Ярусные секции
          sectionLeft = sectionPadding;
          sectionTop = 20 + (sectionIndex * 20);
          sectionWidth = mapWidth - (sectionPadding * 2);
          sectionHeight = mapHeight / 3 + (sectionIndex * 10);
        } else {
          // Круговые секции по умолчанию
          sectionLeft = sectionPadding;
          sectionTop = sectionPadding;
          sectionWidth = mapWidth - (sectionPadding * 2);
          sectionHeight = mapHeight / 2 - (sectionPadding * 1.5);
        }
      }
      
      // Размещаем метку с названием секции
      let labelLeft, labelTop;
      
      if (config.type === 'octagon') {
        // Для октагона размещаем метки вверху каждой секции
        const labelAngle = Math.PI / 4; // 45 градусов - примерное место для метки
        const labelRadius = 85 + (sectionIndex * 45); // Радиус для метки
        labelLeft = centerX + Math.cos(labelAngle) * labelRadius - 40;
        labelTop = centerY + Math.sin(labelAngle) * labelRadius - 25;
      } else if (config.type === 'stadium') {
        if (section.side === 'north') {
          labelLeft = sectionLeft + sectionWidth / 2 - 40;
          labelTop = sectionTop - 25;
        } else if (section.side === 'south') {
          labelLeft = sectionLeft + sectionWidth / 2 - 40;
          labelTop = sectionTop + sectionHeight + 5;
        } else if (section.side === 'east') {
          labelLeft = sectionLeft + sectionWidth + 5;
          labelTop = sectionTop + sectionHeight / 2 - 15;
        } else { // west
          labelLeft = sectionLeft - 85;
          labelTop = sectionTop + sectionHeight / 2 - 15;
        }
      } else {
        if (section.shape === 'rectangle') {
          labelLeft = mapWidth / 2 - 40;
          labelTop = sectionTop - 25;
        } else if (section.shape === 'curve') {
          labelLeft = mapWidth / 2 - 40;
          labelTop = sectionTop + sectionHeight + 5;
        } else if (section.shape === 'tier') {
          labelLeft = mapWidth / 2 - 40;
          labelTop = sectionTop - 25;
        } else {
          labelLeft = mapWidth / 2 - 40;
          labelTop = sectionTop - 15;
        }
      }
      
      // Добавляем информацию о секции
      sectionSeats.push({
        type: 'label',
        id: `section-${sectionIndex}-label`,
        left: labelLeft,
        top: labelTop,
        name: section.name,
        price: section.basePrice,
        color: section.color,
      });
      
      // Генерируем места в зависимости от формы секции
      for (let row = 0; row < section.rows; row++) {
        for (let seat = 0; seat < section.seats; seat++) {
          // Вычисляем позицию места
          let seatX, seatY;
          
          if (config.type === 'octagon') {
            // Для октагона размещаем места по восьмиугольнику вокруг центра
            const angleStep = (Math.PI * 2) / section.seats;
            const angle = angleStep * seat;
            const radius = 85 + (sectionIndex * 45); // Радиус для колец мест с большими интервалами
            
            seatX = centerX + Math.cos(angle) * radius;
            seatY = centerY + Math.sin(angle) * radius;
          } else if (config.type === 'stadium') {
            // Для футбольного стадиона в зависимости от стороны
            const seatSpacing = 18; // расстояние между местами
            const rowSpacing = 18; // расстояние между рядами
            
            if (section.side === 'north') {
              // Северная трибуна (верхняя) - места идут слева направо
              const sectionWidth = 180 + 160;
              const seatsPerRow = section.seats;
              const startX = centerX - sectionWidth / 2 + ((sectionWidth - (seatsPerRow * seatSpacing)) / 2);
              
              seatX = startX + (seat * seatSpacing);
              seatY = sectionTop + (row * rowSpacing) + 10;
            } else if (section.side === 'south') {
              // Южная трибуна (нижняя) - места идут слева направо
              const sectionWidth = 180 + 160;
              const seatsPerRow = section.seats;
              const startX = centerX - sectionWidth / 2 + ((sectionWidth - (seatsPerRow * seatSpacing)) / 2);
              
              seatX = startX + (seat * seatSpacing);
              seatY = sectionTop + (row * rowSpacing) + 10;
            } else if (section.side === 'east') {
              // Восточная трибуна (правая) - места идут сверху вниз
              const sectionHeight = 120 + 80;
              const seatsPerRow = section.seats;
              const startY = centerY - sectionHeight / 2 + ((sectionHeight - (seatsPerRow * seatSpacing)) / 2);
              
              seatX = sectionLeft + (row * rowSpacing) + 10;
              seatY = startY + (seat * seatSpacing);
            } else { // west
              // Западная трибуна (левая) - места идут сверху вниз
              const sectionHeight = 120 + 80;
              const seatsPerRow = section.seats;
              const startY = centerY - sectionHeight / 2 + ((sectionHeight - (seatsPerRow * seatSpacing)) / 2);
              
              seatX = sectionLeft + (row * rowSpacing) + 10;
              seatY = startY + (seat * seatSpacing);
            }
          } else {
            // Для других арен
            if (section.shape === 'rectangle') {
              seatX = sectionLeft + 10 + (seat * ((sectionWidth - 20) / section.seats));
              seatY = sectionTop + 10 + (row * 15);
            } else if (section.shape === 'curve') {
              // Расположение по дуге
              const angle = Math.PI - (Math.PI * (seat / section.seats));
              const radius = sectionHeight - (row * 15);
              seatX = mapWidth / 2 + Math.cos(angle) * radius;
              seatY = mapHeight / 2 + Math.sin(angle) * (radius / 2) - (config.type === 'arena' ? 50 : 0);
            } else if (section.shape === 'tier') {
              // Расположение ярусами
              seatX = sectionLeft + 10 + (seat * ((sectionWidth - 20) / section.seats));
              seatY = sectionTop + sectionHeight - 20 - (row * 15);
            } else {
              // Круговое расположение
              const angle = (Math.PI * 2 * (seat / section.seats));
              const radius = sectionWidth / 3 + (row * 15);
              seatX = mapWidth / 2 + Math.cos(angle) * radius;
              seatY = mapHeight / 4 + Math.sin(angle) * radius;
            }
          }
          
          // Добавляем место с информацией о статусе
          sectionSeats.push({
            type: 'seat',
            id: `${sectionIndex}-${row}-${seat}`,
            left: seatX,
            top: seatY,
            row: row + 1,
            seat: seat + 1,
            section: section.name,
            price: section.basePrice,
            color: section.color,
          });
        }
      }
      
      newSeatingMap.push(...sectionSeats);
    });
    
    setSeatingMap(newSeatingMap);
  };

  const handleSeatPress = (seat) => {
    // Проверяем, что это действительно место, а не метка
    if (seat.type !== 'seat') return;
    
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
      .filter(seat => seat.type === 'seat' && selectedSeats.includes(seat.id))
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
        width: 120,
        height: 120,
        marginLeft: -60,
        marginTop: -60,
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
              <View style={styles.goalArea1} />
              <View style={styles.goalArea2} />
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

  const renderSeatingMap = () => {
    if (!seatingMap.length) return null;

    const mapWidth = width - 40;
    const mapHeight = height * 0.6;

    return (
      <View style={styles.mapContainer}>
        <ScrollView
          style={styles.mapScrollView}
          contentContainerStyle={{
            width: mapWidth * 1.5,
            height: mapHeight * 1.5,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            paddingBottom: 100,
          }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          minimumZoomScale={0.8}
          maximumZoomScale={2.0}
          bouncesZoom={true}
          pinchGestureEnabled={true}
          scrollEnabled={true}
          nestedScrollEnabled={true}
        >
          <ScrollView
            contentContainerStyle={{
              width: mapWidth * 1.5,
              height: mapHeight * 1.5,
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: 100,
            }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            nestedScrollEnabled={true}
          >
            <View style={[
              styles.mapContent, 
              { 
                width: mapWidth, 
                height: mapHeight,
                paddingTop: 30,
              }
            ]}>
              
              {/* Сцена/Экран */}
              {venueConfig?.type !== 'octagon' && (
                <View style={styles.stage}>
                  <Text style={styles.stageText}>СЦЕНА / ЭКРАН</Text>
                </View>
              )}
              
              {/* Центр арены */}
              {renderVenueCenter()}
              
              {/* Отображаем места без меток секций */}
              {seatingMap.filter(item => item.type === 'seat').map((seat) => (
                <TouchableOpacity
                  key={seat.id}
                  style={[
                    styles.seatButton,
                    {
                      left: seat.left - 10,
                      top: seat.top - 10 - 30,
                      backgroundColor: getSeatColor(seat),
                      borderColor: selectedSeats.includes(seat.id) ? '#FF6B6B' : 'rgba(255,255,255,0.5)',
                      borderWidth: selectedSeats.includes(seat.id) ? 2 : 1,
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
                      fontSize: selectedSeats.includes(seat.id) ? 9 : 8,
                      fontWeight: selectedSeats.includes(seat.id) ? 'bold' : '600'
                    }
                  ]}>
                    {seat.row}-{seat.seat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </ScrollView>
      </View>
    );
  };

  return (
    <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" backgroundColor="#f5f7fa" />
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Выбор мест</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.container}>
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>{event?.title || 'Мероприятие'}</Text>
            <Text style={styles.eventDetails}>
              {event?.date || 'Дата не указана'} • {event?.location || event?.venue || 'Место не указано'}
            </Text>
          </View>

          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>
              👆 Нажмите на места для выбора • 🔍 Используйте жесты для масштабирования
            </Text>
            
            {venueConfig && (
              <View style={styles.sectionInfoContainer}>
                {venueConfig.sections.map((section, index) => (
                  <Text key={index} style={styles.sectionInfoText}>
                    {section.name}: <Text style={{fontWeight: 'bold'}}>{section.basePrice.toLocaleString('ru-RU')} ₸</Text>
                  </Text>
                ))}
              </View>
            )}
            
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
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 34),
    paddingBottom: 15,
    backgroundColor: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
  },
  backButton: {
    backgroundColor: 'rgba(102,126,234,0.85)',
    borderRadius: 22,
    padding: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
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
  mapContainer: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 5,
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mapScrollView: {
    flex: 1,
  },
  mapContent: {
    position: 'relative',
    backgroundColor: 'rgba(245, 247, 250, 0.9)',
  },
  stage: {
    position: 'absolute',
    top: 10,
    left: '25%',
    width: '50%',
    height: 30,
    backgroundColor: '#667eea',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  stageText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  seatButton: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  seatNumber: {
    color: 'white',
    fontSize: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
  instructionContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    margin: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  sectionInfoContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  sectionInfoText: {
    fontSize: 12,
    color: '#555',
    marginHorizontal: 6,
    marginVertical: 3,
  },
  selectedHint: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
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
    borderRadius: 20,
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
  footballField: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#4CAF50', // Зеленый цвет поля
    borderRadius: 8,
  },
  centerCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'transparent',
    position: 'absolute',
  },
  centerLine: {
    width: '100%',
    height: 2,
    backgroundColor: 'white',
    position: 'absolute',
  },
  penaltyArea1: {
    width: 60,
    height: 35,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 10,
    borderRadius: 2,
  },
  penaltyArea2: {
    width: 60,
    height: 35,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 10,
    borderRadius: 2,
  },
  goalArea1: {
    width: 30,
    height: 15,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 20,
    borderRadius: 2,
  },
  goalArea2: {
    width: 30,
    height: 15,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 20,
    borderRadius: 2,
  },
  fieldIcon: {
    position: 'absolute',
  },
  octagonRing: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: 25,
    transform: [{ rotate: '-22.5deg' }],
  },
  innerOctagon: {
    position: 'absolute',
    width: '85%',
    height: '85%',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.7)',
    borderRadius: 15,
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
}); 