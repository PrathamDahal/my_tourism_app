import { View, TouchableOpacity, Image, Text, StyleSheet, Modal, Animated } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFetchUserProfileQuery } from "../services/userApi";
import { useAuth } from "../context/AuthContext";
import { fontNames } from "../config/font";
import { API_BASE_URL } from "../../config";
import { useState, useRef, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import LogoutButton from "./LogoutButton";

const UserProfile = () => {
  const navigation = useNavigation();
  const { userToken } = useAuth();
  
  // ✅ Only fetch user profile if logged in
  const { data } = useFetchUserProfileQuery(undefined, {
    skip: !userToken, // Skip query if no token
  });
  
  const userData = data;
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;

  // ✅ Use API_BASE_URL if user image exists
  const imageUri =
    typeof userData?.images === "string" && userData.images.trim()
      ? { uri: `${API_BASE_URL}${userData.images}` }
      : require("../../assets/Images/default-avatar-image.jpg");

  const username = userData
    ? `${userData.firstName} ${userData.lastName}`
    : "Guest";

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: menuVisible ? 0 : 300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [menuVisible]);

  const handleNavigate = (screen) => {
    setMenuVisible(false);
    navigation.navigate("Auth", { screen });
  };

  const menuItems = [
    { label: "Dashboard", screen: "DashboardStack", icon: "dashboard" },
    { label: "My Profile", screen: "MyProfile", icon: "user" },
    { label: "My Cart", screen: "MyCart", icon: "shopping-cart" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Auth", { screen: "MyProfile" })}
          style={styles.profileButton}
        >
          <Image source={imageUri} style={styles.avatar} />
          <View style={styles.textContainer}>
            <Text style={styles.username} numberOfLines={1}>
              {username}
            </Text>
            <Text style={styles.welcomeText}>Welcome Back!</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.iconsContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <FontAwesome name="bell" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setMenuVisible(true)}
          style={styles.iconButton}
        >
          <FontAwesome name="bars" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Slide-out Menu from Right */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="none"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <Animated.View
            style={[
              styles.menuContainer,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menu</Text>
              <TouchableOpacity onPress={() => setMenuVisible(false)}>
                <FontAwesome name="times" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.menuItems}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItemWrapper}
                  onPress={() => handleNavigate(item.screen)}
                >
                  <LinearGradient
                    colors={["#C62828", "#E53935"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.menuItem}
                  >
                    <FontAwesome name={item.icon} size={20} color="#fff" />
                    <Text style={styles.menuItemText}>{item.label}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}

              {/* Logout Button */}
              <View style={styles.logoutWrapper}>
                <LogoutButton setDropdownOpen={setMenuVisible} />
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 120,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#C62828",
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  profileSection: {
    flex: 1,
  },
  profileButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#fff",
  },
  textContainer: {
    marginLeft: 15,
  },
  username: {
    fontSize: 18,
    fontFamily: fontNames.nunito.regular,
    color: "#fff",
    maxWidth: 180,
  },
  welcomeText: {
    fontSize: 14,
    fontFamily: fontNames.playfair.regular,
    color: "rgba(255,255,255,0.9)",
    marginTop: 2,
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 15,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-start",
  },
  menuContainer: {
    position: "absolute",
    right: 0,
    width: 280,
    height: "100%",
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  menuTitle: {
    fontSize: 24,
    fontFamily: fontNames.nunito.regular,
    color: "#333",
    fontWeight: "bold",
  },
  menuItems: {
    marginTop: 10,
  },
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
  logoutWrapper: {
    marginBottom: 15,
  },
});

export default UserProfile;