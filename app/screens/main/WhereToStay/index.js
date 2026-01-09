import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Pagination from "./../../../custom/Pagination";
import { useNavigation } from "@react-navigation/native";
import { fontNames } from "../../../config/font";
import { FontAwesome } from "@expo/vector-icons";
import RatingStars from "../../../custom/RatingStars";
import { API_BASE_URL } from "../../../../config";
import FilterComponent from "../../../custom/AccommodationFilter";
import { useGetAccommodationsQuery } from "../../../services/accommodationApi";
import { useGetAverageReviewQuery } from "../../../services/feedback";
import CustomBottomTab from "../../../custom/BottomTabComponent";

const WhereToStay = () => {
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading, isError, error, isFetching, refetch } =
    useGetAccommodationsQuery({
      page: currentPage,
      limit: 100,
    });

  const accommodations = data?.data || [];

  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    subcategory: "",
    tags: [],
    priceRange: [0, 10000],
    rating: 0,
    address: "",
    destination: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Only show published accommodations
  const publishedAccommodations = useMemo(() => {
    return accommodations.filter((acc) => acc.published === true);
  }, [accommodations]);

  const transformedStays = useMemo(() => {
    return publishedAccommodations.map((stay) => ({
      id: stay.id,
      slug: stay.slug,
      title: stay.name,
      type: stay.category?.name || "Hotel",
      location: stay.address,
      price: stay.fromPrice,
      rating: 0, // Will be updated with actual rating
      image: stay.images.map((img, idx) => ({
        id: idx,
        url: img.startsWith("/api") ? `${API_BASE_URL}${img}` : img,
      })),
      tags: stay.amenities.filter((a) => a !== "[]"),
      description: stay.description,
      destinations: stay.destinations,
    }));
  }, [publishedAccommodations]);

  useEffect(() => {
    let filtered = transformedStays;

    // Filter by subcategory
    if (filters.subcategory) {
      filtered = filtered.filter((i) => i.type === filters.subcategory);
    }

    // Filter by tags/amenities
    if (filters.tags.length > 0) {
      filtered = filtered.filter((i) =>
        filters.tags.every((tag) => i.tags.includes(tag))
      );
    }

    // Filter by price range
    if (filters.priceRange) {
      filtered = filtered.filter(
        (i) =>
          i.price >= filters.priceRange[0] && i.price <= filters.priceRange[1]
      );
    }

    // Filter by rating
    if (filters.rating > 0) {
      filtered = filtered.filter((i) => i.rating >= filters.rating);
    }

    // Filter by address
    if (filters.address) {
      filtered = filtered.filter((i) =>
        i.location.toLowerCase().includes(filters.address.toLowerCase())
      );
    }

    // Filter by destination
    if (filters.destination) {
      filtered = filtered.filter((i) =>
        i.destinations.some((d) =>
          d.toLowerCase().includes(filters.destination.toLowerCase())
        )
      );
    }

    setFilteredProducts((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(filtered)) return filtered;
      return prev;
    });
  }, [filters, searchQuery, transformedStays]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setShowFilter(false);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      subcategory: "",
      tags: [],
      priceRange: [0, 10000],
      rating: 0,
      address: "",
      destination: "",
    });
    setSearchQuery("");
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#C62828" />
        <Text style={styles.loadingText}>Loading accommodations...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle" size={48} color="#C62828" />
        <Text style={styles.errorText}>Failed to load accommodations</Text>
        <Text style={styles.errorSubtext}>{error?.message}</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            colors={["#C62828"]}
            tintColor="#C62828"
          />
        }
      >
        {/* HEADER */}
        <View style={styles.title}>
          <View style={styles.leftGroup}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back-ios" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.titleText}>HomeStays</Text>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome name="bell" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* TOP INFO ROW */}
        <View style={styles.topInfoRow}>
          <View style={styles.resultsRow}>
            <Text style={styles.resultsText}>Showing</Text>
            <View style={styles.resultsBadge}>
              <Text style={styles.resultsBadgeText}>
                {filteredProducts.length}
              </Text>
            </View>
            <Text style={styles.resultsText}>results</Text>
          </View>

          <TouchableOpacity style={styles.sortButton}>
            <Text style={styles.sortText}>Newest</Text>
          </TouchableOpacity>
        </View>

        {/* SEARCH + FILTER */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#888" />
            <TextInput
              placeholder="Search accommodations, location"
              placeholderTextColor="#999"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <TouchableOpacity
            style={styles.filterCircle}
            onPress={() => setShowFilter(true)}
          >
            <Ionicons name="filter" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.productsGrid}>
          {currentItems.map((stay) => (
            <AccommodationCard
              key={stay.id}
              stay={stay}
              navigation={navigation}
            />
          ))}
        </View>

        {filteredProducts.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </ScrollView>

      {/* FILTER MODAL */}
      <FilterComponent
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        accommodations={transformedStays}
      />
      <CustomBottomTab />
    </>
  );
};

