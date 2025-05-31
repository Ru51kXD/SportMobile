import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  disabled = false, 
  loading = false,
  style,
  textStyle 
}) => {
  const getGradientColors = () => {
    if (disabled) return ['#ccc', '#ccc'];
    
    switch (variant) {
      case 'secondary':
        return ['#f8fafc', '#f8fafc'];
      default:
        return ['#667eea', '#764ba2'];
    }
  };

  const getTextColor = () => {
    if (variant === 'secondary') return '#667eea';
    return 'white';
  };

  const renderContent = () => {
    if (loading) {
      if (variant === 'secondary') {
        return <ActivityIndicator color="#667eea" />;
      }
      return <ActivityIndicator color="white" />;
    }
    
    return (
      <Text style={[
        styles.text,
        { color: getTextColor() },
        textStyle
      ]}>
        {title}
      </Text>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={getGradientColors()}
        style={[
          styles.gradient,
          variant === 'secondary' && styles.secondaryButton,
          disabled && styles.disabledButton
        ]}
      >
        {renderContent()}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: '#667eea',
  },
  disabledButton: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Button; 