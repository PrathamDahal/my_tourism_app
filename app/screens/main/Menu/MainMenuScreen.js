import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../context/AuthContext";
import UserProfile from "../../../custom/UserProfile";
import Icon from "react-native-vector-icons/FontAwesome";

const MainNavigationMenuScreen = () => {
  const navigation = useNavigation();
  const { userToken, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  const options = [
    {
      label: "Explore",
      screen: "WhereToGoStack",
      icon: "map-marker",
      color: "#FF6B6B",
      description: "Find amazing places to visit",
    },
    {
      label: "Travel Packages",
      screen: "ContactUs",
      icon: "suitcase",
      color: "#FF8E6E",
      description: "Find curated travel experiences",
    },
    {
      label: "Stays",
      screen: "WhereToStayStack",
      icon: "hotel",
      color: "#6BCB77",
      description: "Browse accommodations and hotels",
    },
    {
      label: "Products",
      screen: "LocalProductsStack",
      icon: "shopping-bag",
      color: "#FFD93D",
      description: "Shop local products and crafts",
    },
    {
      label: "Contact Us",
      screen: "ContactUs",
      icon: "envelope",
      color: "#A45CFF",
      description: "Get in touch with us",
    },
    ...(!userToken
      ? [
          {
            label: "Login",
            parent: "Auth",
            screen: "Login",
            icon: "sign-in",
            color: "#6BCB77",
            description: "Access your account",
          },
          {
            label: "Sign Up",
            parent: "Auth",
            screen: "SignUp",
            icon: "user-plus",
            color: "#A45CFF",
            description: "Create a new account",
          },
        ]
      : []),
  ];

  return (
    <View style={styles.container}>
      {userToken ? (
        <UserProfile />
      ) : (
        <View style={styles.overlay}>
          <Text style={styles.location}>Panchpokhari Tourism</Text>
          <Text style={styles.country}>📍 Nepal</Text>
        </View>
      )}

      <View style={styles.textContainer}>
        <Text style={styles.tourism}>Tourism</Text>
        <Text style={styles.welcomeText}>Discover your next adventure</Text>
      </View>

      {/* Menu Grid */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.menuGrid}>
          {options.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              activeOpacity={0.8}
              onPress={() =>
                item.parent
                  ? navigation.navigate(item.parent, { screen: item.screen })
                  : navigation.navigate(item.screen)
              }
            >
              <View style={[styles.iconContainer]}>
                <Icon name={item.icon} size={40} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },
  overlay: {
    backgroundColor: "#C62828",
    padding: 15,
    paddingTop: 40,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  location: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "800",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  country: {
    fontSize: 16,
    color: "#fff",
    marginTop: 5,
    fontWeight: "600",
  },
  textContainer: {
    marginTop: 8,
    marginHorizontal: 32,
  },
  tourism: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    maxWidth: 180,
  },
  welcomeText: {
    fontSize: 18,
    color: "#777676ff",
    marginTop: 2,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingTop: 20,
  },
  menuItem: {
    width: "48%",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  menuLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#070707ff",
    textAlign: "center",
  },
  menuDescription: {
    marginHorizontal: 4,
    fontSize: 14,
    color: "#718096",
    textAlign: "center",
    lineHeight: 16,
  },
});

export default MainNavigationMenuScreen;
