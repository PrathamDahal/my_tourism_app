import { useState } from "react";
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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRegisterUserMutation } from "../../services/registerApi";
import Icon from "react-native-vector-icons/FontAwesome";
import { fontNames } from "../../config/font";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone is required"),
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    gender: Yup.string().required("Gender is required"),
    role: Yup.string().required("Role is required"),
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
      username: "",
      password: "",
      confirmPassword: "",
      gender: "",
      role: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const { confirmPassword, ...apiPayload } = values;
        const response = await registerUser(apiPayload).unwrap();

        if (response.success) {
          setShowModal(true);
          setTimeout(() => {
            setShowModal(false);
            navigation.reset({
              index: 0,
              routes: [{ name: "MainStack" }],
            });
          }, 2000);
        }
      } catch (err) {
        setStatus(
          err.data?.message || "Registration failed. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

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
            <TextInput
              placeholder="Enter email"
              style={[
                styles.input,
                formik.touched.email &&
                  formik.errors.email &&
                  styles.errorInput,
              ]}
              onChangeText={formik.handleChange("email")}
              onBlur={formik.handleBlur("email")}
              value={formik.values.email}
              keyboardType="email-address"
            />
            {formik.touched.email && formik.errors.email && (
              <Text style={styles.errorText}>{formik.errors.email}</Text>
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

            {/* New Optional Address Fields */}
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
                <Icon
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
                <Icon
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

            {/* Role */}
            <Text style={styles.inputTitle}>Role Selection*</Text>
            <View style={[styles.input, styles.pickerBox]}>
              <Picker
                selectedValue={formik.values.role}
                onValueChange={(itemValue) =>
                  formik.setFieldValue("role", itemValue)
                }
              >
                <Picker.Item label="Select Role*" value="" />
                <Picker.Item label="Normal" value="normal" />
                <Picker.Item label="Seller" value="seller" />
                <Picker.Item label="Host" value="host" />
                <Picker.Item label="Travel Agency" value="travelAgency" />
                <Picker.Item label="Admin" value="admin" />
              </Picker>
            </View>
            {formik.touched.role && formik.errors.role && (
              <Text style={styles.errorText}>{formik.errors.role}</Text>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                (isLoading || formik.isSubmitting) && styles.buttonDisabled,
              ]}
              onPress={formik.handleSubmit}
              disabled={isLoading || formik.isSubmitting}
            >
              {isLoading || formik.isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Register</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <Modal visible={showModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalText}>
                User has been registered successfully!!!
              </Text>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  headerBox: {
    backgroundColor: "#dc2626",
    paddingTop: 32,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  formBox: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: fontNames.openSans.semibold,
    color: "#374151",
    marginVertical: 12,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  inputTitle: {
    fontSize: 14,
    fontFamily: fontNames.nunito.semiBold,
    marginBottom: 4,
    color: "#111827",
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  gridItem: {
    flex: 1,
    marginRight: 6,
  },

  inputWrapper: {
    position: "relative",
  },
  iconRight: {
    position: "absolute",
    right: 10,
    top: 20,
    transform: [{ translateY: -10 }],
    zIndex: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  pickerBox: {
    padding: 0,
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 6,
  },
  errorMessage: {
    color: "red",
    marginBottom: 12,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#dc2626",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
  },
});
