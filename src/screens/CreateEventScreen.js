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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function CreateEventScreen({ navigation }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Футбол',
    price: '',
    capacity: '',
  });

  const [selectedCategory, setSelectedCategory] = useState('Футбол');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.id);
    handleInputChange('category', category.id);
  };

  const handleSubmit = async () => {
    // Валидация
    if (!formData.title.trim()) {
      Alert.alert('Ошибка', 'Введите название мероприятия');
      return;
    }
    if (!formData.description.trim()) {
      Alert.alert('Ошибка', 'Введите описание мероприятия');
      return;
    }
    if (!formData.date.trim()) {
      Alert.alert('Ошибка', 'Введите дату мероприятия');
      return;
    }
    if (!formData.time.trim()) {
      Alert.alert('Ошибка', 'Введите время мероприятия');
      return;
    }
    if (!formData.location.trim()) {
      Alert.alert('Ошибка', 'Введите место проведения');
      return;
    }

    setIsSubmitting(true);

    try {
      // Симуляция создания события
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Успех! 🎉',
        'Мероприятие успешно создано и ожидает модерации',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось создать мероприятие');
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
            onPress={() => handleCategorySelect(category)}
          >
            <Animated.View style={[
              styles.categoryCard,
              selectedCategory === category.id && styles.categoryCardSelected,
              { 
                transform: [{ 
                  scale: selectedCategory === category.id ? pulseAnim : 1 
                }] 
              }
            ]}>
              <LinearGradient
                colors={selectedCategory === category.id 
                  ? [category.color, category.color + 'CC'] 
                  : ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']
                }
                style={styles.categoryGradient}
              >
                <Ionicons 
                  name={category.icon} 
                  size={24} 
                  color={selectedCategory === category.id ? 'white' : category.color} 
                />
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextSelected
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

  const renderSubmitButton = () => (
    <Animated.View style={[styles.submitContainer, { 
      opacity: fadeAnim,
      transform: [{ scale: scaleAnim }]
    }]}>
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <LinearGradient
          colors={isSubmitting ? ['#ccc', '#999'] : ['#FF6B6B', '#FF8E8E']}
          style={styles.submitGradient}
        >
          {isSubmitting ? (
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Ionicons name="hourglass" size={24} color="white" />
            </Animated.View>
          ) : (
            <Ionicons name="checkmark-circle" size={24} color="white" />
          )}
          <Text style={styles.submitText}>
            {isSubmitting ? 'Создаем событие...' : 'Создать мероприятие'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
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
        <View style={styles.formContainer}>
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
          
          <View style={styles.priceCapacityRow}>
            <View style={styles.priceCapacityField}>
              {renderFormField('Цена билета (₸)', 'price', '0', 'numeric')}
            </View>
            <View style={styles.priceCapacityField}>
              {renderFormField('Вместимость', 'capacity', '100', 'numeric')}
            </View>
          </View>
          
          {renderSubmitButton()}
        </View>
        
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
  priceCapacityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceCapacityField: {
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
  submitContainer: {
    marginTop: 20,
  },
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  submitText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 12,
  },
  bottomSpacing: {
    height: 50,
  },
}); 