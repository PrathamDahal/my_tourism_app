import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  TextInput,
  Alert,
} from "react-native";
import { useState } from "react";
import { useFetchUserProfileQuery } from "../../services/userApi";
import ProtectedRoute from "../../navigation/ProtectedRoute";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { API_BASE_URL } from "../../../config";

const MyProfile = () => {
  const { data, isLoading, isError, refetch } = useFetchUserProfileQuery();
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const user = data;

  // Edit form state
  const [editForm, setEditForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    username: "",
    phone: "",
    gender: "",
  });

  const imageUri =
    typeof user?.images === "string" && user.images.trim()
      ? { uri: `${API_BASE_URL}${user.images}` }
      : require("../../../assets/Images/default-avatar-image.jpg");

  const fullName = [user?.firstName, user?.middleName, user?.lastName]
    .filter(Boolean)
    .join(" ");

  const createdAt = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString("en-GB")
    : "N/A";

  const handleEditProfile = () => {
    // Populate form with current user data
    setEditForm({
      firstName: user?.firstName || "",
      middleName: user?.middleName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      username: user?.username || "",
      phone: user?.phone || "",
      gender: user?.gender || "MALE",
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      username: "",
      phone: "",
      gender: "",
    });
  };

  const handleSaveProfile = async () => {
    // Validation
    if (!editForm.firstName.trim()) {
      Alert.alert("Error", "First name is required");
      return;
    }
    if (!editForm.email.trim()) {
      Alert.alert("Error", "Email is required");
      return;
    }
    if (!editForm.phone.trim()) {
      Alert.alert("Error", "Phone is required");
      return;
    }

    setIsSaving(true);
    
    try {
      // TODO: Call your update profile API here
      // await updateProfile(editForm).unwrap();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert("Success", "Profile updated successfully!");
      setIsEditing(false);
      refetch();
    } catch (error) {
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (isError || !user) {
    return (
      <View style={styles.centered}>
        <MaterialIcons name="error-outline" size={64} color="#EF4444" />
        <Text style={styles.errorText}>Failed to load profile</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ProtectedRoute>
      <View style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>मेरो प्रोफाइल</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {!isEditing ? (
            /* VIEW MODE - Profile Card */
            <View style={styles.profileCard}>
              {/* Edit Button */}
              <TouchableOpacity 
                style={styles.editButton}
                onPress={handleEditProfile}
              >
                <MaterialIcons name="edit" size={20} color="#4F46E5" />
              </TouchableOpacity>

              {/* Avatar Section */}
              <View style={styles.avatarSection}>
                <View style={styles.avatarWrapper}>
                  <Image source={imageUri} style={styles.avatar} />
                  <View style={styles.avatarBadge}>
                    <MaterialIcons name="verified" size={16} color="#fff" />
                  </View>
                </View>
                <Text style={styles.fullName}>{fullName}</Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>{user.role?.toUpperCase()}</Text>
                </View>
              </View>

              {/* Info Cards Grid */}
              <View style={styles.infoGrid}>
                <InfoCard
                  icon="envelope"
                  label="इमेल"
                  value={user.email}
                  iconColor="#4F46E5"
                  bgColor="#EEF2FF"
                />
                <InfoCard
                  icon="user"
                  label="युजरनेम"
                  value={user.username}
                  iconColor="#10B981"
                  bgColor="#ECFDF5"
                />
                <InfoCard
                  icon="phone"
                  label="फोन"
                  value={user.phone}
                  iconColor="#F59E0B"
                  bgColor="#FEF3C7"
                />
                <InfoCard
                  icon="venus-mars"
                  label="लिङ्ग"
                  value={user.gender === "MALE" ? "पुरुष" : user.gender === "FEMALE" ? "महिला" : "अन्य"}
                  iconColor="#EC4899"
                  bgColor="#FCE7F3"
                />
                <InfoCard
                  icon="calendar"
                  label="दर्ता मिति"
                  value={createdAt}
                  iconColor="#EF4444"
                  bgColor="#FEE2E2"
                />
                {user.isAdmin && (
                  <InfoCard
                    icon="shield"
                    label="Admin Status"
                    value="Admin User"
                    iconColor="#8B5CF6"
                    bgColor="#F3E8FF"
                  />
                )}
              </View>
            </View>
          ) : (
            /* EDIT MODE - Edit Profile Card */
            <View style={styles.profileCard}>
              {/* Cancel Button */}
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleCancelEdit}
              >
                <MaterialIcons name="close" size={20} color="#EF4444" />
              </TouchableOpacity>

              {/* Avatar Section - View Only in Edit Mode */}
              <View style={styles.avatarSection}>
                <View style={styles.avatarWrapper}>
                  <Image source={imageUri} style={styles.avatar} />
                  <TouchableOpacity style={styles.changePhotoButton}>
                    <MaterialIcons name="camera-alt" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.editTitle}>Edit Profile</Text>
              </View>

              {/* Edit Form */}
              <View style={styles.editForm}>
                <View style={styles.formRow}>
                  <View style={styles.formField}>
                    <Text style={styles.fieldLabel}>First Name *</Text>
                    <TextInput
                      style={styles.input}
                      value={editForm.firstName}
                      onChangeText={(text) => setEditForm({...editForm, firstName: text})}
                      placeholder="Enter first name"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                  <View style={styles.formField}>
                    <Text style={styles.fieldLabel}>Middle Name</Text>
                    <TextInput
                      style={styles.input}
                      value={editForm.middleName}
                      onChangeText={(text) => setEditForm({...editForm, middleName: text})}
                      placeholder="Enter middle name"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>

                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Last Name</Text>
                  <TextInput
                    style={styles.input}
                    value={editForm.lastName}
                    onChangeText={(text) => setEditForm({...editForm, lastName: text})}
                    placeholder="Enter last name"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Email *</Text>
                  <TextInput
                    style={styles.input}
                    value={editForm.email}
                    onChangeText={(text) => setEditForm({...editForm, email: text})}
                    placeholder="Enter email"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Username</Text>
                  <TextInput
                    style={[styles.input, styles.disabledInput]}
                    value={editForm.username}
                    editable={false}
                    placeholderTextColor="#9CA3AF"
                  />
                  <Text style={styles.helperText}>Username cannot be changed</Text>
                </View>

                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Phone *</Text>
                  <TextInput
                    style={styles.input}
                    value={editForm.phone}
                    onChangeText={(text) => setEditForm({...editForm, phone: text})}
                    placeholder="Enter phone number"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Gender *</Text>
                  <View style={styles.genderContainer}>
                    <TouchableOpacity
                      style={[
                        styles.genderOption,
                        editForm.gender === "MALE" && styles.genderOptionSelected
                      ]}
                      onPress={() => setEditForm({...editForm, gender: "MALE"})}
                    >
                      <MaterialIcons 
                        name="check-circle" 
                        size={20} 
                        color={editForm.gender === "MALE" ? "#4F46E5" : "#D1D5DB"} 
                      />
                      <Text style={[
                        styles.genderText,
                        editForm.gender === "MALE" && styles.genderTextSelected
                      ]}>पुरुष</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.genderOption,
                        editForm.gender === "FEMALE" && styles.genderOptionSelected
                      ]}
                      onPress={() => setEditForm({...editForm, gender: "FEMALE"})}
                    >
                      <MaterialIcons 
                        name="check-circle" 
                        size={20} 
                        color={editForm.gender === "FEMALE" ? "#4F46E5" : "#D1D5DB"} 
                      />
                      <Text style={[
                        styles.genderText,
                        editForm.gender === "FEMALE" && styles.genderTextSelected
                      ]}>महिला</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.genderOption,
                        editForm.gender === "OTHER" && styles.genderOptionSelected
                      ]}
                      onPress={() => setEditForm({...editForm, gender: "OTHER"})}
                    >
                      <MaterialIcons 
                        name="check-circle" 
                        size={20} 
                        color={editForm.gender === "OTHER" ? "#4F46E5" : "#D1D5DB"} 
                      />
                      <Text style={[
                        styles.genderText,
                        editForm.gender === "OTHER" && styles.genderTextSelected
                      ]}>अन्य</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.cancelActionButton}
                    onPress={handleCancelEdit}
                  >
                    <Text style={styles.cancelActionText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                    onPress={handleSaveProfile}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.saveButtonText}>Save Changes</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </ProtectedRoute>
  );
};

