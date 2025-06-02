import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Image,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function AuthScreen({ navigation }) {
  const logoAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(logoAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <LinearGradient colors={["#667eea", "#f093fb"]} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#667eea" />
        <Animated.View style={{
          alignItems: 'center',
          marginTop: 60,
          opacity: logoAnim,
          transform: [{ scale: logoAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
        }}>
          <View style={styles.logoCircle}>
            <Ionicons name="trophy-outline" size={54} color="#fff" />
          </View>
          <Text style={styles.title}>SportMobile</Text>
          <Text style={styles.subtitle}>Лучшие спортивные события — всегда с тобой!</Text>
        </Animated.View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={() => navigation.navigate('Login')}>
            <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.buttonGradient}>
              <Ionicons name="log-in-outline" size={22} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Войти</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={() => navigation.navigate('Register')}>
            <LinearGradient colors={["#f093fb", "#f5576c"]} style={styles.buttonGradient}>
              <Ionicons name="person-add-outline" size={22} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Зарегистрироваться</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.85,
    marginBottom: 40,
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    marginTop: 60,
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 18,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
}); 