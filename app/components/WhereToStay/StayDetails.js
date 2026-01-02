import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useGetAccommodationBySlugQuery } from "../../services/accommodationApi";
import {
  useGetReviewsQuery,
  useAddReviewMutation,
  useEditReviewMutation,
  useDeleteReviewMutation,
} from "../../services/feedback";
import { useFetchUserProfileQuery } from "../../services/userApi";
import { API_BASE_URL } from "../../../config";
import { fontNames } from "../../config/font";

const windowWidth = Dimensions.get("window").width;

export default function StayDetails() {
  const route = useRoute();
  const navigation = useNavigation();
  const { slug } = route.params;
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const isTablet = windowWidth >= 768;
  const maxChars = isTablet ? 1000 : 500;

  const { data, isLoading, isError } = useGetAccommodationBySlugQuery(slug);
  const stay = data;

  const { data: reviewsData, isLoading: reviewsLoading } = useGetReviewsQuery(
    { type: "accommodations", id: stay?.id },
    { skip: !stay?.id }
  );

  const { data: userProfile } = useFetchUserProfileQuery();
  const [addReview, { isLoading: isAdding }] = useAddReviewMutation();
  const [editReview, { isLoading: isEditing }] = useEditReviewMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  useEffect(() => {
    if (!isLoading && isError) {
      console.log("Error occurred, going back");
      navigation.goBack();
    }
    if (!isLoading && !isError && !stay) {
      console.log("No stay found, going back");
      navigation.goBack();
    }
  }, [isError, isLoading, stay, navigation]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#C62828" />
        <Text style={styles.loadingText}>Loading accommodation details...</Text>
      </View>
    );
  }

  if (!stay) {
    return null;
  }

  const mainImageUrl = stay.images?.[0]
    ? stay.images[0].startsWith("/api")
      ? `${API_BASE_URL}${stay.images[0]}`
      : stay.images[0]
    : "https://via.placeholder.com/400x300?text=No+Image";

  // Parse amenities - they come as string arrays or may contain "[]"
  let amenitiesList = [];
  if (Array.isArray(stay.amenities)) {
    amenitiesList = stay.amenities
      .filter((a) => a && a !== "[]")
      .flatMap((a) => {
        try {
          const parsed = JSON.parse(a);
          return Array.isArray(parsed) ? parsed : [a];
        } catch {
          return [a];
        }
      });
  }

  // Collect amenities from rooms as well
  const roomAmenities =
    stay.rooms?.flatMap((room) => room.amenities || []) || [];
  const allAmenities = [...new Set([...amenitiesList, ...roomAmenities])];

  const displayAmenities =
    allAmenities.length > 0
      ? allAmenities
      : ["WiFi", "Parking", "Kitchen", "Heating", "Washer", "Breakfast"];

  const amenitiestoShow = showAllAmenities
    ? displayAmenities
    : displayAmenities.slice(0, 6);
  const hasMoreAmenities = displayAmenities.length > 6;

  // Calculate property details from rooms
  const totalGuests =
    stay.rooms?.reduce((sum, room) => sum + (room.maxGuests || 0), 0) || 6;
  const totalBedrooms =
    stay.rooms?.reduce((sum, room) => sum + (room.bedrooms || 0), 0) || 3;
  const totalBeds =
    stay.rooms?.reduce((sum, room) => sum + (room.beds || 0), 0) || 4;
  const totalBathrooms =
    stay.rooms?.reduce((sum, room) => sum + (room.bathrooms || 0), 0) || 2;

  const reviews = reviewsData || [];

  const handleAddReview = async () => {
    if (!comment.trim()) {
      Alert.alert("Error", "Please enter a comment");
      return;
    }

    try {
      await addReview({
        type: "accommodations",
        id: stay.id,
        rating,
        comment,
      }).unwrap();
      setComment("");
      setRating(5);
      setShowReviewForm(false);
      Alert.alert("Success", "Review added successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to add review");
    }
  };

  const handleEditReview = async () => {
    if (!comment.trim()) {
      Alert.alert("Error", "Please enter a comment");
      return;
    }

    try {
      await editReview({
        reviewId: editingReview.id,
        rating,
        comment,
      }).unwrap();
      setComment("");
      setRating(5);
      setEditingReview(null);
      setShowReviewForm(false);
      Alert.alert("Success", "Review updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update review");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    Alert.alert(
      "Delete Review",
      "Are you sure you want to delete this review?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteReview(reviewId).unwrap();
              Alert.alert("Success", "Review deleted successfully");
            } catch (error) {
              Alert.alert("Error", "Failed to delete review");
            }
          },
        },
      ]
    );
  };

  const startEditReview = (review) => {
    setEditingReview(review);
    setRating(review.reviews);
    setComment(review.comment);
    setShowReviewForm(true);
  };

  const cancelReviewForm = () => {
    setShowReviewForm(false);
    setEditingReview(null);
    setComment("");
    setRating(5);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Hero Image with Overlay */}
        <View style={styles.mainImageContainer}>
          <Image
            source={{ uri: mainImageUrl }}
            style={[styles.mainImage, { width: windowWidth }]}
            resizeMode="cover"
          />
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back-ios" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.imageOverlay}>
            <Text style={styles.titleText}>{stay.name}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={14} color="#fff" />
              <Text style={styles.locationText}>{stay.address}</Text>
            </View>
            <TouchableOpacity style={styles.reserveButton}>
              <Text style={styles.reserveButtonText}>RESERVE</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.detailsCard}>
          {/* Property Details Section */}
          <Text style={styles.sectionTitle}>Property Details</Text>

          <View style={styles.propertyDetailsGrid}>
            <View style={styles.detailItem}>
              <Ionicons name="people-outline" size={20} color="#666" />
              <Text style={styles.detailLabel}>Guests</Text>
              <Text style={styles.detailValue}>{totalGuests}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="bed-outline" size={20} color="#666" />
              <Text style={styles.detailLabel}>Bedrooms</Text>
              <Text style={styles.detailValue}>{totalBedrooms}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="bed-outline" size={20} color="#666" />
              <Text style={styles.detailLabel}>Beds</Text>
              <Text style={styles.detailValue}>{totalBeds}</Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialIcons name="bathroom" size={20} color="#666" />
              <Text style={styles.detailLabel}>Bathrooms</Text>
              <Text style={styles.detailValue}>{totalBathrooms}</Text>
            </View>
          </View>

          <View style={styles.checkTimesRow}>
            <View style={styles.checkTimeItem}>
              <Text style={styles.checkTimeLabel}>Check-in</Text>
              <Text style={styles.checkTimeValue}>
                {stay.checkInFrom?.substring(0, 5) || "14:00"}
              </Text>
            </View>
            <View style={styles.checkTimeItem}>
              <Text style={styles.checkTimeLabel}>Check-out</Text>
              <Text style={styles.checkTimeValue}>
                {stay.checkOutUntil?.substring(0, 5) || "10:00"}
              </Text>
            </View>
          </View>

          {/* About This Property */}
          <Text style={styles.sectionTitle}>About This Property</Text>
          <Text style={styles.description}>
            {stay.description?.length > maxChars
              ? stay.description.slice(0, maxChars) + "..."
              : stay.description ||
                "Modern lodge built with love and with some warm and cozy soft furnishings to also ensure peace and relaxation during your stay. Includes full kitchen and spacious living area."}
          </Text>

          {/* Amenities */}
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {amenitiestoShow.map((amenity, index) => (
              <View key={index} style={styles.amenityCard}>
                <Ionicons name="checkmark" size={18} color="#4CAF50" />
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
          {hasMoreAmenities && (
            <View style={styles.seeMoreContainer}>
              <TouchableOpacity
                onPress={() => setShowAllAmenities(!showAllAmenities)}
              >
                <Text style={styles.seeMoreText}>
                  {showAllAmenities ? "See Less..." : "See More..."}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Destination */}
          {stay.primaryDestination && (
            <>
              <Text style={styles.sectionTitle}>Destination</Text>
              <FlatList
                horizontal
                data={[stay.primaryDestination]}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carouselContainer}
                renderItem={({ item }) => (
                  <View style={styles.destinationCard}>
                    <Image
                      source={{
                        uri: item.heroImageUrl?.startsWith("/api")
                          ? `${API_BASE_URL}${item.heroImageUrl}`
                          : item.heroImageUrl ||
                            "https://via.placeholder.com/400x200",
                      }}
                      style={styles.destinationImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.destinationName}>{item.name}</Text>
                  </View>
                )}
                keyExtractor={(item) => item.id}
              />
            </>
          )}

          {/* Reviews */}
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>{reviews.length} Reviews</Text>
            {userProfile && !showReviewForm && (
              <TouchableOpacity
                style={styles.addReviewButton}
                onPress={() => setShowReviewForm(true)}
              >
                <View style={styles.addReviewContent}>
                  <MaterialIcons name="add" size={20} color="#fff" />
                  <Text style={styles.addReviewText}>Add Review</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* Review Form */}
          {showReviewForm && (
            <View style={styles.reviewForm}>
              <Text style={styles.reviewFormTitle}>
                {editingReview ? "Edit Review" : "Add Review"}
              </Text>

              {/* Star Rating */}
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingLabel}>Rating:</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setRating(star)}
                    >
                      <Ionicons
                        name={star <= rating ? "star" : "star-outline"}
                        size={28}
                        color="#FFB800"
                        style={styles.starButton}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Comment Input */}
              <TextInput
                style={styles.commentInput}
                placeholder="Write your review..."
                multiline
                numberOfLines={4}
                value={comment}
                onChangeText={setComment}
              />

              {/* Buttons */}
              <View style={styles.reviewFormButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={cancelReviewForm}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={editingReview ? handleEditReview : handleAddReview}
                  disabled={isAdding || isEditing}
                >
                  {isAdding || isEditing ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>
                      {editingReview ? "Update" : "Submit"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}

          {reviewsLoading ? (
            <ActivityIndicator
              size="small"
              color="#C62828"
              style={{ marginVertical: 20 }}
            />
          ) : (
            reviews.map((review) => {
              const isUserReview = userProfile?.id === review.userId;
              const avatarUrl = review.image?.startsWith("/api")
                ? `${API_BASE_URL}${review.image}`
                : review.image;

              return (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    {avatarUrl ? (
                      <Image
                        source={{ uri: avatarUrl }}
                        style={styles.avatarImage}
                      />
                    ) : (
                      <View style={styles.avatarCircle}>
                        <Text style={styles.avatarText}>
                          {review.name.charAt(0)}
                        </Text>
                      </View>
                    )}
                    <View style={styles.reviewInfo}>
                      <Text style={styles.reviewerName}>{review.name}</Text>
                      <View style={styles.starsRow}>
                        {[...Array(5)].map((_, i) => (
                          <Ionicons
                            key={i}
                            name={i < review.reviews ? "star" : "star-outline"}
                            size={14}
                            color="#FFB800"
                          />
                        ))}
                      </View>
                    </View>
                    {isUserReview && (
                      <View style={styles.reviewActions}>
                        <TouchableOpacity
                          onPress={() => startEditReview(review)}
                          style={styles.actionButton}
                        >
                          <Ionicons
                            name="create-outline"
                            size={20}
                            color="#666"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleDeleteReview(review.id)}
                          style={styles.actionButton}
                          disabled={isDeleting}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={20}
                            color="#E53935"
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              );
            })
          )}

          {/* Spacer for sticky bottom */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      {/* Sticky Bottom Section */}
      <View style={styles.stickyBottom}>
        <TouchableOpacity
          style={styles.viewRoomsButton}
          onPress={() =>
            navigation.navigate("RoomBookings", { slug: stay.slug })
          }
        >
          <Text style={styles.viewRoomsButtonText}>View Rooms</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  scrollView: { flex: 1 },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  headerTop: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    marginTop: 30,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  mainImageContainer: {
    position: "relative",
    height: 350,
  },
  mainImage: {
    objectFit: "cover",
    height: 350,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  titleText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  locationText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 4,
  },
  reserveButton: {
    backgroundColor: "#E53935",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  reserveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  detailsCard: {
    backgroundColor: "#fff",
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: fontNames.openSans.semibold,
    color: "#333",
    marginTop: 20,
    marginBottom: 12,
  },
  propertyDetailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  detailItem: {
    width: "50%",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 2,
  },
  checkTimesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  checkTimeItem: {
    flex: 1,
  },
  checkTimeLabel: {
    fontSize: 16,
    fontFamily: fontNames.openSans.semibold,
    color: "#333",
    marginBottom: 4,
  },
  checkTimeValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: "#555",
    marginBottom: 8,
  },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  amenityCard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    padding: 12,
    borderRadius: 8,
    margin: 4,
  },
  amenityText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
  },
  seeMoreContainer: {
    alignItems: "flex-end",
    marginTop: 8,
    marginBottom: 8,
  },
  seeMoreText: {
    color: "#E53935",
    fontSize: 14,
    fontWeight: "500",
  },
  carouselContainer: {
    paddingRight: 16,
  },
  destinationCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    width: windowWidth * 0.75,
  },
  destinationImage: {
    width: "100%",
    height: 150,
  },
  destinationName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    padding: 12,
  },
  roomCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    width: windowWidth * 0.7,
  },
  roomImage: {
    width: "100%",
    height: 140,
  },
  roomName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    padding: 12,
  },
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  addReviewButton: {
    backgroundColor: "#E53935",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  addReviewContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addReviewText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 6,
    fontFamily: fontNames.nunito.regular,
  },

  reviewCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  reviewHeader: {
    flexDirection: "row",
    marginBottom: 8,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E53935",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  reviewInfo: {
    marginLeft: 12,
    justifyContent: "center",
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  starsRow: {
    flexDirection: "row",
  },
  reviewComment: {
    fontSize: 13,
    color: "#555",
    lineHeight: 20,
  },
  reviewForm: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  reviewFormTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ratingLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  starButton: {
    marginHorizontal: 2,
  },
  commentInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  reviewFormButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    backgroundColor: "#f0f0f0",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },
  submitButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    backgroundColor: "#E53935",
    minWidth: 80,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  reviewActions: {
    flexDirection: "row",
    marginLeft: "auto",
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  bottomSpacer: {
    height: 100,
  },
  stickyBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  viewRoomsButton: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#E53935",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
  },
  viewRoomsButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
