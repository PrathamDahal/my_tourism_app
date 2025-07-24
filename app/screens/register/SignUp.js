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
import { useNavigation } from "@react-navigation/native";
import { useRegisterUserMutation } from "../../services/registerApi";
import { Modal, FlatList } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const roleOptions = [
    { label: "Normal", value: "normal" },
    { label: "Admin", value: "admin" },
    { label: "Seller", value: "seller" },
    { label: "Host", value: "host" },
    { label: "Travel Agency", value: "travel agency" },
  ];

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone is required"),
    username: Yup.string().required("Username is required"),
    password: Yup.string().min(8).required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    role: Yup.string().required("Role is required"),
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
      confirmPassword: "",
      role: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { confirmPassword, ...payload } = values;
        const res = await registerUser(payload).unwrap();
        if (res.success) {
          navigation.navigate("Login");
        }
      } catch (err) {
        alert(err?.data?.message || "Registration failed.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const renderField = (label, name, options = {}) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          formik.touched[name] && formik.errors[name] && styles.errorInput,
        ]}
        value={formik.values[name]}
        onChangeText={formik.handleChange(name)}
        onBlur={formik.handleBlur(name)}
        placeholder={label}
        secureTextEntry={options.secure}
        keyboardType={options.keyboard}
      />
      {formik.touched[name] && formik.errors[name] && (
        <Text style={styles.errorText}>{formik.errors[name]}</Text>
      )}
    </View>
  );

  const renderRoleSelector = () => (
    <View style={styles.field}>
      <Text style={styles.label}>Role*</Text>
      <TouchableOpacity
        style={[
          styles.dropdownButton,
          formik.touched.role && formik.errors.role && styles.errorInput,
        ]}
        onPress={() => setShowRoleModal(true)}
      >
        <Text style={{ color: formik.values.role ? "#000" : "#aaa" }}>
          {formik.values.role
            ? roleOptions.find((r) => r.value === formik.values.role)?.label
            : "Select your role"}
        </Text>
        <AntDesign name="down" size={16} color="#888" />
      </TouchableOpacity>

      {formik.touched.role && formik.errors.role && (
        <Text style={styles.errorText}>{formik.errors.role}</Text>
      )}

      {/* Dropdown Modal */}
      <Modal visible={showRoleModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowRoleModal(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={roleOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    formik.setFieldValue("role", item.value);
                    setShowRoleModal(false);
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
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Info</Text>
          {renderField("Username*", "username")}
          {renderField("Password*", "password", { secure: true })}
          {renderField("Confirm Password*", "confirmPassword", {
            secure: true,
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Role</Text>
          {renderRoleSelector()}
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
  title: {
    fontSize: 26,
    fontWeight: "700",
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
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
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
});
