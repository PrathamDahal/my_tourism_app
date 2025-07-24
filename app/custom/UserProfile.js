import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { useFetchUserProfileQuery } from "../services/userApi";

// Helper Dropdown Item
const DropdownItem = ({ icon, label, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.dropdownItem}>
    <Icon name={icon} size={16} color="#374151" style={{ marginRight: 8 }} />
    <Text style={styles.dropdownText}>{label}</Text>
  </TouchableOpacity>
);

const UserProfile = () => {
  const navigation = useNavigation();
  const { logout } = useAuth();
  const { data, isLoading } = useFetchUserProfileQuery();
  const userData = data?.data?.user;
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const imageUri =
    userData?.images || require("../../assets/Images/default-avatar-image.jpg");
  const username = userData?.username || "Guest";
  const email = userData?.email || "example@email.com";

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigation.navigate("Auth", { screen: "Login" });
  };

  const toggleDropDown = () => setDropdownOpen(!isDropdownOpen);

  if (isLoading || !userData) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleDropDown} style={styles.profileButton}>
        <Image
          source={typeof imageUri === "string" ? { uri: imageUri } : imageUri}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
        <Icon
          name="angle-down"
          size={18}
          color="#6B7280"
          style={{
            transform: [{ rotate: isDropdownOpen ? "180deg" : "0deg" }],
          }}
        />
      </TouchableOpacity>

      <Modal transparent visible={isDropdownOpen} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setDropdownOpen(false)}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.dropdown}>
                <View style={styles.dropdownHeader}>
                  <Image
                    source={
                      typeof imageUri === "string"
                        ? { uri: imageUri }
                        : imageUri
                    }
                    style={styles.dropdownAvatar}
                  />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.dropdownUsername}>{username}</Text>
                    <Text style={styles.dropdownEmail}>{email}</Text>
                  </View>
                </View>

                <View style={styles.dropdownItemContainer}>
                  <DropdownItem
                    icon="user"
                    label="My Profile"
                    onPress={() => {
                      setDropdownOpen(false);
                      navigation.navigate("Auth", { screen: "MyProfile" });
                    }}
                  />
                  <DropdownItem
                    icon="shopping-cart"
                    label="My Cart"
                    onPress={() => {
                      setDropdownOpen(false);
                      navigation.navigate("Auth", { screen: "MyCart" });
                    }}
                  />
                  {["admin", "seller", "host", "travelAgency"].includes(
                    userData?.role
                  ) && (
                    <DropdownItem
                      icon="dashboard"
                      label="Dashboard"
                      onPress={() => {
                        setDropdownOpen(false);
                        navigation.navigate("Dashboard");
                      }}
                    />
                  )}
                </View>

                <View style={styles.divider} />
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={handleLogout}
                >
                  <Icon
                    name="sign-out"
                    size={18}
                    color="#fff"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Logout
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 15,
  },
  profileButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    marginLeft: 10,
    marginRight: 6,
  },
  username: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
  },
  email: {
    fontSize: 12,
    color: "#6B7280",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 50,
    paddingRight: 10,
  },
  dropdown: {
    width: 250,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
  },
  dropdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  dropdownAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  dropdownUsername: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#111827",
  },
  dropdownEmail: {
    fontSize: 12,
    color: "#6B7280",
  },
  dropdownItemContainer: {
    marginBottom: 10,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownText: {
    fontSize: 14,
    color: "#374151",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 8,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EF4444",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    justifyContent: "center",
  },
});

export default UserProfile;
