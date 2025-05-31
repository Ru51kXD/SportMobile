import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Platform,
  Image,
  Dimensions,
  Animated,
  StatusBar,
  Share,
  Modal,
  Linking,
  Alert,
  TextInput,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { worldEvents } from '../data/WorldEvents';
import { favoriteStorage } from '../data/FavoriteStorage';

const { width, height } = Dimensions.get('window');

export default function ProfileScreen({ navigation, route }) {
  const [userStats, setUserStats] = useState({
    eventsAttended: 47,
    totalSpent: 625000,
    favoriteEvents: 12,
    friendsInvited: 8,
    points: 2580,
    level: 'Gold Member'
  });

  const [recentBookings, setRecentBookings] = useState([
    {
      id: 1,
      event: 'UFC 301: Pereira vs Prochazka',
      date: '2024-06-29',
      seats: ['12-5', '12-6'],
      total: 150000,
      status: 'confirmed',
      paymentMethod: 'kaspi'
    },
    {
      id: 2,
      event: 'NBA Finals 2024: Game 7',
      date: '2024-06-21',
      seats: ['A-15'],
      total: 225000,
      status: 'pending',
      paymentMethod: 'card'
    }
  ]);

  const [createdEvents, setCreatedEvents] = useState([
    {
      id: 1,
      title: 'Любительский футбол',
      date: '2024-06-20',
      participants: 22,
      status: 'active'
    },
    {
      id: 2,
      title: 'Баскетбольный турнир',
      date: '2024-06-18',
      participants: 16,
      status: 'active'
    }
  ]);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const newBookingAnim = useRef(new Animated.Value(0)).current;

  const [bonusModalVisible, setBonusModalVisible] = useState(false);
  const [supportModalVisible, setSupportModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [settingsName, setSettingsName] = useState('ForWinkk');
  const [settingsEmail, setSettingsEmail] = useState('user@example.com');
  const [settingsLang, setSettingsLang] = useState('ru');
  const [settingsNotifications, setSettingsNotifications] = useState(true);

  useEffect(() => {
    // Проверяем новое бронирование из навигации
    if (route.params?.newBooking) {
      const newBooking = route.params.newBooking;
      
      // Добавляем новое бронирование с анимацией
      const booking = {
        id: Date.now(),
        event: newBooking.event,
        date: new Date(newBooking.date).toISOString().split('T')[0],
        seats: newBooking.seats,
        total: newBooking.total,
        status: 'confirmed',
        paymentMethod: newBooking.paymentMethod || 'card'
      };

      setRecentBookings(prev => [booking, ...prev]);
      
      // Обновляем статистику
      setUserStats(prev => ({
        ...prev,
        eventsAttended: prev.eventsAttended + 1,
        totalSpent: prev.totalSpent + newBooking.total,
        points: prev.points + Math.floor(newBooking.total / 100)
      }));

      // Анимация нового бронирования
      Animated.sequence([
        Animated.timing(newBookingAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(newBookingAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    }

    // Запускаем анимации
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

    // Анимация вращения для иконок
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, [route.params]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#4CAF50';
      case 'completed': return '#2196F3';
      case 'cancelled': return '#f44336';
      default: return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Подтверждено';
      case 'completed': return 'Завершено';
      case 'cancelled': return 'Отменено';
      case 'active': return 'Активно';
      default: return status;
    }
  };

  const renderHeader = () => (
    <SafeAreaView style={styles.headerSafeArea}>
      <Animated.View style={[styles.headerContainer, { 
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }]}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.profileInfo}>
              <Animated.View style={[styles.avatarContainer, { transform: [{ scale: scaleAnim }] }]}>
                <LinearGradient
                  colors={['#FFD700', '#FFA500']}
                  style={styles.avatar}
                >
                  <Ionicons name="person" size={40} color="white" />
                </LinearGradient>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>⭐</Text>
                </View>
              </Animated.View>
              
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{userStats.userName}</Text>
                <Text style={styles.userLevel}>{userStats.level}</Text>
                <View style={styles.pointsContainer}>
                  <Ionicons name="diamond" size={16} color="#FFD700" />
                  <Text style={styles.points}>{userStats.points} очков</Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity style={styles.settingsButton} onPress={() => setSettingsModalVisible(true)}>
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <Ionicons name="settings" size={24} color="white" />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>
      {/* Settings Modal */}
      <Modal visible={settingsModalVisible} transparent animationType="fade">
        <View style={{ flex:1, backgroundColor:'rgba(0,0,0,0.3)', justifyContent:'center', alignItems:'center' }}>
          <View style={{ backgroundColor:'white', borderRadius:16, padding:28, alignItems:'stretch', width:320 }}>
            <Ionicons name="settings-outline" size={40} color="#667eea" style={{ alignSelf:'center', marginBottom: 12 }} />
            <Text style={{ fontSize:20, fontWeight:'bold', marginBottom:16, alignSelf:'center' }}>Настройки</Text>
            <Text style={{ color:'#1a202c', fontWeight:'600', marginBottom:4 }}>Имя</Text>
            <TextInput
              style={{ borderWidth:1, borderColor:'#e0e0e0', borderRadius:10, padding:10, marginBottom:12, fontSize:16 }}
              value={settingsName}
              onChangeText={setSettingsName}
              placeholder="Ваше имя"
            />
            <Text style={{ color:'#1a202c', fontWeight:'600', marginBottom:4 }}>Email</Text>
            <TextInput
              style={{ borderWidth:1, borderColor:'#e0e0e0', borderRadius:10, padding:10, marginBottom:12, fontSize:16 }}
              value={settingsEmail}
              onChangeText={setSettingsEmail}
              placeholder="Ваш email"
              keyboardType="email-address"
            />
            <Text style={{ color:'#1a202c', fontWeight:'600', marginBottom:4 }}>Язык</Text>
            <View style={{ flexDirection:'row', marginBottom:12 }}>
              <TouchableOpacity onPress={()=>setSettingsLang('ru')} style={{ backgroundColor: settingsLang==='ru' ? '#667eea' : '#f0f0f0', borderRadius:8, paddingVertical:6, paddingHorizontal:16, marginRight:8 }}>
                <Text style={{ color: settingsLang==='ru' ? 'white' : '#1a202c', fontWeight:'600' }}>Русский</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>setSettingsLang('en')} style={{ backgroundColor: settingsLang==='en' ? '#667eea' : '#f0f0f0', borderRadius:8, paddingVertical:6, paddingHorizontal:16 }}>
                <Text style={{ color: settingsLang==='en' ? 'white' : '#1a202c', fontWeight:'600' }}>English</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection:'row', alignItems:'center', marginBottom:16 }}>
              <Text style={{ color:'#1a202c', fontWeight:'600', flex:1 }}>Уведомления</Text>
              <Switch value={settingsNotifications} onValueChange={setSettingsNotifications} />
            </View>
            <TouchableOpacity onPress={handleSaveSettings} style={{ backgroundColor:'#667eea', borderRadius:10, paddingVertical:12, alignItems:'center', marginBottom:12 }}>
              <Text style={{ color:'white', fontWeight:'bold', fontSize:16 }}>Сохранить</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={{ alignItems:'center', marginBottom:4 }}>
              <Text style={{ color:'#f44336', fontWeight:'bold', fontSize:16 }}>Выйти из аккаунта</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>setSettingsModalVisible(false)} style={{ alignItems:'center', marginTop:8 }}>
              <Text style={{ color:'#667eea', fontWeight:'bold', fontSize:16 }}>Отмена</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );

  const renderStats = () => (
    <Animated.View style={[styles.statsContainer, { 
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }]
    }]}>
      <Text style={styles.sectionTitle}>📊 Моя статистика</Text>
      
      <View style={styles.statsGrid}>
        <Animated.View style={[styles.statCard, { transform: [{ scale: scaleAnim }] }]}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E8E']}
            style={styles.statCardGradient}
          >
            <Ionicons name="calendar" size={24} color="white" />
            <Text style={styles.statNumber}>{userStats.eventsAttended}</Text>
            <Text style={styles.statLabel}>События</Text>
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[styles.statCard, { transform: [{ scale: scaleAnim }] }]}>
          <LinearGradient
            colors={['#4ECDC4', '#44A08D']}
            style={styles.statCardGradient}
          >
            <Ionicons name="card" size={24} color="white" />
            <Text style={styles.statNumber}>{Math.floor(userStats.totalSpent / 1000)}k ₸</Text>
            <Text style={styles.statLabel}>Потрачено</Text>
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[styles.statCard, { transform: [{ scale: scaleAnim }] }]}>
          <LinearGradient
            colors={['#45B7D1', '#96C93D']}
            style={styles.statCardGradient}
          >
            <Ionicons name="heart" size={24} color="white" />
            <Text style={styles.statNumber}>{userStats.favoriteEvents}</Text>
            <Text style={styles.statLabel}>Избранные</Text>
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[styles.statCard, { transform: [{ scale: scaleAnim }] }]}>
          <LinearGradient
            colors={['#F093FB', '#F5576C']}
            style={styles.statCardGradient}
          >
            <Ionicons name="people" size={24} color="white" />
            <Text style={styles.statNumber}>{userStats.friendsInvited}</Text>
            <Text style={styles.statLabel}>Друзья</Text>
          </LinearGradient>
        </Animated.View>
      </View>
    </Animated.View>
  );

  const renderRecentBookings = () => (
    <Animated.View style={[styles.bookingsContainer, { opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🎫 Мои бронирования</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>Все</Text>
        </TouchableOpacity>
      </View>

      {recentBookings.map((booking, index) => (
        <Animated.View
          key={booking.id}
          style={[
            styles.bookingCard,
            {
              transform: [{
                translateY: slideAnim.interpolate({
                  inputRange: [0, 50],
                  outputRange: [0, 50 + index * 20],
                })
              }, {
                scale: (index === 0 && route.params?.newBooking) 
                  ? newBookingAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.05],
                    })
                  : 1
              }]
            }
          ]}
        >
          <LinearGradient
            colors={index === 0 && route.params?.newBooking 
              ? ['rgba(76, 175, 80, 0.9)', 'rgba(76, 175, 80, 0.7)'] 
              : ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']
            }
            style={styles.bookingCardGradient}
          >
            {/* Новое бронирование badge */}
            {index === 0 && route.params?.newBooking && (
              <Animated.View style={[styles.newBookingBadge, {
                opacity: newBookingAnim,
                transform: [{ scale: newBookingAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }) }]
              }]}>
                <Text style={styles.newBookingText}>✨ Новое!</Text>
              </Animated.View>
            )}

            <View style={styles.bookingHeader}>
              <View style={styles.bookingInfo}>
                <Text style={[styles.bookingEvent, {
                  color: index === 0 && route.params?.newBooking ? 'white' : '#1a202c'
                }]} numberOfLines={1}>
                  {booking.event}
                </Text>
                <Text style={[styles.bookingDate, {
                  color: index === 0 && route.params?.newBooking ? 'rgba(255,255,255,0.8)' : '#718096'
                }]}>
                  {new Date(booking.date).toLocaleDateString('ru-RU')}
                </Text>
              </View>
              
              <View style={[
                styles.statusBadge,
                { 
                  backgroundColor: booking.status === 'confirmed' ? '#4CAF50' : '#FF9800',
                  opacity: index === 0 && route.params?.newBooking ? 0.8 : 1
                }
              ]}>
                <Text style={styles.statusText}>
                  {booking.status === 'confirmed' ? 'Подтвержден' : 'Ожидание'}
                </Text>
              </View>
            </View>

            <View style={styles.bookingDetails}>
              <View style={styles.seatsInfo}>
                <Ionicons name="location" size={16} color={index === 0 && route.params?.newBooking ? 'white' : '#667eea'} />
                <Text style={[styles.seatsText, {
                  color: index === 0 && route.params?.newBooking ? 'white' : '#667eea'
                }]}>
                  Места: {booking.seats.join(', ')}
                </Text>
              </View>
              
              <View style={styles.paymentInfo}>
                <Ionicons 
                  name={booking.paymentMethod === 'kaspi' ? 'phone-portrait' : 'card'} 
                  size={14} 
                  color={index === 0 && route.params?.newBooking ? 'rgba(255,255,255,0.8)' : '#718096'} 
                />
                <Text style={[styles.paymentText, {
                  color: index === 0 && route.params?.newBooking ? 'rgba(255,255,255,0.8)' : '#718096'
                }]}>
                  {booking.paymentMethod === 'kaspi' ? 'Kaspi Pay' : 'Карта'}
                </Text>
              </View>
              
              <Text style={[styles.bookingPrice, {
                color: index === 0 && route.params?.newBooking ? 'white' : '#1a202c'
              }]}>
                {booking.total.toLocaleString('ru-RU')} ₸
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>
      ))}
    </Animated.View>
  );

  // Быстрое действие: Избранное
  const handleFavoritesPress = () => {
    navigation.navigate('Favorites', { favoriteIds: favoriteStorage.getFavorites() });
  };

  // Быстрое действие: Бонусы
  const handleBonusPress = () => {
    setBonusModalVisible(true);
  };

  // Быстрое действие: Пригласить
  const handleInvitePress = async () => {
    try {
      await Share.share({
        message: 'Присоединяйся к лучшему спортивному приложению! SportMobile ⚡️',
      });
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось открыть диалог приглашения');
    }
  };

  // Быстрое действие: Поддержка
  const handleSupportPress = () => {
    setSupportModalVisible(true);
  };

  // Сохранить настройки
  const handleSaveSettings = () => {
    // Можно добавить валидацию email/имени
    setUserStats(prev => ({ ...prev, userName: settingsName }));
    setSettingsModalVisible(false);
    Alert.alert('Сохранено', 'Настройки успешно сохранены!');
  };

  // Выйти из аккаунта
  const handleLogout = () => {
    setSettingsModalVisible(false);
    Alert.alert('Выход', 'Вы вышли из аккаунта!');
    // Здесь можно добавить логику выхода
  };

  const renderQuickActions = () => (
    <Animated.View style={[styles.quickActionsContainer, { opacity: fadeAnim }]}>
      <Text style={styles.sectionTitle}>⚡ Быстрые действия</Text>
      
      <View style={styles.actionsGrid}>
        <TouchableOpacity style={styles.actionButton} onPress={handleFavoritesPress}>
          <LinearGradient colors={['#667eea', '#764ba2']} style={styles.actionGradient}>
            <Ionicons name="heart-outline" size={24} color="white" />
            <Text style={styles.actionText}>Избранное</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleBonusPress}>
          <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.actionGradient}>
            <Ionicons name="gift-outline" size={24} color="white" />
            <Text style={styles.actionText}>Бонусы</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleInvitePress}>
          <LinearGradient colors={['#4ecdc4', '#44a08d']} style={styles.actionGradient}>
            <Ionicons name="share-outline" size={24} color="white" />
            <Text style={styles.actionText}>Пригласить</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleSupportPress}>
          <LinearGradient colors={['#ffecd2', '#fcb69f']} style={styles.actionGradient}>
            <Ionicons name="help-circle-outline" size={24} color="white" />
            <Text style={styles.actionText}>Поддержка</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Модалка бонусов */}
      <Modal visible={bonusModalVisible} transparent animationType="fade">
        <View style={{ flex:1, backgroundColor:'rgba(0,0,0,0.3)', justifyContent:'center', alignItems:'center' }}>
          <View style={{ backgroundColor:'white', borderRadius:16, padding:28, alignItems:'center', width:300 }}>
            <Ionicons name="gift-outline" size={40} color="#f093fb" style={{ marginBottom: 12 }} />
            <Text style={{ fontSize:18, fontWeight:'bold', marginBottom:8 }}>Бонусы скоро!</Text>
            <Text style={{ color:'#666', textAlign:'center', marginBottom:18 }}>Ваша бонусная программа скоро будет доступна. Следите за обновлениями!</Text>
            <TouchableOpacity onPress={()=>setBonusModalVisible(false)} style={{ marginTop:8 }}>
              <Text style={{ color:'#667eea', fontWeight:'bold', fontSize:16 }}>ОК</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Модалка поддержки */}
      <Modal visible={supportModalVisible} transparent animationType="fade">
        <View style={{ flex:1, backgroundColor:'rgba(0,0,0,0.3)', justifyContent:'center', alignItems:'center' }}>
          <View style={{ backgroundColor:'white', borderRadius:16, padding:28, alignItems:'center', width:300 }}>
            <Ionicons name="help-circle-outline" size={40} color="#fcb69f" style={{ marginBottom: 12 }} />
            <Text style={{ fontSize:18, fontWeight:'bold', marginBottom:8 }}>Поддержка</Text>
            <Text style={{ color:'#666', textAlign:'center', marginBottom:18 }}>Пишите нам на support@sportmobile.kz или звоните +7 777 123 45 67</Text>
            <TouchableOpacity onPress={()=>{
              Linking.openURL('mailto:support@sportmobile.kz');
              setSupportModalVisible(false);
            }} style={{ marginBottom:8 }}>
              <Text style={{ color:'#667eea', fontWeight:'bold', fontSize:16 }}>Написать на почту</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>setSupportModalVisible(false)}>
              <Text style={{ color:'#667eea', fontWeight:'bold', fontSize:16 }}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderHeader()}
        {renderStats()}
        {renderRecentBookings()}
        {renderQuickActions()}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerSafeArea: {
    backgroundColor: '#667eea',
  },
  headerContainer: {
    marginBottom: 25,
  },
  header: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 32 : 24,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 12,
  },
  userInfo: {
    marginLeft: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  userLevel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  points: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
    marginLeft: 4,
  },
  settingsButton: {
    padding: 12,
  },
  statsContainer: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 60) / 2,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  statCardGradient: {
    padding: 20,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  bookingsContainer: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
  },
  bookingCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookingCardGradient: {
    padding: 16,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bookingInfo: {
    flex: 1,
    marginRight: 12,
  },
  bookingEvent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  bookingDate: {
    fontSize: 14,
    color: '#718096',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  bookingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seatsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seatsText: {
    fontSize: 14,
    color: '#667eea',
    marginLeft: 4,
    fontWeight: '500',
  },
  bookingPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  quickActionsContainer: {
    marginHorizontal: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: (width - 60) / 2,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionGradient: {
    padding: 20,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    marginTop: 8,
  },
  bottomSpacing: {
    height: 50,
  },
  newBookingBadge: {
    position: 'absolute',
    top: -8,
    left: 16,
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  newBookingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  paymentText: {
    fontSize: 12,
    marginLeft: 4,
  },
}); 