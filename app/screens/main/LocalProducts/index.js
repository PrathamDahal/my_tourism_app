import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Dimensions,
  RefreshControl,
} from "react-native";
import { useGetCategoriesQuery } from "../../../services/categoryApi";
import { useGetProductsQuery } from "../../../services/productApi";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../../../config";
import { fontNames } from "../../../config/font";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import CustomBottomTab from "../../../custom/BottomTabComponent";

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
    isFetching,
    refetch,
  } = useGetProductsQuery();

  const [showAll, setShowAll] = useState(false);
  const [activeProducts, setActiveProducts] = useState([]);

  // Filter products to only include active ones
  useEffect(() => {
    if (products?.data) {
      const filtered = products.data.filter(
        (product) => product.status === "active"
      );
      setActiveProducts(filtered);
    }
  }, [products]);

  // Fix: Access categories.data instead of categories directly
  const categoriesData = categories?.data || [];
  const visibleCategories = showAll
    ? categoriesData
    : categoriesData.slice(0, 4);
  const shouldShowSeeMore = categoriesData.length > 4;
  const formatPrice = (price) => `$${parseFloat(price ?? 0).toFixed(2)}`;

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
      key={product?.id ?? `product-${index}`}
      style={styles.productCardContainer}
    >
      <TouchableOpacity
        style={styles.productCard}
        onPress={() =>
          navigation.navigate("ProductDetails", {
            slug: product?.slug,
            categoryName: categories?.name,
          })
        }
      >
        <Image
          source={
            typeof product?.images?.[0] === "string" &&
            product?.images[0].trim()
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
    </View>
  );

  // Get first 15 active products
  const displayedProducts = activeProducts.slice(0, 15);

  return (
    <>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            colors={["#C62828"]}
            tintColor="#C62828"
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.leftGroup}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back-ios" size={24} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Products</Text>
          </View>

          <TouchableOpacity style={styles.headerIconButton}>
            <FontAwesome name="bell" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Categories</Text>

          <View style={styles.categoriesContainer}>
            {visibleCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryButton}
                onPress={() =>
                  navigation.navigate("CategoryProducts", {
                    slug: category.slug,
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

          <Text style={styles.sectionTitle}>Featured Products</Text>

          <View style={styles.productsGrid}>
            {displayedProducts.length > 0 ? (
              displayedProducts.map(renderProductCard)
            ) : (
              <Text style={styles.noProductsText}>
                No active products available
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={() => navigation.navigate("ProductDisplay")}
          >
            <Text style={styles.seeAllButtonText}>See All Products</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <CustomBottomTab />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#C62828",
    paddingHorizontal: 15,
    paddingTop: 45,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 10,
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    color: "#fff",
    fontFamily: fontNames.nunito.regular,
  },
  headerIconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  content: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
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
    fontSize: 16,
    fontFamily: fontNames.openSans.regular,
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
    backgroundColor: "#fe2a2aff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  seeAllButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  noProductsText: {
    textAlign: "center",
    width: "100%",
    marginTop: 20,
    color: "#666",
  },
});

export default LocalProducts;
