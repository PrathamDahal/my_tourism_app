import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
} from "react-native";
import { stayOptions, stays } from "../../../data/StayOptions";
import { useNavigation } from "@react-navigation/native";
import DestinationCarousel from "../Carousel/Carousel";

const TravelPackages = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesPerSlide] = useState(1);
  const [windowWidth] = useState(Dimensions.get("window").width);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === stays.length - 1 ? 0 : prevIndex + 1
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

  const goToPrevSlide = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? stays.length - 1 : prevIndex - 1
      );
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  };

  const goToNextSlide = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === stays.length - 1 ? 0 : prevIndex + 1
      );
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  };

  const getStayTypeColor = (stayType) => {
    const option = stayOptions.find((opt) => opt.title === stayType);
    return option?.color || "#000";
  };

  const handleSlideClick = (stayId) => {
    navigation.navigate("TravelPackages", {
      screen: "TravelDeals",
      params: { id: stayId },
    });
  };

  const getVisibleStays = () => {
    let visibleStays = [];
    for (let i = 0; i < imagesPerSlide; i++) {
      const index = (currentIndex + i) % stays.length;
      visibleStays.push(stays[index]);
    }
    return visibleStays;
  };

  const itemWidth = windowWidth / imagesPerSlide;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.navigationContainer}>
          <TouchableOpacity onPress={goToPrevSlide} style={styles.navButton}>
            <Text style={styles.navButtonText}>&lt;</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Travel Packages</Text>

          <TouchableOpacity onPress={goToNextSlide} style={styles.navButton}>
            <Text style={styles.navButtonText}>&gt;</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.carouselWrapper}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContainer}
        >
          {getVisibleStays().map((stay, index) => (
            <Animated.View
              key={index}
              style={[styles.stayItem, { width: windowWidth - 40, opacity: fadeAnim }]}
            >
              <TouchableOpacity
                onPress={() => handleSlideClick(stay.id)}
                activeOpacity={0.8}
                style={styles.touchableContent}
              >
                <DestinationCarousel
                  title={stay.title}
                  images={Array.isArray(stay.image) ? stay.image : [stay.image]}
                />

                <View
                  style={[
                    styles.stayTypeIndicator,
                    { backgroundColor: getStayTypeColor(stay.type) },
                  ]}
                >
                  <Text style={styles.stayTypeText}>{stay.type}</Text>
                </View>

                <View style={styles.stayInfo}>
                  <View style={styles.stayDetails}>
                    <Text style={styles.stayDetail}>{stay.location}</Text>
                    <Text style={[styles.stayDetail, styles.contact]}>
                      Mobile: {stay.contact}
                    </Text>
                  </View>
                  <Text style={styles.stayPrice}>
                    NRS {stay.price} <Text style={styles.priceUnit}>/ night</Text>
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>
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
    width: "100%",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    width: "100%",
  },
    navButton: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 22,
  },
  title: {
    textAlign: "center",
    fontFamily: "PlayfairDisplay_600SemiBold",
    fontSize: 20,
    fontWeight: "600",
  },
  carouselWrapper: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  carouselContainer: {
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
    paddingHorizontal: 20,
  },
  stayItem: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  touchableContent: {
    width: "100%",
    height: "100%",
  },
  stayTypeIndicator: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1,
  },
  stayTypeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  stayInfo: {
    paddingHorizontal: 26,
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    alignItems: "left",
    marginTop: 10,
  },
  stayDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  stayDetail: {
    color: "#374151",
    fontSize: 12,
    fontFamily: "OpenSans_400Regular",
  },
  contact: {
    paddingLeft: 8,
  },
  stayPrice: {
    fontWeight: "bold",
    marginTop: 8,
    fontSize: 15,
    fontFamily: "OpenSans_400Regular",
  },
  priceUnit: {
    fontWeight: "500",
    fontSize: 14,
  },
});

export default TravelPackages;
