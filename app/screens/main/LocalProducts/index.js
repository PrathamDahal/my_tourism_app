import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useGetCategoriesQuery } from "../../../services/categoryApi";
import { useGetProductsQuery } from "../../../services/productApi";
import { SafeAreaView } from "react-native-safe-area-context";

const LocalProducts = ({ navigation }) => {
  // Fetch categories from API
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useGetCategoriesQuery();

  // Fetch top selling products from API
  const {
    data: products,
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: productsError,
  } = useGetProductsQuery({
    limit: 3, // Get top 3 selling products
  });

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Categories</Text>

        <View style={styles.section}>
          {categories?.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryItem}
              onPress={() =>
                navigation.navigate("CategoryProducts", {
                  categoryId: category.id,
                  categoryName: category.name,
                })
              }
            >
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionHeader}>Top Selling</Text>
        <View style={styles.section}>
          {products?.slice(0, 3).map((product) => (
            <TouchableOpacity
              key={product.id}
              style={styles.topSellingItem}
              onPress={() =>
                navigation.navigate("ProductDetail", {
                  productId: product.id,
                })
              }
            >
              <Text style={styles.topSellingText}>
                {product.name}{" "}
                <Text style={styles.priceText}>
                  ${product.price.toFixed(2)}
                </Text>
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.topSellingItem}
            onPress={() => navigation.navigate("AllProducts")}
          >
            <Text style={styles.topSellingText}>See All</Text>
          </TouchableOpacity>
        </View>
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
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#000",
  },
  categoryItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
  },
  categoryText: {
    fontSize: 16,
    color: "#000",
  },
  topSellingItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
  },
  topSellingText: {
    fontSize: 16,
    color: "#000",
  },
  priceText: {
    fontWeight: "bold",
    color: "#000",
  },
});

export default LocalProducts;
