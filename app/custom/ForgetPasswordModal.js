import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const ForgetPasswordModal = ({ showModal, closeModal }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert("Validation", "Please enter your email.");
      return;
    }

    try {
      const response = await fetch(
        "https://tourism.smartptrm.com/api/v1/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Email sent successfully!");
      } else {
        Alert.alert("Failed", "Failed to send email.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      Alert.alert("Error", "Error sending email.");
    }

    closeModal();
    setEmail("");
  };

  return (
    <Modal
      visible={showModal}
      animationType="fade"
      transparent
      onRequestClose={closeModal}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.centeredView}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Enter your email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={handleSubmit}
              style={[styles.button, styles.okButton]}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setEmail("");
                closeModal();
              }}
              style={[styles.button, styles.closeButton]}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ForgetPasswordModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalView: {
    width: 320,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  okButton: {
    backgroundColor: "#22C55E", // green-500
    marginRight: 10,
  },
  closeButton: {
    backgroundColor: "#EF4444", // red-500
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
