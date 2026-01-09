import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Platform,
} from "react-native";
import { useGetUserBookingsQuery } from "../../services/userApi"; // Update with correct import path
import ProductBookings from "./Booking Components/ProductBookings";
import AccommodationBookings from "./Booking Components/AccommodationBookings";
import PackageBookings from "./Booking Components/PackageBookings";
import { fontNames } from "../../config/font";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

const MyBookings = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Get userId from route params passed from UserProfile
  const userId = route.params?.userId;

  // Single API call to get all bookings
  const {
    data: bookingsData,
    isLoading,
    refetch,
    isFetching,
  } = useGetUserBookingsQuery(userId, {
    skip: !userId, // Skip query if userId is not available
  });

  // Extract different booking types from the response
  // Filter only processing or completed product orders
  const orders =
    bookingsData?.products?.filter(
      (o) => o.status === "processing" || o.status === "completed"
    ) || [];

  // Accommodation bookings - using the 'accommodations' array
  const roomBookings = bookingsData?.accommodations || [];

  // Travel package bookings - using the 'travelPackages' array
  const packageBookings = bookingsData?.travelPackages || [];

  // Show loading if query is loading
  if (isLoading) {
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;
  }

  // Handle case where userId is not available
  if (!userId) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>User not authenticated</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#070c1dff" />
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </View>

      {/* Product Bookings Section */}
      <View style={styles.section}>
        <Text style={styles.headerText}>Product History:</Text>
        <ScrollView horizontal>
          <View style={{ minWidth: screenWidth - 24 }}>
            <ProductBookings
              orders={orders}
              isFetching={isFetching}
              refetch={refetch}
            />
          </View>
        </ScrollView>
      </View>

      {/* Accommodation Bookings Section */}
      <View style={styles.section}>
        <Text style={styles.headerText}>Accommodation History:</Text>
        <ScrollView horizontal>
          <View style={{ minWidth: screenWidth - 24 }}>
            <AccommodationBookings
              bookings={roomBookings}
              isFetching={isFetching}
              refetch={refetch}
            />
          </View>
        </ScrollView>
      </View>

      {/* Package Bookings Section */}
      <View style={styles.section}>
        <Text style={styles.headerText}>Travel Package History:</Text>
        <ScrollView horizontal>
          <View style={{ minWidth: screenWidth - 24 }}>
            <PackageBookings
              bookings={packageBookings}
              isFetching={isFetching}
              refetch={refetch}
            />
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default MyBookings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },

  /* HEADER */
  header: {
    paddingTop: Platform.OS === "ios" ? 55 : 40,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f3f4f6",
  },

  backButton: {
    flexDirection: "row",
    width: '40%',
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },

  backText: {
    marginLeft: 6,
    fontSize: 15,
    fontFamily: fontNames.nunito.semiBold,
    color: "#1f2937",
  },

  /* SECTIONS */
  section: {
    marginTop: 20,
    marginBottom: 28,
    paddingHorizontal: 14,
  },

  headerText: {
    fontFamily: fontNames.nunito.bold,
    fontSize: 22,
    marginBottom: 12,
    color: "#111827",
  },

  /* ERROR STATE */
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 100,
  },

  errorText: {
    fontFamily: fontNames.nunito.regular,
    fontSize: 16,
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 20,
  },

  backButtonText: {
    fontFamily: fontNames.nunito.semiBold,
    fontSize: 15,
    color: "#fff",
  },
});