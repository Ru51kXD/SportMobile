import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Dimensions,
  Animated,
  FlatList,
  Share,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Пример данных
const BONUS_LEVELS = [
  { 
    level: 'Silver', min: 0, max: 999, color: ['#bfc7d1', '#e0e0e0'],
    icon: 'medal-outline',
    perks: [
      'Базовое накопление бонусов',
      'Доступ к стандартным акциям',
    ]
  },
  { 
    level: 'Gold', min: 1000, max: 4999, color: ['#FFD700', '#FFA500'],
    icon: 'trophy-outline',
    perks: [
      'Ускоренное накопление бонусов',
      'Эксклюзивные скидки',
      'Приоритетная поддержка',
    ]
  },
  { 
    level: 'Platinum', min: 5000, max: 9999, color: ['#b3c6ff', '#667eea'],
    icon: 'diamond-outline',
    perks: [
      'Максимальный кэшбэк',
      'Доступ к закрытым событиям',
      'Подарки на день рождения',
    ]
  },
  { 
    level: 'Diamond', min: 10000, max: 999999, color: ['#00e6e6', '#667eea'],
    icon: 'star-outline',
    perks: [
      'VIP-статус',
      'Личные предложения',
      'Билеты без очереди',
      'Подарки от партнеров',
    ]
  },
];

const BONUS_HISTORY = [
  { id: 1, type: 'earn', amount: 200, date: '2024-06-01', desc: 'Покупка билета: UFC 301' },
  { id: 2, type: 'earn', amount: 100, date: '2024-06-03', desc: 'Приглашение друга' },
  { id: 3, type: 'spend', amount: 150, date: '2024-06-10', desc: 'Скидка на билет' },
  { id: 4, type: 'earn', amount: 300, date: '2024-06-15', desc: 'Покупка билета: NBA Finals' },
  { id: 5, type: 'earn', amount: 50, date: '2024-06-18', desc: 'Оставлен отзыв' },
];

