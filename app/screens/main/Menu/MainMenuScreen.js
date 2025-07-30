import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../context/AuthContext"; // adjust path if needed
import UserProfile from "../../../custom/UserProfile";
import LogoutButton from "../../../custom/LogoutButton";

const MainNavigationMenuScreen = () => {
  const navigation = useNavigation();
  const { userToken, isLoading } = useAuth();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  const options = [
    {
      label: "Home",
      screen: "HomeStack",
      image: require("../../../../assets/Images/Menu/home.jpg"),
      description: "Explore our home offerings and updates.",
    },
    {
      label: "Explore",
      screen: "WhereToGoStack",
      image: require("../../../../assets/Images/Menu/explore.jpg"),
      description: "Find places to visit and things to do.",
    },
    {
      label: "Stays",
      screen: "WhereToStayStack",
      image: require("../../../../assets/Images/Menu/stays.jpg"),
      description: "Browse top-rated hotels and accommodations.",
    },
    {
      label: "Products",
      screen: "LocalProductsStack",
      image: require("../../../../assets/Images/Menu/products.jpg"),
      description: "Shop authentic local products.",
    },
    {
      label: "Contact Us",
      screen: "ContactUs",
      image: require("../../../../assets/Images/Menu/contact.jpg"),
      description: "Get in touch with our support team.",
    },
    {
      label: "Travel Packages",
      screen: "ContactUs",
      image: require("../../../../assets/Images/Menu/travel.jpg"),
      description: "Explore customized travel packages.",
    },
    ...(!userToken
      ? [
          {
            label: "Login",
            parent: "Auth",
            screen: "Login",
            image: require("../../../../assets/Images/Menu/login.jpg"),
            description: "Access your account securely.",
          },
          {
            label: "Sign Up",
            parent: "Auth",
            screen: "SignUp",
            image: require("../../../../assets/Images/Menu/register.jpg"),
            description: "Create a new account and get started.",
          },
        ]
      : []),
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ImageBackground
        source={require("../../../../assets/Images/Menu/main-menu-banner.jpg")}
        style={styles.headerImage}
        imageStyle={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
      >
        {userToken && (
          <View style={styles.profile}>
            <UserProfile />
          </View>
        )}
        {/* <LogoutButton /> */}

        <View style={styles.overlay}>
          <Text style={styles.location}>Panchpokhari Tourism</Text>
          <Text style={styles.country}>📍 Nepal</Text>
        </View>
      </ImageBackground>

      <View style={styles.cardList}>
        {options.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.cardContainer}
            onPress={() =>
              item.parent
                ? navigation.navigate(item.parent, { screen: item.screen })
                : navigation.navigate(item.screen)
            }
          >
            <ImageBackground
              source={item.image}
              style={styles.cardImage}
              imageStyle={{ borderRadius: 15 }}
            >
              <View style={styles.cardOverlay}>
                <Text style={styles.cardTitle}>{item.label}</Text>
                <Text style={styles.cardSubtitle}>{item.description}</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerImage: {
    position: "relative",
    zIndex: 10,
    height: 250,
    justifyContent: "flex-end",
    padding: 20,
  },
  profile: {
    position: "absolute",
    paddingVertical: 4,
    paddingLeft: 5,
    borderRadius: 999,
    zIndex: 20,
    top: 35,
    right: 4,
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 10,
    borderRadius: 10,
  },
  location: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  country: {
    fontSize: 16,
    color: "#fff",
    marginTop: 4,
  },
  cardList: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  cardContainer: {
    width: "100%",
    aspectRatio: 2.1,
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#e0e0e0",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardImage: {
    flex: 1,
    justifyContent: "flex-end",
  },
  cardOverlay: {
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 15,
  },
  cardTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#f0f0f0",
    marginBottom: 10,
  },
});

export default MainNavigationMenuScreen;
