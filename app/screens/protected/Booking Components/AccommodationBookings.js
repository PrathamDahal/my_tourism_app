import { View, Text, FlatList, StyleSheet } from "react-native";
import { useFetchUserProfileQuery } from "../../../services/userApi"; // Adjust path as needed

const AccommodationBookings = ({ bookings, isFetching, refetch }) => {
  const ROW_HEIGHT = 45;
  const MAX_VISIBLE_ROWS = 6;
  const maxHeight = ROW_HEIGHT * MAX_VISIBLE_ROWS;

  // Fetch user profile to get the guest name
  const { data: userData } = useFetchUserProfileQuery();

  // Get guest name from user profile
  const guestName = userData
    ? `${userData.firstName} ${userData.lastName}`
    : "Guest";

  return (
    <View>
      {/* Table Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, { width: 140 }]}>Booking ID</Text>
        <Text style={[styles.headerCell, { width: 120 }]}>Guest</Text>
        <Text style={[styles.headerCell, { width: 120 }]}>Room</Text>
        <Text style={[styles.headerCell, { width: 100 }]}>Check-in</Text>
        <Text style={[styles.headerCell, { width: 100 }]}>Check-out</Text>
        <Text style={[styles.headerCell, { width: 80 }]}>Nights</Text>
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
          <Text style={styles.emptyText}>No room bookings found</Text>
        }
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.row,
              { backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9" },
            ]}
          >
            <Text style={[styles.cell, { width: 120 }]} numberOfLines={1}>
              {item.code || item.bookingCode || item.id}
            </Text>

            <Text style={[styles.cell, { width: 100 }]} numberOfLines={1}>
              {guestName}
            </Text>

            <Text style={[styles.cell, { width: 140 }]} numberOfLines={1}>
              {item.room?.name || item.roomName || "N/A"}
            </Text>

            <Text style={[styles.cell, { width: 100 }]}>
              {new Date(item.checkIn).toLocaleDateString()}
            </Text>

            <Text style={[styles.cell, { width: 110 }]}>
              {new Date(item.checkOut).toLocaleDateString()}
            </Text>

            <Text style={[styles.cell, { width: 70 }]}>
              {item.nights ||
                Math.ceil(
                  (new Date(item.checkOut) - new Date(item.checkIn)) /
                    (1000 * 60 * 60 * 24)
                )}
            </Text>

            <Text style={[styles.cell, { width: 100 }]}>
              Rs. {item.total || item.totalAmount}
            </Text>

            <View
              style={[
                styles.statusBadge,
                item.status === "confirmed" || item.status === "completed"
                  ? styles.completed
                  : item.status === "pending"
                  ? styles.pending
                  : item.status === "cancelled"
                  ? styles.cancelled
                  : styles.expired,
                { width: 100, alignItems: "center" },
              ]}
            >
              <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default AccommodationBookings;

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
    textAlign: "center",
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
  cancelled: {
    backgroundColor: "#dc2626",
  },
  expired: {
    backgroundColor: "#6b7280",
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