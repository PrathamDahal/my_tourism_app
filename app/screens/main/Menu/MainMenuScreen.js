import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../context/AuthContext";
import { useFetchUserProfileQuery } from "../../../services/userApi";
import UserProfile from "../../../custom/UserProfile";
import { FontAwesome } from "@expo/vector-icons";
import { fontNames } from "../../../config/font";
import { LinearGradient } from 'expo-linear-gradient';

const MainNavigationMenuScreen = () => {
  const navigation = useNavigation();
  const { userToken, isLoading } = useAuth();
  const { data: userData } = useFetchUserProfileQuery(undefined, {
    skip: !userToken,
  });

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
      screen: "TravelPackageStack",
      icon: "suitcase",
      color: "#FF8E6E",
      description: "Find curated travel experiences",
    },
    {
      label: "HomeStays",
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

  const handleNavigation = (item) => {
    try {
      if (item.parent) {
        navigation.navigate(item.parent, { screen: item.screen });
      } else {
        navigation.navigate(item.screen);
      }
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const handleTrackingNavigation = () => {
    try {
      navigation.navigate("UserTracking");
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.overlay}>
          <ActivityIndicator size="small" color="#fff" />
        </View>
      ) : userToken ? (
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
              onPress={() => handleNavigation(item)}
            >
              <View style={[styles.iconContainer]}>
                <FontAwesome name={item.icon} size={40} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* User Account Sections - Only show when logged in */}
        {userToken && (
          <>
            {/* My Account Section */}
            <View style={styles.accountSection}>
              <Text style={styles.sectionHeader}>My Account</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate("Auth", { 
                  screen: "MyBookings",
                  params: { userId: userData?.id }
                })}
              >
                <LinearGradient
                  colors={['#8B2E2E', '#D94A4A', '#FF6B6B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.accountCard}
                >
                  <View style={styles.accountIconContainer}>
                    <FontAwesome name="history" size={28} color="#fff" />
                  </View>
                  <View style={styles.accountTextContainer}>
                    <Text style={styles.accountTitle}>Payment History</Text>
                    <Text style={styles.accountSubtitle}>
                      View all transactions
                    </Text>
                  </View>
                  <FontAwesome name="chevron-right" size={20} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Safety & Tracking Section */}
            <View style={styles.trackingSection}>
              <Text style={styles.sectionHeader}>Safety & Tracking</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleTrackingNavigation}
              >
                <LinearGradient
                  colors={['#8B2E2E', '#D94A4A', '#FF6B6B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.trackingCard}
                >
                  <View style={styles.trackingIconContainer}>
                    <FontAwesome name="send" size={28} color="#fff" />
                  </View>
                  <View style={styles.trackingTextContainer}>
                    <Text style={styles.trackingTitle}>Location Tracking</Text>
                    <Text style={styles.trackingSubtitle}>
                      Share location & SOS alerts
                    </Text>
                  </View>
                  <FontAwesome name="chevron-right" size={20} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  overlay: {
    backgroundColor: "#C62828",
    padding: 15,
    paddingTop: 40,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    minHeight: 100,
    justifyContent: "center",
  },
  location: {
    fontSize: 24,
    fontFamily: fontNames.openSans.regular,
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  country: {
    fontSize: 16,
    fontFamily: fontNames.openSans.regular,
    color: "#fff",
    marginTop: 5,
  },
  textContainer: {
    marginTop: 8,
    marginHorizontal: 32,
  },
  tourism: {
    fontSize: 24,
    fontFamily: fontNames.raleway.regular,
    color: "#000",
    maxWidth: 180,
  },
  welcomeText: {
    fontSize: 18,
    fontFamily: fontNames.raleway.regular,
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
    marginBottom: 2,
    fontFamily: fontNames.playfair.semiBold,
    color: "#070707ff",
    textAlign: "center",
  },
  menuDescription: {
    fontSize: 14,
    color: "#718096",
    textAlign: "center",
    lineHeight: 16,
  },
  accountSection: {
    paddingHorizontal: 32,
    marginTop: 24,
    marginBottom: 8,
  },
  sectionHeader: {
    fontSize: 22,
    fontFamily: fontNames.raleway.regular,
    color: "#000",
    marginBottom: 16,
  },
  accountCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  accountIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  accountTextContainer: {
    flex: 1,
  },
  accountTitle: {
    fontSize: 18,
    fontFamily: fontNames.playfair.semiBold,
    color: "#fff",
    marginBottom: 4,
  },
  accountSubtitle: {
    fontSize: 14,
    fontFamily: fontNames.openSans.regular,
    color: "rgba(255, 255, 255, 0.9)",
  },
  trackingSection: {
    paddingHorizontal: 32,
    marginTop: 16,
    marginBottom: 16,
  },
  trackingCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  trackingIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  trackingTextContainer: {
    flex: 1,
  },
  trackingTitle: {
    fontSize: 18,
    fontFamily: fontNames.playfair.semiBold,
    color: "#fff",
    marginBottom: 4,
  },
  trackingSubtitle: {
    fontSize: 14,
    fontFamily: fontNames.openSans.regular,
    color: "rgba(255, 255, 255, 0.9)",
  },
});

export default MainNavigationMenuScreen;