import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useGetProductsQuery } from "../../../services/productApi";
import { API_BASE_URL } from "../../../../config";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";

const ProductDisplay = () => {
  const navigation = useNavigation();
  const {
    data: products,
    isLoading: isProductsLoading,
    isError: isProductsError,
    refetch,
    isFetching,
  } = useGetProductsQuery();

  const totalProducts = products?.totalProducts;
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeProducts, setActiveProducts] = useState([]);

  // Filter products to only include active ones
  useEffect(() => {
    if (products?.data) {
      const filtered = products.data.filter(product => product.status === "active");
      setActiveProducts(filtered);
    }
  }, [products]);

  // Filter active products by search query
  const filteredProducts = activeProducts.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (price) => `$${parseFloat(price ?? 0).toFixed(2)}`;

  const handleSuggestionSelect = (value) => {
    setSearchQuery(value);
    setShowSuggestions(false);
  };

  const renderProductCard = (product) => (
    <TouchableOpacity
      key={product._id}
      style={styles.productCard}
      onPress={() =>
        navigation.navigate("ProductDetails", {
          slug: product?.slug,
        })
      }
      activeOpacity={0.9}
    >
      <Image
        source={
          typeof product.images?.[0] === "string" && product.images[0].trim()
            ? { uri: `${API_BASE_URL}${product.images[0]}` }
            : require("../../../../assets/T-App-icon.png")
        }
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.productPrice}>{formatPrice(product?.price)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (isProductsLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2a52be" />
      </View>
    );
  }

  if (isProductsError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading products</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>All Products</Text>
        <View style={styles.totalContainer}>
          <Ionicons name="cube" size={18} color="#777" />
          <Text style={styles.totalProductsText}>
            {activeProducts.length} Items
          </Text>
        </View>
      </View>

      <TextInput
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          setShowSuggestions(true);
        }}
        style={styles.searchInput}
      />
      {showSuggestions && searchQuery.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {filteredProducts?.length > 0 ? (
            filteredProducts.slice(0, 5).map((item) => (
              <TouchableWithoutFeedback
                key={item._id}
                onPress={() => handleSuggestionSelect(item.name)}
              >
                <View style={styles.suggestionItem}>
                  <Text>{item.name}</Text>
                </View>
              </TouchableWithoutFeedback>
            ))
          ) : (
            <View style={styles.suggestionItem}>
              <Text>No matches found</Text>
            </View>
          )}
        </View>
      )}

      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => renderProductCard(item)}
        keyExtractor={(item, index) =>
          item?._id?.toString() ?? index.toString()
        }
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        onScrollBeginDrag={() => setShowSuggestions(false)}
        refreshing={isFetching}
        onRefresh={refetch}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>No active products available</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 10,
    paddingTop: 34,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    marginBottom: 12,
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2a2a2a",
  },
  searchInput: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  suggestionsContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    paddingVertical: 4,
    maxHeight: 150,
  },
  suggestionItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  totalContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  totalProductsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#777",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  listContent: {
    paddingBottom: 30,
  },
  productCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 0.5,
    borderColor: "#ddd",
  },
  productImage: {
    width: "100%",
    height: 140,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
    height: 38,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2a52be",
  },
  errorText: {
    fontSize: 16,
    color: "#ff0000",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#2a52be",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});

export default ProductDisplay;