import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { API_BASE_URL } from "../../../config";
import { useGetRoomsQuery } from "../../services/accommodationRoomApi";

export default function RoomBookings() {
  const navigation = useNavigation();
  const route = useRoute();
  const { slug } = route.params;

  const { data, isLoading, isError } = useGetRoomsQuery(slug);
  const rooms = data?.data ?? [];

  const [quantities, setQuantities] = useState({});

  const updateQty = (id, type, available) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      if (type === "inc" && current < available)
        return { ...prev, [id]: current + 1 };
      if (type === "dec" && current > 0) return { ...prev, [id]: current - 1 };
      return prev;
    });
  };

  /* ---------- LOADING / ERROR ---------- */
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E53935" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text>Failed to load rooms</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.title}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back-ios" size={26} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Complete Booking</Text>
            <Text style={styles.headerSubtitle}>
              Select rooms, dates & guests
            </Text>
          </View>
        </View>
      </View>

      <ScrollView>
        {/* STEP */}
        <View style={styles.stepRow}>
          <Text style={styles.stepBadge}>1</Text>
          <Text style={styles.stepText}>Select Rooms</Text>
        </View>

        {/* ROOMS */}
        {rooms.map((room) => (
          <View key={room.id} style={styles.card}>
            {/* IMAGE */}
            <View style={styles.imageWrapper}>
              <Image
                source={{
                  uri: room.images?.[0]
                    ? `${API_BASE_URL}${room.images[0]}`
                    : "https://via.placeholder.com/600x400",
                }}
                style={styles.image}
              />
              <View style={styles.overlay} />

              <View style={styles.imageContent}>
                <Text style={styles.roomName}>{room.name}</Text>

                <View style={styles.iconRow}>
                  <View style={styles.iconItem}>
                    <Ionicons name="people" size={14} color="#fff" />
                    <Text style={styles.iconText}>{room.capacity}</Text>
                  </View>
                  <View style={styles.iconItem}>
                    <Ionicons name="bed" size={14} color="#fff" />
                    <Text style={styles.iconText}>{room.beds}</Text>
                  </View>
                  <View style={styles.iconItem}>
                    <Ionicons name="water" size={14} color="#fff" />
                    <Text style={styles.iconText}>{room.bathrooms}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* INFO */}
            <View style={styles.info}>
              <Text style={styles.price}>
                NPR {Number(room.basePrice).toFixed(0)}
                <Text style={styles.perNight}> /night</Text>
              </Text>

              <Text style={styles.available}>{room.totalUnits} available</Text>

              <View style={styles.amenities}>
                {room.amenities?.slice(0, 3).map((a, i) => (
                  <View key={i} style={styles.amenity}>
                    <Text style={styles.amenityText}>{a}</Text>
                  </View>
                ))}
                {room.amenities?.length > 3 && (
                  <Text style={styles.moreAmenity}>
                    +{room.amenities.length - 3}
                  </Text>
                )}
              </View>

              {/* QUANTITY */}
              <View style={styles.qtyRow}>
                <Text style={styles.qtyLabel}>Quantity</Text>

                <View style={styles.qtyControls}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQty(room.id, "dec", room.totalUnits)}
                  >
                    <Text style={styles.qtyBtnText}>−</Text>
                  </TouchableOpacity>

                  <Text style={styles.qtyValue}>
                    {quantities[room.id] || 0}
                  </Text>

                  <TouchableOpacity
                    style={styles.qtyBtnActive}
                    onPress={() => updateQty(room.id, "inc", room.totalUnits)}
                  >
                    <Text style={styles.qtyBtnTextActive}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    marginTop: -1,
    backgroundColor: "#C62828",
    padding: 8,
    paddingTop: 40,
    marginBlock: 10,
  },
  header: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerText: { marginLeft: 8 },
  headerTitle: { color: "#fff", fontSize: 16, fontWeight: "600" },
  headerSubtitle: { color: "#fff", fontSize: 12, opacity: 0.9 },

  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 10,
  },
  stepBadge: {
    backgroundColor: "#E53935",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontWeight: "600",
  },
  stepText: { fontSize: 16, fontWeight: "600" },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },

  imageWrapper: { height: 140 },
  image: { width: "100%", height: "100%" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  imageContent: { position: "absolute", bottom: 12, left: 12 },
  roomName: { color: "#fff", fontSize: 16, fontWeight: "600" },

  iconRow: { flexDirection: "row", marginTop: 6 },
  iconItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  iconText: { color: "#fff", marginLeft: 4, fontSize: 12 },

  info: { padding: 12 },
  price: { color: "#E53935", fontSize: 16, fontWeight: "700" },
  perNight: { fontSize: 12, color: "#777" },
  available: { fontSize: 12, color: "#999", marginVertical: 4 },

  amenities: { flexDirection: "row", marginVertical: 6 },
  amenity: {
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  amenityText: { fontSize: 12 },
  moreAmenity: { fontSize: 12, color: "#777" },

  qtyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  qtyLabel: { fontSize: 14, color: "#444" },
  qtyControls: { flexDirection: "row", alignItems: "center" },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnActive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E53935",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnText: { fontSize: 18 },
  qtyBtnTextActive: { fontSize: 18, color: "#fff" },
  qtyValue: { marginHorizontal: 12, fontSize: 16 },
});
