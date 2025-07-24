import { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLoginMutation } from "../../services/auth/authApiSlice";
import ForgetPasswordModal from "../../custom/ForgetPasswordModal"; // Make sure this modal is React Native compatible
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/authSlice";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "./../../context/AuthContext";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { login: contextLogin } = useAuth();
  const [login, { isLoading, isError }] = useLoginMutation();

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleLogin = async () => {
    try {
      const response = await login({ username, password }).unwrap();

      const { accessToken, refreshToken, user } = response;

      contextLogin(user, { accessToken, refreshToken });

      navigation.reset({
        index: 0,
        routes: [{ name: "App" }],
      });
    } catch (err) {
      console.log("Login failed:", err);
      Alert.alert("Login failed", "Please check your credentials");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
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
        <View style={styles.passwordInputWrapper}>
          <TextInput
            style={styles.inputWithIcon}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            returnKeyType="done"
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.eyeIcon}
            activeOpacity={0.7}
          >
            <Feather
              name={passwordVisible ? "eye" : "eye-off"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.row}>
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
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
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
    width: 300,
    height: 20,
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
  passwordInputWrapper: {
    position: "relative",
    width: "100%",
  },
  inputWithIcon: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingRight: 44,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  eyeIcon: {
    position: "absolute",
    right: 14,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
});
