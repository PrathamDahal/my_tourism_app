// CustomerFeedbackContainer.js
import { Text, ActivityIndicator } from "react-native";
import CustomerFeedback from "./CustomerFeedback";
import { useAddReviewMutation, useGetReviewsQuery } from "../../../services/feedback";

const CustomerFeedbackContainer = ({ type, id }) => {
  const { data: feedback, isLoading, error } = useGetReviewsQuery({ type, id });
  const [addReview] = useAddReviewMutation();

  const handleSubmitReview = async ({ rating, comment }) => {
    await addReview({ type, id, rating, comment }).unwrap();
  };

  if (isLoading) return <ActivityIndicator size="large" style={{ marginTop: 20 }} />;
  if (error) return <Text style={{ textAlign: "center", marginTop: 20 }}>Failed to load feedback.</Text>;

  return <CustomerFeedback feedback={feedback || []} onSubmit={handleSubmitReview} />;
};

export default CustomerFeedbackContainer;
