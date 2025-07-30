import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useResetPasswordMutation } from "../services/resetPasswordApi"; // Adjust the path

const ResetPasswordScreen = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const { token } = route.params;

  const [resetPassword, { isLoading, isSuccess }] = useResetPasswordMutation();

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await resetPassword({ token, password: newPassword }).unwrap();
      Alert.alert("Success", "Password reset successfully!", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (error) {
      setError(error?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Please enter a new password.</Text>

      <Text style={styles.label}>New Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Enter new password"
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={[
          styles.input,
          confirmPassword && newPassword !== confirmPassword
            ? styles.inputError
            : null,
        ]}
        secureTextEntry
        placeholder="Confirm new password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {confirmPassword && newPassword !== confirmPassword && (
        <Text style={styles.errorText}>Passwords do not match.</Text>
      )}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {isSuccess && (
        <Text style={styles.successText}>Password reset successfully!</Text>
      )}

      <TouchableOpacity
        onPress={handleResetPassword}
        style={styles.button}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>SUBMIT</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 24,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  inputError: {
    borderColor: "red",
  },
  button: {
    backgroundColor: "#e63946",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 8,
  },
  successText: {
    color: "green",
    marginBottom: 8,
    textAlign: "center",
  },
});

export default ResetPasswordScreen;
