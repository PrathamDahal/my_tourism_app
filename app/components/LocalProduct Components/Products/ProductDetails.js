import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useGetProductBySlugQuery } from "../../../services/productApi";
import { useAddToCartMutation } from "../../../services/cartApi";
import RatingStars from "./../../../custom/RatingStars";
import { API_BASE_URL } from "../../../../config";
import CustomerFeedbackContainer from "./CustomerFeedbackContainer";
import { useGetAverageReviewQuery } from "../../../services/feedback";

const { width } = Dimensions.get("window");

const ProductDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { slug } = route.params || {};
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, isLoading, isError, isFetching, refetch } =
    useGetProductBySlugQuery(slug);
  const [addToCart] = useAddToCartMutation();

  const product = data;
  const images = product?.images || [];

  const { data: reviewsData } = useGetAverageReviewQuery(
    {
      type: "product",
      id: product?.id,
    },
    {
      skip: !product?.id,
      refetchOnMountOrArgChange: true,
    }
  );

  const rating = reviewsData?.average ?? 0;
  const hasReviews = (reviewsData?.count ?? 0) > 0;

  const increaseQuantity = () => {
    if (product?.stock && quantity < product.stock) {
      setQuantity((q) => q + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  const handleAddToCartClick = async () => {
    if (product.stock && quantity > product.stock) {
      setErrorMessage(
        `Cannot add more than available stock (${product.stock})`
      );
      setShowErrorToast(true);

      // Hide after 3 seconds
      setTimeout(() => {
        setShowErrorToast(false);
      }, 3000);

      return;
    }

    try {
      await addToCart({ productId: product.id, quantity }).unwrap();
      navigation.navigate("Auth", { screen: "MyCart" });
    } catch (err) {
      // Check if it's an unauthorized error (401)
      if (err?.status === 401 || err?.originalStatus === 401) {
        Alert.alert(
          "Login Required",
          "Can't add items to cart if not logged in",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Login",
              onPress: () => navigation.navigate("Auth", { screen: "Login" }),
            },
          ]
        );
        return;
      }

      // Handle other errors
      setErrorMessage("Failed to add item to cart");
      setShowErrorToast(true);

      // Hide after 3 seconds
      setTimeout(() => {
        setShowErrorToast(false);
      }, 3000);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View style={styles.center}>
        <Text>Product details are not available.</Text>
      </View>
    );
  }

  const renderThumbnail = ({ item, index }) => (
    <TouchableOpacity onPress={() => setSelectedImageIndex(index)}>
      <Image
        source={{ uri: `${API_BASE_URL}${item}` }}
        style={[
          styles.thumbnail,
          index === selectedImageIndex && styles.selectedThumbnail,
        ]}
      />
    </TouchableOpacity>
  );

  const mainImage = images.length ? images[selectedImageIndex] : null;
  const getImageUri = (img) => {
    if (!img) return null;
    return img.startsWith("http")
      ? img
      : `${API_BASE_URL.replace(/\/$/, "")}/${img.replace(/^\/+/, "")}`;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 20}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        alwaysBounceVertical={true} // ✅ REQUIRED for iOS
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={() => {
              refetch(); // 🔄 product
              setRefreshKey((k) => k + 1); // 🔄 feedback
            }}
            colors={["#160b0bff"]} // Android
            tintColor="#0e0606ff" // iOS
          />
        }
      >
        <View style={styles.container}>
          <View style={styles.galleryContainer}>
            <FlatList
              horizontal
              data={images}
              renderItem={renderThumbnail}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 12 }}
            />

            {showErrorToast && (
              <View style={styles.toast}>
                <Text style={styles.toastText}>{errorMessage}</Text>
              </View>
            )}

            {mainImage && (
              <Image
                source={{ uri: getImageUri(mainImage) }}
                style={styles.mainImage}
                resizeMode="contain"
              />
            )}
          </View>

          {/* Product Details Section */}
          <View style={styles.detailsContainer}>
            <View style={styles.ratingContainer}>
              <Text style={styles.title}>{product.name}</Text>
              <View style={styles.ratingRow}>
                <RatingStars rating={rating} />
                <Text style={styles.ratingValue}>
                  {hasReviews ? reviewsData.average.toFixed(1) : "N/A"}
                </Text>
              </View>
            </View>
            <Text style={styles.price}>Nrs {product.price}</Text>
            <Text style={styles.seller}>
              Seller: {product.seller?.firstName || "N/A"}
            </Text>

            <View style={styles.quantityRow}>
              <TouchableOpacity
                onPress={decreaseQuantity}
                disabled={quantity <= 1}
                style={styles.quantityButton}
              >
                <Text
                  style={[styles.qtySign, quantity <= 1 && styles.disabledSign]}
                >
                  –
                </Text>
              </TouchableOpacity>
              <Text style={styles.qtyNumber}>{quantity}</Text>
              <TouchableOpacity
                onPress={increaseQuantity}
                disabled={product.stock && quantity >= product.stock}
                style={styles.quantityButton}
              >
                <Text
                  style={[
                    styles.qtySign,
                    product.stock &&
                      quantity >= product.stock &&
                      styles.disabledSign,
                  ]}
                >
                  +
                </Text>
              </TouchableOpacity>

              {product.stock && (
                <Text style={styles.stockInfo}>Available: {product.stock}</Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddToCartClick}
            >
              <Text style={styles.addText}>Add to Cart</Text>
            </TouchableOpacity>

            <Text style={styles.categoryTags}>
              <Text style={styles.bold}>Category:</Text>{" "}
              {product.category?.name || "Uncategorized"}
            </Text>
            <Text style={styles.categoryTags}>
              <Text style={styles.bold}>Tags:</Text>{" "}
              {product.tags?.length ? product.tags.join(", ") : "No tags"}
            </Text>
          </View>

          {/* Tabs Section */}
          <View style={styles.tabBar}>
            {["description", "feedback"].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[
                  styles.tabButton,
                  activeTab === tab && styles.activeTab,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab
                      ? styles.tabActiveText
                      : styles.tabInactiveText,
                  ]}
                >
                  {tab === "description" ? "Description" : "Feedback"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content Section */}
          {activeTab === "description" ? (
            <View style={styles.descriptionTabBox}>
              <Text style={styles.descriptionTabText}>
                {product.description || "No description available."}
              </Text>
            </View>
          ) : (
            <CustomerFeedbackContainer
              type="product"
              id={product.id}
              refreshKey={refreshKey}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingTop: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  galleryContainer: {
    marginBottom: 20,
  },
  thumbnailList: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
  },
  selectedThumbnail: {
    borderColor: "#007AFF",
    borderWidth: 2,
  },
  mainImage: {
    width: width - 24,
    height: width - 24,
    alignSelf: "center",
    marginTop: 12,
  },
  detailsContainer: {
    paddingHorizontal: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingValue: {
    marginLeft: 6,
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    flex: 1,
    marginRight: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
    marginVertical: 8,
  },
  seller: {
    fontSize: 14,
    color: "#444",
    marginBottom: 8,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  quantityButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  qtySign: {
    fontSize: 18,
    width: 24,
    textAlign: "center",
  },
  qtyNumber: {
    marginHorizontal: 12,
    fontSize: 16,
  },
  disabledSign: {
    color: "#ccc",
  },
  stockInfo: {
    marginLeft: 16,
    fontSize: 13,
    color: "#888",
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 16,
  },
  addText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  categoryTags: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  bold: {
    fontWeight: "600",
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    marginTop: 20,
    marginHorizontal: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: "#007AFF",
  },
  tabText: {
    fontSize: 16,
  },
  tabActiveText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  tabInactiveText: {
    color: "#888",
  },
  descriptionTabBox: {
    backgroundColor: "#F9FAFB",
    margin: 12,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  descriptionTabText: {
    fontSize: 15,
    textAlign: "center",
    color: "#374151",
    lineHeight: 24,
  },
  toast: {
    position: "absolute",
    top: 10,
    left: 20,
    right: 20,
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 6,
    zIndex: 1,
  },
  toastText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
});

export default ProductDetails;
