import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const FilterComponent = ({
  allTags,
  filters,
  setFilters,
  handleFilterApply,
  stays,
}) => {
  const [openSections, setOpenSections] = useState({
    priceRange: true,
    rating: true,
    tags: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const minPossiblePrice = Math.min(...stays.map((p) => p.price));
  const maxPossiblePrice = Math.max(...stays.map((p) => p.price));

  // Initialize with the current filter values or the full range
  const [priceRange, setPriceRange] = useState(
    filters.priceRange || [minPossiblePrice, maxPossiblePrice]
  );

  const handlePriceChange = (values) => {
    setPriceRange(values);
  };

  const handlePriceChangeComplete = (values) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: values,
    }));
  };

  // Format price with commas for thousands
  const formatPrice = (price) => {
    return `$${price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Price Range Section */}
      <View style={styles.section}>
        <TouchableOpacity
          onPress={() => toggleSection("priceRange")}
          style={styles.sectionHeader}
        >
          <Text style={styles.sectionTitle}>Price Range</Text>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={24}
            style={{
              transform: [
                { rotate: openSections.priceRange ? "180deg" : "0deg" },
              ],
            }}
          />
        </TouchableOpacity>
        {openSections.priceRange && (
          <View style={styles.sectionContent}>
            <View style={styles.priceDisplayContainer}>
              <View style={styles.priceDisplay}>
                <Text style={styles.priceLabel}>
                  Min: {formatPrice(priceRange[0])}
                </Text>
              </View>
              <View style={styles.priceDisplay}>
                <Text style={styles.priceLabel}>
                  Max: {formatPrice(priceRange[1])}
                </Text>
              </View>
            </View>

            <MultiSlider
              values={priceRange}
              sliderLength={300}
              min={minPossiblePrice}
              max={maxPossiblePrice}
              step={1}
              allowOverlap={false}
              snapped
              minMarkerOverlapDistance={40}
              onValuesChange={handlePriceChange}
              onValuesChangeFinish={handlePriceChangeComplete}
              selectedStyle={styles.selectedTrack}
              unselectedStyle={styles.unselectedTrack}
              markerStyle={styles.marker}
              trackStyle={styles.track}
              containerStyle={styles.sliderContainer}
            />

            <View style={styles.priceRangeLabels}>
              <Text style={styles.priceLimitLabel}>
                {formatPrice(minPossiblePrice)}
              </Text>
              <Text style={styles.priceLimitLabel}>
                {formatPrice(maxPossiblePrice)}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Rating Section */}
      <View style={styles.section}>
        <TouchableOpacity
          onPress={() => toggleSection("rating")}
          style={styles.sectionHeader}
        >
          <Text style={styles.sectionTitle}>Minimum Rating</Text>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={24}
            style={{
              transform: [{ rotate: openSections.rating ? "180deg" : "0deg" }],
            }}
          />
        </TouchableOpacity>
        {openSections.rating && (
          <View style={styles.sectionContent}>
            {[5, 4, 3, 2, 1].map((rating) => (
              <TouchableOpacity
                key={rating}
                style={styles.checkboxRow}
                onPress={() =>
                  setFilters((prev) => ({
                    ...prev,
                    minRating: prev.minRating === rating ? null : rating,
                  }))
                }
              >
                <MaterialCommunityIcons
                  name={
                    filters.minRating === rating
                      ? "checkbox-marked"
                      : "checkbox-blank-outline"
                  }
                  size={20}
                  color="#e53935"
                />
                <View style={styles.starsRow}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FontAwesome
                      key={i}
                      name="star"
                      size={16}
                      color={i < rating ? "#facc15" : "#e5e7eb"}
                    />
                  ))}
                  <Text style={styles.ratingText}>{rating}.0 & up</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Tags Section */}
      <View style={styles.section}>
        <TouchableOpacity
          onPress={() => toggleSection("tags")}
          style={styles.sectionHeader}
        >
          <Text style={styles.sectionTitle}>Amenities</Text>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={24}
            style={{
              transform: [{ rotate: openSections.tags ? "180deg" : "0deg" }],
            }}
          />
        </TouchableOpacity>
        {openSections.tags && (
          <View style={styles.tagsContainer}>
            {allTags.map((tag) => {
              const isSelected = filters.tags.includes(tag);
              return (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagButton,
                    isSelected
                      ? styles.tagButtonSelected
                      : styles.tagButtonUnselected,
                  ]}
                  onPress={() =>
                    setFilters((prev) => ({
                      ...prev,
                      tags: isSelected
                        ? prev.tags.filter((t) => t !== tag)
                        : [...prev.tags, tag],
                    }))
                  }
                >
                  <Text
                    style={[
                      styles.tagText,
                      isSelected
                        ? styles.tagTextSelected
                        : styles.tagTextUnselected,
                    ]}
                  >
                    {tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {/* Apply Button */}
      <TouchableOpacity onPress={handleFilterApply} style={styles.applyButton}>
        <Text style={styles.applyButtonText}>Apply Filters</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  section: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  sectionContent: {
    paddingVertical: 12,
    alignItems: "center",
  },
  priceDisplayContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
  },
  priceDisplay: {
    backgroundColor: "#f3f4f6",
    padding: 8,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  priceRangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
  },
  priceLimitLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  selectedTrack: {
    backgroundColor: "#1e90ff",
  },
  unselectedTrack: {
    backgroundColor: "#ddd",
  },
  marker: {
    backgroundColor: "#1e90ff",
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#fff",
  },
  track: {
    height: 4,
    borderRadius: 2,
  },
  sliderContainer: {
    marginHorizontal: 16,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    width: "100%",
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#4b5563",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagButton: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  tagButtonSelected: {
    backgroundColor: "#e0f2fe",
    borderColor: "#7dd3fc",
  },
  tagButtonUnselected: {
    backgroundColor: "#f9fafb",
  },
  tagText: {
    fontSize: 14,
  },
  tagTextSelected: {
    color: "#0369a1",
    fontWeight: "500",
  },
  tagTextUnselected: {
    color: "#6b7280",
  },
  applyButton: {
    backgroundColor: "#e53935",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default FilterComponent;
