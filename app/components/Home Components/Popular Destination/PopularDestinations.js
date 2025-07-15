import { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { destinations } from './../../../data/DestinationCarousel';
import DestinationCarousel from './../Carousel/Carousel';

const PopularDestinations = () => {
  const navigation = useNavigation();

  const screenWidth = Dimensions.get('window').width;
  const sliderWidth = screenWidth * 0.9;
  const slideWidth = sliderWidth - 10;
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === destinations.length - 1 ? 0 : prevIndex + 1
        );
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const goToNextSlide = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === destinations.length - 1 ? 0 : prevIndex + 1
      );
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  };

  const goToPrevSlide = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? destinations.length - 1 : prevIndex - 1
      );
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  };

  const currentDestination = destinations[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.navigationContainer}>
          <TouchableOpacity onPress={goToPrevSlide} style={styles.navButton}>
            <Text style={styles.navButtonText}>&lt;</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Popular Destinations</Text>

          <TouchableOpacity onPress={goToNextSlide} style={styles.navButton}>
            <Text style={styles.navButtonText}>&gt;</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.sliderContainer, { width: sliderWidth }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('DestinationDetails', {
              destination: currentDestination,
            })
          }
          style={{ width: slideWidth }}
        >
          <Animated.View
            style={[
              styles.slide,
              { width: slideWidth, opacity: fadeAnim },
            ]}
          >
            <DestinationCarousel
              title={currentDestination.title}
              images={currentDestination.image}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#f8f9fa",
  },
  sliderContainer: {
    height: 400,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    overflow: "hidden",
  },
  slide: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  navButton: {
    backgroundColor: "#f59e0b",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  navButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  title: {
    textAlign: "center",
    fontFamily: "PlayfairDisplay-SemiBold",
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginHorizontal: 10,
  },
});

export default PopularDestinations;
