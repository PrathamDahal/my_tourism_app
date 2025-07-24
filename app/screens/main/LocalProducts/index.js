import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Dimensions,
} from "react-native";
import { useGetCategoriesQuery } from "../../../services/categoryApi";
import { useGetProductsQuery } from "../../../services/productApi";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { API_BASE_URL } from "../../../../config";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 40) / 2; // Calculate width for 2-column grid with padding

const LocalProducts = ({ navigation }) => {
  // Fetch categories from API
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useGetCategoriesQuery();

  // Fetch products from API
  const {
    data: products,
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: productsError,
  } = useGetProductsQuery();

  const [showAll, setShowAll] = useState(false);

  const visibleCategories = showAll ? categories : categories?.slice(0, 4);
  const shouldShowSeeMore = categories?.length > 4;

  if (isCategoriesLoading || isProductsLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isCategoriesError) {
    return (
      <View style={styles.container}>
        <Text>Error loading categories: {categoriesError.error}</Text>
      </View>
    );
  }

  if (isProductsError) {
    return (
      <View style={styles.container}>
        <Text>Error loading products: {productsError.error}</Text>
      </View>
    );
  }

  const renderProductCard = (product, index) => (
    <View
      key={product?._id ?? `product-${index}`}
      style={styles.productCardContainer}
    >
      <TouchableOpacity
        style={styles.productCard}
        onPress={() =>
          navigation.navigate("ProductDetails", {
            slug: product?.slug,
          })
        }
      >
        <Image
          source={
            typeof product?.images?.[0] === "string" && product?.images[0].trim()
              ? {uri: `${API_BASE_URL}/${product.images[0]}`}
              : require("../../../../assets/T-App-icon.png")
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
    </View>
  );

  // Get first 15 products
  const displayedProducts = products?.data?.slice(0, 15) || [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <Text style={styles.header}>Categories</Text>

        <View style={styles.categoriesContainer}>
          {visibleCategories?.map((category) => (
            <TouchableOpacity
              key={category._id}
              style={styles.categoryButton}
              onPress={() =>
                navigation.navigate("CategoryProducts", {
                  categoryId: category._id,
                  categoryName: category.name,
                })
              }
            >
              <Text style={styles.categoryButtonText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {shouldShowSeeMore && !showAll && (
          <TouchableOpacity onPress={() => setShowAll(true)}>
            <Text style={styles.seeMoreText}>See more...</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.sectionHeader}>Featured Products</Text>

        <View style={styles.productsGrid}>
          {displayedProducts.map((product, index) =>
            renderProductCard(product, index)
          )}
        </View>

        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={() => navigation.navigate("ProductDisplay")}
        >
          <Text style={styles.seeAllButtonText}>See All Products</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    marginTop: 20,
    color: "#000",
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  categoryButton: {
    width: CARD_WIDTH,
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
  },
  seeMoreText: {
    color: "#007bff",
    fontSize: 14,
    textAlign: "right",
    marginBottom: 10,
    marginRight: 5,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  productCardContainer: {
    width: CARD_WIDTH,
    marginBottom: 15,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: CARD_WIDTH,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2a59fe",
  },
  seeAllButton: {
    backgroundColor: "#2a59fe",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  seeAllButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LocalProducts;
