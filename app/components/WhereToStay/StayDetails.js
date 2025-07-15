import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { stays } from "../../data/StayOptions";

const StayDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;

  const [stay, setStay] = useState(null);

  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());
  const [roomCount, setRoomCount] = useState(1);
  const [guestCount, setGuestCount] = useState(2);

  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);

  useEffect(() => {
    const foundStay = stays.find((s) => s.id === id);
    if (foundStay) setStay(foundStay);
    else navigation.goBack();
  }, [id]);

  const incrementCount = (setter) => setter((prev) => prev + 1);
  const decrementCount = (setter, value, min = 1) => {
    if (value > min) setter((prev) => prev - 1);
  };

  const handleReserve = () => {
    Alert.alert("Reservation Confirmed", `Booking for ${stay.title}!`);
  };

  const amenitiesList = [
    { icon: "📶", name: "Wifi" },
    { icon: "📺", name: "Tv" },
    { icon: "🍽️", name: "Utensils" },
    { icon: "🏔️", name: "Mountain View" },
    { icon: "❄️", name: "A/C" },
    { icon: "🅿️", name: "Free Parking" },
    { icon: "🐶", name: "Pet Friendly" },
    { icon: "⚡", name: "High-Speed Internet" },
    { icon: "🧺", name: "Laundry Services" },
  ];

  if (!stay) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>{stay.title}</Text>
      <Text style={styles.location}>{stay.location}</Text>

      {/* Images */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
      >
        {stay.image.map((img) => (
          <Image key={img.id} source={{ uri: img.url }} style={styles.image} />
        ))}
      </ScrollView>

      <View style={styles.propertyInfoContainer}>
        <Text style={styles.propertyTitle}>Entire home in Panchpokhari</Text>
        <Text style={styles.propertyDetails}>
          10 guests · 4 bedrooms · 5 beds · 5 baths
        </Text>

        <Text style={styles.propertyDescription}>
          Pawna Lake's glassy surface stretches beyond this Lonavala villa while
          the Western Ghats punctuate the horizon. Earthy tones and a clean,
          cozy design scheme are drenched in sunlight inside the sprawling
          living space. Follow a stone path through the lush garden as you sip a
          glass of champagne. A sleek infinity pool melts into the panoramic
          view. Hike to the scenic plateau at nearby Mangi Tungi.
        </Text>

        <TouchableOpacity style={styles.showMoreButton}>
          <Text style={styles.showMoreText}>Show more ›</Text>
        </TouchableOpacity>

        {/* Amenities */}
        <View style={styles.amenitiesContainer}>
          <Text style={styles.amenitiesTitle}>What this place offers</Text>
          {amenitiesList.map((amenity, index) => (
            <View key={index} style={styles.amenityItem}>
              <Text style={styles.amenityIcon}>{amenity.icon}</Text>
              <Text style={styles.amenityName}>{amenity.name}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.showAllFeaturesButton}>
            <Text style={styles.showAllFeaturesText}>Show all 12 features</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Booking Widget */}
      <View style={styles.bookingCard}>
        <View style={styles.priceRow}>
          <Text style={styles.priceText}>
            NRS {stay.price || "1,437"} /night
          </Text>
        </View>

        {/* Date Selection */}
        <View style={styles.dateSection}>
          <TouchableOpacity
            style={styles.datePicker}
            onPress={() => setShowCheckInPicker(true)}
          >
            <Text style={styles.dateLabel}>CHECK-IN</Text>
            <Text style={styles.dateValue}>{checkInDate.toDateString()}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.datePicker}
            onPress={() => setShowCheckOutPicker(true)}
          >
            <Text style={styles.dateLabel}>CHECK-OUT</Text>
            <Text style={styles.dateValue}>{checkOutDate.toDateString()}</Text>
          </TouchableOpacity>
        </View>

        {showCheckInPicker && (
          <DateTimePicker
            value={checkInDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowCheckInPicker(false);
              if (date) setCheckInDate(date);
            }}
          />
        )}
        {showCheckOutPicker && (
          <DateTimePicker
            value={checkOutDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowCheckOutPicker(false);
              if (date) setCheckOutDate(date);
            }}
          />
        )}

        {/* Room Selection */}
        <View style={styles.counterRow}>
          <Text style={styles.counterLabel}>Room</Text>
          <View style={styles.counterControl}>
            <TouchableOpacity
              onPress={() => decrementCount(setRoomCount, roomCount)}
            >
              <Text style={styles.counterButton}>-</Text>
            </TouchableOpacity>
            <Text style={styles.counterValue}>{roomCount}</Text>
            <TouchableOpacity onPress={() => incrementCount(setRoomCount)}>
              <Text style={styles.counterButton}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.smallNote}>3 rooms left</Text>
        </View>

        {/* Guest Selection */}
        <View style={styles.counterRow}>
          <Text style={styles.counterLabel}>Guests</Text>
          <View style={styles.counterControl}>
            <TouchableOpacity
              onPress={() => decrementCount(setGuestCount, guestCount)}
            >
              <Text style={styles.counterButton}>-</Text>
            </TouchableOpacity>
            <Text style={styles.counterValue}>{guestCount}</Text>
            <TouchableOpacity onPress={() => incrementCount(setGuestCount)}>
              <Text style={styles.counterButton}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.smallNote}>max 3 guest</Text>
        </View>

        {/* Price Details */}
        <View style={styles.priceDetails}>
          <Text style={styles.priceDetailsTitle}>Price Details</Text>
          <View style={styles.priceDetailRow}>
            <Text>1 room × 2 nights</Text>
            <Text>$120.32</Text>
          </View>
          <View style={styles.priceDetailRow}>
            <Text>Tax and service fees</Text>
            <Text>$8.32</Text>
          </View>
          <View style={[styles.priceDetailRow, { borderTopWidth: 1 }]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalLabel}>$1,200</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.reserveButton} onPress={handleReserve}>
          <Text style={styles.reserveText}>Reserve</Text>
        </TouchableOpacity>
        <Text style={styles.hostNote}>Host will contact you soon</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  location: { fontSize: 16, color: "#666", marginBottom: 12 },
  carousel: { marginBottom: 16 },
  image: { width: 350, height: 200, marginRight: 10, borderRadius: 10 },

  propertyInfoContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  propertyDetails: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  propertyDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12,
    lineHeight: 20,
  },
  showMoreButton: {
    marginBottom: 16,
  },
  showMoreText: {
    color: "#1e88e5",
    fontSize: 14,
    fontWeight: "500",
  },
  amenitiesContainer: {
    marginTop: 16,
  },
  amenitiesTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  amenityIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  amenityName: {
    fontSize: 14,
    color: "#333",
  },
  showAllFeaturesButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  showAllFeaturesText: {
    fontSize: 14,
    color: "#333",
  },
  bookingCard: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    marginBottom: 40,
    backgroundColor: "#fff",

    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,

    // Elevation for Android
    elevation: 8,

    // Optional: create a subtle top highlight for better 3D
    shadowTop: {
      shadowColor: "#fff",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  priceText: { fontSize: 20, fontWeight: "bold" },

  dateSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  datePicker: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000",
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  dateLabel: { fontSize: 12, color: "#888" },
  dateValue: { fontSize: 14, fontWeight: "600" },

  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    justifyContent: "space-between",
  },
  counterLabel: { fontSize: 16, fontWeight: "500" },
  counterControl: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  counterButton: { fontSize: 20, color: "#007bff", paddingHorizontal: 8 },
  counterValue: { fontSize: 16, marginHorizontal: 8 },
  smallNote: { fontSize: 12, color: "#007bff", marginLeft: 8 },

  priceDetails: {
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  priceDetailsTitle: {
    fontWeight: "bold",
    marginBottom: 8,
    backgroundColor: "#eee",
    padding: 4,
  },
  priceDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  totalLabel: { fontWeight: "bold" },

  reserveButton: {
    backgroundColor: "#e53935",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  reserveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  hostNote: { textAlign: "center", marginTop: 8, color: "#666", fontSize: 12 },
});

export default StayDetails;
