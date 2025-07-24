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
import { useGetProductsByCategoryQuery } from "../../../services/productApi";
import { API_BASE_URL } from "../../../../config";
import { Ionicons } from "@expo/vector-icons";

const CategoryProducts = ({ route }) => {
  const { categoryId, categoryName } = route.params;
  const navigation = useNavigation();

  const {
    data: product,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetProductsByCategoryQuery(categoryId);

  const products = product?.data || [];
  const totalProducts = product?.totalProducts;

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
            ? { uri: `${API_BASE_URL}/${product.images[0]}` }
            : require("../../../../assets/T-App-icon.png")
        }
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.productPrice}>Rs. {product.price}</Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2a52be" />
      </View>
    );
  }

  if (isError) {
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
        <Text style={styles.categoryTitle}>{categoryName}</Text>
        <View style={styles.totalContainer}>
          <Ionicons name="pricetags" size={18} color="#777" />
          <Text style={styles.totalProductsText}>
            {totalProducts} Products
          </Text>
        </View>
      </View>

      <FlatList
        data={products}
        renderItem={({ item }) => renderProductCard(item)}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            colors={["#2a52be"]}
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
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 10,
    paddingTop: 36,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    marginTop: 10,
    paddingHorizontal: 8,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2a2a2a",
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
    backgroundColor: "#ffffff",
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

export default CategoryProducts;
