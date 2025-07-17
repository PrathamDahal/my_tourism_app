import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Button, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MyCart = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([
    { id: '1', name: 'Local Handicraft', price: 25.99, quantity: 1, stock: 3 },
    { id: '2', name: 'Organic Coffee', price: 12.50, quantity: 2, stock: 5 },
    { id: '3', name: 'Traditional Shawl', price: 35.00, quantity: 1, stock: 1 },
  ]);
  const [errorMessage, setErrorMessage] = useState(null);

  const updateQuantity = (id, newQuantity) => {
    const product = cartItems.find(item => item.id === id);
    if (!product) return;

    if (newQuantity < 1) return;

    if (product.stock && newQuantity > product.stock) {
      setErrorMessage(`Cannot add more than available stock (${product.stock})`);
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + (item.price * item.quantity), 0)
      .toFixed(2);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Cart</Text>

      {errorMessage && (
        <View style={styles.errorToast}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      {cartItems.length === 0 ? (
        <View style={styles.emptyCart}>
          <Ionicons name="cart-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Button
            title="Browse Products"
            onPress={() => navigation.navigate('LocalProducts')}
            color="#841584"
          />
        </View>
      ) : (
        <>
          <ScrollView>
            {cartItems.map(item => (
              <View key={item.id} style={styles.cartItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                </View>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    style={styles.quantityButton}
                  >
                    <Ionicons name="remove" size={20} color="#841584" />
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    style={styles.quantityButton}
                  >
                    <Ionicons name="add" size={20} color="#841584" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => removeItem(item.id)}
                  style={styles.removeButton}
                >
                  <Ionicons name="trash-outline" size={20} color="#ff4444" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: ${calculateTotal()}</Text>
            <Button
              title="Proceed to Checkout"
              onPress={() => Alert.alert('Checkout', 'Proceeding to payment')}
              color="#841584"
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginVertical: 20,
  },
  errorToast: {
    backgroundColor: '#fee2e2',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  errorText: {
    color: '#b91c1c',
    textAlign: 'center',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  quantityButton: {
    padding: 5,
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  removeButton: {
    padding: 5,
  },
  totalContainer: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MyCart;
