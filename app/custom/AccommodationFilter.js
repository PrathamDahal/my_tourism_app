import { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { fontNames } from "../config/font";

const FilterComponent = ({
  visible,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
  accommodations,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  // Extract unique values from accommodations
  const categories = useMemo(() => {
    const cats = accommodations.map((acc) => acc.type);
    return [...new Set(cats)];
  }, [accommodations]);

  const amenities = useMemo(() => {
    const allAmenities = accommodations.flatMap((acc) => acc.tags);
    return [...new Set(allAmenities)];
  }, [accommodations]);

  const addresses = useMemo(() => {
    const addrs = accommodations.map((acc) => acc.location);
    return [...new Set(addrs)];
  }, [accommodations]);

  const destinations = useMemo(() => {
    const dests = accommodations.flatMap((acc) => acc.destinations);
    return [...new Set(dests.filter((d) => d !== "[]"))];
  }, [accommodations]);

  const handleSubcategoryPress = (category) => {
    setLocalFilters({
      ...localFilters,
      subcategory: localFilters.subcategory === category ? "" : category,
    });
  };

  const handleAmenityPress = (amenity) => {
    const currentTags = localFilters.tags || [];
    const newTags = currentTags.includes(amenity)
      ? currentTags.filter((t) => t !== amenity)
      : [...currentTags, amenity];

    setLocalFilters({
      ...localFilters,
      tags: newTags,
    });
  };

  const handlePriceChange = (value) => {
    setLocalFilters({
      ...localFilters,
      priceRange: [localFilters.priceRange[0], value],
    });
  };

  const handleRatingPress = (rating) => {
    setLocalFilters({
      ...localFilters,
      rating: localFilters.rating === rating ? 0 : rating,
    });
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      subcategory: "",
      tags: [],
      priceRange: [0, 10000],
      rating: 0,
      address: "",
      destination: "",
    };
    setLocalFilters(resetFilters);
    onResetFilters();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalBody}
            showsVerticalScrollIndicator={false}
          >
            {/* Category Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Accommodation Type</Text>
              <View style={styles.chipsContainer}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.chip,
                      localFilters.subcategory === category &&
                        styles.chipSelected,
                    ]}
                    onPress={() => handleSubcategoryPress(category)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        localFilters.subcategory === category &&
                          styles.chipTextSelected,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Price Range Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>
                Price Range (NPR 0 - {localFilters.priceRange[1]})
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={10000}
                step={100}
                value={localFilters.priceRange[1]}
                onValueChange={handlePriceChange}
                minimumTrackTintColor="#C62828"
                maximumTrackTintColor="#ddd"
                thumbTintColor="#C62828"
              />
              <View style={styles.priceLabels}>
                <Text style={styles.priceLabel}>NPR 0</Text>
                <Text style={styles.priceLabel}>
                  NPR {localFilters.priceRange[1]}
                </Text>
              </View>
            </View>

            {/* Rating Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Minimum Rating</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.ratingButton,
                      localFilters.rating === rating && styles.ratingSelected,
                    ]}
                    onPress={() => handleRatingPress(rating)}
                  >
                    <Ionicons
                      name="star"
                      size={20}
                      color={
                        localFilters.rating === rating ? "#fff" : "#C62828"
                      }
                    />
                    <Text
                      style={[
                        styles.ratingText,
                        localFilters.rating === rating &&
                          styles.ratingTextSelected,
                      ]}
                    >
                      {rating}+
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Amenities Filter */}
            {amenities.length > 0 && (
              <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>Amenities</Text>
                <View style={styles.chipsContainer}>
                  {amenities.map((amenity) => (
                    <TouchableOpacity
                      key={amenity}
                      style={[
                        styles.chip,
                        localFilters.tags?.includes(amenity) &&
                          styles.chipSelected,
                      ]}
                      onPress={() => handleAmenityPress(amenity)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          localFilters.tags?.includes(amenity) &&
                            styles.chipTextSelected,
                        ]}
                      >
                        {amenity}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Address Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Location/Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter location or address"
                placeholderTextColor="#999"
                value={localFilters.address}
                onChangeText={(text) =>
                  setLocalFilters({ ...localFilters, address: text })
                }
              />
              <View style={styles.chipsContainer}>
                {addresses.slice(0, 6).map((address, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.chip,
                      localFilters.address === address && styles.chipSelected,
                    ]}
                    onPress={() =>
                      setLocalFilters({
                        ...localFilters,
                        address:
                          localFilters.address === address ? "" : address,
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.chipText,
                        localFilters.address === address &&
                          styles.chipTextSelected,
                      ]}
                    >
                      {address}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Destination Filter */}
            {destinations.length > 0 && (
              <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>Destinations</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Search destinations"
                  placeholderTextColor="#999"
                  value={localFilters.destination}
                  onChangeText={(text) =>
                    setLocalFilters({ ...localFilters, destination: text })
                  }
                />
                <View style={styles.chipsContainer}>
                  {destinations.slice(0, 8).map((dest, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.chip,
                        localFilters.destination === dest &&
                          styles.chipSelected,
                      ]}
                      onPress={() =>
                        setLocalFilters({
                          ...localFilters,
                          destination:
                            localFilters.destination === dest ? "" : dest,
                        })
                      }
                    >
                      <Text
                        style={[
                          styles.chipText,
                          localFilters.destination === dest &&
                            styles.chipTextSelected,
                        ]}
                      >
                        {dest}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>Reset All</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    fontFamily: fontNames.nunito.bold,
  },

  closeButton: {
    padding: 4,
  },

  modalBody: {
    padding: 20,
  },

  filterSection: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    fontFamily: fontNames.nunito.semiBold,
  },

  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
  },

  chipSelected: {
    backgroundColor: "#C62828",
    borderColor: "#C62828",
  },

  chipText: {
    fontSize: 14,
    color: "#666",
    fontFamily: fontNames.nunito.regular,
  },

  chipTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },

  slider: {
    width: "100%",
    height: 40,
  },

  priceLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -10,
  },

  priceLabel: {
    fontSize: 14,
    color: "#666",
    fontFamily: fontNames.nunito.regular,
  },

  ratingContainer: {
    flexDirection: "row",
    gap: 8,
  },

  ratingButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
    gap: 4,
  },

  ratingSelected: {
    backgroundColor: "#C62828",
    borderColor: "#C62828",
  },

  ratingText: {
    fontSize: 14,
    color: "#666",
    fontFamily: fontNames.nunito.regular,
  },

  ratingTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
    fontFamily: fontNames.nunito.regular,
  },

  modalFooter: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },

  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },

  resetButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
    fontFamily: fontNames.nunito.semiBold,
  },

  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#C62828",
    alignItems: "center",
    justifyContent: "center",
  },

  applyButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    fontFamily: fontNames.nunito.semiBold,
  },
});

export default FilterComponent;