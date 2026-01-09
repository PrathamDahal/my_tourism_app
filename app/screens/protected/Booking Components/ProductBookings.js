import { View, Text, FlatList, StyleSheet } from "react-native";

const ProductBookings = ({ orders, isFetching, refetch }) => {
  const ROW_HEIGHT = 45;
  const MAX_VISIBLE_ROWS = 6;
  const maxHeight = ROW_HEIGHT * MAX_VISIBLE_ROWS;
  
  return (
    <View>
      {/* Table Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, { width: 140 }]}>Order</Text>
        <Text style={[styles.headerCell, { width: 120 }]}>Buyer</Text>
        <Text style={[styles.headerCell, { width: 100 }]}>Product</Text>
        <Text style={[styles.headerCell, { width: 120 }]}>Payment</Text>
        <Text style={[styles.headerCell, { width: 80 }]}>Items</Text>
        <Text style={[styles.headerCell, { width: 100 }]}>Total</Text>
        <Text style={[styles.headerCell, { width: 100 }]}>Status</Text>
        <Text style={[styles.headerCell, { width: 120 }]}>Date</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        onRefresh={refetch}
        refreshing={isFetching}
        style={{maxHeight : maxHeight}}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No processing or completed bookings found
          </Text>
        }
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.row,
              { backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9" },
            ]}
          >
            <Text style={[styles.cell, { width: 110 }]} numberOfLines={1}>
              {item.code}
            </Text>

            <Text style={[styles.cell, { width: 110 }]} numberOfLines={1}>
              {item.buyer.firstName} {item.buyer.lastName}
            </Text>

            <Text style={[styles.cell, { width: 110 }]} numberOfLines={1}>
              {item.items.map((i) => i.productId).join(", ")}
            </Text>

            <Text style={[styles.cell, { width: 130 }]} numberOfLines={1}>
              {item.paymentMethod}
            </Text>

            <Text style={[styles.cell, { width: 70 }]}>{item.items.length}</Text>

            <Text style={[styles.cell, { width: 100 }]}>Rs. {item.total}</Text>

            <View
              style={[
                styles.statusBadge,
                item.status === "completed"
                  ? styles.completed
                  : styles.processing,
                { width: 100, alignItems: "center" },
              ]}
            >
              <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
            </View>

            <Text style={[styles.cell, { width: 120 }]}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default ProductBookings;

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
  processing: {
    backgroundColor: "#f9c416ff",
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