export default function BonusScreen({ navigation }) {
  // Состояния
  const [bonus, setBonus] = useState(1200);
  const [history, setHistory] = useState(BONUS_HISTORY);
  const [animValue] = useState(new Animated.Value(0));

  // Определяем уровень
  const currentLevel = BONUS_LEVELS.find(lvl => bonus >= lvl.min && bonus <= lvl.max) || BONUS_LEVELS[0];
  const nextLevel = BONUS_LEVELS.find(lvl => lvl.min > bonus) || BONUS_LEVELS[BONUS_LEVELS.length - 1];
  const progress = nextLevel ? (bonus - currentLevel.min) / (nextLevel.min - currentLevel.min) : 1;

  // Анимация при получении бонусов
  useEffect(() => {
    Animated.sequence([
      Animated.timing(animValue, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(animValue, { toValue: 0, duration: 600, useNativeDriver: true })
    ]).start();
  }, [bonus]);

  // Формат даты
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: '2-digit' });
  };

  // История бонусов
  const renderHistoryItem = ({ item }) => (
    <View style={[styles.historyItem, item.type === 'earn' ? styles.historyEarn : styles.historySpend]}>
      <View style={styles.historyIconWrap}>
        <Ionicons name={item.type === 'earn' ? 'add-circle' : 'remove-circle'} size={28} color={item.type === 'earn' ? '#4ECDC4' : '#FF6B6B'} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.historyDesc}>{item.desc}</Text>
        <Text style={styles.historyDate}>{formatDate(item.date)}</Text>
      </View>
      <Text style={[styles.historyAmount, { color: item.type === 'earn' ? '#4ECDC4' : '#FF6B6B' }] }>
        {item.type === 'earn' ? '+' : '-'}{item.amount}
      </Text>
    </View>
  );

  // Показ преимуществ статусов
  const renderLevelCard = (level, idx) => (
    <LinearGradient key={level.level} colors={level.color} style={styles.levelCard}>
      <View style={styles.levelCardHeader}>
        <Ionicons name={level.icon} size={28} color={level.level === currentLevel.level ? '#FFD700' : 'white'} style={{ marginRight: 10 }} />
        <Text style={[styles.levelCardTitle, level.level === currentLevel.level && { color: '#FFD700' }]}>{level.level}</Text>
      </View>
      {level.perks.map((perk, i) => (
        <View key={i} style={styles.perkRow}>
          <Ionicons name="checkmark-circle" size={16} color="#fff" style={{ marginRight: 6, opacity: 0.7 }} />
          <Text style={styles.perkText}>{perk}</Text>
        </View>
      ))}
    </LinearGradient>
  );

  // Share приглашение
  const handleInvite = async () => {
    try {
      await Share.share({
        message: 'Присоединяйся к лучшему спортивному приложению! Получай бонусы за друзей и билеты — SportMobile ⚡️',
      });
    } catch (e) {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#f093fb" />
      <LinearGradient colors={["#f093fb", "#f5576c"]} style={styles.headerGradient}>
        <SafeAreaView style={styles.headerSafeArea}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Бонусы</Text>
            <View style={styles.placeholder} />
          </View>
        </SafeAreaView>
      </LinearGradient>
      <View style={styles.content}>
        {/* Баланс и уровень */}
        <LinearGradient colors={currentLevel.color} style={styles.bonusCard}>
          <Animated.View style={{ alignItems: 'center', transform: [{ scale: animValue.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] }) }] }}>
            <Ionicons name="diamond" size={40} color="#fff" style={{ marginBottom: 8 }} />
            <Text style={styles.bonusLabel}>Ваш баланс</Text>
            <Text style={styles.bonusValue}>{bonus} бонусов</Text>
            <View style={styles.levelBadge}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.levelText}>{currentLevel.level}</Text>
            </View>
          </Animated.View>
          {/* Прогресс-бар */}
          {nextLevel && (
            <View style={styles.progressWrap}>
              <View style={styles.progressBarBg}>
                <Animated.View style={[styles.progressBarFill, { width: `${Math.min(progress * 100, 100)}%` }]} />
              </View>
              <Text style={styles.progressText}>
                До {nextLevel.level}: {nextLevel.min - bonus} бонусов
              </Text>
            </View>
          )}
        </LinearGradient>
        {/* Кнопка */}
        <TouchableOpacity style={styles.inviteBtn} activeOpacity={0.85} onPress={handleInvite}>
          <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.inviteGradient}>
            <Ionicons name="share-outline" size={22} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.inviteText}>Пригласить друга</Text>
          </LinearGradient>
        </TouchableOpacity>
        {/* Преимущества статусов */}
        <Text style={styles.levelsTitle}>Преимущества статусов</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.levelsScroll} contentContainerStyle={{ paddingRight: 12 }}>
          {BONUS_LEVELS.map(renderLevelCard)}
        </ScrollView>
        {/* История */}
        <Text style={styles.historyTitle}>История бонусов</Text>
        <FlatList
          data={history}
          keyExtractor={item => item.id.toString()}
          renderItem={renderHistoryItem}
          style={styles.historyList}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

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
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
  },
  bonusCard: {
    width: width - 48,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  bonusLabel: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginBottom: 2,
  },
  bonusValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 4,
  },
  levelText: {
    color: '#FFD700',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 14,
  },
  progressWrap: {
    width: '100%',
    marginTop: 18,
    alignItems: 'center',
  },
  progressBarBg: {
    width: '100%',
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: 10,
    backgroundColor: '#FFD700',
    borderRadius: 8,
  },
  progressText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  inviteBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 24,
  },
  inviteGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  inviteText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  levelsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a202c',
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginLeft: 4,
  },
  levelsScroll: {
    width: '100%',
    marginBottom: 24,
  },
  levelCard: {
    width: Math.min(width * 0.8, 240),
    minHeight: 90,
    borderRadius: 20,
    padding: 18,
    paddingRight: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  levelCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  perkText: {
    color: 'white',
    fontSize: 14,
    opacity: 0.92,
    flexShrink: 1,
    flexWrap: 'wrap',
    textAlign: 'left',
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a202c',
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginLeft: 4,
  },
  historyList: {
    width: '100%',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  historyEarn: {
    borderLeftWidth: 5,
    borderLeftColor: '#4ECDC4',
  },
  historySpend: {
    borderLeftWidth: 5,
    borderLeftColor: '#FF6B6B',
  },
  historyIconWrap: {
    marginRight: 14,
  },
  historyDesc: {
    fontSize: 15,
    color: '#1a202c',
    fontWeight: '600',
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 13,
    color: '#667eea',
    opacity: 0.8,
  },
  historyAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
}); 