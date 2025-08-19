import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { stays } from "../../data/StayOptions";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import RatingStars from "../../custom/RatingStars";

export default function StayDetails() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;
  const [stay, setStay] = useState(null);
  
  const windowWidth = Dimensions.get("window").width;
  const isTablet = windowWidth >= 768; // basic breakpoint for tablet
  const maxChars = isTablet ? 1000 : 500;

  useEffect(() => {
    const foundStay = stays.find((s) => s.id === id);
    if (foundStay) setStay(foundStay);
    else navigation.goBack();
  }, [id]);

  if (!stay) return null;
  const mainImage = stay.image[0];

  const amenitiesList = [
    "WiFi",
    "Air conditioning",
    "Pool",
    "Car",
    "Kitchen",
    "Beach access",
    "Parking",
    "Alcohol",
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Top Image with Overlay */}
      <View style={styles.mainImageContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back-ios" size={32} color="#fff" />
        </TouchableOpacity>
        <Image
          source={{ uri: mainImage.url }}
          style={[styles.mainImage, { width: windowWidth }]}
          resizeMode="cover"
        />
        <View style={styles.titleOverlay}>
          <Ionicons name="location" size={24} color="#fff" />
          <Text style={styles.titleText}>{stay.title}</Text>
        </View>
      </View>

      {/* Details Card */}
      <View style={styles.detailsCard}>
        <View style={styles.ratingPriceRow}>
          <View style={styles.ratingRow}>
            <RatingStars rating={stay.rating} />
            <Text style={{ marginLeft: 8, fontSize: 18, color: "#555" }}>
              {stay.rating.toFixed(1)}
            </Text>
          </View>
          <Text style={styles.price}>
            Npr {stay.price}
            <Text style={styles.perNight}> /night</Text>
          </Text>
        </View>

        <Text style={styles.detailsText}>3 Rooms • 2 Baths • 6 Guests</Text>

        <Text style={styles.description}>
          {stay.description.length > maxChars
            ? stay.description.slice(0, maxChars) + "..."
            : stay.description}
        </Text>

        {/* Amenities */}
        <Text style={styles.sectionTitle}>Amenities</Text>
        <View style={styles.amenitiesContainer}>
          {amenitiesList.map((amenity, index) => (
            <View key={index} style={styles.amenityItem}>
              <View style={styles.greenDot} />
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
        </View>

        {/* Host Section */}
        <Text style={styles.sectionTitle}>Host</Text>
        <View style={styles.hostRow}>
          <View style={styles.hostAvatar}>
            <Text style={styles.hostInitial}>S</Text>
          </View>
          <Text style={styles.hostName}>Sarah</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  mainImageContainer: {
    position: "relative",
    marginBottom: 24,
  },
  mainImage: {
    height: 300,
  },
  backButton: {
    position: "absolute",
    zIndex: 2,
    top: 40,
    left: 20,
  },
  titleOverlay: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    bottom: 16,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
  },
  titleText: {
    fontSize: 24,
    marginLeft: 10,
    color: "white",
    fontWeight: "500",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  detailsCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: -20,
    padding: 16,
  },
  ratingPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  ratingRow: { flexDirection: "row", alignItems: "center" },
  rating: { marginLeft: 4, fontSize: 14 },
  price: { fontSize: 16, fontWeight: "bold", color: "green" },
  perNight: { fontSize: 14, color: "gray", fontWeight: "normal" },
  detailsText: { color: "gray", marginTop: 6 },
  description: { marginTop: 10, lineHeight: 20, color: "#444" },
  sectionTitle: { marginTop: 16, fontWeight: "bold", fontSize: 16 },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginVertical: 4,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "green",
    marginRight: 8,
  },
  amenityText: { fontSize: 14, color: "#333" },
  hostRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  hostAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  hostInitial: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  hostName: { marginLeft: 8, fontSize: 16 },
});
