// src/pages/LoginScreen.js
import { View, Text, Image, StyleSheet, ScrollView, Dimensions } from "react-native";
import LoginForm from "./LoginForm";

const { width } = Dimensions.get("window");

const LoginScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Left Section (Tourism Info) */}
      <View style={styles.leftSection}>
        <Image
          source={require("../../../assets/T-App-icon.png")}
          style={styles.image}
          resizeMode="cover"
        />
        <Text style={styles.title}>Panchpokhari Tourism</Text>
        <Text style={styles.subtitle}>PanchPokhari Thangpal Gaupailka</Text>
        <Text style={styles.description}>
          Discover authentic destinations and unforgettable experiences tailored
          for every traveler.
        </Text>
      </View>

      {/* Right Section (Login Form) */}
      <View style={styles.rightSection}>
        <LoginForm />
      </View>
    </ScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: width >= 768 ? "row" : "column", // Responsive layout
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 16,
  },
  leftSection: {
    width: width >= 768 ? "50%" : "100%",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 130,
    height: 110,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    color: "red",
    fontFamily: "redressed", // Make sure this font is loaded via expo-font if used
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
  },
  rightSection: {
    width: width >= 768 ? "50%" : "100%",
    backgroundColor: "#e5e7eb", // Tailwind's bg-gray-200
    padding: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
