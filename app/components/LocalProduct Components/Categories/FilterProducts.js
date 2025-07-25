import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { MaterialIcons } from "@expo/vector-icons";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FilterProductComponent = ({ onApplyFilters, availableTags = [] }) => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
    } else {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  const handleApply = () => {
    onApplyFilters({
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minRating: selectedRating,
      tags: selectedTags,
    });
    setIsExpanded(false);
  };

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded((prev) => !prev);
  };

  return (
    <View style={styles.wrapper}>
      {/* Dropdown Header */}
      <TouchableOpacity style={styles.dropdownHeader} onPress={toggleExpand}>
        <Text style={styles.dropdownHeaderText}>Filter Products</Text>
        <MaterialIcons
          name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={24}
          color="#333"
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.container}>
          {/* Price Range */}
          <Text style={styles.label}>Price Range (Rs.)</Text>
          <MultiSlider
            values={priceRange}
            min={0}
            max={10000}
            step={100}
            onValuesChange={(values) => setPriceRange(values)}
            selectedStyle={{ backgroundColor: "#2a52be" }}
            markerStyle={{ backgroundColor: "#2a52be" }}
          />
          <View style={styles.priceLabels}>
            <Text>Min: Rs. {priceRange[0]}</Text>
            <Text>Max: Rs. {priceRange[1]}</Text>
          </View>

          {/* Ratings */}
          <Text style={styles.label}>Minimum Rating</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((rating) => (
              <TouchableOpacity
                key={rating}
                style={styles.ratingItem}
                onPress={() => setSelectedRating(rating)}
              >
                <MaterialIcons
                  name={
                    selectedRating === rating
                      ? "check-box"
                      : "check-box-outline-blank"
                  }
                  size={20}
                  color="#2a52be"
                />
                <Text style={styles.ratingText}>{rating} Stars & Up</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tags */}
          <Text style={styles.label}>Tags</Text>
          <View style={styles.tagsContainer}>
            {availableTags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tag,
                  selectedTags.includes(tag) && styles.tagSelected,
                ]}
                onPress={() => toggleTag(tag)}
              >
                <Text
                  style={{
                    color: selectedTags.includes(tag) ? "#fff" : "#333",
                  }}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Apply Button */}
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#f0f0f0",
  },
  dropdownHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  container: {
    padding: 12,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 6,
    color: "#333",
  },
  priceLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  ratingContainer: {
    flexDirection: "column",
    marginBottom: 10,
  },
  ratingItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tag: {
    borderWidth: 1,
    borderColor: "#aaa",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  tagSelected: {
    backgroundColor: "#2a52be",
    borderColor: "#2a52be",
  },
  applyButton: {
    marginTop: 12,
    backgroundColor: "#2a52be",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  applyText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default FilterProductComponent;
