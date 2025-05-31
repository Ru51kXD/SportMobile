import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const EventImage = ({
  imageUrl,
  sportIcon = 'trophy',
  sportColor = '#667eea',
  height = 200,
  width = '100%',
  borderRadius = 12,
  style = {}
}) => {
  const renderPlaceholder = () => (
    <LinearGradient
      colors={[sportColor, sportColor + '80']}
      style={[
        styles.placeholder,
        {
          height,
          width,
          borderRadius,
        }
      ]}
    >
      <Ionicons
        name={sportIcon}
        size={height * 0.3}
        color="rgba(255, 255, 255, 0.8)"
      />
    </LinearGradient>
  );

  if (!imageUrl) {
    return renderPlaceholder();
  }

  return (
    <View style={[styles.container, style]}>
      <Image
        source={{ uri: imageUrl }}
        style={[
          styles.image,
          {
            height,
            width,
            borderRadius,
          }
        ]}
        resizeMode="cover"
        onError={() => renderPlaceholder()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    backgroundColor: '#f0f0f0',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
});

export default EventImage; 