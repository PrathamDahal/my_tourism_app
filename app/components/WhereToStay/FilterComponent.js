import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import products from './../../data/products';

const FilterComponent = ({
  subcategories,
  allTags,
  filters,
  setFilters,
  handleFilterApply,
}) => {
  const [openSections, setOpenSections] = useState({
    categories: true,
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

  const minPrice = Math.min(...products.map((p) => p.price));
  const maxPrice = Math.max(...products.map((p) => p.price));

  const cleanTags = (tags) => {
    if (Array.isArray(tags)) return tags;
    return tags
      .replace(/[\]"]+/g, '')
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Categories */}
      <View style={styles.section}>
        <TouchableOpacity
          onPress={() => toggleSection('categories')}
          style={styles.sectionHeader}
        >
          <Text style={styles.sectionTitle}>All Categories</Text>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={24}
            style={{
              transform: [{ rotate: openSections.categories ? '180deg' : '0deg' }],
            }}
          />
        </TouchableOpacity>
        {openSections.categories && (
          <View style={styles.sectionContent}>
            {subcategories.map((subcat) => (
              <TouchableOpacity
                key={subcat}
                style={styles.radioRow}
                onPress={() =>
                  setFilters((prev) => ({
                    ...prev,
                    selectedSubCategories:
                      prev.selectedSubCategories.includes(subcat) ? [] : [subcat],
                  }))
                }
              >
                <MaterialCommunityIcons
                  name={
                    filters.selectedSubCategories.includes(subcat)
                      ? 'radiobox-marked'
                      : 'radiobox-blank'
                  }
                  size={20}
                  color="#e53935"
                />
                <Text style={styles.radioLabel}>{subcat}</Text>
                <Text style={styles.radioCount}>(154)</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Price Range */}
      <View style={styles.section}>
        <TouchableOpacity
          onPress={() => toggleSection('priceRange')}
          style={styles.sectionHeader}
        >
          <Text style={styles.sectionTitle}>Price</Text>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={24}
            style={{
              transform: [{ rotate: openSections.priceRange ? '180deg' : '0deg' }],
            }}
          />
        </TouchableOpacity>
        {openSections.priceRange && (
          <View style={styles.sectionContent}>
            <Slider
              minimumValue={minPrice}
              maximumValue={maxPrice}
              step={1}
              value={filters.priceRange[1]}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  priceRange: [minPrice, value],
                }))
              }
              minimumTrackTintColor="#1e90ff"
              maximumTrackTintColor="#ddd"
              thumbTintColor="#1e90ff"
            />
            <View style={styles.priceRangeLabels}>
              <Text style={styles.priceLabel}>Price: ${minPrice}</Text>
              <Text style={styles.priceLabel}>To</Text>
              <Text style={styles.priceLabel}>${filters.priceRange[1]}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Rating */}
      <View style={styles.section}>
        <TouchableOpacity
          onPress={() => toggleSection('rating')}
          style={styles.sectionHeader}
        >
          <Text style={styles.sectionTitle}>Rating</Text>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={24}
            style={{
              transform: [{ rotate: openSections.rating ? '180deg' : '0deg' }],
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
                      ? 'checkbox-marked'
                      : 'checkbox-blank-outline'
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
                      color={i < rating ? '#facc15' : '#e5e7eb'}
                    />
                  ))}
                  <Text style={styles.ratingText}>{rating}.0 & up</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Tags */}
      <View style={styles.section}>
        <TouchableOpacity
          onPress={() => toggleSection('tags')}
          style={styles.sectionHeader}
        >
          <Text style={styles.sectionTitle}>Popular Tag</Text>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={24}
            style={{
              transform: [{ rotate: openSections.tags ? '180deg' : '0deg' }],
            }}
          />
        </TouchableOpacity>
        {openSections.tags && (
          <View style={styles.tagsContainer}>
            {cleanTags(allTags).map((tag) => {
              const isSelected = filters.selectedTags.includes(tag);
              return (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagButton,
                    isSelected ? styles.tagButtonSelected : styles.tagButtonUnselected,
                  ]}
                  onPress={() =>
                    setFilters((prev) => ({
                      ...prev,
                      selectedTags: isSelected
                        ? prev.selectedTags.filter((t) => t !== tag)
                        : [...prev.selectedTags, tag],
                    }))
                  }
                >
                  <Text
                    style={[
                      styles.tagText,
                      isSelected ? styles.tagTextSelected : styles.tagTextUnselected,
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

      <TouchableOpacity
        onPress={handleFilterApply}
        style={styles.applyButton}
      >
        <Text style={styles.applyButtonText}>Apply Filters</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  sectionContent: {
    paddingVertical: 8,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4b5563',
  },
  radioCount: {
    marginLeft: 'auto',
    fontSize: 12,
    color: '#9ca3af',
  },
  priceRangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#4b5563',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#4b5563',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  tagButton: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagButtonSelected: {
    backgroundColor: '#dbeafe',
  },
  tagButtonUnselected: {
    backgroundColor: '#f3f4f6',
  },
  tagText: {
    fontSize: 12,
  },
  tagTextSelected: {
    color: '#2563eb',
  },
  tagTextUnselected: {
    color: '#4b5563',
  },
  applyButton: {
    marginTop: 12,
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FilterComponent;