// Separate component for accommodation card to handle reviews
const AccommodationCard = ({ stay, navigation }) => {
  const { data: reviewsData } = useGetAverageReviewQuery({
    type: "accommodation",
    id: stay.id,
  });

  const rating = reviewsData?.average ?? 0; // default 0 if undefined
  const hasReviews = reviewsData?.count > 0;

  return (
    <View style={styles.productCard}>
      <Image
        source={
          stay.image[0]?.url
            ? { uri: stay.image[0].url }
            : require("../../../../assets/Images/Accomodation/hotel-house.jpg")
        }
        style={styles.productImage}
      />

      <View style={styles.productInfoContainer}>
        <View style={styles.productHeader}>
          <Text style={styles.productName} numberOfLines={1}>
            {stay.title}
          </Text>
          <View style={styles.ratingContainer}>
            <RatingStars rating={rating} />
            <Text style={styles.ratingText}>
              {hasReviews ? reviewsData.average : "N/A"}
            </Text>
          </View>
        </View>

        <View style={styles.locationContainer}>
          <Ionicons name="location-sharp" size={16} color="#888" />
          <Text style={styles.productDesc} numberOfLines={1}>
            {stay.location}
          </Text>
        </View>

        {/* PRICE + BUTTON */}
        <View style={styles.priceRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>Npr {stay.price}</Text>
            <Text style={styles.perNightText}>/ night</Text>
          </View>

          <TouchableOpacity
            style={styles.viewDetailsBtn}
            onPress={() =>
              navigation.navigate("StayDetails", { slug: stay.slug })
            }
          >
            <Text style={styles.viewDetailsText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },

  errorText: {
    marginTop: 10,
    fontSize: 18,
    color: "#C62828",
    fontWeight: "600",
  },

  errorSubtext: {
    marginTop: 5,
    fontSize: 14,
    color: "#666",
  },

  title: {
    backgroundColor: "#C62828",
    padding: 15,
    paddingTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  leftGroup: { flexDirection: "row", alignItems: "center" },

  backButton: { marginRight: 10 },

  titleText: { color: "#fff", fontSize: 24 },

  iconButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 8,
    borderRadius: 20,
  },

  topInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 8,
  },

  resultsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  resultsText: {
    fontSize: 14,
    color: "#444",
    fontFamily: fontNames.nunito.regular,
  },

  resultsBadge: {
    backgroundColor: "#C62828",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },

  resultsBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  sortButton: {
    paddingVertical: 4,
  },

  sortText: {
    color: "#C62828",
    fontSize: 14,
    fontWeight: "600",
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 10,
  },

  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: "#eee",
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    fontFamily: fontNames.nunito.regular,
  },

  filterCircle: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: "#C62828",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },

  productsGrid: { paddingHorizontal: 8 },

  productCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
  },

  productImage: { width: "100%", height: 200 },

  productInfoContainer: { padding: 12 },

  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  productName: { fontSize: 16, flex: 1 },

  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 6,
    borderRadius: 4,
  },

  ratingText: { marginLeft: 4 },

  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },

  productDesc: { marginLeft: 4 },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  priceContainer: { flexDirection: "row", alignItems: "center" },

  productPrice: {
    fontSize: 18,
    color: "#C62828",
    fontWeight: "700",
  },

  perNightText: { marginLeft: 4, color: "#888" },

  viewDetailsBtn: {
    backgroundColor: "#C62828",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },

  viewDetailsText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: fontNames.nunito.semiBold,
  },
});

export default WhereToStay;
