import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";

const LogoutButton = ({ setDropdownOpen }) => {
  const { logout } = useAuth();
  const navigation = useNavigation();

  const handleLogout = async () => {
    await logout();
    setDropdownOpen?.(false); // optional chaining if not provided
    navigation.navigate("Auth", { screen: "Login" });
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleLogout}>
      <Icon name="sign-out" size={18} color="#fff" style={styles.icon} />
      <Text style={styles.text}>Logout</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e53935",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default LogoutButton;
