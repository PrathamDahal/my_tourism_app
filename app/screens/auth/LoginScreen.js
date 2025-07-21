import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import LoginForm from "./LoginForm";
import { useRoute } from "@react-navigation/native";
import { useEffect } from "react";

const { width } = Dimensions.get("window");

const LoginScreen = () => {
  const route = useRoute();

  useEffect(() => {
    if (route.params?.from === "cart") {
      Alert.alert(
        "Authentication Required",
        "Please Login First to AddToCart!!!"
      );
    }
  }, [route.params]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 20}
      style={{ flex: 1 }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.leftSection}>
          <Image
            source={require("../../../assets/T-App-icon.png")}
            style={styles.image}
            resizeMode="cover"
          />
          <Text style={styles.title}>Panchpokhari Tourism</Text>
          <Text style={styles.subtitle}>PanchPokhari Thangpal Gaupailka</Text>
          <Text style={styles.description}>
            Discover authentic destinations and unforgettable experiences
            tailored for every traveler.
          </Text>
        </View>

        <View style={styles.rightSection}>
          <LoginForm />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    fontFamily: "redressed",
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
    backgroundColor: "#e5e7eb",
    padding: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
