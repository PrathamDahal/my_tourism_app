import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import ForgetPasswordModal from "../../custom/ForgetPasswordModal"; // Make sure this modal is React Native compatible
import { useLoginMutation } from "../../services/loginApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../services/auth/authSlice";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [login, { isLoading, isError, error }] = useLoginMutation();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Validation", "Please enter username and password");
      return;
    }
    try {
      const credentials = { username, password };
      const { accessToken, refreshToken } = await login(credentials).unwrap();

      dispatch(setCredentials({ accessToken, refreshToken }));

      if (rememberMe) {
        await AsyncStorage.setItem("accessToken", accessToken);
        await AsyncStorage.setItem("refreshToken", refreshToken);
      }

      // Navigate to the home or main screen after login
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }], // change 'Home' to your main screen name
      });
    } catch (err) {
      Alert.alert("Login Failed", err?.data?.message || "Please try again.");
      console.error("Login failed:", err);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Welcome Back</Text>
        <Image
          source={require("../../../assets/Images/red-line.png")}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="default"
            returnKeyType="next"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            returnKeyType="done"
          />
        </View>

        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => setRememberMe(!rememberMe)}
            style={styles.checkboxContainer}
          >
            <View style={[styles.checkbox, rememberMe && styles.checkedBox]} />
            <Text style={styles.checkboxLabel}>Remember me</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={openModal}>
            <Text style={styles.forgotPasswordText}>Forget Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Log in</Text>
          )}
        </TouchableOpacity>

        {isError && (
          <Text style={styles.errorText}>
            {error?.data?.message || "Login failed. Please try again."}
          </Text>
        )}

        <View style={styles.createAccountContainer}>
          <Text style={styles.createAccountText}>CREATE AN ACCOUNT</Text>
        </View>

        <ForgetPasswordModal showModal={showModal} closeModal={closeModal} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "300",
    color: "#FBBF24", // yellow-400
    marginBottom: 10,
    fontFamily: "italiano", // Load this font with expo-font if needed
    textAlign: "center",
  },
  image: {
    width: 150,
    height: 40,
    marginBottom: 20,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#4B5563", // gray-700
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB", // gray-300
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    alignItems: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 5,
    marginRight: 8,
  },
  checkedBox: {
    backgroundColor: "#DC2626", // red-600
    borderColor: "#DC2626",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#111827", // gray-900
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#4F46E5", // indigo-600
  },
  button: {
    width: "100%",
    backgroundColor: "#DC2626", // red-600
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: "center",
    transform: [{ scale: 1 }],
  },
  buttonDisabled: {
    backgroundColor: "#B91C1C", // darker red
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  errorText: {
    color: "#DC2626",
    marginTop: 10,
    textAlign: "center",
  },
  createAccountContainer: {
    marginTop: 30,
  },
  createAccountText: {
    fontSize: 14,
    color: "#4B5563", // gray-600
    textAlign: "center",
  },
});
