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
import ForgetPasswordModal from "../../custom/ForgetPasswordModal";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "./../../context/AuthContext";
import { fontNames } from "../../config/font";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { login: contextLogin } = useAuth();
  const [login, { isLoading, error }] = useLoginMutation();

  const navigation = useNavigation();

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleLogin = async () => {
    // ✅ Basic validation
    if (!email || !password) {
      Alert.alert("Missing Information", "Please enter both email and password");
      return;
    }

    try {
      const response = await login({ email, password }).unwrap();
      
      if (!response.accessToken || !response.refreshToken) {
        console.warn("Tokens missing:", response);
        Alert.alert("Login Error", "Invalid response from server");
        return;
      }

      const { accessToken, refreshToken } = response;

      // ✅ Save to context (which should save to AsyncStorage)
      await contextLogin({ accessToken, refreshToken });

      // ✅ Navigate to main app
      navigation.reset({
        index: 0,
        routes: [{ name: "MainStack" }],
      });
    } catch (err) {
      console.log("Login failed:", err);
      
      // ✅ Handle different error types
      if (err.status === 429) {
        Alert.alert(
          "Too Many Attempts",
          "You have made too many login attempts. Please wait a few minutes and try again.",
          [{ text: "OK" }]
        );
      } else if (err.status === 401) {
        Alert.alert(
          "Login Failed",
          "Invalid email or password. Please try again.",
          [{ text: "OK" }]
        );
      } else if (err.status === "FETCH_ERROR") {
        Alert.alert(
          "Network Error",
          "Unable to connect to the server. Please check your internet connection.",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Login Failed",
          err.data?.message || "An unexpected error occurred. Please try again.",
          [{ text: "OK" }]
        );
      }
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
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          returnKeyType="next"
          editable={!isLoading} // ✅ Disable while loading
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
            onSubmitEditing={handleLogin} // ✅ Allow enter key to submit
            editable={!isLoading} // ✅ Disable while loading
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.eyeIcon}
            activeOpacity={0.7}
            disabled={isLoading} // ✅ Disable while loading
          >
            <Feather
              name={passwordVisible ? "eye" : "eye-off"}
              size={20}
              color={isLoading ? "#CCC" : "#666"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.row}>
        <TouchableOpacity onPress={openModal} disabled={isLoading}>
          <Text style={[
            styles.forgotPasswordText,
            isLoading && styles.disabledText
          ]}>
            Forget Password?
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoading} // ✅ Prevent double-clicks
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Log in</Text>
        )}
      </TouchableOpacity>

      {/* ✅ Display error message if present */}
      {error && (
        <Text style={styles.errorText}>
          {error.status === 429 
            ? "Too many attempts. Please wait."
            : error.data?.message || "Login failed. Please try again."}
        </Text>
      )}

      <TouchableOpacity
        style={styles.createAccountContainer}
        onPress={() => navigation.navigate("SignUp")}
        disabled={isLoading} // ✅ Disable while loading
      >
        <Text style={[
          styles.createAccountText,
          isLoading && styles.disabledText
        ]}>
          CREATE AN ACCOUNT
        </Text>
      </TouchableOpacity>

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
    color: "#FBBF24",
    marginBottom: 10,
    fontFamily: fontNames.openSans.regular,
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
    fontFamily: fontNames.openSans.regular,
    color: "#4B5563",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
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
  forgotPasswordText: {
    fontSize: 14,
    color: "#4F46E5",
  },
  // ✅ New style for disabled text
  disabledText: {
    opacity: 0.5,
  },
  button: {
    width: "100%",
    backgroundColor: "#DC2626",
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#B91C1C",
    opacity: 0.7, // ✅ Visual feedback for disabled state
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: fontNames.openSans.regular,
    fontWeight: "600",
  },
  errorText: {
    color: "#DC2626",
    marginTop: 10,
    textAlign: "center",
    fontSize: 14,
  },
  createAccountContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  createAccountText: {
    color: "#e63946",
    fontSize: 16,
    fontFamily: fontNames.openSans.regular,
    fontWeight: "semi-bold",
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