import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function PaymentScreen({ navigation, route }) {
  const { bookingData } = route.params || {};
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const successAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;
  const starAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const paymentMethods = [
    {
      id: 'card',
      name: 'Банковская карта',
      icon: 'card',
      description: 'Visa, MasterCard, Мир',
      color: '#4CAF50',
    },
    {
      id: 'kaspi',
      name: 'Kaspi Pay',
      icon: 'phone-portrait',
      description: 'Оплата через Kaspi.kz',
      color: '#FF6B35',
    },
    {
      id: 'halyk',
      name: 'Halyk Bank',
      icon: 'wallet',
      description: 'Мобильное приложение',
      color: '#1976D2',
    },
    {
      id: 'forte',
      name: 'Forte Bank',
      icon: 'card-outline',
      description: 'ForteBank Mobile',
      color: '#9C27B0',
    },
  ];

  useEffect(() => {
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

  const startSuccessAnimation = () => {
    setShowSuccessModal(true);
    
    // Пульсирующая анимация чекмарка
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        })
      ])
    ).start();

    // Основная анимация появления
    Animated.parallel([
      Animated.spring(successAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      // Анимация конфетти
      Animated.timing(confettiAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      // Анимация звезд
      Animated.timing(starAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Симуляция обработки платежа
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setIsProcessing(false);
      startSuccessAnimation();
      
      // Через 3 секунды переходим в профиль
      setTimeout(() => {
        setShowSuccessModal(false);
        navigation.navigate('MainTabs', {
          screen: 'Profile',
          params: { 
            newBooking: {
              event: bookingData.event,
              seats: bookingData.seats,
              total: bookingData.total,
              date: bookingData.date,
              paymentMethod: selectedPaymentMethod,
            }
          }
        });
      }, 3000);

    } catch (error) {
      setIsProcessing(false);
      Alert.alert('Ошибка', 'Не удалось обработать платеж. Попробуйте еще раз.');
    }
  };

  const renderHeader = () => (
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
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Оплата билетов</Text>
          <View style={styles.headerPlaceholder} />
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const renderBookingSummary = () => (
    <Animated.View style={[styles.summaryContainer, { 
      opacity: fadeAnim,
      transform: [{ scale: scaleAnim }]
    }]}>
      <LinearGradient
        colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
        style={styles.summaryGradient}
      >
        <View style={styles.summaryHeader}>
          <Ionicons name="ticket" size={24} color="#667eea" />
          <Text style={styles.summaryTitle}>Детали бронирования</Text>
        </View>

        <View style={styles.summaryDetails}>
          <Text style={styles.eventTitle}>{bookingData?.event}</Text>
          <Text style={styles.eventDate}>
            {new Date(bookingData?.date).toLocaleDateString('ru-RU')}
          </Text>
          
          <View style={styles.seatsRow}>
            <Text style={styles.seatsLabel}>Места:</Text>
            <Text style={styles.seatsValue}>
              {bookingData?.seats?.join(', ')}
            </Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Итого к оплате:</Text>
            <Text style={styles.totalValue}>
              {bookingData?.total?.toLocaleString('ru-RU')} ₸
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const renderPaymentMethods = () => (
    <Animated.View style={[styles.paymentContainer, { opacity: fadeAnim }]}>
      <Text style={styles.sectionTitle}>Способ оплаты</Text>
      
      {paymentMethods.map((method, index) => (
        <Animated.View
          key={method.id}
          style={[
            styles.paymentMethod,
            {
              transform: [{
                translateY: slideAnim.interpolate({
                  inputRange: [0, 50],
                  outputRange: [0, 50 + index * 20],
                })
              }]
            }
          ]}
        >
          <TouchableOpacity
            style={[
              styles.paymentCard,
              selectedPaymentMethod === method.id && styles.paymentCardSelected
            ]}
            onPress={() => setSelectedPaymentMethod(method.id)}
          >
            <LinearGradient
              colors={selectedPaymentMethod === method.id 
                ? [method.color, method.color + 'CC'] 
                : ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']
              }
              style={styles.paymentGradient}
            >
              <View style={styles.paymentInfo}>
                <View style={styles.paymentIcon}>
                  <Ionicons 
                    name={method.icon} 
                    size={24} 
                    color={selectedPaymentMethod === method.id ? 'white' : method.color} 
                  />
                </View>
                
                <View style={styles.paymentDetails}>
                  <Text style={[
                    styles.paymentName,
                    selectedPaymentMethod === method.id && styles.paymentNameSelected
                  ]}>
                    {method.name}
                  </Text>
                  <Text style={[
                    styles.paymentDescription,
                    selectedPaymentMethod === method.id && styles.paymentDescriptionSelected
                  ]}>
                    {method.description}
                  </Text>
                </View>
              </View>

              {selectedPaymentMethod === method.id && (
                <Ionicons name="checkmark-circle" size={24} color="white" />
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </Animated.View>
  );

  const renderPayButton = () => (
    <Animated.View style={[styles.payButtonContainer, { 
      opacity: fadeAnim,
      transform: [{ scale: scaleAnim }]
    }]}>
      <TouchableOpacity
        style={styles.payButton}
        onPress={handlePayment}
        disabled={isProcessing}
      >
        <LinearGradient
          colors={isProcessing ? ['#ccc', '#999'] : ['#4CAF50', '#66BB6A']}
          style={styles.payButtonGradient}
        >
          {isProcessing ? (
            <Animated.View style={{ 
              transform: [{ 
                rotate: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                })
              }] 
            }}>
              <Ionicons name="hourglass" size={24} color="white" />
            </Animated.View>
          ) : (
            <Ionicons name="card" size={24} color="white" />
          )}
          <Text style={styles.payButtonText}>
            {isProcessing ? 'Обработка платежа...' : `Оплатить ${bookingData?.total?.toLocaleString('ru-RU')} ₸`}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderSuccessModal = () => (
    <Modal
      visible={showSuccessModal}
      transparent={true}
      animationType="none"
    >
      <View style={styles.successModalOverlay}>
        <Animated.View style={[styles.successModalContent, {
          opacity: successAnim,
          transform: [{ scale: successAnim }]
        }]}>
          <LinearGradient
            colors={['#4CAF50', '#66BB6A', '#81C784']}
            style={styles.successGradient}
          >
            {/* Конфетти анимация */}
            <Animated.View style={[styles.confettiContainer, {
              opacity: confettiAnim,
              transform: [{ 
                translateY: confettiAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-100, 200],
                })
              }]
            }]}>
              {[...Array(20)].map((_, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.confettiPiece,
                    {
                      left: Math.random() * (width - 40) + 20,
                      backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#667eea'][Math.floor(Math.random() * 4)],
                      transform: [
                        { 
                          rotate: confettiAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', `${360 * (index % 2 === 0 ? 1 : -1)}deg`],
                          })
                        }
                      ]
                    }
                  ]}
                />
              ))}
            </Animated.View>

            {/* Звезды */}
            <Animated.View style={[styles.starsContainer, {
              opacity: starAnim,
              transform: [{ scale: starAnim }]
            }]}>
              {[...Array(8)].map((_, index) => {
                const angle = (index * 45) * (Math.PI / 180);
                const radius = 60;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                return (
                  <Animated.View
                    key={index}
                    style={[
                      styles.star,
                      {
                        left: '50%',
                        top: '50%',
                        transform: [
                          { translateX: x - 10 },
                          { translateY: y - 10 },
                          { 
                            rotate: starAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0deg', '720deg'],
                            })
                          }
                        ]
                      }
                    ]}
                  >
                    <Ionicons name="star" size={16} color="#FFD700" />
                  </Animated.View>
                );
              })}
            </Animated.View>

            {/* Основной контент */}
            <Animated.View style={[styles.successContent, {
              transform: [{ scale: pulseAnim }]
            }]}>
              <View style={styles.successIconContainer}>
                <Ionicons name="checkmark-circle" size={80} color="white" />
              </View>
              
              <Text style={styles.successTitle}>Оплата успешна! 🎉</Text>
              <Text style={styles.successSubtitle}>
                Билеты добавлены в ваш профиль
              </Text>
              
              <View style={styles.successDetails}>
                <Text style={styles.successEvent}>{bookingData?.event}</Text>
                <Text style={styles.successAmount}>
                  {bookingData?.total?.toLocaleString('ru-RU')} ₸
                </Text>
              </View>

              <View style={styles.successFooter}>
                <Ionicons name="ticket" size={20} color="white" />
                <Text style={styles.successFooterText}>
                  Переход в профиль...
                </Text>
              </View>
            </Animated.View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      {renderHeader()}
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderBookingSummary()}
        {renderPaymentMethods()}
        {renderPayButton()}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      {renderSuccessModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerContainer: {
    marginBottom: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 25,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  summaryContainer: {
    marginBottom: 25,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  summaryGradient: {
    padding: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a202c',
    marginLeft: 12,
  },
  summaryDetails: {
    gap: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  eventDate: {
    fontSize: 14,
    color: '#718096',
  },
  seatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  seatsLabel: {
    fontSize: 14,
    color: '#718096',
  },
  seatsValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a202c',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  paymentContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 15,
  },
  paymentMethod: {
    marginBottom: 12,
  },
  paymentCard: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  paymentCardSelected: {
    elevation: 8,
    shadowOpacity: 0.2,
  },
  paymentGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  paymentNameSelected: {
    color: 'white',
  },
  paymentDescription: {
    fontSize: 14,
    color: '#718096',
    marginTop: 2,
  },
  paymentDescriptionSelected: {
    color: 'rgba(255,255,255,0.8)',
  },
  payButtonContainer: {
    marginTop: 20,
  },
  payButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  payButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 12,
  },
  bottomSpacing: {
    height: 50,
  },
  successModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successModalContent: {
    width: width * 0.85,
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  successGradient: {
    padding: 30,
    alignItems: 'center',
  },
  successIconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 20,
  },
  successDetails: {
    alignItems: 'center',
    marginBottom: 20,
  },
  successEvent: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  successAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  successFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successFooterText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  confettiPiece: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  starsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  star: {
    position: 'absolute',
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContent: {
    alignItems: 'center',
    zIndex: 3,
  },
}); 