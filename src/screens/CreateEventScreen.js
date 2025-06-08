import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  StatusBar,
  Animated,
  Dimensions,
  Platform,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import UserStorage from '../data/UserStorage';
import EventStorage from '../data/WorldEvents';

const { width, height } = Dimensions.get('window');

const STEPS = {
  BASIC_INFO: 0,
  SEAT_PRICING: 1,
  PREVIEW: 2,
};

export default function CreateEventScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(STEPS.BASIC_INFO);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Футбол',
    venue: '',
    sport_color: '#667eea',
    sport_icon: 'trophy',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop',
  });

  const [seatPricing, setSeatPricing] = useState({
    sections: [
      { name: 'VIP', price: '', capacity: '', color: '#FF6B6B' },
      { name: 'Партер', price: '', capacity: '', color: '#4CAF50' },
      { name: 'Балкон', price: '', capacity: '', color: '#667eea' },
    ],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const successAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  const categories = [
    { id: 'Футбол', name: 'Футбол', icon: 'football', color: '#4CAF50' },
    { id: 'Баскетбол', name: 'Баскетбол', icon: 'basketball', color: '#FF9800' },
    { id: 'Теннис', name: 'Теннис', icon: 'tennisball', color: '#2196F3' },
    { id: 'Бокс', name: 'Бокс', icon: 'fitness', color: '#F44336' },
    { id: 'Хоккей', name: 'Хоккей', icon: 'snow', color: '#00BCD4' },
    { id: 'Волейбол', name: 'Волейбол', icon: 'baseball', color: '#9C27B0' },
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

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      ])
    ).start();

    // Rotate animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSeatPricingChange = (index, field, value) => {
    const newSections = [...seatPricing.sections];
    newSections[index] = {
      ...newSections[index],
      [field]: value,
    };
    setSeatPricing({ sections: newSections });
  };

  const validateBasicInfo = () => {
    if (!formData.title.trim()) {
      Alert.alert('Ошибка', 'Введите название мероприятия');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Ошибка', 'Введите описание мероприятия');
      return false;
    }
    if (!formData.date.trim()) {
      Alert.alert('Ошибка', 'Введите дату мероприятия');
      return false;
    }
    if (!formData.time.trim()) {
      Alert.alert('Ошибка', 'Введите время мероприятия');
      return false;
    }
    if (!formData.location.trim()) {
      Alert.alert('Ошибка', 'Введите место проведения');
      return false;
    }
    return true;
  };

  const validateSeatPricing = () => {
    for (const section of seatPricing.sections) {
      if (!section.price || !section.capacity) {
        Alert.alert('Ошибка', 'Заполните все поля цен и вместимости');
        return false;
      }
      if (isNaN(section.price) || isNaN(section.capacity)) {
        Alert.alert('Ошибка', 'Цена и вместимость должны быть числами');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === STEPS.BASIC_INFO) {
      if (validateBasicInfo()) {
        setCurrentStep(STEPS.SEAT_PRICING);
      }
    } else if (currentStep === STEPS.SEAT_PRICING) {
      if (validateSeatPricing()) {
        setCurrentStep(STEPS.PREVIEW);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > STEPS.BASIC_INFO) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleSubmit = async () => {
    if (!UserStorage.isAdmin()) {
      Alert.alert('Ошибка', 'Только администратор может создавать события');
      return;
    }

    // Проверка всех полей формы
    if (!validateBasicInfo() || !validateSeatPricing()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const totalCapacity = seatPricing.sections.reduce((sum, section) => sum + Number(section.capacity), 0);
      const minPrice = Math.min(...seatPricing.sections.map(section => Number(section.price)));
      const maxPrice = Math.max(...seatPricing.sections.map(section => Number(section.price)));

      // Создаем уникальный ID для события
      const eventId = `event-${Date.now().toString()}`;
      
      // Форматируем данные события
      const newEvent = {
        id: eventId,
        ...formData,
        price: minPrice,
        originalPrice: maxPrice,
        capacity: totalCapacity,
        available_tickets: totalCapacity,
        isHot: false,
        rating: 0,
        reviews_count: 0,
        tags: [formData.category],
        discount: Math.floor((maxPrice - minPrice) / maxPrice * 100) || 0,
        seatPricing: seatPricing.sections,
        venue: formData.venue || `${formData.location} Arena`,
      };

      // Сохраняем новое событие
      EventStorage.addEvent(newEvent);
      
      // Показываем сообщение об успехе
      startSuccessAnimation();
      
      setTimeout(() => {
        setShowSuccessModal(false);
        navigation.goBack();
      }, 3000);
    } catch (error) {
      console.error('Ошибка при создании мероприятия:', error);
      Alert.alert('Ошибка', 'Не удалось создать мероприятие. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
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
          
          <View style={styles.headerTitleContainer}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Ionicons name="add-circle" size={28} color="white" />
            </Animated.View>
            <Text style={styles.headerTitle}>Создать событие</Text>
          </View>
          
          <View style={styles.headerPlaceholder} />
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const renderFormField = (label, field, placeholder, keyboardType = 'default', multiline = false) => (
    <Animated.View style={[styles.fieldContainer, { 
      opacity: fadeAnim,
      transform: [{ scale: scaleAnim }]
    }]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputContainer}>
        <LinearGradient
          colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
          style={[styles.inputGradient, multiline && styles.multilineInput]}
        >
          <TextInput
            style={[styles.textInput, multiline && styles.multilineTextInput]}
            placeholder={placeholder}
            value={formData[field]}
            onChangeText={(value) => handleInputChange(field, value)}
            keyboardType={keyboardType}
            multiline={multiline}
            numberOfLines={multiline ? 4 : 1}
            placeholderTextColor="#999"
          />
        </LinearGradient>
      </View>
    </Animated.View>
  );

  const renderCategorySelector = () => (
    <Animated.View style={[styles.categoryContainer, { 
      opacity: fadeAnim,
      transform: [{ scale: scaleAnim }]
    }]}>
      <Text style={styles.fieldLabel}>Категория</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryOption}
            onPress={() => handleInputChange('category', category.id)}
          >
            <Animated.View style={[
              styles.categoryCard,
              formData.category === category.id && styles.categoryCardSelected,
              { 
                transform: [{ 
                  scale: formData.category === category.id ? pulseAnim : 1 
                }] 
              }
            ]}>
              <LinearGradient
                colors={formData.category === category.id 
                  ? [category.color, category.color + 'CC'] 
                  : ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']
                }
                style={styles.categoryGradient}
              >
                <Ionicons 
                  name={category.icon} 
                  size={24} 
                  color={formData.category === category.id ? 'white' : category.color} 
                />
                <Text style={[
                  styles.categoryText,
                  formData.category === category.id && styles.categoryTextSelected
                ]}>
                  {category.name}
                </Text>
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case STEPS.BASIC_INFO:
        return (
          <>
            {renderFormField('Название мероприятия', 'title', 'Введите название...')}
            {renderFormField('Описание', 'description', 'Расскажите о мероприятии...', 'default', true)}
            
            <View style={styles.dateTimeRow}>
              <View style={styles.dateTimeField}>
                {renderFormField('Дата', 'date', 'ДД.ММ.ГГГГ')}
              </View>
              <View style={styles.dateTimeField}>
                {renderFormField('Время', 'time', 'ЧЧ:ММ')}
              </View>
            </View>
            
            {renderFormField('Место проведения', 'location', 'Адрес или название места...')}
            {renderCategorySelector()}
          </>
        );
      case STEPS.SEAT_PRICING:
        return (
          <>
            {seatPricing.sections.map((section, index) => (
              <View key={index} style={styles.sectionContainer}>
                <View style={[styles.sectionHeader, { backgroundColor: section.color + '20' }]}>
                  <Text style={[styles.sectionTitle, { color: section.color }]}>
                    {section.name}
                  </Text>
                </View>
                
                <View style={styles.sectionFields}>
                  <View style={styles.sectionField}>
                    <Text style={styles.fieldLabel}>Цена (₸)</Text>
                    <TextInput
                      style={[styles.input, { borderColor: section.color }]}
                      value={section.price}
                      onChangeText={(value) => handleSeatPricingChange(index, 'price', value)}
                      keyboardType="numeric"
                      placeholder="0"
                    />
                  </View>
                  
                  <View style={styles.sectionField}>
                    <Text style={styles.fieldLabel}>Вместимость</Text>
                    <TextInput
                      style={[styles.input, { borderColor: section.color }]}
                      value={section.capacity}
                      onChangeText={(value) => handleSeatPricingChange(index, 'capacity', value)}
                      keyboardType="numeric"
                      placeholder="0"
                    />
                  </View>
                </View>
              </View>
            ))}
          </>
        );
      case STEPS.PREVIEW:
        return (
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>{formData.title}</Text>
            <Text style={styles.previewDescription}>{formData.description}</Text>
            
            <View style={styles.previewInfo}>
              <View style={styles.previewInfoItem}>
                <Ionicons name="calendar" size={20} color="#667eea" />
                <Text style={styles.previewInfoText}>{formData.date}</Text>
              </View>
              
              <View style={styles.previewInfoItem}>
                <Ionicons name="time" size={20} color="#667eea" />
                <Text style={styles.previewInfoText}>{formData.time}</Text>
              </View>
              
              <View style={styles.previewInfoItem}>
                <Ionicons name="location" size={20} color="#667eea" />
                <Text style={styles.previewInfoText}>{formData.location}</Text>
              </View>
            </View>
            
            <View style={styles.previewSections}>
              {seatPricing.sections.map((section, index) => (
                <View key={index} style={styles.previewSection}>
                  <View style={[styles.previewSectionDot, { backgroundColor: section.color }]} />
                  <Text style={styles.previewSectionName}>{section.name}</Text>
                  <Text style={styles.previewSectionPrice}>
                    {Number(section.price).toLocaleString('ru-RU')} ₸
                  </Text>
                  <Text style={styles.previewSectionCapacity}>
                    {section.capacity} мест
                  </Text>
                </View>
              ))}
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  const renderNavigationButtons = () => (
    <View style={styles.navigationButtons}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={handlePrevStep}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.navButtonGradient}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.navButtonText}>
            {currentStep === STEPS.BASIC_INFO ? 'Назад' : 'Предыдущий шаг'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {currentStep < STEPS.PREVIEW ? (
        <TouchableOpacity
          style={styles.navButton}
          onPress={handleNextStep}
        >
          <LinearGradient
            colors={['#FF6B6B', '#FF8E8E']}
            style={styles.navButtonGradient}
          >
            <Text style={styles.navButtonText}>Следующий шаг</Text>
            <Ionicons name="arrow-forward" size={24} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.navButton}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <LinearGradient
            colors={isSubmitting ? ['#ccc', '#999'] : ['#4CAF50', '#66BB6A']}
            style={styles.navButtonGradient}
          >
            {isSubmitting ? (
              <Animated.View style={{ transform: [{ rotate: rotateAnim }] }}>
                <Ionicons name="hourglass" size={24} color="white" />
              </Animated.View>
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={24} color="white" />
                <Text style={styles.navButtonText}>Создать мероприятие</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );

  const startSuccessAnimation = () => {
    setShowSuccessModal(true);
    
    // Анимация успешного создания
    Animated.sequence([
      Animated.timing(successAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(confettiAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  };

  const renderSuccessModal = () => (
    <Modal
      visible={showSuccessModal}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalContainer}>
        <Animated.View 
          style={[
            styles.successModal,
            { 
              opacity: successAnim,
              transform: [
                { scale: successAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.5, 1.1, 1]
                }) }
              ]
            }
          ]}
        >
          <LinearGradient
            colors={['#6ee7b7', '#3b82f6']}
            style={styles.successModalContent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Animated.View style={{
              opacity: confettiAnim,
              transform: [{ scale: confettiAnim }]
            }}>
              <Ionicons name="checkmark-circle" size={80} color="white" />
            </Animated.View>
            
            <Text style={styles.successTitle}>Событие создано!</Text>
            <Text style={styles.successMessage}>
              Ваше мероприятие "{formData.title}" успешно создано и опубликовано.
            </Text>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {renderHeader()}
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.formContainer}>
          {renderStepContent()}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={handlePrevStep}
        >
          <Ionicons name="chevron-back" size={24} color="#667eea" />
          <Text style={styles.footerButtonText}>
            {currentStep > STEPS.BASIC_INFO ? 'Назад' : 'Отмена'}
          </Text>
        </TouchableOpacity>
        
        {currentStep < STEPS.PREVIEW ? (
          <TouchableOpacity
            style={styles.footerButton}
            onPress={handleNextStep}
          >
            <Text style={styles.footerButtonText}>Далее</Text>
            <Ionicons name="chevron-forward" size={24} color="#667eea" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.footerButton, styles.submitButton]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.submitButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {isSubmitting ? (
                <View style={styles.submitLoading}>
                  <Animated.View style={{
                    transform: [{ rotate: spin }]
                  }}>
                    <Ionicons name="refresh" size={24} color="white" />
                  </Animated.View>
                </View>
              ) : (
                <View style={styles.submitContent}>
                  <Text style={styles.submitText}>Создать</Text>
                  <Ionicons name="checkmark" size={24} color="white" />
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
      
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
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 12,
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 8,
  },
  inputContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputGradient: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  multilineInput: {
    paddingVertical: 16,
  },
  textInput: {
    fontSize: 16,
    color: '#1a202c',
    minHeight: 20,
  },
  multilineTextInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateTimeField: {
    width: (width - 60) / 2,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoriesScroll: {
    paddingVertical: 5,
  },
  categoryOption: {
    marginRight: 12,
  },
  categoryCard: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryCardSelected: {
    elevation: 8,
    shadowOpacity: 0.2,
  },
  categoryGradient: {
    padding: 16,
    alignItems: 'center',
    minWidth: 100,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    color: '#667eea',
  },
  categoryTextSelected: {
    color: 'white',
  },
  sectionContainer: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    padding: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionFields: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionField: {
    flex: 1,
    marginHorizontal: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
  },
  previewCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 12,
  },
  previewDescription: {
    fontSize: 16,
    color: '#4a5568',
    marginBottom: 20,
  },
  previewInfo: {
    marginBottom: 20,
  },
  previewInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewInfoText: {
    fontSize: 16,
    color: '#4a5568',
    marginLeft: 8,
  },
  previewSections: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 16,
  },
  previewSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewSectionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  previewSectionName: {
    flex: 1,
    fontSize: 16,
    color: '#4a5568',
  },
  previewSectionPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a202c',
    marginRight: 16,
  },
  previewSectionCapacity: {
    fontSize: 14,
    color: '#718096',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  navButton: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  navButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
    marginLeft: 8,
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  submitLoading: {
    padding: 16,
  },
  submitContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  successModal: {
    width: width * 0.85,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  successModalContent: {
    padding: 30,
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    lineHeight: 22,
  },
}); 