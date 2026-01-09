import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import RatingStars from "../../custom/RatingStars";
import { fontNames } from "../../config/font";
import { API_BASE_URL } from "../../../config";
import { useGetPackageDeparturesQuery } from "../../services/travelDeparturesApi";

const TravelPackageDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { packageData } = route.params; // selected package
  const [expanded, setExpanded] = useState(false);

  const windowWidth = Dimensions.get("window").width;
  const isTablet =
    Platform.isPad || (Platform.OS === "android" && windowWidth >= 600);
  const limit = isTablet ? 1000 : 500;

  const toggleExpanded = () => setExpanded(!expanded);
  let imageSource;

  // Check images[0]
  if (packageData.images?.[0] && packageData.images[0].trim() !== "") {
    imageSource = { uri: `${API_BASE_URL}${packageData.images[0].trim()}` };
  }
  // Check coverImage
  else if (packageData.coverImage && packageData.coverImage.trim() !== "") {
    imageSource = { uri: `${API_BASE_URL}${packageData.coverImage.trim()}` };
  }
  // Fallback to local default
  else {
    imageSource = require("../../../assets/Images/Travel/travel-default.jpg");
  }

  // Fetch departures
  const { data: departuresData, isLoading: isLoadingDepartures } =
    useGetPackageDeparturesQuery(packageData.slug);

  const departuresArray = departuresData?.data ?? [];

  return (
    <ScrollView style={styles.container}>
      {/* HEADER IMAGE */}
      <ImageBackground source={imageSource} style={styles.headerImage}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back-ios" size={32} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.headerOverlay}>
          <Text style={styles.title}>{packageData.name}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={14} color="#fff" />
            <Text style={styles.location}>
              {packageData.destinations?.[0]?.name ?? "Unknown Location"}
            </Text>
          </View>
        </View>
      </ImageBackground>

      {/* INFO ROW */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={16} color="#000" />
          <Text style={styles.infoText}>
            {packageData.durationDays ?? 0} Days /{" "}
            {packageData.durationNights ?? 0} Nights
          </Text>
        </View>
        <View style={styles.infoItem}>
          <RatingStars rating={packageData.rating ?? 0} />
          <Text style={styles.infoText}>{packageData.rating ?? 0}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.price}>Npr {packageData.price ?? 0} </Text>
          <Text style={styles.person}>/person</Text>
        </View>
      </View>

      {/* ABOUT THIS PACKAGE */}
      <Text style={styles.aboutTitle}>About this Package</Text>

      {/* DESCRIPTION */}
      <TouchableOpacity onPress={toggleExpanded}>
        <Text style={styles.paragraph}>
          {expanded || packageData.description?.length <= limit
            ? packageData.description
            : `${packageData.description?.substring(0, limit)}...`}
          {packageData.description?.length > limit && (
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
        {packageData.included?.map((inc, i) => (
          <View key={i} style={styles.detailRow}>
            <Ionicons name="checkmark-circle" size={20} color="green" />
            <Text style={styles.detailText}>{inc}</Text>
          </View>
        ))}

        <Text style={styles.detailsTitle}>
          <Ionicons name="close-circle" size={20} color="red" /> Not Included:
        </Text>
        {packageData.notIncluded?.map((ninc, i) => (
          <View key={i} style={styles.detailRow}>
            <Ionicons name="close-circle" size={20} color="red" />
            <Text style={styles.detailText}>{ninc}</Text>
          </View>
        ))}
      </View>

      {/* Available Departures */}
      {packageData.usesDepartures && (
        <View style={styles.departureContainer}>
          <Text style={styles.departureTitle}>Available Departures</Text>

          {isLoadingDepartures ? (
            <ActivityIndicator
              size="large"
              color="#C62828"
              style={{ marginTop: 20 }}
            />
          ) : departuresArray.length > 0 ? (
            departuresArray.map((departure, index) => {
              const formattedDate = new Date(departure.date).toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              );

              return (
                <View
                  key={departure.id}
                  style={styles.departureCardProfessional}
                >
                  <View style={styles.departureInfo}>
                    <Text style={styles.departureDateProfessional}>
                      {formattedDate}
                    </Text>
                    <Text style={styles.departureSpotsProfessional}>
                      {departure.capacityRemaining} Spots Available
                    </Text>
                  </View>
                  <View style={styles.departurePriceBadge}>
                    <Text style={styles.departurePriceProfessional}>
                      Rs.{" "}
                      {(
                        departure.priceOverride ?? packageData.price
                      )?.toLocaleString() ?? "0"}
                    </Text>
                    <View style={styles.availableBadgeProfessional}>
                      <Text style={styles.availableTextProfessional}>
                        Available
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={{ textAlign: "center", marginTop: 10, color: "#555" }}>
              No departures available
            </Text>
          )}
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
  backButton: { position: "absolute", zIndex: 2, top: 10, left: 20 },
  headerOverlay: { padding: 15 },
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
  detailRow: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  detailText: {
    fontSize: 16,
    fontFamily: fontNames.raleway.regular,
    color: "#555",
    marginLeft: 10,
    textAlign: "center",
  },
  departureContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    shadowColor: "#080808ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    elevation: 2,
  },
  departureTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
    color: "#111827",
  },
  departureCardProfessional: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  departureInfo: {
    flex: 2,
  },
  departureDateProfessional: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  departureSpotsProfessional: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  departurePriceBadge: {
    alignItems: "flex-end",
    justifyContent: "center",
    flex: 1,
  },
  departurePriceProfessional: {
    fontSize: 16,
    fontWeight: "700",
    color: "#059669",
  },
  availableBadgeProfessional: {
    marginTop: 6,
    paddingVertical: 2,
    paddingHorizontal: 10,
    backgroundColor: "#d1fae5",
    borderRadius: 12,
  },
  availableTextProfessional: {
    color: "#065f46",
    fontWeight: "600",
    fontSize: 12,
  },
});