const InfoCard = ({ icon, label, value, iconColor, bgColor }) => (
  <View style={styles.infoCard}>
    <View style={[styles.iconCircle, { backgroundColor: bgColor }]}>
      <FontAwesome name={icon} size={20} color={iconColor} />
    </View>
    <View style={styles.infoCardContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={2}>
        {value || "N/A"}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  errorText: {
    fontSize: 18,
    color: "#EF4444",
    fontWeight: "600",
    marginTop: 16,
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#4F46E5",
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    position: "relative",
  },
  editButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cancelButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  avatarSection: {
    alignItems: "center",
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  avatarBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  changePhotoButton: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F59E0B",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  fullName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  editTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: "#EEF2FF",
    borderRadius: 20,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4F46E5",
    letterSpacing: 0.5,
  },
  infoGrid: {
    marginTop: 24,
    gap: 12,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoCardContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
  },
  editForm: {
    marginTop: 24,
    gap: 16,
  },
  formRow: {
    flexDirection: "row",
    gap: 12,
  },
  formField: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#111827",
    backgroundColor: "#fff",
  },
  disabledInput: {
    backgroundColor: "#F9FAFB",
    color: "#9CA3AF",
  },
  helperText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  genderContainer: {
    flexDirection: "row",
    gap: 8,
  },
  genderOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  genderOptionSelected: {
    borderColor: "#4F46E5",
    backgroundColor: "#EEF2FF",
  },
  genderText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  genderTextSelected: {
    color: "#4F46E5",
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  cancelActionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  cancelActionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#4F46E5",
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default MyProfile;