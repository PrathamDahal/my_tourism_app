import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ConfirmationModal = ({
  visible,
  question,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.question}>{question}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.noButton]} onPress={onCancel}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.yesButton]} onPress={onConfirm}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    elevation: 5,
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  yesButton: {
    backgroundColor: "#10B981", // green
  },
  noButton: {
    backgroundColor: "#EF4444", // red
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ConfirmationModal;
