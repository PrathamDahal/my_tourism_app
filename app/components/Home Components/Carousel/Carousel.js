import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

const DestinationCarousel = ({ title, images = [] }) => {
  const screenWidth = Dimensions.get('window').width;
  const imageWidth = screenWidth * 0.8; // Fixed width for all images (70% of screen width)
  const imageHeight = imageWidth * 0.7; // Height based on the fixed width

  return (
    <View style={[styles.container, { width: imageWidth }]}>
      <View style={styles.imageContainer}>
        {images.length > 0 ? (
          <Image
            source={{ uri: images[0]?.url }}
            style={[styles.image, { width: imageWidth, height: imageHeight }]}
            resizeMode="contain"
            accessibilityLabel={title}
          />
        ) : (
          <View style={[styles.placeholder, { width: imageWidth, height: imageHeight }]}>
            <Text style={styles.placeholderText}>No images available</Text>
          </View>
        )}
      </View>

      {/* Destination Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title || 'Untitled Destination'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
  },
  imageContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    // width and height now set dynamically
  },
  placeholder: {
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#6b7280',
  },
  titleContainer: {
    marginTop: 8,
  },
  title: {
    color: 'black',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'OpenSans-SemiBold',
  },
});

export default DestinationCarousel;