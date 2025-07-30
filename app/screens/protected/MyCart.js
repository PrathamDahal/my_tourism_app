import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  useClearCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartMutation,
} from "../../services/cartApi";
import QrPurchaseModal from "../../components/Cart/OrderModal/QrOrderModal";
import CODPurchaseModal from "../../components/Cart/OrderModal/CoDOrderModal";

const MyCart = () => {
  const { data: cartData, isLoading, isError, refetch } = useGetCartQuery();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [clearCart] = useClearCartMutation();
  const [updateCart] = useUpdateCartMutation();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [cartSummary, setCartSummary] = useState({
    subtotal: 0,
    shipping: 0,
    total: 0,
    itemCount: 0,
  });

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [currentVendorCheckout, setCurrentVendorCheckout] = useState(null);

  const transformCartData = (apiData) => {
    if (!apiData || !Array.isArray(apiData.items)) {
      // If response is known message like "No items in cart", don't log error
      if (apiData?.message === "No items in cart") {
        return [];
      }

      console.error("Invalid cart data structure:", apiData);
      return [];
    }

    const vendorMap = new Map();

    apiData.items.forEach((item) => {
      if (!item || !item.product) return;

      const product = item.product;
      const sellerId = product.seller?._id || "default";
      const sellerName = product.seller
        ? `${product.seller.firstName} ${product.seller.lastName}`
        : "Store";

      if (!vendorMap.has(sellerId)) {
        vendorMap.set(sellerId, {
          vendorId: sellerId,
          vendor: sellerName,
          items: [],
          checked: false,
        });
      }

      const vendor = vendorMap.get(sellerId);
      const safeQuantity = Math.min(item.quantity, product.stock || 0);
      vendor.items.push({
        id: item._id,
        productId: product._id,
        name: product.name,
        color: product.color || "N/A",
        quantity: safeQuantity,
        price: product.price,
        stock: product.stock || 0,
        checked: false,
        image: product.images?.[0] || null,
      });
    });

    return Array.from(vendorMap.values());
  };

  useEffect(() => {
    if (cartData) {
      const transformedData = transformCartData(cartData);
      setProducts(transformedData);
    }
  }, [cartData]);

  useEffect(() => {
    let calculatedTotal = 0;
    products.forEach((vendor) => {
      vendor.items.forEach((item) => {
        if (item.checked) {
          calculatedTotal += item.quantity * item.price;
        }
      });
    });
    setTotal(calculatedTotal);
  }, [products]);

  const toggleItemCheck = (vendorIndex, itemIndex) => {
    const updatedProducts = [...products];
    const item = updatedProducts[vendorIndex].items[itemIndex];
    item.checked = !item.checked;

    const vendor = updatedProducts[vendorIndex];
    vendor.checked = vendor.items.every((item) => item.checked);

    setProducts(updatedProducts);
  };

  const toggleVendorCheck = (vendorIndex) => {
    const updatedProducts = [...products];
    const vendor = updatedProducts[vendorIndex];
    vendor.checked = !vendor.checked;
    vendor.items.forEach((item) => {
      item.checked = vendor.checked;
    });
    setProducts(updatedProducts);
  };

  const updateQuantity = async (vendorIndex, itemIndex, newQuantity) => {
    try {
      const updatedProducts = [...products];
      const item = updatedProducts[vendorIndex].items[itemIndex];

      newQuantity = Number(newQuantity);
      if (isNaN(newQuantity) || newQuantity < 1) return;

      // Ensure we don't exceed stock
      newQuantity = Math.min(newQuantity, item.stock);
      if (newQuantity === item.quantity) return;

      // Optimistic update
      item.quantity = newQuantity;
      setProducts(updatedProducts);

      // Update backend
      const response = await updateCart({
        productId: item.productId,
        quantity: newQuantity,
      }).unwrap();

      // If there was an error, refetch to get correct data
      if (response.error) {
        refetch();
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
      refetch(); // Revert to server data on error
    }
  };

  const calculateSubtotal = (item) => (item.quantity * item.price).toFixed(2);

  // Calculate summary based on selected items
  const calculateSummary = () => {
    let subtotal = 0;
    let shipping = 0;
    let itemCount = 0;

    products.forEach((vendor) => {
      vendor.items.forEach((item) => {
        if (item.checked) {
          subtotal += item.price * item.quantity;
          itemCount += item.quantity;
        }
      });
    });

    return {
      subtotal,
      shipping,
      total: subtotal + shipping,
      itemCount,
    };
  };

  const getCurrentVendorItems = () => {
    if (!currentVendorCheckout) return [];
    return currentVendorCheckout.items.filter((item) => item.checked);
  };

  const getCurrentVendorTotal = () => {
    return getCurrentVendorItems().reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  // Update summary whenever products or shipping costs change
  useEffect(() => {
    const summary = calculateSummary();
    setCartSummary(summary);
  }, [products]);

  const handleClearCart = async () => {
    try {
      await clearCart().unwrap();
      refetch();
      Alert.alert("Success", "Cart cleared.");
    } catch (error) {
      console.error("Failed to clear cart:", error);
      Alert.alert("Error", "Could not clear cart.");
    }
  };

  const handleVendorCheckout = (vendorIndex) => {
    const vendor = products[vendorIndex];
    const itemsToCheckout = vendor.items.filter((item) => item.checked);

    if (itemsToCheckout.length === 0) {
      Alert.alert("Error", "Please select items to checkout");
      return;
    }

    if (!selectedPayment) {
      Alert.alert("Error", "Please select a payment method");
      return;
    }

    setCurrentVendorCheckout(vendor);
    setIsPurchaseModalOpen(true);
  };

  const hasVendorCheckedItems = (vendorIndex) => {
    return products[vendorIndex]?.items.some((item) => item.checked);
  };

  if (isLoading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading your cart...</Text>
      </View>
    );

  if (isError)
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Failed to load cart. Please check your connection and try again.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <View style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>My Shopping Cart</Text>

        {products.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Your cart is empty</Text>
            <Text style={styles.emptySubtext}>
              Browse products to add items
            </Text>
          </View>
        ) : (
          <>
            {products.map((vendor, vendorIndex) => (
              <View key={vendor.vendorId} style={styles.vendorContainer}>
                {/* Vendor header with checkbox */}
                <TouchableOpacity
                  style={styles.vendorHeader}
                  onPress={() => toggleVendorCheck(vendorIndex)}
                >
                  <Text style={styles.checkbox}>
                    {vendor.checked ? "✓" : "○"}
                  </Text>
                  <Text style={styles.vendorName} numberOfLines={1}>
                    {vendor.vendor}
                  </Text>
                </TouchableOpacity>

                {/* Vendor items */}
                {vendor.items.map((item, itemIndex) => (
                  <View key={item.id} style={styles.itemContainer}>
                    <TouchableOpacity
                      onPress={() => toggleItemCheck(vendorIndex, itemIndex)}
                      style={styles.itemCheckbox}
                    >
                      <Text
                        style={[
                          styles.checkbox,
                          item.checked && styles.checkedCheckbox,
                        ]}
                      >
                        {item.checked ? "✓" : "○"}
                      </Text>
                    </TouchableOpacity>

                    <View style={styles.itemContent}>
                      <Text style={styles.itemName} numberOfLines={2}>
                        {item.name}
                      </Text>

                      <View style={styles.itemMeta}>
                        <Text style={styles.itemMetaText}>
                          Color: {item.color}
                        </Text>
                        <Text style={styles.itemMetaText}>
                          ${item.price.toFixed(2)}
                        </Text>
                        <Text style={styles.itemMetaText}>
                          Stock: {item.stock}
                        </Text>
                      </View>

                      {/* Quantity controls */}
                      <View style={{ marginBottom: 8 }}>
                        <Text
                          style={{
                            fontSize: 13,
                            color: "#444",
                            marginBottom: 4,
                          }}
                        >
                          Quantity: {item.quantity}
                        </Text>
                        <View style={styles.quantityContainer}>
                          <TouchableOpacity
                            style={[
                              styles.quantityButton,
                              item.quantity <= 1 && styles.disabledButton,
                            ]}
                            onPress={() =>
                              updateQuantity(
                                vendorIndex,
                                itemIndex,
                                item.quantity - 1
                              )
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Text style={styles.quantityButtonText}>-</Text>
                          </TouchableOpacity>

                          <Text style={styles.quantityValue}>
                            {item.quantity}
                          </Text>

                          <TouchableOpacity
                            style={[
                              styles.quantityButton,
                              item.quantity >= item.stock &&
                                styles.disabledButton,
                            ]}
                            onPress={() =>
                              updateQuantity(
                                vendorIndex,
                                itemIndex,
                                item.quantity + 1
                              )
                            }
                            disabled={item.quantity >= item.stock}
                          >
                            <Text style={styles.quantityButtonText}>+</Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View style={styles.itemFooter}>
                        <Text style={styles.subtotal}>
                          ${calculateSubtotal(item)}
                        </Text>

                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={async () => {
                            try {
                              await removeFromCart(item.productId).unwrap();
                              refetch();
                            } catch (err) {
                              Alert.alert("Error", "Failed to remove item");
                            }
                          }}
                        >
                          <Text style={styles.removeText}>Remove</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}

                {/* Vendor checkout section */}
                <View style={styles.checkoutSection}>
                  <Text style={styles.paymentTitle}>Payment Method</Text>

                  <View style={styles.paymentOptions}>
                    <TouchableOpacity
                      style={[
                        styles.paymentOption,
                        selectedPayment === "cod" && styles.selectedPayment,
                      ]}
                      onPress={() => setSelectedPayment("cod")}
                    >
                      <Text style={styles.paymentText}>Cash on Delivery</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.paymentOption,
                        selectedPayment === "payNow" && styles.selectedPayment,
                      ]}
                      onPress={() => setSelectedPayment("payNow")}
                    >
                      <Text style={styles.paymentText}>Pay with QR</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.checkoutButton,
                      (!selectedPayment ||
                        !hasVendorCheckedItems(vendorIndex)) &&
                        styles.disabledCheckout,
                    ]}
                    onPress={() => handleVendorCheckout(vendorIndex)}
                    disabled={
                      !selectedPayment || !hasVendorCheckedItems(vendorIndex)
                    }
                  >
                    <Text style={styles.checkoutButtonText}>
                      Checkout with {vendor.vendor.split(" ")[0]}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Cart summary */}
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>
                Order Summary ({cartSummary.itemCount}{" "}
                {cartSummary.itemCount === 1 ? "item" : "items"})
              </Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>
                  ${cartSummary.subtotal.toFixed(2)}
                </Text>
              </View>

              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  ${cartSummary.total.toFixed(2)}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.checkoutButton,
                  cartSummary.itemCount === 0 && styles.disabledCheckout,
                ]}
                disabled={cartSummary.itemCount === 0}
                onPress={() => {
                  Alert.alert(
                    "Confirm Purchase",
                    `Total: $${cartSummary.total.toFixed(2)}\n${
                      cartSummary.itemCount
                    } items`,
                    [
                      { text: "Cancel", style: "cancel" },
                      { text: "Confirm", onPress: handleFinalCheckout },
                    ]
                  );
                }}
              >
                <Text style={styles.checkoutButtonText}>
                  Proceed to Checkout
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearCart}
            >
              <Text style={styles.clearButtonText}>Clear Entire Cart</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
      {selectedPayment === "cod" ? (
        <CODPurchaseModal
          isOpen={isPurchaseModalOpen}
          onClose={() => {
            setIsPurchaseModalOpen(false);
            setCurrentVendorCheckout(null);
          }}
          cartItems={getCurrentVendorItems()}
          total={getCurrentVendorTotal()}
        />
      ) : (
        <QrPurchaseModal
          isOpen={isPurchaseModalOpen}
          onClose={() => {
            setIsPurchaseModalOpen(false);
            setCurrentVendorCheckout(null);
          }}
          cartItems={getCurrentVendorItems()}
          total={getCurrentVendorTotal()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: 32,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#d9534f",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#5bc0de",
    padding: 12,
    borderRadius: 6,
    alignSelf: "center",
  },
  retryButtonText: {
    color: "white",
    fontWeight: "600",
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 24,
    color: "#333",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#777",
  },
  vendorContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: "hidden",
  },
  vendorHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#f8f9fa",
  },
  checkbox: {
    fontSize: 20,
    color: "#666",
    marginRight: 12,
  },
  checkedCheckbox: {
    color: "#28a745",
  },
  vendorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  itemContainer: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemCheckbox: {
    justifyContent: "flex-start",
    paddingRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    marginBottom: 6,
  },
  itemMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  itemMetaText: {
    fontSize: 13,
    color: "#666",
    marginRight: 12,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e9ecef",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 18,
    color: "#333",
  },
  disabledButton: {
    backgroundColor: "#f8f9fa",
  },
  quantityValue: {
    width: 40,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subtotal: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  removeButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  removeText: {
    color: "#dc3545",
    fontSize: 14,
  },
  checkoutSection: {
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  paymentTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
    color: "#555",
  },
  paymentOptions: {
    flexDirection: "row",
    marginBottom: 16,
  },
  paymentOption: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
    backgroundColor: "#fff",
  },
  selectedPayment: {
    borderColor: "#28a745",
    backgroundColor: "#e8f5e9",
  },
  paymentText: {
    fontSize: 14,
    textAlign: "center",
    color: "#333",
  },
  checkoutButton: {
    padding: 14,
    borderRadius: 6,
    backgroundColor: "#28a745",
  },
  disabledCheckout: {
    backgroundColor: "#adb5bd",
  },
  checkoutButtonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 15,
  },
  summaryContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    color: "#333",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  clearButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#dc3545",
  },
  clearButtonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 15,
  },
});

export default MyCart;
