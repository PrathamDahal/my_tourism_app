import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import { fontNames } from "../config/font";

const LogoutButton = ({ setDropdownOpen }) => {
  const { logout } = useAuth();
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            setDropdownOpen?.(false);
            navigation.navigate("Auth", { screen: "Login" });
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <TouchableOpacity style={styles.menuItemWrapper} onPress={handleLogout}>
      <LinearGradient
        colors={["#C62828", "#E53935"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.menuItem}
      >
        <FontAwesome name="sign-out" size={20} color="#fff" />
        <Text style={styles.menuItemText}>Logout</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItemWrapper: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: fontNames.nunito.regular,
    color: "#fff",
    marginLeft: 15,
    fontWeight: "600",
  },
});

export default LogoutButton;