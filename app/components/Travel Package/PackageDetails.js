import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import RatingStars from "../../custom/RatingStars";
import { fontNames } from "../../config/font";
import { API_BASE_URL } from "../../../config";

const TravelPackageDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { packageData } = route.params; // Pass selected package
  const [expanded, setExpanded] = useState(false);
  const windowWidth = Dimensions.get("window").width;
  const isTablet =
    Platform.isPad || (Platform.OS === "android" && windowWidth >= 600);
  const limit = isTablet ? 1000 : 500;

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER IMAGE */}
      <ImageBackground
        source={
          packageData.images?.[0]
            ? { uri: `${API_BASE_URL}/${packageData.images[0]}` }
            : { uri: "https://via.placeholder.com/600x400.png?text=No+Image" }
        }
        style={styles.headerImage}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back-ios" size={32} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.headerOverlay}>
          <Text style={styles.title}>{packageData.title}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={14} color="#fff" />
            <Text style={styles.location}>{packageData.location}</Text>
          </View>
        </View>
      </ImageBackground>

      {/* INFO ROW */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={16} color="#000" />
          <Text style={styles.infoText}>{packageData.duration}</Text>
        </View>
        <View style={styles.infoItem}>
          <RatingStars rating={packageData.rating} />
          <Text style={styles.infoText}>{packageData.rating}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.price}>Npr {packageData.price} </Text>
          <Text style={styles.person}>/person</Text>
        </View>
      </View>

      {/* ABOUT THIS PACKAGE */}
      <Text style={styles.aboutTitle}>About this Package</Text>

      {/* DESCRIPTION */}
      <TouchableOpacity onPress={toggleExpanded}>
        <Text style={styles.paragraph}>
          {expanded || packageData.description.length <= limit
            ? packageData.description
            : `${packageData.description.substring(0, limit)}...`}
          {packageData.description.length > limit && (
            <Text style={{ color: "#C62828", fontWeight: "bold" }}>
              {expanded ? " Read less" : " Read more"}
            </Text>
          )}
        </Text>
      </TouchableOpacity>

      {/* INCLUDED & NOT INCLUDED */}
      <View style={styles.details}>
        <Text style={styles.detailsTitle}>
          <Ionicons name="checkmark-circle" size={20} color="green" /> Included:
        </Text>
        {packageData.included.map((inc, i) => (
          <View key={i} style={styles.detailRow}>
            <Ionicons name="checkmark-circle" size={20} color="green" />
            <Text style={styles.detailText}>{inc}</Text>
          </View>
        ))}

        <Text style={styles.detailsTitle}>
          <Ionicons name="close-circle" size={20} color="red" /> Not Included:
        </Text>
        {packageData.notIncluded.map((ninc, i) => (
          <View key={i} style={styles.detailRow}>
            <Ionicons name="close-circle" size={20} color="red" />
            <Text style={styles.detailText}>{ninc}</Text>
          </View>
        ))}
      </View>

      {packageData.availableDepartures &&
        packageData.availableDepartures.length > 0 && (
          <View style={styles.departureContainer}>
            <Text style={styles.departureTitle}>Available Departures</Text>
            {packageData.availableDepartures.map((departure, index) => (
              <View key={index} style={styles.departureCard}>
                <View>
                  <Text style={styles.departureDate}>{departure.date}</Text>
                  <Text style={styles.departureSpots}>
                    {departure.spotsAvailable}
                  </Text>
                </View>
                <View style={styles.departurePriceContainer}>
                  <Text style={styles.departurePrice}>
                    Rs.{departure.price.toLocaleString()}
                  </Text>
                  <View style={styles.availableBadge}>
                    <Text style={styles.availableText}>Available</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
    </ScrollView>
  );
};

export default TravelPackageDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerImage: { height: 220, justifyContent: "space-between" },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    marginTop: 30,
  },
  backButton: {
    position: "absolute",
    zIndex: 2,
    top: 10,
    left: 20,
  },
  headerOverlay: {
    padding: 15,
  },
  title: { fontSize: 20, fontFamily: fontNames.nunito.bold, color: "#fff" },
  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  location: {
    color: "#fff",
    fontSize: 13,
    fontFamily: fontNames.nunito.semiBold,
    marginLeft: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    alignItems: "center",
  },
  infoItem: { flexDirection: "row", alignItems: "center" },
  infoText: { marginLeft: 5, fontSize: 14 },
  priceRow: { flexDirection: "row", alignItems: "center" },
  price: { color: "green", fontSize: 14, fontWeight: "bold" },
  person: { fontSize: 12, color: "#444" },

  aboutTitle: {
    fontSize: 24,
    fontFamily: fontNames.raleway.medium,
    paddingHorizontal: 40,
    marginTop: 20,
    marginBottom: 10,
    textAlign: "left",
  },
  paragraph: {
    textAlign: "justify",
    paddingHorizontal: 40,
    marginVertical: 10,
    fontSize: 16,
    fontFamily: fontNames.raleway.regular,
    lineHeight: 24,
    color: "#666",
    marginBottom: 16,
  },

  details: {
    paddingHorizontal: 40,
    marginVertical: 10,
    alignItems: "flex-start",
  },
  detailsTitle: {
    fontFamily: fontNames.raleway.medium,
    fontSize: 24,
    marginVertical: 10,
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  detailText: {
    fontSize: 16,
    fontFamily: fontNames.raleway.regular,
    color: "#555",
    marginLeft: 10,
    textAlign: "center",
  },

  departureContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    marginHorizontal: 40,
    marginTop: 20,
    marginBottom: 30,
  },
  departureTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  departureCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#fafafa",
  },
  departureDate: {
    fontWeight: "600",
    fontSize: 16,
    color: "#111827",
  },
  departureSpots: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  departurePriceContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  departurePrice: {
    fontWeight: "700",
    fontSize: 16,
    color: "#111827",
  },
  availableBadge: {
    backgroundColor: "#fee2e2",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 4,
  },
  availableText: {
    color: "#b91c1c",
    fontSize: 12,
    fontWeight: "500",
  },
});
