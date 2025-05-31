import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AnimatedEventCard from '../components/AnimatedEventCard';
import { worldEvents, featuredEvents } from '../data/WorldEvents';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(worldEvents);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  
  // Animation refs
  const headerAnimation = useRef(new Animated.Value(0)).current;
  const searchAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const categories = [
    { id: 'all', name: 'Все', icon: 'apps', color: '#667eea' },
    { id: 'UFC', name: 'UFC', icon: 'flash', color: '#C8102E' },
    { id: 'NBA', name: 'NBA', icon: 'basketball', color: '#1D428A' },
    { id: 'FIFA', name: 'FIFA', icon: 'football', color: '#326295' },
    { id: 'F1', name: 'F1', icon: 'car-sport', color: '#E10600' },
    { id: 'Olympics', name: 'Олимпиада', icon: 'medal', color: '#0085C3' },
  ];

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(headerAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(searchAnimation, {
        toValue: 1,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      })
    ]).start();

    // Pulse animation for hot events
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [searchQuery, selectedCategory]);

  const filterEvents = () => {
    let filtered = worldEvents;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.sport === selectedCategory);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleEventPress = (event, action) => {
    if (action === 'selectSeats') {
      navigation.navigate('SeatSelection', { event });
    } else {
      navigation.navigate('EventDetails', { event });
    }
  };

  const renderHeader = () => {
    const headerY = headerAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [-100, 0],
    });

    return (
      <Animated.View style={[styles.headerContainer, { transform: [{ translateY: headerY }] }]}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>🌍 World Sports</Text>
              <Text style={styles.headerSubtitle}>Топ-события планеты</Text>
            </View>
            
            <TouchableOpacity style={styles.profileButton}>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                  style={styles.profileGradient}
                >
                  <Ionicons name="person" size={24} color="white" />
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  const renderSearchBar = () => {
    const searchY = searchAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0],
    });

    return (
      <Animated.View style={[styles.searchContainer, { 
        transform: [{ translateY: searchY }],
        opacity: searchAnimation 
      }]}>
        <LinearGradient
          colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
          style={styles.searchGradient}
        >
          <Ionicons name="search" size={20} color="#667eea" />
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск событий UFC, NBA, FIFA..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#667eea" />
            </TouchableOpacity>
          )}
        </LinearGradient>
      </Animated.View>
    );
  };

  const renderCategories = () => (
    <Animated.View style={[styles.categoriesContainer, { opacity: fadeAnim }]}>
      <Text style={styles.sectionTitle}>Категории</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <LinearGradient
              colors={selectedCategory === category.id 
                ? [category.color, category.color + 'CC'] 
                : ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']
              }
              style={styles.categoryGradient}
            >
              <Ionicons 
                name={category.icon} 
                size={20} 
                color={selectedCategory === category.id ? 'white' : category.color} 
              />
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive
              ]}>
                {category.name}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );

  const renderFeaturedSection = () => (
    <Animated.View style={[styles.featuredSection, { opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🔥 Горячие события</Text>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E8E']}
            style={styles.hotBadge}
          >
            <Ionicons name="flame" size={16} color="white" />
            <Text style={styles.hotBadgeText}>HOT</Text>
          </LinearGradient>
        </Animated.View>
      </View>
      
      <FlatList
        data={featuredEvents}
        renderItem={({ item, index }) => (
          <AnimatedEventCard
            event={item}
            onPress={handleEventPress}
            index={index}
          />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.featuredList}
        snapToInterval={width * 0.85 + 40}
        decelerationRate="fast"
      />
    </Animated.View>
  );

  const renderAllEvents = () => (
    <Animated.View style={[styles.allEventsSection, { opacity: fadeAnim }]}>
      <Text style={styles.sectionTitle}>
        {selectedCategory === 'all' 
          ? '🌟 Все события' 
          : `${categories.find(c => c.id === selectedCategory)?.name || ''} События`
        }
      </Text>
      <Text style={styles.sectionSubtitle}>
        {filteredEvents.length} {filteredEvents.length === 1 ? 'событие' : 'событий'} найдено
      </Text>
      
      {filteredEvents.map((event, index) => (
        <AnimatedEventCard
          key={event.id}
          event={event}
          onPress={handleEventPress}
          index={index}
        />
      ))}
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#667eea']}
            tintColor="#667eea"
          />
        }
      >
        {renderHeader()}
        {renderSearchBar()}
        {renderCategories()}
        {renderFeaturedSection()}
        {renderAllEvents()}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  profileButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  profileGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 25,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  searchGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  categoriesContainer: {
    marginBottom: 25,
  },
  categoriesScroll: {
    paddingLeft: 20,
  },
  categoryButton: {
    marginRight: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  categoryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    color: '#667eea',
  },
  categoryTextActive: {
    color: 'white',
  },
  featuredSection: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#718096',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  hotBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  hotBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  featuredList: {
    paddingLeft: 20,
  },
  allEventsSection: {
    marginHorizontal: 20,
  },
  bottomSpacing: {
    height: 100,
  },
});

export default HomeScreen; 