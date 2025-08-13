import { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import OrderSuccessModal from "./SuccessModal";

const CODPurchaseModal = ({ isOpen, onClose, cartItems, total }) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const generateOrderCode = () =>
    `#0${Math.floor(10000 + Math.random() * 90000)}`;

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const orderDetails = {
    orderCode: generateOrderCode(),
    date: getCurrentDate(),
    total: `Rs. ${total.toFixed(2)}`,
    paymentMethod: "Cash on Delivery",
  };

  useEffect(() => {
    if (!isOpen) setShowSuccessModal(false);
  }, [isOpen]);

  const totalQuantity = (cartItems || []).reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const handleCompletePurchase = () => setShowSuccessModal(true);

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onClose();
  };

  return (
    <>
      <Modal visible={isOpen} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="gray" />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.title}>Complete Your Purchase</Text>
              <Text style={styles.subtitle}>
                {totalQuantity} item{totalQuantity !== 1 ? "s" : ""} in your
                order
              </Text>

              <View style={styles.section}>
                <Text style={styles.sectionHeader}>Cash on Delivery</Text>
                <Ionicons
                  name="cash-outline"
                  size={64}
                  color="#9CA3AF"
                  style={{ alignSelf: "center" }}
                />
                <Text style={styles.infoText}>
                  You'll pay in cash when your order is delivered. Please have
                  the exact amount ready.
                </Text>
                <Text style={styles.totalText}>
                  Total to pay on delivery: Rs.{total.toFixed(2)}
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionHeader}>Order Summary</Text>
                {(cartItems || []).map((item, index) => (
                  <View key={`item-${index}`} style={styles.itemRow}>
                    <Text>
                      {item.name}
                      {item.quantity > 1 && ` (×${item.quantity})`}
                    </Text>
                    <Text>Rs.{(item.price * item.quantity).toFixed(2)}</Text>
                  </View>
                ))}

                <View style={styles.totalRow}>
                  <Text>Total</Text>
                  <Text>Rs.{total.toFixed(2)}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleCompletePurchase}
              >
                <Text style={styles.confirmButtonText}>Confirm Order</Text>
              </TouchableOpacity>
              <Text style={styles.noteText}>
                Your order will be processed immediately after confirmation.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <OrderSuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        orderDetails={orderDetails}
      />
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    maxHeight: "90%",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  scrollContent: {
    paddingTop: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
    marginBottom: 16,
  },
  section: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  sectionHeader: {
    fontWeight: "bold",
    marginBottom: 8,
    backgroundColor: "#E5E7EB",
    padding: 6,
  },
  infoText: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
    marginVertical: 8,
  },
  totalText: {
    fontWeight: "600",
    textAlign: "center",
  },
  vendor: {
    color: "#D97706",
    fontWeight: "bold",
    marginTop: 6,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    paddingTop: 8,
    marginTop: 10,
  },
  confirmButton: {
    backgroundColor: "#16A34A",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  noteText: {
    fontSize: 12,
    color: "gray",
    textAlign: "center",
    marginTop: 8,
  },
});

export default CODPurchaseModal;
