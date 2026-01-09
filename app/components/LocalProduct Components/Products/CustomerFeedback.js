// CustomerFeedback.js
import { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useFetchUserProfileQuery } from "../../../services/userApi";
import { useAuth } from "../../../context/AuthContext";
import {
  useDeleteReviewMutation,
  useEditReviewMutation,
} from "../../../services/feedback";
import { fontNames } from "../../../config/font";

// Simple Rating Stars Component
const RatingStars = ({ rating, onChange, interactive }) => {
  return (
    <View style={{ flexDirection: "row" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => interactive && onChange(star)}
          activeOpacity={interactive ? 0.6 : 1}
        >
          <FontAwesome
            name={star <= rating ? "star" : "star-o"}
            size={20}
            color="#fbbf24"
            style={{ marginRight: 4 }}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const CustomerFeedback = ({ feedback, onSubmit }) => {
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { userToken } = useAuth();
  
  // ✅ Only fetch user profile if logged in
  const { data: userProfile } = useFetchUserProfileQuery(undefined, {
    skip: !userToken,
  });
  
  const isLoggedIn = !!userProfile;

  const [deleteReview, { isLoading: deleting }] = useDeleteReviewMutation();
  const [editReview] = useEditReviewMutation();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    reviewId: "",
    rating: 0,
    comment: "",
  });

  const handleDelete = async (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this review?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteReview(id).unwrap();
            } catch {
              Alert.alert("Error", "Failed to delete review");
            }
          },
        },
      ]
    );
  };

  const handleEdit = (item) => {
    setEditData({
      reviewId: item.id,
      rating: item.reviews,
      comment: item.comment,
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      await editReview(editData).unwrap();
      setEditModalOpen(false);
    } catch {
      Alert.alert("Error", "Failed to update review");
    }
  };

  const handleSubmit = async () => {
    if (newRating === 0 || newComment.trim() === "") {
      Alert.alert("Validation Error", "Please provide a rating and a comment.");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({ rating: newRating, comment: newComment });
      setNewRating(0);
      setNewComment("");
    } catch {
      Alert.alert("Error", "Failed to submit review");
    }
    setSubmitting(false);
  };

  return (
    <View style={{ padding: 12 }}>
      {/* Existing Reviews */}
      {feedback.map((item, index) => (
        <View key={index} style={styles.reviewCard}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.avatar}>
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <Text style={styles.avatarText}>
                  {item.name?.charAt(0) || "?"}
                </Text>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <RatingStars rating={item.reviews} />
              <Text style={styles.comment}>{item.comment}</Text>
            </View>

            {userProfile?.id === item.userId && (
              <View style={{ flexDirection: "column" }}>
                <TouchableOpacity
                  onPress={() => handleEdit(item)}
                  style={{ marginRight: 5 }}
                >
                  <FontAwesome name="edit" size={20} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  disabled={deleting}
                >
                  <FontAwesome name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      ))}

      {/* Submit Review */}
      {isLoggedIn ? (
        <View style={styles.form}>
          <Text style={styles.formTitle}>Give a Review</Text>

          <Text>Your Rating</Text>
          <RatingStars rating={newRating} onChange={setNewRating} interactive />

          <TextInput
            placeholder="Write your review here..."
            value={newComment}
            onChangeText={setNewComment}
            style={styles.textArea}
            multiline
          />

          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.submitBtn}
            disabled={submitting}
          >
            <Text style={{ color: "#fff", fontFamily: fontNames.nunito.semiBold, fontSize: 16 }}>
              {submitting ? "Submitting..." : "Submit Review"}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.loginPrompt}>
          <Text style={styles.loginPromptText}>
            Please login to add review
          </Text>
        </View>
      )}

      {/* Edit Modal */}
      <Modal visible={editModalOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => setEditModalOpen(false)}
              style={styles.closeBtn}
            >
              <Text style={{ fontSize: 18 }}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Review</Text>

            <Text>Rating</Text>
            <RatingStars
              rating={editData.rating}
              onChange={(val) =>
                setEditData((prev) => ({ ...prev, rating: val }))
              }
              interactive
            />

            <Text style={{ marginTop: 8 }}>Comment</Text>
            <TextInput
              value={editData.comment}
              onChangeText={(val) =>
                setEditData((prev) => ({ ...prev, comment: val }))
              }
              style={styles.textArea}
              multiline
            />

            <TouchableOpacity
              onPress={handleEditSubmit}
              style={styles.submitBtn}
            >
              <Text style={{ color: "#fff" }}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  reviewCard: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    backgroundColor: "#e5e7eb",
    borderRadius: 24,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarText: { fontSize: 18, fontWeight: "bold" },
  name: { fontWeight: "bold", fontSize: 16 },
  comment: { fontSize: 14, color: "#6b7280", marginTop: 4 },
  form: {
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  formTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    minHeight: 80,
    marginTop: 8,
    marginBottom: 12,
  },
  submitBtn: {
    backgroundColor: "#c82d1fff",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    width: "90%",
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  modalTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  loginPrompt: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  loginPromptText: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },
});

export default CustomerFeedback;