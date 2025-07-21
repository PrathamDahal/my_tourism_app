import React from "react";
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

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

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
          {renderField("Role* (e.g. admin, host)", "role")}
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
});
