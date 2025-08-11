import { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Button,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import OrderSuccessModal from "./SuccessModal";

const QrPurchaseModal = ({ isOpen, onClose, cartItems = [], total = 0 }) => {
  const [activeTab, setActiveTab] = useState("payment");
  const [receiptUploaded, setReceiptUploaded] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
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

  useEffect(() => {
    if (!isOpen) {
      setActiveTab("payment");
      setReceiptUploaded(false);
      setUploadedImage(null);
    }
  }, [isOpen]);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setUploadedImage(result.assets[0].uri);
      setReceiptUploaded(true);
    }
  };

  const handleCompletePurchase = () => {
    setShowSuccessModal(true);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onClose();
  };

  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + (item?.checked ? item.quantity : 0),
    0
  );

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Camera roll access is needed.");
      }
    })();
  }, []);

  const checkedItems = cartItems.filter((item) => item.checked);

  const orderDetails = {
    orderCode: generateOrderCode(),
    date: getCurrentDate(),
    total: `$${total.toFixed(2)}`,
    paymentMethod: "Paid through QR",
  };

  return (
    <>
      <Modal visible={isOpen} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="gray" />
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={styles.title}>Complete Your Purchase</Text>
              <Text style={styles.subtitle}>
                {totalQuantity} item{totalQuantity !== 1 ? "s" : ""} in your
                order
              </Text>
            </View>

            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === "payment" && styles.activeTab,
                ]}
                onPress={() => setActiveTab("payment")}
              >
                <Text style={styles.tabText}>Payment</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === "upload" && styles.activeTab]}
                onPress={() => setActiveTab("upload")}
                disabled={!receiptUploaded && activeTab === "payment"}
              >
                <Text style={styles.tabText}>Upload Receipt</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
              {activeTab === "payment" ? (
                <>
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                      Seller's Payment QR Code
                    </Text>
                    <View style={styles.qrPlaceholder}>
                      <Text style={{ color: "gray" }}>QR Code</Text>
                    </View>
                    <Text style={styles.tip}>
                      Scan this QR code with your payment app to complete the
                      transaction.
                    </Text>
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Price Details</Text>
                    {checkedItems.length > 0 ? (
                      <>
                        {checkedItems.map((item, i) => (
                          <View key={i} style={styles.itemRow}>
                            <Text>
                              {item.name}
                              {item.quantity > 1 && ` (×${item.quantity})`}
                            </Text>
                            <Text>
                              ${(item.price * item.quantity).toFixed(2)}
                            </Text>
                          </View>
                        ))}
                      </>
                    ) : (
                      <Text style={styles.tip}>
                        No items selected for checkout
                      </Text>
                    )}

                    <View style={styles.totalRow}>
                      <Text>Total</Text>
                      <Text>${total.toFixed(2)}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => setActiveTab("upload")}
                    style={styles.confirmButton}
                  >
                    <Text style={styles.confirmButtonText}>Confirm Order</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    Upload Your Payment Confirmation
                  </Text>

                  {uploadedImage ? (
                    <>
                      <Image
                        source={{ uri: uploadedImage }}
                        style={styles.image}
                      />
                      <Text style={styles.successText}>
                        Receipt uploaded successfully!
                      </Text>
                    </>
                  ) : (
                    <Button title="Upload File" onPress={handleImagePick} />
                  )}

                  <TouchableOpacity
                    onPress={handleCompletePurchase}
                    disabled={!receiptUploaded}
                    style={[
                      styles.completeButton,
                      !receiptUploaded && styles.disabledButton,
                    ]}
                  >
                    <Text style={styles.completeButtonText}>
                      Complete Purchase
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
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
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 1,
  },
  header: {
    marginTop: 30,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    color: "gray",
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: "row",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#e0e0e0",
  },
  tabText: {
    fontWeight: "500",
  },
  content: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  sectionTitle: {
    fontWeight: "600",
    marginBottom: 10,
  },
  qrPlaceholder: {
    height: 180,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  vendor: {
    fontWeight: "bold",
    color: "#d97706",
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
    borderColor: "#eee",
    marginTop: 8,
    paddingTop: 8,
  },
  tip: {
    textAlign: "center",
    fontSize: 12,
    color: "gray",
    marginTop: 4,
  },
  confirmButton: {
    backgroundColor: "green",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "600",
  },
  completeButton: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  completeButtonText: {
    color: "white",
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  successText: {
    textAlign: "center",
    color: "green",
    marginTop: 10,
  },
  image: {
    width: "100%",
    height: 180,
    resizeMode: "contain",
    borderRadius: 10,
  },
});

export default QrPurchaseModal;
