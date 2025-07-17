import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useGetProductsQuery } from "../../../services/productApi";

const ProductDisplay = () => {
  const navigation = useNavigation();
  const {
    data: products,
    isLoading: isProductsLoading,
    isError: isProductsError,
    refetch,
    isFetching,
  } = useGetProductsQuery();

  const renderProductCard = (product) => (
    <TouchableOpacity
      key={product.id}
      style={styles.productCard}
      onPress={() =>
        navigation.navigate("ProductDetail", {
          productId: product.id,
        })
      }
      activeOpacity={0.8}
    >
      <Image
        source={
          typeof product.imageUrl === "string" && product.imageUrl.trim()
            ? { uri: product.imageUrl }
            : require("../../../../assets/T-App-icon.png") // or use a valid default image
        }
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (isProductsLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
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
      <FlatList
        data={products?.data}
        renderItem={({ item }) => renderProductCard(item)}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            colors={["#0000ff"]}
          />
        }
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>No products available</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 10,
    paddingTop: 34,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
  productCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: "100%",
    height: 150,
    backgroundColor: "#f0f0f0",
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
    height: 40,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2a52be",
  },
  errorText: {
    fontSize: 16,
    color: "#ff0000",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#0000ff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});

export default ProductDisplay;
