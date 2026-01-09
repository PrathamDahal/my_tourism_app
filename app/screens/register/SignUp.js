import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";
import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";
import { useRegisterUserMutation } from "../../services/registerApi";
import { useLazyCheckEmailQuery } from "../../services/auth/authApiSlice";
import { FontAwesome } from "@expo/vector-icons";
import { fontNames } from "../../config/font";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [checkEmail, { data: emailCheckData, isFetching: isCheckingEmail }] =
    useLazyCheckEmailQuery();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("success"); // 'success' or 'error'
  const [modalMessage, setModalMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailValidationStatus, setEmailValidationStatus] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const debounceTimer = useRef(null);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string().required("Phone is required"),
    gender: Yup.string().required("Gender is required"),
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    role: Yup.string().required("Role is required"),
    images: Yup.mixed().nullable(),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phone: "",
      permanentAddress: "",
      temporaryAddress: "",
      gender: "",
      username: "",
      password: "",
      confirmPassword: "",
      role: "NORMAL",
      images: null,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const { confirmPassword, ...apiPayload } = values;
        
        // If no image selected, remove images field
        if (!apiPayload.images) {
          delete apiPayload.images;
        }
        
        const response = await registerUser(apiPayload).unwrap();
        
        if (response.success) {
          setModalType("success");
          setModalMessage("User has been registered successfully!");
          setShowModal(true);
          
          setTimeout(() => {
            setShowModal(false);
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          }, 2000);
        } else {
          setModalType("error");
          setModalMessage(response.message || "Registration failed!");
          setShowModal(true);
          setTimeout(() => setShowModal(false), 3000);
        }
      } catch (err) {
        const errorMessage = err.data?.message || err.message || "Registration failed. Please try again.";
        
        setModalType("error");
        setModalMessage(errorMessage);
        setShowModal(true);
        setStatus(errorMessage);
        
        setTimeout(() => setShowModal(false), 3000);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Debounced email validation
  useEffect(() => {
    const emailValue = formik.values.email;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (!emailValue || !emailValue.includes("@")) {
      setEmailValidationStatus(null);
      return;
    }

    debounceTimer.current = setTimeout(() => {
      checkEmail(emailValue);
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [formik.values.email, checkEmail]);

  // Update validation status based on API response
  useEffect(() => {
    if (emailCheckData !== undefined) {
      setEmailValidationStatus(
        emailCheckData.available || emailCheckData.success ? "valid" : "invalid"
      );
    }
  }, [emailCheckData]);

  // Image picker
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], 
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setSelectedImage(asset.uri);
      
      // Set the asset directly - RTK will handle FormData conversion
      formik.setFieldValue("images", asset);
    }
  };

  const handleRemoveImage = () => {
    formik.setFieldValue("images", null);
    setSelectedImage(null);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 20}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <View style={styles.headerBox}>
            <Text style={styles.headerText}>User Registration</Text>
          </View>

          <View style={styles.formBox}>
            {formik.status && (
              <Text style={styles.errorMessage}>{formik.status}</Text>
            )}

            {/* Profile Image */}
            <View style={styles.imageSection}>
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={pickImage}
              >
                {selectedImage ? (
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: selectedImage }}
                      style={styles.profileImage}
                    />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={handleRemoveImage}
                    >
                      <FontAwesome name="times-circle" size={24} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <FontAwesome name="camera" size={32} color="#9ca3af" />
                    <Text style={styles.imagePlaceholderText}>
                      Add Profile Photo
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Personal Information</Text>

            {/* First & Middle Name */}
            <View style={styles.gridRow}>
              <View style={styles.gridItem}>
                <Text style={styles.inputTitle}>First Name*</Text>
                <TextInput
                  placeholder="Enter first name"
                  style={[
                    styles.input,
                    formik.touched.firstName &&
                      formik.errors.firstName &&
                      styles.errorInput,
                  ]}
                  onChangeText={formik.handleChange("firstName")}
                  onBlur={formik.handleBlur("firstName")}
                  value={formik.values.firstName}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <Text style={styles.errorText}>
                    {formik.errors.firstName}
                  </Text>
                )}
              </View>

              <View style={styles.gridItem}>
                <Text style={styles.inputTitle}>Middle Name</Text>
                <TextInput
                  placeholder="Enter middle name"
                  style={styles.input}
                  onChangeText={formik.handleChange("middleName")}
                  onBlur={formik.handleBlur("middleName")}
                  value={formik.values.middleName}
                />
              </View>
            </View>

            <Text style={styles.inputTitle}>Last Name*</Text>
            <TextInput
              placeholder="Enter last name"
              style={[
                styles.input,
                formik.touched.lastName &&
                  formik.errors.lastName &&
                  styles.errorInput,
              ]}
              onChangeText={formik.handleChange("lastName")}
              onBlur={formik.handleBlur("lastName")}
              value={formik.values.lastName}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <Text style={styles.errorText}>{formik.errors.lastName}</Text>
            )}

            <Text style={styles.inputTitle}>Gender*</Text>
            <View style={[styles.input, styles.pickerBox]}>
              <Picker
                selectedValue={formik.values.gender}
                onValueChange={(itemValue) =>
                  formik.setFieldValue("gender", itemValue)
                }
              >
                <Picker.Item label="Select Gender*" value="" />
                <Picker.Item label="MALE" value="MALE" />
                <Picker.Item label="FEMALE" value="FEMALE" />
                <Picker.Item label="OTHERS" value="OTHERS" />
              </Picker>
            </View>
            {formik.touched.gender && formik.errors.gender && (
              <Text style={styles.errorText}>{formik.errors.gender}</Text>
            )}

            <Text style={styles.inputTitle}>Email*</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Enter email"
                style={[
                  styles.input,
                  formik.touched.email &&
                    formik.errors.email &&
                    styles.errorInput,
                  { paddingRight: 40 },
                ]}
                onChangeText={formik.handleChange("email")}
                onBlur={formik.handleBlur("email")}
                value={formik.values.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {isCheckingEmail && (
                <View style={styles.iconRight}>
                  <ActivityIndicator size="small" color="#6b7280" />
                </View>
              )}
              {!isCheckingEmail && emailValidationStatus === "valid" && (
                <View style={styles.iconRight}>
                  <FontAwesome name="check-circle" size={20} color="#10b981" />
                </View>
              )}
              {!isCheckingEmail && emailValidationStatus === "invalid" && (
                <View style={styles.iconRight}>
                  <FontAwesome name="times-circle" size={20} color="#ef4444" />
                </View>
              )}
            </View>
            {formik.touched.email && formik.errors.email && (
              <Text style={styles.errorText}>{formik.errors.email}</Text>
            )}
            {!isCheckingEmail && emailValidationStatus === "invalid" && (
              <Text style={styles.errorText}>Email is already taken</Text>
            )}

            <Text style={styles.inputTitle}>Phone*</Text>
            <TextInput
              placeholder="Enter phone number"
              style={[
                styles.input,
                formik.touched.phone &&
                  formik.errors.phone &&
                  styles.errorInput,
              ]}
              onChangeText={formik.handleChange("phone")}
              onBlur={formik.handleBlur("phone")}
              value={formik.values.phone}
              keyboardType="phone-pad"
            />
            {formik.touched.phone && formik.errors.phone && (
              <Text style={styles.errorText}>{formik.errors.phone}</Text>
            )}

            <Text style={styles.inputTitle}>Permanent Address</Text>
            <TextInput
              placeholder="Enter permanent address"
              style={styles.input}
              onChangeText={formik.handleChange("permanentAddress")}
              onBlur={formik.handleBlur("permanentAddress")}
              value={formik.values.permanentAddress}
            />

            <Text style={styles.inputTitle}>Temporary Address</Text>
            <TextInput
              placeholder="Enter temporary address"
              style={styles.input}
              onChangeText={formik.handleChange("temporaryAddress")}
              onBlur={formik.handleBlur("temporaryAddress")}
              value={formik.values.temporaryAddress}
            />

            {/* Account Info */}
            <Text style={styles.sectionTitle}>Account Information</Text>

            <Text style={styles.inputTitle}>Username*</Text>
            <TextInput
              placeholder="Enter username"
              style={[
                styles.input,
                formik.touched.username &&
                  formik.errors.username &&
                  styles.errorInput,
              ]}
              onChangeText={formik.handleChange("username")}
              onBlur={formik.handleBlur("username")}
              value={formik.values.username}
              autoCapitalize="none"
            />
            {formik.touched.username && formik.errors.username && (
              <Text style={styles.errorText}>{formik.errors.username}</Text>
            )}

            <Text style={styles.inputTitle}>Password*</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Enter password"
                secureTextEntry={!showPassword}
                style={[
                  styles.input,
                  formik.touched.password &&
                    formik.errors.password &&
                    styles.errorInput,
                  { paddingRight: 40 },
                ]}
                onChangeText={formik.handleChange("password")}
                onBlur={formik.handleBlur("password")}
                value={formik.values.password}
              />
              <TouchableOpacity
                style={styles.iconRight}
                onPress={() => setShowPassword(!showPassword)}
              >
                <FontAwesome
                  name={showPassword ? "eye" : "eye-slash"}
                  size={20}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>
            {formik.touched.password && formik.errors.password && (
              <Text style={styles.errorText}>{formik.errors.password}</Text>
            )}

            <Text style={styles.inputTitle}>Confirm Password*</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Confirm password"
                secureTextEntry={!showConfirmPassword}
                style={[
                  styles.input,
                  formik.touched.confirmPassword &&
                    formik.errors.confirmPassword &&
                    styles.errorInput,
                  { paddingRight: 40 },
                ]}
                onChangeText={formik.handleChange("confirmPassword")}
                onBlur={formik.handleBlur("confirmPassword")}
                value={formik.values.confirmPassword}
              />
              <TouchableOpacity
                style={styles.iconRight}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <FontAwesome
                  name={showConfirmPassword ? "eye" : "eye-slash"}
                  size={20}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <Text style={styles.errorText}>
                  {formik.errors.confirmPassword}
                </Text>
              )}

            <TouchableOpacity
              style={[
                styles.button,
                (isLoading ||
                  formik.isSubmitting ||
                  emailValidationStatus === "invalid") &&
                  styles.buttonDisabled,
              ]}
              onPress={formik.handleSubmit}
              disabled={
                isLoading ||
                formik.isSubmitting ||
                emailValidationStatus === "invalid"
              }
            >
              {isLoading || formik.isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Register</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginRedirect}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginLink}>Login here</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Modal visible={showModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              {modalType === "success" ? (
                <>
                  <FontAwesome name="check-circle" size={48} color="#10b981" />
                  <Text style={styles.modalTextSuccess}>{modalMessage}</Text>
                  <Text style={styles.modalSubText}>
                    Redirecting to login...
                  </Text>
                </>
              ) : (
                <>
                  <FontAwesome name="times-circle" size={48} color="#ef4444" />
                  <Text style={styles.modalTextError}>{modalMessage}</Text>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setShowModal(false)}
                  >
                    <Text style={styles.modalButtonText}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  headerBox: {
    paddingTop: 32,
    paddingBlock: 16,
    backgroundColor: "#f6413bff",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontFamily: fontNames.nunito.semiBold,
    color: "#fff",
  },
  formBox: {
    padding: 20,
  },
  imageSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  imagePickerButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  removeImageButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 2,
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
    borderRadius: 60,
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    color: "#1f2937",
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  gridItem: {
    flex: 1,
  },
  inputTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
    color: "#374151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 14,
  },
  inputWrapper: {
    position: "relative",
    marginBottom: 10,
  },
  iconRight: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  errorInput: {
    borderColor: "#ef4444",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
  errorMessage: {
    color: "#ef4444",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
  pickerBox: {
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#f6443bff",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: "#9ca3af",
  },
  buttonText: {
    color: "#fff",
    fontSize: 24,
    fontFamily: fontNames.nunito.semiBold,
  },
  loginRedirect: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  loginText: {
    fontSize: 14,
    color: "#6b7280",
  },
  loginLink: {
    fontSize: 14,
    color: "#f6443bff",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 12,
    alignItems: "center",
    width: "80%",
    maxWidth: 400,
  },
  modalTextSuccess: {
    fontSize: 18,
    fontWeight: "600",
    color: "#10b981",
    marginTop: 16,
    textAlign: "center",
  },
  modalTextError: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ef4444",
    marginTop: 16,
    textAlign: "center",
  },
  modalSubText: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 8,
  },
  modalButton: {
    marginTop: 16,
    backgroundColor: "#f6443bff",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default RegisterScreen;