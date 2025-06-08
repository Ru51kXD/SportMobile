import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import EventStorage from '../data/WorldEvents';

const { width } = Dimensions.get('window');

export default function StatsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('events');
  const [eventStats, setEventStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    categoryCounts: {},
    popularEvents: [],
    venueStats: []
  });
  const [salesStats, setSalesStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    salesByMonth: [
      { month: 'Янв', sales: 28, revenue: 5100000 },
      { month: 'Фев', sales: 35, revenue: 6200000 },
      { month: 'Мар', sales: 42, revenue: 7800000 },
      { month: 'Апр', sales: 52, revenue: 9300000 },
      { month: 'Май', sales: 46, revenue: 8500000 },
      { month: 'Июн', sales: 58, revenue: 10200000 },
    ],
    categorySales: [
      { category: 'Футбол', sales: 120, revenue: 22000000, color: '#4CAF50' },
      { category: 'Баскетбол', sales: 85, revenue: 18500000, color: '#FF9800' },
      { category: 'UFC', sales: 62, revenue: 12800000, color: '#F44336' },
      { category: 'Теннис', sales: 48, revenue: 9600000, color: '#2196F3' },
      { category: 'Хоккей', sales: 32, revenue: 6400000, color: '#00BCD4' },
    ]
  });
  const [trendStats, setTrendStats] = useState({
    averageTicketPrice: 175000,
    priceChangePercent: 12,
    mostInDemand: 'UFC 301: Pereira vs Prochazka',
    fastestSelling: 'NBA Finals 2024: Game 7',
    priceTrends: [
      { category: 'UFC', price: 75000, change: +15 },
      { category: 'NBA', price: 225000, change: +22 },
      { category: 'FIFA', price: 425000, change: +8 },
      { category: 'UEFA', price: 175000, change: +5 },
      { category: 'NHL', price: 160000, change: -3 },
    ]
  });

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  useEffect(() => {
    // Загружаем данные о событиях
    const events = EventStorage.getEvents() || [];
    
    // Подсчитываем статистику по событиям
    const now = new Date();
    const upcomingEvents = events.filter(event => new Date(event.date) > now);
    
    // Считаем количество событий по категориям
    const categories = {};
    events.forEach(event => {
      const category = event.category || 'Другое';
      categories[category] = (categories[category] || 0) + 1;
    });
    
    // Популярные события (с наибольшим рейтингом)
    const popular = [...events]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);
    
    // Статистика по площадкам
    const venues = {};
    events.forEach(event => {
      const venue = event.venue || 'Неизвестно';
      if (!venues[venue]) {
        venues[venue] = { name: venue, count: 0 };
      }
      venues[venue].count++;
    });
    
    setEventStats({
      totalEvents: events.length,
      upcomingEvents: upcomingEvents.length,
      categoryCounts: categories,
      popularEvents: popular,
      venueStats: Object.values(venues).sort((a, b) => b.count - a.count).slice(0, 5)
    });
    
    // Считаем общую сумму продаж
    const totalSales = events.reduce((sum, event) => {
      return sum + ((event.capacity || 0) - (event.available_tickets || 0));
    }, 0);
    
    // Считаем общую выручку
    const totalRevenue = events.reduce((sum, event) => {
      const soldTickets = (event.capacity || 0) - (event.available_tickets || 0);
      return sum + (soldTickets * (event.price || 0));
    }, 0);
    
    setSalesStats(prev => ({
      ...prev,
      totalSales,
      totalRevenue
    }));
    
    // Начальная анимация
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
      })
    ]).start();
  }, []);

  const renderStatCard = (title, value, icon, color, subtitle = null) => {
    return (
      <Animated.View style={[styles.statCard, {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }]}>
        <LinearGradient
          colors={[color, `${color}99`]}
          style={styles.statCardGradient}
        >
          <View style={styles.statCardIconContainer}>
            <Ionicons name={icon} size={24} color="white" />
          </View>
          <Text style={styles.statCardValue}>{value}</Text>
          <Text style={styles.statCardTitle}>{title}</Text>
          {subtitle && <Text style={styles.statCardSubtitle}>{subtitle}</Text>}
        </LinearGradient>
      </Animated.View>
    );
  };

  const renderEventStats = () => {
    return (
      <View style={styles.statsContainer}>
        <View style={styles.statCardsRow}>
          {renderStatCard('Всего событий', eventStats.totalEvents, 'calendar', '#FF6B6B')}
          {renderStatCard('Предстоящие', eventStats.upcomingEvents, 'time', '#4ECDC4')}
        </View>
        
        <Animated.View style={[styles.sectionContainer, {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }]}>
          <Text style={styles.sectionTitle}>Популярные категории</Text>
          <View style={styles.categoriesContainer}>
            {Object.entries(eventStats.categoryCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([category, count], index) => (
                <View key={category} style={styles.categoryItem}>
                  <View style={[styles.categoryDot, { backgroundColor: getColorForCategory(category) }]} />
                  <Text style={styles.categoryName}>{category}</Text>
                  <Text style={styles.categoryCount}>{count}</Text>
                </View>
              ))}
          </View>
        </Animated.View>
        
        <Animated.View style={[styles.sectionContainer, {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }]}>
          <Text style={styles.sectionTitle}>Топ событий по рейтингу</Text>
          {eventStats.popularEvents.map((event, index) => (
            <View key={event.id} style={styles.popularEventItem}>
              <Text style={styles.popularEventRank}>{index + 1}</Text>
              <View style={styles.popularEventInfo}>
                <Text style={styles.popularEventTitle}>{event.title}</Text>
                <Text style={styles.popularEventCategory}>{event.category}</Text>
              </View>
              <View style={styles.popularEventRating}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.popularEventRatingText}>{event.rating || 0}</Text>
              </View>
            </View>
          ))}
        </Animated.View>
        
        <Animated.View style={[styles.sectionContainer, {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }]}>
          <Text style={styles.sectionTitle}>Площадки</Text>
          {eventStats.venueStats.map((venue) => (
            <View key={venue.name} style={styles.venueItem}>
              <Ionicons name="location" size={20} color="#667eea" />
              <Text style={styles.venueName}>{venue.name}</Text>
              <Text style={styles.venueCount}>{venue.count} событий</Text>
            </View>
          ))}
        </Animated.View>
      </View>
    );
  };

  const renderSalesStats = () => {
    return (
      <View style={styles.statsContainer}>
        <View style={styles.statCardsRow}>
          {renderStatCard('Всего продано', salesStats.totalSales, 'ticket', '#45B7D1', 'билетов')}
          {renderStatCard('Доход', `${Math.round(salesStats.totalRevenue / 1000000)}M ₸`, 'cash', '#96CEB4')}
        </View>
        
        <Animated.View style={[styles.sectionContainer, {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }]}>
          <Text style={styles.sectionTitle}>Продажи по месяцам</Text>
          <View style={styles.chartContainer}>
            {salesStats.salesByMonth.map((item) => (
              <View key={item.month} style={styles.chartColumn}>
                <View style={[
                  styles.chartBar, 
                  { height: `${(item.sales / Math.max(...salesStats.salesByMonth.map(i => i.sales))) * 100}%` }
                ]} />
                <Text style={styles.chartLabel}>{item.month}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
        
        <Animated.View style={[styles.sectionContainer, {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }]}>
          <Text style={styles.sectionTitle}>Продажи по категориям</Text>
          {salesStats.categorySales.map((item) => (
            <View key={item.category} style={styles.categoryStatsItem}>
              <View style={styles.categoryStatsHeader}>
                <View style={[styles.categoryDot, { backgroundColor: item.color }]} />
                <Text style={styles.categoryStatsName}>{item.category}</Text>
                <Text style={styles.categoryStatsValue}>{item.sales} билетов</Text>
              </View>
              <View style={styles.categoryStatsBar}>
                <View 
                  style={[
                    styles.categoryStatsProgress, 
                    { 
                      width: `${(item.sales / Math.max(...salesStats.categorySales.map(i => i.sales))) * 100}%`,
                      backgroundColor: item.color
                    }
                  ]} 
                />
              </View>
            </View>
          ))}
        </Animated.View>
      </View>
    );
  };

  const renderTrendStats = () => {
    return (
      <View style={styles.statsContainer}>
        <View style={styles.statCardsRow}>
          {renderStatCard(
            'Средняя цена', 
            `${Math.round(trendStats.averageTicketPrice / 1000)}K ₸`, 
            'trending-up', 
            '#F093FB',
            `+${trendStats.priceChangePercent}% от прошлого месяца`
          )}
        </View>
        
        <Animated.View style={[styles.sectionContainer, {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }]}>
          <Text style={styles.sectionTitle}>Тренды цен по категориям</Text>
          {trendStats.priceTrends.map((item) => (
            <View key={item.category} style={styles.trendItem}>
              <Text style={styles.trendCategory}>{item.category}</Text>
              <Text style={styles.trendPrice}>{Math.round(item.price / 1000)}K ₸</Text>
              <View style={[
                styles.trendChange, 
                { backgroundColor: item.change >= 0 ? '#4CAF50' : '#F44336' }
              ]}>
                <Ionicons 
                  name={item.change >= 0 ? 'arrow-up' : 'arrow-down'} 
                  size={12} 
                  color="white" 
                />
                <Text style={styles.trendChangeText}>{Math.abs(item.change)}%</Text>
              </View>
            </View>
          ))}
        </Animated.View>
        
        <Animated.View style={[styles.sectionContainer, {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }]}>
          <Text style={styles.sectionTitle}>Популярные события</Text>
          <View style={styles.popularTrendItem}>
            <View style={styles.popularTrendIcon}>
              <Ionicons name="flame" size={24} color="#FF6B6B" />
            </View>
            <View style={styles.popularTrendContent}>
              <Text style={styles.popularTrendLabel}>Самое востребованное</Text>
              <Text style={styles.popularTrendTitle}>{trendStats.mostInDemand}</Text>
            </View>
          </View>
          
          <View style={styles.popularTrendItem}>
            <View style={styles.popularTrendIcon}>
              <Ionicons name="flash" size={24} color="#FF9800" />
            </View>
            <View style={styles.popularTrendContent}>
              <Text style={styles.popularTrendLabel}>Быстрее всего продается</Text>
              <Text style={styles.popularTrendTitle}>{trendStats.fastestSelling}</Text>
            </View>
          </View>
        </Animated.View>
      </View>
    );
  };

  const getColorForCategory = (category) => {
    const colors = {
      'Футбол': '#4CAF50',
      'Баскетбол': '#FF9800',
      'MMA': '#F44336',
      'UFC': '#C8102E',
      'Теннис': '#2196F3',
      'Хоккей': '#00BCD4',
      'Автоспорт': '#E10600',
      'Гольф': '#006747',
    };
    return colors[category] || '#667eea';
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
        <Text style={styles.headerTitle}>Статистика</Text>
      </LinearGradient>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'events' && styles.activeTabButton]}
          onPress={() => setActiveTab('events')}
        >
          <Text style={[styles.tabText, activeTab === 'events' && styles.activeTabText]}>События</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'sales' && styles.activeTabButton]}
          onPress={() => setActiveTab('sales')}
        >
          <Text style={[styles.tabText, activeTab === 'sales' && styles.activeTabText]}>Продажи</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'trends' && styles.activeTabButton]}
          onPress={() => setActiveTab('trends')}
        >
          <Text style={[styles.tabText, activeTab === 'trends' && styles.activeTabText]}>Тренды</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'events' && renderEventStats()}
        {activeTab === 'sales' && renderSalesStats()}
        {activeTab === 'trends' && renderTrendStats()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#667eea',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#718096',
  },
  activeTabText: {
    color: '#667eea',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  statsContainer: {
    padding: 20,
  },
  statCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: (width - 50) / 2,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statCardGradient: {
    padding: 20,
    alignItems: 'center',
  },
  statCardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statCardTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  statCardSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  sectionContainer: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 16,
  },
  categoriesContainer: {
    marginTop: 10,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    color: '#4a5568',
  },
  categoryCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  popularEventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  popularEventRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#667eea',
    textAlign: 'center',
    lineHeight: 28,
    color: 'white',
    fontWeight: 'bold',
    marginRight: 12,
  },
  popularEventInfo: {
    flex: 1,
  },
  popularEventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
  },
  popularEventCategory: {
    fontSize: 14,
    color: '#718096',
    marginTop: 2,
  },
  popularEventRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  popularEventRatingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a202c',
    marginLeft: 4,
  },
  venueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  venueName: {
    flex: 1,
    fontSize: 16,
    color: '#4a5568',
    marginLeft: 10,
  },
  venueCount: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 180,
    marginTop: 10,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
  },
  chartBar: {
    width: 16,
    backgroundColor: '#667eea',
    borderRadius: 8,
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 12,
    color: '#718096',
  },
  categoryStatsItem: {
    marginBottom: 16,
  },
  categoryStatsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryStatsName: {
    flex: 1,
    fontSize: 16,
    color: '#4a5568',
    marginLeft: 10,
  },
  categoryStatsValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  categoryStatsBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
  },
  categoryStatsProgress: {
    height: '100%',
    borderRadius: 4,
  },
  trendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  trendCategory: {
    flex: 1,
    fontSize: 16,
    color: '#4a5568',
  },
  trendPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a202c',
    marginRight: 12,
  },
  trendChange: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendChangeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 2,
  },
  popularTrendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  popularTrendIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  popularTrendContent: {
    flex: 1,
  },
  popularTrendLabel: {
    fontSize: 14,
    color: '#718096',
  },
  popularTrendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a202c',
    marginTop: 2,
  },
}); 