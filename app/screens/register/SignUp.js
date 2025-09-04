import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Modal, FlatList } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useCreateUserMutation } from "../../services/registerApi";
import { fontNames } from "../../config/font";
import { useNavigation } from "@react-navigation/native";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const roleOptions = [
    { label: "Normal", value: "NORMAL" },
    { label: "Admin", value: "ADMIN" },
    { label: "Seller", value: "SELLER" },
    { label: "Host", value: "HOST" },
    { label: "Travel Agency", value: "TRAVELAGENCY" },
  ];

  const genderOptions = [
    { label: "Male", value: "MALE" },
    { label: "Female", value: "FEMALE" },
    { label: "Other", value: "OTHERS" },
  ];

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone is required"),
    username: Yup.string().required("Username is required"),
    password: Yup.string().min(8).required("Password is required"),
    role: Yup.string().required("Role is required"),
    gender: Yup.string().required("Gender is required"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phone: "",
      username: "",
      password: "",
      role: "",
      gender: "",
      permanentAddress: "",
      temporaryAddress: "",
      images: null,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await createUser(values).unwrap();
        if (res.success) {
          // Show success modal instead of navigating immediately
          setShowSuccessModal(true);
        }
      } catch (err) {
        alert(err?.data?.message || "Registration failed.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.base64) {
      formik.setFieldValue("images", `/uploads/${result.base64}`);
    }
  };

  const renderField = (label, name, options = {}) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={[
            styles.input,
            formik.touched[name] && formik.errors[name] && styles.errorInput,
          ]}
          value={formik.values[name]}
          onChangeText={formik.handleChange(name)}
          onBlur={formik.handleBlur(name)}
          placeholder={label}
          secureTextEntry={options.secure && !showPassword}
          keyboardType={options.keyboard}
        />
        {options.secure && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <AntDesign
              name={showPassword ? "eyeo" : "eye"}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        )}
      </View>
      {formik.touched[name] && formik.errors[name] && (
        <Text style={styles.errorText}>{formik.errors[name]}</Text>
      )}
    </View>
  );

  const renderDropdown = (label, name, options, showModal, setShowModal) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}*</Text>
      <TouchableOpacity
        style={[
          styles.dropdownButton,
          formik.touched[name] && formik.errors[name] && styles.errorInput,
        ]}
        onPress={() => setShowModal(true)}
      >
        <Text style={{ color: formik.values[name] ? "#000" : "#aaa" }}>
          {formik.values[name]
            ? options.find((r) => r.value === formik.values[name])?.label
            : `Select your ${label.toLowerCase()}`}
        </Text>
        <AntDesign name="down" size={16} color="#888" />
      </TouchableOpacity>

      {formik.touched[name] && formik.errors[name] && (
        <Text style={styles.errorText}>{formik.errors[name]}</Text>
      )}

      <Modal visible={showModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowModal(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    formik.setFieldValue(name, item.value);
                    setShowModal(false);
                  }}
                >
                  <Text>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.leftSection}>
          <Image
            source={require("../../../assets/T-App-icon.png")}
            style={styles.image}
            resizeMode="cover"
          />
          <Text style={styles.appTitle}>Panchpokhari Tourism</Text>
          <Text style={styles.subtitle}>PanchPokhari Thangpal Gaupailka</Text>
          <Text style={styles.description}>
            Discover authentic destinations and unforgettable experiences
            tailored for every traveler.
          </Text>
        </View>
        <Text style={styles.title}>Create Account</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Info</Text>
          {renderField("First Name*", "firstName")}
          {renderField("Middle Name", "middleName")}
          {renderField("Last Name*", "lastName")}
          {renderField("Email*", "email", { keyboard: "email-address" })}
          {renderField("Phone*", "phone", { keyboard: "phone-pad" })}
          {renderField("Permanent Address", "permanentAddress")}
          {renderField("Temporary Address", "temporaryAddress")}
          <Text style={styles.label}>Image</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            <Text style={{ fontSize: 16 }}>
              {formik.values.images
                ? "Change Profile Image"
                : "Select Profile Image"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Info</Text>
          {renderField("Username*", "username")}
          {renderField("Password*", "password", { secure: true })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Role & Gender</Text>
          {renderDropdown(
            "Role",
            "role",
            roleOptions,
            showRoleModal,
            setShowRoleModal
          )}
          {renderDropdown(
            "Gender",
            "gender",
            genderOptions,
            showGenderModal,
            setShowGenderModal
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            (formik.isSubmitting || isLoading) && styles.disabledButton,
          ]}
          onPress={formik.handleSubmit}
          disabled={formik.isSubmitting || isLoading}
        >
          {formik.isSubmitting || isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>
        <Modal visible={showSuccessModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.successModalContent}>
              <Text style={styles.successText}>
                User has been registered successfully!!!
              </Text>
              <TouchableOpacity
                style={styles.successButton}
                onPress={() => {
                  setShowSuccessModal(false);
                  navigation.navigate("Login");
                }}
              >
                <Text style={styles.successButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8f9fa",
    paddingBottom: 60,
  },
  leftSection: {
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 10,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e3342f",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginTop: 4,
  },
  description: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginTop: 6,
    paddingHorizontal: 10,
  },
  imagePicker: {
    borderColor: "#ccc",
    borderWidth: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontFamily: fontNames.raleway.regular,
    color: "#e3342f",
    textAlign: "center",
    marginVertical: 20,
  },
  section: {
    marginBottom: 25,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fontNames.poppins.regular,
    marginBottom: 12,
    color: "#333",
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontFamily: fontNames.poppins.regular,
    color: "#555",
    marginBottom: 4,
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  errorInput: {
    borderColor: "#e3342f",
  },
  errorText: {
    fontSize: 12,
    color: "#e3342f",
    marginTop: 3,
  },
  button: {
    backgroundColor: "#e3342f",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  eyeIcon: {
    position: "absolute",
    alignItems: "center",
    top: 12,
    right: 12,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    width: "80%",
    maxHeight: "60%",
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  successModalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  successText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  successButton: {
    backgroundColor: "#e3342f",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  successButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
