import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import { useFetchUserProfileQuery } from "../../services/userApi";
import ProtectedRoute from "../../navigation/ProtectedRoute";
import Icon from "react-native-vector-icons/FontAwesome";

const MyProfile = () => {
  const { data: userData, isLoading, isError } = useFetchUserProfileQuery();

  const user = userData?.data?.user;

  const fullName = [user?.firstName, user?.middleName, user?.lastName]
    .filter(Boolean)
    .join(" ");

  const createdAt = new Date(user?.createdAt).toLocaleDateString("en-GB");

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (isError || !user) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "red" }}>Failed to load user data</Text>
      </View>
    );
  }

  return (
    <ProtectedRoute>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>मेरो प्रोफाइल</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                user?.images
                  ? { uri: user.images }
                  : require("../../../assets/Images/default-avatar-image.jpg")
              }
              style={styles.avatar}
            />
            <Text style={styles.fullName}>{fullName}</Text>
            <Text style={styles.role}>{user.role?.toUpperCase()}</Text>
          </View>

          <View style={styles.infoSection}>
            <InfoRow icon="envelope" label="इमेल" value={user.email} />
            <InfoRow icon="user" label="युजरनेम" value={user.username} />
            <InfoRow icon="phone" label="फोन" value={user.phone} />
            <InfoRow icon="calendar" label="दर्ता मिति" value={createdAt} />
          </View>
        </View>
      </ScrollView>
    </ProtectedRoute>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <Icon name={icon} size={16} color="#4B5563" style={{ width: 24 }} />
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value || "N/A"}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingTop: 32,
    paddingHorizontal: 10,    backgroundColor: "#F9FAFB",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#1F2937",
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  fullName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  role: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  infoSection: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontWeight: "600",
    color: "#374151",
    width: 90,
  },
  value: {
    color: "#374151",
    flex: 1,
    flexWrap: "wrap",
  },
});

export default MyProfile;
