import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import UserStorage from '../data/UserStorage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setTimeout(async () => {
      if (await UserStorage.login(email.trim(), password)) {
        setError('');
        window.setIsLoggedIn(true);
      } else {
        setError('Неверный email или пароль');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <LinearGradient colors={["#667eea", "#f093fb"]} style={styles.gradient}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor="#667eea" />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.container}>
            <Text style={styles.title}>Вход</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#c3c3c3"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Пароль"
              placeholderTextColor="#c3c3c3"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
              <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.buttonGradient}>
                <Ionicons name="log-in-outline" size={22} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>{loading ? 'Вход...' : 'Войти'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  back: { position: 'absolute', top: 48, left: 24, zIndex: 10 },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 32, letterSpacing: 1 },
  input: { width: 300, backgroundColor: 'rgba(255,255,255,0.13)', borderRadius: 14, padding: 16, fontSize: 17, color: '#fff', marginBottom: 18 },
  button: { borderRadius: 16, overflow: 'hidden', marginTop: 10 },
  buttonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, paddingHorizontal: 32 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  error: { color: '#ffbaba', fontSize: 15, marginBottom: 8, marginTop: -8 },
}); 