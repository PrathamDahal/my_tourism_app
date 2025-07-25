import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  Animated,
  TouchableOpacity,
} from "react-native";
import AppText from "../../AppText";
import { FontAwesome } from "@expo/vector-icons";

const FeaturedActivities = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];

  // Image data with descriptions
  const slides = [
    {
      source: require("../../../../assets/Images/Home/Frame 40.png"),
      description: "Explore the beautiful landscapes of Panchpokhari",
    },
    {
      source: require("../../../../assets/Images/Home/Frame 39.png"),
      description: "Experience local culture and traditions",
    },
    {
      source: require("../../../../assets/Images/Home/Frame 35.png"),
      description: "Adventure activities for thrill seekers",
    },
    {
      source: require("../../../../assets/Images/Home/Frame 34.png"),
      description: "Serene lakes and breathtaking views",
    },
    {
      source: require("../../../../assets/Images/Home/Frame 36.png"),
      description: "Wildlife encounters in natural habitats",
    },
    {
      source: require("../../../../assets/Images/Home/Frame 38.png"),
      description: "Traditional cuisine and local delicacies",
    },
    {
      source: require("../../../../assets/Images/Home/Frame 37.png"),
      description: "Sunset views that will take your breath away",
    },
  ];

  // Top decoration icons
  const topIcons = [
    { name: "soccer-ball-o", size: 36, color: "#FF5733" },
    { name: "bicycle", size: 28, color: "#33A8FF" },
    { name: "trophy", size: 34, color: "#FFD700" },
    { name: "bullseye", size: 26, color: "#4CAF50" },
  ];

  // Bottom decoration icons
  const bottomIcons = [
    { name: "bicycle", size: 30, color: "#9C27B0" },
    { name: "bullseye", size: 28, color: "#2196F3" },
    { name: "soccer-ball-o", size: 24, color: "#FF9800" },
    { name: "trophy", size: 32, color: "#3F51B5" },
  ];

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === slides.length - 1 ? 0 : prevIndex + 1
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

  const goToNext = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  };

  const goToPrev = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? slides.length - 1 : prevIndex - 1
      );
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  };

  // Render decoration icons in a row
  const renderIconRow = (icons, style) => (
    <View style={[styles.iconRow, style]}>
      {icons.map((icon, index) => (
        <FontAwesome
          key={index}
          name={icon.name}
          size={icon.size}
          color={icon.color}
          style={styles.sportsIcon}
        />
      ))}
    </View>
  );

  return (
    <View style={[styles.container]}>
      {renderIconRow(topIcons, styles.topIcons)}

      <AppText style={styles.title} fontFamily="playfair" weight="semiBold">
        Featured Activities
      </AppText>

      <View style={styles.sliderContainer}>
        <Animated.View style={[styles.slide, { opacity: fadeAnim }]}>
          <Image
            source={slides[currentIndex].source}
            style={styles.slideImage}
            resizeMode="contain"
          />
          <AppText style={styles.description}>
            {slides[currentIndex].description}
          </AppText>
        </Animated.View>

        <TouchableOpacity
          style={[styles.arrow, styles.leftArrow]}
          onPress={goToPrev}
        >
          <Text style={styles.arrowText}>‹</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.arrow, styles.rightArrow]}
          onPress={goToNext}
        >
          <Text style={styles.arrowText}>›</Text>
        </TouchableOpacity>

        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentIndex && styles.activeDot,
              ]}
            />
          ))}
        </View>
      </View>

      {renderIconRow(bottomIcons, styles.bottomIcons)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    position: "relative",
    overflow: "hidden",
  },
  title: {
    textAlign: "center",
    fontSize: 22,
    marginVertical: 20,
    zIndex: 1,
  },
  sliderContainer: {
    width: "90%",
    height: "65%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    backgroundColor: "white",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    transform: [
      { perspective: 1000 },
      { rotateX: "2deg" },
      { rotateY: "-1deg" },
    ],
    overflow: "hidden",
  },
  slide: {
    width: "90%",
    height: "80%",
    alignItems: "center",
  },
  slideImage: {
    width: "100%",
    height: "80%",
    maxWidth: 400,
    maxHeight: 400,
  },
  description: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#333",
    paddingHorizontal: 20,
  },
  arrow: {
    position: "absolute",
    top: "90%",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(243, 161, 7, 0.7)",
    alignItems: "center",
    zIndex: 2,
  },
  leftArrow: {
    left: 6,
  },
  rightArrow: {
    right: 6,
  },
  arrowText: {
    fontSize: 30,
    color: "#333",
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    margin: 5,
  },
  activeDot: {
    backgroundColor: "#FFA500",
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    position: "absolute",
  },
  topIcons: {
    top: 73,
  },
  bottomIcons: {
    bottom: 30,
  },
  sportsIcon: {
    opacity: 0.7,
    marginHorizontal: 10,
  },
});

export default React.memo(FeaturedActivities);
