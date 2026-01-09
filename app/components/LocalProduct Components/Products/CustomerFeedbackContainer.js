// CustomerFeedbackContainer.js
import { Text, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import CustomerFeedback from "./CustomerFeedback";
import {
  useAddReviewMutation,
  useGetReviewsQuery,
} from "../../../services/feedback";

const CustomerFeedbackContainer = ({ type, id, refreshKey }) => {
  const {
    data: feedback,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetReviewsQuery({ type, id });

  const [addReview] = useAddReviewMutation();

  // 🔄 Refetch when parent pulls to refresh
  useEffect(() => {
    if (refreshKey !== undefined) {
      refetch();
    }
  }, [refreshKey, refetch]);

  const handleSubmitReview = async ({ rating, comment }) => {
    await addReview({ type, id, rating, comment }).unwrap();
    refetch(); // 🔄 refresh after submit
  };

  if (isLoading)
    return <ActivityIndicator size="large" style={{ marginTop: 20 }} />;

  if (error)
    return (
      <Text style={{ textAlign: "center", marginTop: 20 }}>
        Failed to load feedback.
      </Text>
    );

  return (
    <CustomerFeedback
      feedback={feedback || []}
      loading={isFetching}
      onSubmit={handleSubmitReview}
    />
  );
};

export default CustomerFeedbackContainer;
