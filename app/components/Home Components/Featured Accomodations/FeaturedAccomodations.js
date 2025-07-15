import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DestinationCarousel from "../Carousel/Carousel";
import { stayOptions, stays } from "../../../data/StayOptions";

const FeaturedAccomodations = () => {
  const navigation = useNavigation();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesPerSlide] = useState(1);
  const [windowWidth] = useState(Dimensions.get("window").width);
  const fadeAnim = useRef(new Animated.Value(1)).current;

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
  }, [currentIndex, fadeAnim]);

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

  const getStayTypeColor = (stayType) => {
    const option = stayOptions.find((opt) => opt.title === stayType);
    return option?.color || "#000";
  };

  const itemWidth = windowWidth / imagesPerSlide;

  const getVisibleStays = () => {
    let visibleStays = [];
    for (let i = 0; i < imagesPerSlide; i++) {
      const index = (currentIndex + i) % stays.length;
      visibleStays.push(stays[index]);
    }
    return visibleStays;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.navigationContainer}>
          <TouchableOpacity onPress={goToPrevSlide} style={styles.navButton}>
            <Text style={styles.navButtonText}>&lt;</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Featured Accommodations</Text>

          <TouchableOpacity onPress={goToNextSlide} style={styles.navButton}>
            <Text style={styles.navButtonText}>&gt;</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.carouselContainer}>
        {getVisibleStays().map((stay, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("StayDetails", { id: stay.id })}
            style={{ width: itemWidth }}
          >
            <Animated.View
              style={[styles.stayItem, { width: itemWidth, opacity: fadeAnim }]}
            >
              <DestinationCarousel title={stay.title} images={stay.image} />

              <View style={styles.stayInfo}>
                <Text
                  style={[
                    styles.stayType,
                    { color: getStayTypeColor(stay.type) },
                  ]}
                >
                  {stay.type}
                </Text>
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
            </Animated.View>
          </TouchableOpacity>
        ))}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    justifyContent: "center",
    flex: 1,
  },
  navButton: {
    backgroundColor: "#f59e0b",
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
  },
  stayItem: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  stayInfo: {
    paddingHorizontal: 26,
    width: "100%",
    backgroundColor: "#ffffff", // Add your desired color here
    borderRadius: 8, // Optional: for rounded corners
    alignItems: "left",
    marginTop: 10,
  },
  stayType: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 4,
  },
  stayTitle: {
    fontWeight: "500",
    fontSize: 14,
    fontFamily: "OpenSans_400Regular",
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

export default FeaturedAccomodations;
