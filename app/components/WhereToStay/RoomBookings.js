import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { API_BASE_URL } from "../../../config";
import { useGetRoomsQuery } from "../../services/accommodationRoomApi";
import { useCreateRoomBookingMutation } from "../../services/accommodationBookingApi";

export default function RoomBookings() {
  const navigation = useNavigation();
  const route = useRoute();
  const { slug } = route.params;

  const { data, isLoading, isError } = useGetRoomsQuery(slug);
  const rooms = data?.data ?? [];

  const [createRoomBooking, { isLoading: isBooking }] =
    useCreateRoomBookingMutation();

  const [quantities, setQuantities] = useState({});
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const updateQty = (id, type, available) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      if (type === "inc" && current < available)
        return { ...prev, [id]: current + 1 };
      if (type === "dec" && current > 0) return { ...prev, [id]: current - 1 };
      return prev;
    });
  };

  // Get selected rooms
  const selectedRooms = rooms
    .filter((room) => quantities[room.id] > 0)
    .map((room) => ({
      ...room,
      quantity: quantities[room.id],
    }));

  // Calculate totals
  const calculateTotals = () => {
    if (!checkIn || !checkOut) {
      return {
        nights: 0,
        roomTotal: 0,
        cleaningFee: 0,
        serviceFee: 0,
        tax: 0,
        total: 0,
      };
    }

    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      return {
        nights: 0,
        roomTotal: 0,
        cleaningFee: 0,
        serviceFee: 0,
        tax: 0,
        total: 0,
      };
    }

    const roomTotal = selectedRooms.reduce(
      (sum, room) => sum + room.basePrice * room.quantity * nights,
      0
    );

    const cleaningFee = 500;
    const serviceFee = roomTotal * 0.1;
    const tax = roomTotal * 0.13;
    const total = roomTotal + cleaningFee + serviceFee + tax;

    return { nights, roomTotal, cleaningFee, serviceFee, tax, total };
  };

  const totals = calculateTotals();

  // Calculate max guests
  const maxGuests = selectedRooms.reduce(
    (sum, room) => sum + room.maxGuests * room.quantity,
    0
  );

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const isPastOrToday = (day) => {
    if (!day) return true;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    date.setHours(0, 0, 0, 0);

    return date <= today; // today + past
  };

  const handleDatePress = (day) => {
    if (isPastOrToday(day)) return; // ⛔ block past & today

    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(selectedDate);
      setCheckOut(null);
    } else if (checkIn && !checkOut) {
      if (selectedDate > checkIn) {
        setCheckOut(selectedDate);
      } else {
        setCheckOut(checkIn);
        setCheckIn(selectedDate);
      }
    }
  };

  const isDateInRange = (day) => {
    if (!checkIn || !day) return false;
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    if (checkOut) {
      return date >= checkIn && date <= checkOut;
    }
    return date.getTime() === checkIn.getTime();
  };

  const isDateCheckIn = (day) => {
    if (!checkIn || !day) return false;
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return date.getTime() === checkIn.getTime();
  };

  const isDateCheckOut = (day) => {
    if (!checkOut || !day) return false;
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return date.getTime() === checkOut.getTime();
  };

  const changeMonth = (direction) => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction)
    );
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleConfirmBooking = async () => {
    if (!checkIn || !checkOut) {
      Alert.alert("Error", "Please select check-in and check-out dates");
      return;
    }

    if (selectedRooms.length === 0) {
      Alert.alert("Error", "Please select at least one room");
      return;
    }

    try {
      // Make booking for each selected room
      for (const room of selectedRooms) {
        const bookingData = {
          accommodationId: room.accommodationId || slug,
          roomId: room.id,
          checkIn: checkIn.toISOString().split("T")[0],
          checkOut: checkOut.toISOString().split("T")[0],
          qty: room.quantity,
          guests: numberOfGuests,
        };

        await createRoomBooking(bookingData).unwrap();
      }

      Alert.alert("Success", "Booking confirmed successfully!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      // Check if it's an unauthorized error (401)
      if (error?.status === 401 || error?.originalStatus === 401) {
        Alert.alert(
          "Authentication Required",
          "You need to log in for further processes",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Login",
              onPress: () => navigation.navigate("Auth", { screen: "Login" }),
            },
          ]
        );
        return;
      }

      // Handle other errors
      const message = Array.isArray(error?.data?.message)
        ? error.data.message.join("\n")
        : error?.data?.message || "Failed to create booking";

      Alert.alert("Error", message);
    }
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

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

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
        {/* STEP 1: ROOMS SELECTED */}
        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>1</Text>
            </View>
            <Text style={styles.stepTitle}>Rooms Selected</Text>
          </View>
          <View style={styles.roomsSelectedInfo}>
            <Text style={styles.roomsCount}>
              {selectedRooms.length} room{selectedRooms.length !== 1 ? "s" : ""}
            </Text>
            <Text style={styles.pricePerNight}>
              Per Night{"\n"}
              <Text style={styles.priceAmount}>
                NPR{" "}
                {selectedRooms
                  .reduce(
                    (sum, room) => sum + room.basePrice * room.quantity,
                    0
                  )
                  .toLocaleString()}
              </Text>
            </Text>
          </View>
        </View>

        {/* AVAILABLE ROOMS */}
        {rooms.map((room) => (
          <View key={room.id} style={styles.card}>
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
                    <Text style={styles.iconText}>
                      {room.capacity}{" "}
                      {room.maxGuests ? `(max ${room.maxGuests})` : ""}
                    </Text>
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

        {/* STEP 2: SELECT DATES */}
        {selectedRooms.length > 0 && (
          <>
            <View style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>2</Text>
                </View>
                <Text style={styles.stepTitle}>Select Dates</Text>
              </View>
            </View>

            {/* Calendar */}
            <View style={styles.calendarCard}>
              <View style={styles.calendarHeader}>
                <TouchableOpacity onPress={() => changeMonth(-1)}>
                  <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.monthText}>{monthName}</Text>
                <TouchableOpacity onPress={() => changeMonth(1)}>
                  <Ionicons name="chevron-forward" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <View style={styles.weekDays}>
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <Text key={day} style={styles.weekDayText}>
                    {day}
                  </Text>
                ))}
              </View>

              <View style={styles.daysGrid}>
                {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                  <View key={`empty-${i}`} style={styles.dayCell} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const disabled = isPastOrToday(day);
                  const inRange = isDateInRange(day);
                  const isCheckInDate = isDateCheckIn(day);
                  const isCheckOutDate = isDateCheckOut(day);

                  return (
                    <TouchableOpacity
                      key={day}
                      disabled={disabled}
                      style={[
                        styles.dayCell,
                        disabled && styles.dayCellDisabled,
                        inRange && styles.dayCellInRange,
                        (isCheckInDate || isCheckOutDate) &&
                          styles.dayCellSelected,
                      ]}
                      onPress={() => handleDatePress(day)}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          disabled && styles.dayTextDisabled,
                          (isCheckInDate || isCheckOutDate) &&
                            styles.dayTextSelected,
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Date Display */}
              <View style={styles.dateDisplay}>
                <View style={styles.dateBox}>
                  <Ionicons name="calendar" size={16} color="#10B981" />
                  <Text style={styles.dateLabel}>Check-in</Text>
                  <Text style={styles.dateValue}>
                    {checkIn ? formatDate(checkIn) : "Select"}
                  </Text>
                </View>
                <View style={styles.dateBox}>
                  <Ionicons name="calendar" size={16} color="#EF4444" />
                  <Text style={styles.dateLabel}>Check-out</Text>
                  <Text style={styles.dateValue}>
                    {checkOut ? formatDate(checkOut) : "Select"}
                  </Text>
                </View>
              </View>
            </View>

            {/* STEP 3: GUESTS */}
            <View style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>3</Text>
                </View>
                <Text style={styles.stepTitle}>Guests</Text>
              </View>
            </View>

            <View style={styles.guestsCard}>
              <View style={styles.guestsRow}>
                <View style={styles.guestsIcon}>
                  <Ionicons name="people" size={24} color="#E53935" />
                </View>
                <View style={styles.guestsInfo}>
                  <Text style={styles.guestsLabel}>Total Guests</Text>
                  <Text style={styles.guestsMax}>Max {maxGuests} people</Text>
                </View>
                <View style={styles.guestsControls}>
                  <TouchableOpacity
                    style={styles.guestsBtn}
                    onPress={() =>
                      setNumberOfGuests(Math.max(1, numberOfGuests - 1))
                    }
                  >
                    <Text style={styles.guestsBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.guestsValue}>{numberOfGuests}</Text>
                  <TouchableOpacity
                    style={styles.guestsBtnActive}
                    onPress={() =>
                      setNumberOfGuests(Math.min(maxGuests, numberOfGuests + 1))
                    }
                  >
                    <Text style={styles.guestsBtnTextActive}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* STEP 4: PRICING */}
            <View style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>4</Text>
                </View>
                <Text style={styles.stepTitle}>Pricing</Text>
                {totals.nights > 0 && (
                  <Text style={styles.nightsTag}>{totals.nights} nights</Text>
                )}
              </View>
            </View>

            <View style={styles.pricingCard}>
              {totals.nights > 0 ? (
                <>
                  <View style={styles.pricingRow}>
                    <Text style={styles.pricingLabel}>Room Charges</Text>
                    <Text style={styles.pricingValue}>
                      NPR {totals.roomTotal.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.pricingRow}>
                    <Text style={styles.pricingLabel}>Cleaning Fee</Text>
                    <Text style={styles.pricingValue}>
                      NPR {totals.cleaningFee.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.pricingRow}>
                    <Text style={styles.pricingLabel}>Service Fee (10%)</Text>
                    <Text style={styles.pricingValue}>
                      NPR {totals.serviceFee.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.pricingRow}>
                    <Text style={styles.pricingLabel}>Tax (13%)</Text>
                    <Text style={styles.pricingValue}>
                      NPR {totals.tax.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.pricingRow}>
                    <Text style={styles.totalLabel}>Grand Total</Text>
                    <Text style={styles.totalValue}>
                      NPR {totals.total.toFixed(2)}
                    </Text>
                  </View>
                </>
              ) : (
                <Text style={styles.emptyText}>
                  Select dates to see pricing
                </Text>
              )}
            </View>

            {/* Warning */}
            <View style={styles.warningCard}>
              <Ionicons name="warning" size={20} color="#F59E0B" />
              <Text style={styles.warningText}>
                No cancellations can be made once booking is confirmed. Please
                review your selection carefully.
              </Text>
            </View>

            {/* Confirm Button */}
            <TouchableOpacity
              style={[
                styles.confirmBtn,
                (!checkIn ||
                  !checkOut ||
                  isBooking ||
                  selectedRooms.length === 0) &&
                  styles.confirmBtnDisabled,
              ]}
              onPress={handleConfirmBooking}
              disabled={
                !checkIn || !checkOut || isBooking || selectedRooms.length === 0
              }
            >
              <Text style={styles.confirmBtnText}>
                {isBooking ? "Processing..." : "Confirm Booking"}
              </Text>
            </TouchableOpacity>
          </>
        )}

        <View style={{ height: 40 }} />
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

  stepCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stepBadge: {
    backgroundColor: "#E53935",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBadgeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  stepTitle: { fontSize: 18, fontWeight: "600", flex: 1 },
  nightsTag: {
    backgroundColor: "#DBEAFE",
    color: "#1E40AF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    fontSize: 12,
    fontWeight: "600",
  },

  roomsSelectedInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  roomsCount: { fontSize: 14, color: "#666" },
  pricePerNight: { fontSize: 12, color: "#666", textAlign: "right" },
  priceAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E53935",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
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

  amenities: { flexDirection: "row", marginVertical: 6, flexWrap: "wrap" },
  amenity: {
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
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

  // Calendar Styles
  calendarCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  monthText: { fontSize: 16, fontWeight: "600" },
  weekDays: {
    flexDirection: "row",
    marginBottom: 8,
  },
  weekDayText: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
  },
  dayCellDisabled: {
    backgroundColor: "#F3F4F6",
  },

  dayTextDisabled: {
    color: "#9CA3AF",
  },

  dayCellInRange: {
    backgroundColor: "#FFEBEE",
  },
  dayCellSelected: {
    backgroundColor: "#E53935",
    borderRadius: 20,
  },
  dayText: {
    fontSize: 14,
    color: "#333",
  },
  dayTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  dateDisplay: {
    flexDirection: "row",
    marginTop: 16,
    gap: 12,
  },
  dateBox: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 8,
    gap: 4,
  },
  dateLabel: {
    fontSize: 11,
    color: "#666",
  },
  dateValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  // Guests Styles
  guestsCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  guestsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  guestsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFEBEE",
    alignItems: "center",
    justifyContent: "center",
  },
  guestsInfo: {
    flex: 1,
    marginLeft: 12,
  },
  guestsLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  guestsMax: {
    fontSize: 12,
    color: "#666",
  },
  guestsControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  guestsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  guestsBtnActive: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E53935",
    alignItems: "center",
    justifyContent: "center",
  },
  guestsBtnText: {
    fontSize: 20,
    color: "#666",
  },
  guestsBtnTextActive: {
    fontSize: 20,
    color: "#fff",
  },
  guestsValue: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: "600",
  },

  // Pricing Styles
  pricingCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  pricingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  pricingLabel: {
    fontSize: 14,
    color: "#666",
  },
  pricingValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#E53935",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    paddingVertical: 16,
  },

  // Warning Card
  warningCard: {
    backgroundColor: "#FFFBEB",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: "#92400E",
    lineHeight: 18,
  },

  // Confirm Button
  confirmBtn: {
    backgroundColor: "#E53935",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmBtnDisabled: {
    backgroundColor: "#D1D5DB",
  },
  confirmBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
