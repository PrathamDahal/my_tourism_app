import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { fontNames } from "../../../config/font";
import RatingStars from "../../../custom/RatingStars";
import { useGetTravelPackagesQuery } from "../../../services/travelPackagesApi";
import { useGetAverageReviewQuery } from "../../../services/feedback";
import { API_BASE_URL } from "../../../../config";
import CustomBottomTab from "../../../custom/BottomTabComponent";

const PackageCard = ({ item, navigation }) => {
  const { data: reviewsData } = useGetAverageReviewQuery({
    type: "package",
    id: item.id,
  });

  const rating = reviewsData?.average ?? 0;
  const hasReviews = reviewsData?.count > 0;

  // Safely get the first image string
  const firstImage = item?.images?.[0];

  // Construct full URL
  const imageSource = firstImage
    ? { uri: `${API_BASE_URL}${firstImage}` } // remote
    : require("../../../../assets/Images/Travel/travel-default.jpg"); // local

  return (
    <View style={styles.card}>
      {imageSource ? (
        <Image source={imageSource} style={styles.image} />
      ) : (
        <View
          style={[
            styles.image,
            {
              backgroundColor: "#ccc",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <Text>No Image</Text>
        </View>
      )}

      <View style={styles.durationBadge}>
        <Ionicons name="time-outline" size={14} color="#000" />
        <Text style={styles.durationText}>
          {item?.durationDays ?? 0} Days / {item?.durationNights ?? 0} Nights
        </Text>
      </View>

      <View style={styles.cardContent}>
        {/* Title and Rating Row */}
        <View style={styles.titleRatingRow}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item?.name ?? "No Title"}
          </Text>
          <View style={styles.ratingContainer}>
            <RatingStars rating={rating} />
            <Text style={styles.ratingText}>
              {hasReviews ? reviewsData.average.toFixed(1) : "N/A"}
            </Text>
          </View>
        </View>

        <Text style={styles.location}>
          {item?.destinations?.[0]?.name ?? "Unknown Location"}
        </Text>

        {/* Price and Button Row */}
        <View style={styles.priceButtonRow}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>Npr {item?.price ?? 0}</Text>
            <Text style={styles.person}>/person</Text>
          </View>
          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={() =>
              navigation.navigate("TravelPackageDetails", { packageData: item })
            }
          >
            <Text style={styles.viewDetailsText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const TravelPackagesScreen = () => {
  const [search, setSearch] = useState("");
  const navigation = useNavigation();

  const {
    data: travelPackages,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetTravelPackagesQuery();

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#C62828" />
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text>{error?.message || "Failed to load travel packages"}</Text>
      </View>
    );
  }

  const Packages = travelPackages?.data || [];

  const filteredPackages = Packages.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderPackage = ({ item }) => (
    <PackageCard item={item} navigation={navigation} />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.leftGroup}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back-ios" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Travel Packages</Text>
        </View>
        <TouchableOpacity style={styles.headerIconButton}>
          <FontAwesome name="bell" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Row */}
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search packages..."
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.searchIconButton}>
          <MaterialIcons name="filter-list" size={22} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.searchIconButton, { backgroundColor: "#C62828" }]}
        >
          <Ionicons name="search" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Package List */}
      <FlatList
        data={filteredPackages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPackage}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshing={isFetching}
        onRefresh={refetch}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 50 }}>
            <Text>No packages found.</Text>
          </View>
        }
      />
      
      <CustomBottomTab />
    </View>
  );
};

export default TravelPackagesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#C62828",
    paddingHorizontal: 15,
    paddingTop: 45,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftGroup: { flexDirection: "row", alignItems: "center" },
  backButton: { marginRight: 10, padding: 4 },
  headerTitle: {
    fontSize: 24,
    color: "#fff",
    fontFamily: fontNames.nunito.regular,
  },
  headerIconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  searchRow: { flexDirection: "row", alignItems: "center", margin: 12 },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: fontNames.playfair.regular,
    width: "78%",
    height: "100%",
  },
  searchIconButton: {
    marginLeft: 2,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 16,
    marginHorizontal: 12,
    elevation: 3,
    overflow: "hidden",
  },
  image: { width: "100%", height: 180 },
  durationBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  durationText: { fontSize: 12, marginLeft: 4 },
  cardContent: { padding: 10 },
  titleRatingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitle: {
    fontFamily: fontNames.openSans.semibold,
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: "bold",
    color: "#333",
  },
  location: { fontSize: 13, color: "#666", marginBottom: 8 },
  priceButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: { color: "green", fontSize: 14, fontWeight: "bold" },
  person: { fontSize: 12, color: "#444" },
  viewDetailsButton: {
    backgroundColor: "#C62828",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  viewDetailsText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: fontNames.nunito.semiBold,
  },
});
