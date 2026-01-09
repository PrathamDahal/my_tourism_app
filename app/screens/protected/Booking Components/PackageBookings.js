import { View, Text, FlatList, StyleSheet } from "react-native";
import { useFetchUserProfileQuery } from "../../../services/userApi"; // Adjust path as needed

const PackageBookings = ({ bookings, isFetching, refetch }) => {
  const ROW_HEIGHT = 45;
  const MAX_VISIBLE_ROWS = 6;
  const maxHeight = ROW_HEIGHT * MAX_VISIBLE_ROWS;

  // Fetch user profile to get the customer name
  const { data: userData } = useFetchUserProfileQuery();

  // Get customer name from user profile
  const customerName = userData
    ? `${userData.firstName} ${userData.lastName}`
    : "Guest";
  
  return (
    <View>
      {/* Table Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, { width: 140 }]}>Booking ID</Text>
        <Text style={[styles.headerCell, { width: 120 }]}>Customer</Text>
        <Text style={[styles.headerCell, { width: 140 }]}>Package</Text>
        <Text style={[styles.headerCell, { width: 100 }]}>Start Date</Text>
        <Text style={[styles.headerCell, { width: 80 }]}>Duration</Text>
        <Text style={[styles.headerCell, { width: 80 }]}>Travelers</Text>
        <Text style={[styles.headerCell, { width: 100 }]}>Total</Text>
        <Text style={[styles.headerCell, { width: 100 }]}>Status</Text>
      </View>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        onRefresh={refetch}
        refreshing={isFetching}
        style={{ maxHeight: maxHeight }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No package bookings found</Text>
        }
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.row,
              { backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9" },
            ]}
          >
            <Text style={[styles.cell, { width: 130 }]} numberOfLines={1}>
              {item.code || item.bookingCode || item.id}
            </Text>

            <Text style={[styles.cell, { width: 110 }]} numberOfLines={1}>
              {customerName}
            </Text>

            <Text style={[styles.cell, { width: 140 }]} numberOfLines={1}>
              {item.travelPackage?.name || item.packageName || "N/A"}
            </Text>

            <Text style={[styles.cell, { width: 100 }]}>
              {item.travelDate 
                ? new Date(item.travelDate).toLocaleDateString()
                : item.departure?.date
                ? new Date(item.departure.date).toLocaleDateString()
                : "N/A"}
            </Text>

            <Text style={[styles.cell, { width: 80 }]}>
              {item.travelPackage?.durationDays || item.duration || "N/A"} days
            </Text>

            <Text style={[styles.cell, { width: 60 }]}>
              {item.travellersCount || item.travelers || item.numberOfTravelers || item.pax || 1}
            </Text>

            <Text style={[styles.cell, { width: 100 }]}>
              Rs. {item.total || item.totalAmount || (item.travelPackage?.price * (item.travellersCount || 1))}
            </Text>

            <View
              style={[
                styles.statusBadge,
                item.status === "CONFIRMED" || item.status === "confirmed" || item.status === "completed"
                  ? styles.completed
                  : item.status === "PENDING_CONFIRMATION" || item.status === "pending"
                  ? styles.pending
                  : item.status === "cancelled"
                  ? styles.cancelled
                  : styles.processing,
                { width: 100, alignItems: "center" },
              ]}
            >
              <Text style={styles.statusText}>
                {item.status === "PENDING_CONFIRMATION" ? "PENDING" : item.status.toUpperCase()}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default PackageBookings;

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#e0e7ff",
    paddingVertical: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 1,
    borderColor: "#c7d2fe",
  },
  headerCell: {
    fontWeight: "700",
    fontSize: 13,
    color: "#1e40af",
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  cell: {
    fontSize: 12,
    color: "#111827",
    paddingHorizontal: 8,
  },
  statusBadge: {
    paddingVertical: 4,
    borderRadius: 6,
  },
  completed: {
    backgroundColor: "#16a34a",
  },
  pending: {
    backgroundColor: "#eab308",
  },
  processing: {
    backgroundColor: "#f97316",
  },
  cancelled: {
    backgroundColor: "#dc2626",
  },
  statusText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 11,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#6b7280",
    fontSize: 14,
  },
});