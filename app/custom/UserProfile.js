import { View, TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFetchUserProfileQuery } from "../services/userApi";
import { fontNames } from "../config/font";
import { API_BASE_URL } from "../../config";

const UserProfile = () => {
  const navigation = useNavigation();
  const { data } = useFetchUserProfileQuery();
  const userData = data;

  // ✅ Use API_BASE_URL if user image exists
  const imageUri =
    typeof userData?.images === "string" && userData.images.trim()
      ? { uri: `${API_BASE_URL}${userData.images}` }
      : require("../../assets/Images/default-avatar-image.jpg");

  const username = userData
    ? `${userData.firstName} ${userData.lastName}`
    : "Guest";

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Auth", { screen: "MyProfile" })}
          style={styles.profileButton}
        >
          <Image
            source={imageUri}
            style={styles.avatar}
          />
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
          onPress={() => navigation.navigate("Auth", { screen: "Settings" })}
          style={styles.iconButton}
        >
          <FontAwesome name="cog" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
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
});

export default UserProfile;
