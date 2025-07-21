import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  useClearCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartMutation,
} from "../../services/cartApi";

const MyCart = () => {
  const navigation = useNavigation();
  const { data: cartData, isLoading, isError, refetch } = useGetCartQuery();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [clearCart] = useClearCartMutation();
  const [updateCart] = useUpdateCartMutation();

  const [products, setProducts] = useState([]);
  const [hasCheckedItems, setHasCheckedItems] = useState(false);
  const [total, setTotal] = useState(0);

  const transformCartData = (apiData) => {
    if (!apiData || !apiData.items || !Array.isArray(apiData.items)) {
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
    const checked = products.some(
      (vendor) => vendor.checked || vendor.items.some((item) => item.checked)
    );
    setHasCheckedItems(checked);
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
    const updatedProducts = JSON.parse(JSON.stringify(products));
    const item = updatedProducts[vendorIndex].items[itemIndex];
    newQuantity = Number(newQuantity);
    if (isNaN(newQuantity) || newQuantity < 1) return;
    newQuantity = Math.min(newQuantity, item.stock);
    if (newQuantity === item.quantity) return;

    item.quantity = newQuantity;
    setProducts(updatedProducts);

    try {
      await updateCart({ productId: item.productId, quantity: newQuantity });
      refetch();
    } catch (error) {
      console.error("Failed to update quantity:", error);
      refetch();
    }
  };

  const formatPrice = (price) => `$${price.toFixed(2)}`;
  const calculateSubtotal = (item) => (item.quantity * item.price).toFixed(2);

  if (isLoading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  if (isError) return <Text style={styles.error}>Failed to load cart. Please log in again.</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Shopping Cart</Text>
      {products.map((vendor, vendorIndex) => (
        <View key={vendor.vendorId} style={styles.vendorContainer}>
          <View style={styles.vendorHeader}>
            <TouchableOpacity onPress={() => toggleVendorCheck(vendorIndex)}>
              <Text style={styles.checkbox}>{vendor.checked ? "☑️" : "⬜️"}</Text>
            </TouchableOpacity>
            <Text style={styles.vendorName}>{vendor.vendor}</Text>
          </View>

          {vendor.items.map((item, itemIndex) => (
            <View key={item.id} style={styles.itemRow}>
              <TouchableOpacity onPress={() => toggleItemCheck(vendorIndex, itemIndex)}>
                <Text style={styles.checkbox}>{item.checked ? "✅" : "⬜️"}</Text>
              </TouchableOpacity>
              <View style={styles.itemDetails}>
                <Text>{item.name}</Text>
                <Text>Color: {item.color}</Text>
                <Text>Price: {formatPrice(item.price)}</Text>
                <Text>Stock: {item.stock}</Text>
              </View>
              <View style={styles.quantityControl}>
                <TouchableOpacity
                  onPress={() => updateQuantity(vendorIndex, itemIndex, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Text style={styles.quantityBtn}>➖</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity
                  onPress={() => updateQuantity(vendorIndex, itemIndex, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                >
                  <Text style={styles.quantityBtn}>➕</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.subtotal}>Subtotal: ${calculateSubtotal(item)}</Text>
            </View>
          ))}
        </View>
      ))}

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  error: {
    marginTop: 40,
    fontSize: 16,
    textAlign: "center",
    color: "red",
  },
  vendorContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  vendorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  vendorName: {
    marginLeft: 10,
    fontWeight: "bold",
    color: "#333",
  },
  checkbox: {
    fontSize: 18,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
  },
  quantityBtn: {
    fontSize: 18,
    paddingHorizontal: 6,
  },
  quantityText: {
    fontSize: 16,
    paddingHorizontal: 6,
  },
  subtotal: {
    fontWeight: "bold",
    fontSize: 14,
  },
  totalContainer: {
    marginTop: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
  },
});

export default MyCart;
