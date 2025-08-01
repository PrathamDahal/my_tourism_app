import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import StayOptions from "../../../components/WhereToStay/StayOptions";
import FilterComponent from "../../../components/WhereToStay/FilterComponent";
import { stays } from "../../../data/StayOptions";
import Pagination from "./../../../custom/Pagination";
import { useNavigation } from "@react-navigation/native";
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filteredProducts, setFilteredProducts] = useState(stays);

  // Update when filters change
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

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [filters]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterApply = () => {
    setShowFilter(false);
  };

  // Called when StayOptions filter is clicked
  const handleTypeSelect = (type) => {
    setFilters((prev) => ({
      ...prev,
      subcategory: type === "All" ? "" : type,
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Where To Stay</Text>
      <Text style={styles.subHeader}>
        Find the perfect accommodation for your trip
      </Text>

      {/* First filter: Stay type */}
      <StayOptions onSelectType={handleTypeSelect} />

      {/* Second filter: Additional tags, price, rating etc */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowFilter((prev) => !prev)}
      >
        <View style={styles.filterButtonContent}>
          <Text style={styles.filterButtonText}>Filter by...</Text>
          <Ionicons
            name={showFilter ? "chevron-up" : "chevron-down"}
            size={20}
            color="#fff"
            style={styles.filterButtonIcon}
          />
        </View>
      </TouchableOpacity>

      {showFilter && (
        <FilterComponent
          allTags={allTags}
          filters={filters}
          setFilters={setFilters}
          handleFilterApply={handleFilterApply}
          stays={stays}
        />
      )}

      {/* Products */}
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
            <Text style={styles.productName}>{stay.title}</Text>
            <Text style={styles.productDesc} numberOfLines={2}>
              {stay.location}
            </Text>
            <Text style={styles.productPrice}>Rs. {stay.price}</Text>
            {stay.rating && <RatingStars rating={stay.rating} />}
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
    paddingHorizontal: 16,
    paddingTop: 32,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  subHeader: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  filterButton: {
    width: "50%",
    backgroundColor: "#e53935",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  filterButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  filterButtonIcon: {
    marginLeft: 8,
  },
  filterButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
  },
  productName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    color: "#333",
  },
  productDesc: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  productPrice: {
    fontWeight: "bold",
    fontSize: 16,
    color: "green",
  },
  tipContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0e6ff",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  tipText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
  },
});

export default WhereToStay;
