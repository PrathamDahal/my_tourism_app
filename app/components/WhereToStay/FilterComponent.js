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

  // Initialize price range if not set
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);

  return (
    <ScrollView style={styles.container}>
      {/* Categories Section */}
      <View style={styles.section}>
        <TouchableOpacity
          onPress={() => toggleSection('categories')}
          style={styles.sectionHeader}
        >
          <Text style={styles.sectionTitle}>Categories</Text>
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
                    subcategory: prev.subcategory === subcat ? '' : subcat,
                  }))
                }
              >
                <MaterialCommunityIcons
                  name={
                    filters.subcategory === subcat
                      ? 'radiobox-marked'
                      : 'radiobox-blank'
                  }
                  size={20}
                  color="#e53935"
                />
                <Text style={styles.radioLabel}>{subcat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Price Range Section */}
      <View style={styles.section}>
        <TouchableOpacity
          onPress={() => toggleSection('priceRange')}
          style={styles.sectionHeader}
        >
          <Text style={styles.sectionTitle}>Price Range</Text>
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
              value={priceRange[1]}
              onValueChange={(value) => setPriceRange([minPrice, value])}
              onSlidingComplete={(value) => 
                setFilters(prev => ({
                  ...prev,
                  priceRange: [minPrice, value]
                }))
              }
              minimumTrackTintColor="#1e90ff"
              maximumTrackTintColor="#ddd"
              thumbTintColor="#1e90ff"
            />
            <View style={styles.priceRangeLabels}>
              <Text style={styles.priceLabel}>${minPrice}</Text>
              <Text style={styles.priceLabel}>${priceRange[1]}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Rating Section */}
      <View style={styles.section}>
        <TouchableOpacity
          onPress={() => toggleSection('rating')}
          style={styles.sectionHeader}
        >
          <Text style={styles.sectionTitle}>Minimum Rating</Text>
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

      {/* Tags Section */}
      <View style={styles.section}>
        <TouchableOpacity
          onPress={() => toggleSection('tags')}
          style={styles.sectionHeader}
        >
          <Text style={styles.sectionTitle}>Amenities</Text>
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
            {allTags.map((tag) => {
              const isSelected = filters.tags.includes(tag);
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
                      tags: isSelected
                        ? prev.tags.filter((t) => t !== tag)
                        : [...prev.tags, tag],
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

      {/* Apply Button */}
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
    padding: 16,
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  sectionContent: {
    paddingVertical: 12,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4b5563',
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
    marginBottom: 12,
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
  },
  tagButton: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tagButtonSelected: {
    backgroundColor: '#e0f2fe',
    borderColor: '#7dd3fc',
  },
  tagButtonUnselected: {
    backgroundColor: '#f9fafb',
  },
  tagText: {
    fontSize: 14,
  },
  tagTextSelected: {
    color: '#0369a1',
    fontWeight: '500',
  },
  tagTextUnselected: {
    color: '#6b7280',
  },
  applyButton: {
    backgroundColor: '#e53935',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FilterComponent;