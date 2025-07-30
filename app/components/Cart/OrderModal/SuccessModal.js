import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, Feather } from '@expo/vector-icons';

const OrderSuccessModal = ({ isOpen, onClose, orderDetails }) => {
  const { orderCode, date, total, paymentMethod } = orderDetails || {};

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name="x" size={24} color="gray" />
          </TouchableOpacity>

          {/* Success content */}
          <View style={styles.content}>
            <Text style={styles.thankYouText}>Thank you! 🎉</Text>

            <View style={styles.successIconContainer}>
              <AntDesign name="check" size={40} color="white" />
            </View>

            <Text style={styles.orderReceivedText}>Your order has been received</Text>

            {/* Order details */}
            <View style={styles.detailRow}><Text style={styles.label}>Order code:</Text><Text style={styles.value}>{orderCode}</Text></View>
            <View style={styles.detailRow}><Text style={styles.label}>Date:</Text><Text style={styles.value}>{date}</Text></View>
            <View style={styles.detailRow}><Text style={styles.label}>Total:</Text><Text style={styles.value}>{total}</Text></View>
            <View style={styles.detailRow}><Text style={styles.label}>Payment method:</Text><Text style={styles.value}>{paymentMethod}</Text></View>

            {/* Purchase history button */}
            <TouchableOpacity style={styles.historyButton} onPress={onClose}>
              <Text style={styles.historyButtonText}>Purchase history</Text>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  content: {
    marginTop: 30,
    alignItems: 'center',
  },
  thankYouText: {
    fontSize: 22,
    fontWeight: '500',
    marginBottom: 16,
  },
  successIconContainer: {
    backgroundColor: 'green',
    borderRadius: 60,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  orderReceivedText: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
  },
  label: {
    color: '#666',
  },
  value: {
    fontWeight: '500',
  },
  historyButton: {
    backgroundColor: '#555',
    marginTop: 28,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 50,
  },
  historyButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default OrderSuccessModal;
