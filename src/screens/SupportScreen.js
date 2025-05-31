import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
  StatusBar,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const FAQS = [
  {
    q: 'Как купить билет на событие?',
    a: 'Выберите событие, нажмите "Забронировать", выберите места и оплатите удобным способом.'
  },
  {
    q: 'Как добавить событие в избранное?',
    a: 'На экране события нажмите на иконку сердца в правом верхнем углу.'
  },
  {
    q: 'Как связаться с поддержкой?',
    a: 'Вы можете написать нам на почту, позвонить или перейти в Telegram.'
  },
  {
    q: 'Как получить бонусы?',
    a: 'Бонусная программа скоро будет доступна. Следите за обновлениями!'
  },
];

const SupportScreen = ({ navigation }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const anims = useRef(FAQS.map(() => new Animated.Value(0))).current;

  const handleEmail = () => {
    Linking.openURL('mailto:support@sportmobile.kz');
  };
  const handlePhone = () => {
    Linking.openURL('tel:+77771234567');
  };
  const handleTelegram = () => {
    Linking.openURL('https://t.me/dyhuex');
  };

  const handleToggleFAQ = (idx) => {
    if (openIndex === idx) {
      Animated.timing(anims[idx], {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => setOpenIndex(null));
    } else {
      if (openIndex !== null) {
        Animated.timing(anims[openIndex], {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
      setOpenIndex(idx);
      Animated.timing(anims[idx], {
        toValue: 1,
        duration: 250,
        useNativeDriver: false,
      }).start();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      {/* Header */}
      <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.headerGradient}>
        <SafeAreaView style={styles.headerSafeArea}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Поддержка</Text>
            <View style={styles.placeholder} />
          </View>
        </SafeAreaView>
      </LinearGradient>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Часто задаваемые вопросы</Text>
        {FAQS.map((item, idx) => (
          <View key={idx} style={styles.faqItemWrap}>
            <TouchableOpacity onPress={() => handleToggleFAQ(idx)} activeOpacity={0.8}>
              <LinearGradient colors={[openIndex === idx ? '#667eea' : '#fff', '#f8fafc']} style={[styles.faqItem, openIndex === idx && styles.faqItemActive]}>
                <View style={styles.faqQuestionRow}>
                  <Ionicons name="help-circle-outline" size={22} color={openIndex === idx ? 'white' : '#667eea'} style={{ marginRight: 10 }} />
                  <Text style={[styles.faqQuestion, openIndex === idx && { color: 'white' }]}>{item.q}</Text>
                  <Ionicons name={openIndex === idx ? 'chevron-up' : 'chevron-down'} size={20} color={openIndex === idx ? 'white' : '#667eea'} />
                </View>
                <Animated.View style={{
                  height: anims[idx].interpolate({ inputRange: [0, 1], outputRange: [0, 60] }),
                  overflow: 'hidden',
                  opacity: anims[idx],
                  marginTop: 6,
                }}>
                  <Text style={[styles.faqAnswer, openIndex === idx && { color: 'white' }]}>{item.a}</Text>
                </Animated.View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ))}
        <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Связаться с поддержкой</Text>
        <LinearGradient colors={["#fcb69f", "#ffecd2"]} style={styles.contactBlock}>
          <TouchableOpacity style={styles.contactRow} onPress={handleEmail} activeOpacity={0.8}>
            <Ionicons name="mail-outline" size={22} color="#667eea" style={{ marginRight: 12 }} />
            <Text style={styles.contactText}>support@sportmobile.kz</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactRow} onPress={handlePhone} activeOpacity={0.8}>
            <Ionicons name="call-outline" size={22} color="#667eea" style={{ marginRight: 12 }} />
            <Text style={styles.contactText}>+7 777 123 45 67</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactRow} onPress={handleTelegram} activeOpacity={0.8}>
            <Ionicons name="paper-plane-outline" size={22} color="#229ED9" style={{ marginRight: 12 }} />
            <Text style={[styles.contactText, { color: '#229ED9', fontWeight: 'bold' }]}>@dyhuex</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerGradient: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  headerSafeArea: {
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: Platform.OS === 'android' ? 32 : 24,
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 16,
    marginTop: 8,
  },
  faqItemWrap: {
    marginBottom: 12,
  },
  faqItem: {
    borderRadius: 16,
    padding: 18,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  faqItemActive: {
    backgroundColor: '#667eea',
    shadowOpacity: 0.12,
  },
  faqQuestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
    flex: 1,
    marginRight: 8,
  },
  faqAnswer: {
    fontSize: 15,
    color: '#1a202c',
    lineHeight: 22,
    marginTop: 2,
  },
  contactBlock: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 18,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  contactText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '500',
  },
});

export default SupportScreen; 