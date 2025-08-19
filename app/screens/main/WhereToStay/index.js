import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import FilterComponent from "../../../components/WhereToStay/FilterComponent";
import { stays } from "../../../data/StayOptions";
import Pagination from "./../../../custom/Pagination";
import { useNavigation } from "@react-navigation/native";
import { fontNames } from "../../../config/font";
import Icon from "react-native-vector-icons/FontAwesome";
import RatingStars from "../../../custom/RatingStars";

const WhereToStay = () => {
  const navigation = useNavigation();
  const allTags = useMemo(() => {
    const tags = stays.flatMap((stay) => stay.tags || []);
    return [...new Set(tags)];
  }, []);

  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    subcategory: "", // controlled by StayOptions
    tags: [], // controlled by FilterComponent
  });
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filteredProducts, setFilteredProducts] = useState(stays);

  // Update when filters or search query change
  useEffect(() => {
    let filtered = stays;

    if (filters.subcategory) {
      filtered = filtered.filter((item) => item.type === filters.subcategory);
    }

    if (filters.tags.length > 0) {
      filtered = filtered.filter((item) =>
        filters.tags.every((tag) => item.tags.includes(tag))
      );
    }

    if (filters.priceRange?.length === 2) {
      const [min, max] = filters.priceRange;
      filtered = filtered.filter(
        (item) => item.price >= min && item.price <= max
      );
    }

    if (filters.minRating) {
      filtered = filtered.filter((item) => item.rating >= filters.minRating);
    }

    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [filters, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterApply = () => {
    setShowFilter(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
          <Icon name="bell" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search and filter row */}
      <View style={styles.searchFilterRow}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search HomeStays..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilter((prev) => !prev)}
        >
          <MaterialIcons name="filter-list" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {showFilter && (
        <FilterComponent
          allTags={allTags}
          filters={filters}
          setFilters={setFilters}
          handleFilterApply={handleFilterApply}
          stays={stays}
        />
      )}

      <View style={styles.productsGrid}>
        {currentItems.map((stay) => (
          <TouchableOpacity
            key={stay.id}
            style={styles.productCard}
            onPress={() => navigation.navigate("StayDetails", { id: stay.id })}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: stay.image[0]?.url }}
              style={styles.productImage}
              resizeMode="cover"
            />
            <View style={styles.productInfoContainer}>
              <View style={styles.productHeader}>
                <Text style={styles.productName} numberOfLines={1}>
                  {stay.title}
                </Text>
                <View style={styles.ratingContainer}>
                  <RatingStars rating={stay.rating} />
                  <Text style={styles.ratingText}>
                    {stay.rating?.toFixed(1)}
                  </Text>
                </View>
              </View>
              <View style={styles.locationContainer}>
                <Ionicons name="location-sharp" size={16} color="#888" />
                <Text style={styles.productDesc} numberOfLines={1}>
                  {stay.location}
                </Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.productPrice}>Npr {stay.price}</Text>
                <Text style={styles.perNightText}>/ night</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {filteredProducts.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}

      <View style={styles.tipContainer}>
        <Ionicons name="information-circle" size={24} color="#841584" />
        <Text style={styles.tipText}>
          All listings verified for quality and safety
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  title: {
    marginTop: -1,
    backgroundColor: "#C62828",
    padding: 15,
    paddingTop: 40,
    marginBlock: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  titleText: {
    fontSize: 24,
    color: "#fff",
    fontFamily: fontNames.nunito.regular,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  iconButton: {
    marginLeft: 15,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  searchFilterRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 3, // spacing between search and filter
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden", // clip icon inside border
    height: 45,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: fontNames.playfair.regular,
    width: "78%",
    height: "100%",
  },
  filterButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  productCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productInfoContainer: {
    padding: 12,
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  productName: {
    fontFamily: fontNames.raleway.medium,
    fontSize: 16,
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  productDesc: {
    fontSize: 14,
    color: "#666",
    fontFamily: fontNames.raleway.medium,
    marginLeft: 4,
    flex: 1,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  productPrice: {
    fontFamily: fontNames.allura,
    fontSize: 18,
    color: "#1e8229ff",
  },
  perNightText: {
    fontSize: 14,
    color: "#888",
    marginLeft: 4,
    marginBottom: 1,
  },
  tipContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0e6ff",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  tipText: {
    marginLeft: 10,
    fontFamily: fontNames.nunito.regular,
    fontSize: 14,
    color: "#333",
  },
});

export default WhereToStay;
