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

const TravelPackageDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { packageData } = route.params; // Pass selected package
  const [expanded, setExpanded] = useState(false);

  const [activeTab, setActiveTab] = useState("Itinerary");
  const windowWidth = Dimensions.get("window").width;
  const isTablet =
    Platform.isPad || (Platform.OS === "android" && windowWidth >= 600);
  const limit = isTablet ? 1000 : 500;
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Dummy itinerary (you can expand based on package)
  const itinerary = [
    {
      id: 1,
      title: "Arrive In Tokyo",
      desc: "Welcome meeting and orientation",
    },
    {
      id: 2,
      title: "Tokyo Exploration",
      desc: "Visit Shibuya, Meiji Shrine, and Harajuku",
    },
    {
      id: 3,
      title: "Tokyo to Kyoto",
      desc: "Bullet train journey and evening in Gion",
    },
    {
      id: 4,
      title: "Kyoto Temples",
      desc: "Visit Kinkaku-ji and Fushimi Inari Shrine",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* HEADER IMAGE */}
      <ImageBackground
        source={{ uri: packageData.imageUrls[0].url }}
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

      {/* TABS */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "Itinerary" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("Itinerary")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Itinerary" && styles.activeTabText,
            ]}
          >
            Itinerary
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "Details" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("Details")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Details" && styles.activeTabText,
            ]}
          >
            Details
          </Text>
        </TouchableOpacity>
      </View>

      {/* TAB CONTENT */}
      {activeTab === "Itinerary" ? (
        <View style={styles.itinerary}>
          {itinerary.map((day, index) => (
            <View key={day.id} style={styles.itineraryItem}>
              <View style={styles.timeline}>
                <View style={styles.circle} />
                {index < itinerary.length - 1 && <View style={styles.line} />}
              </View>
              <View style={styles.itineraryContent}>
                <Text style={styles.itineraryTitle}>{day.title}</Text>
                <Text style={styles.itineraryDesc}>{day.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.details}>
          <Text style={styles.detailsTitle}>Included:</Text>
          {packageData.included.map((inc, i) => (
            <Text key={i} style={styles.detailText}>
              • {inc}
            </Text>
          ))}

          <Text style={styles.detailsTitle}>Not Included:</Text>
          {packageData.notIncluded.map((ninc, i) => (
            <Text key={i} style={styles.detailText}>
              • {ninc}
            </Text>
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
  paragraph: {
    paddingHorizontal: 24,
    marginVertical: 24,
    fontSize: 14,
    fontFamily: fontNames.raleway.regular,
    lineHeight: 24,
    color: "#666",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    alignItems: "center",
  },
  infoItem: { flexDirection: "row", alignItems: "center" },
  infoText: { marginLeft: 5, fontSize: 14 },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    color: "green",
    fontSize: 14,
    fontWeight: "bold",
  },
  person: {
    fontSize: 12,
    color: "#444",
  },

  description: {
    fontSize: 14,
    color: "#555",
    paddingHorizontal: 15,
    marginBottom: 10,
  },

  tabRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    borderRadius: 10,
    paddingVertical: 2,
    backgroundColor: "#C62828",
    borderBottomWidth: 1,
    borderBottomColor: "#e21e1eff",
    marginHorizontal: 22,
    marginBottom: 16,
  },
  tabButton: {
    width: "32%",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  activeTabButton: {
    backgroundColor: "#fff",
  },
  tabText: {
    fontSize: 16,
    textAlign: "center",
    color: "#fff",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "semi-bold",
  },

  itinerary: { paddingHorizontal: 15, marginTop: 10 },
  itineraryItem: { flexDirection: "row", marginBottom: 20 },
  timeline: { alignItems: "center", width: 20 },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#C62828",
  },
  line: { width: 2, flex: 1, backgroundColor: "#C62828", marginTop: 2 },
  itineraryContent: { marginLeft: 10, flex: 1 },
  itineraryTitle: { fontWeight: "bold", fontSize: 15, marginBottom: 2 },
  itineraryDesc: { fontSize: 13, color: "#555" },

  details: { paddingHorizontal: 15, marginTop: 10 },
  detailsTitle: { fontWeight: "bold", marginTop: 10, marginBottom: 5 },
  detailText: { fontSize: 13, color: "#555", marginLeft: 10 },
});
