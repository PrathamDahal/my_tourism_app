import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import HeroSection from "../../../components/Hero/HeroSection";

const { width, height } = Dimensions.get("window");

const Home = ({ navigation }) => {
  const menuItems = [
    {
      title: "Featured Activities",
      icon: "fire",
      screen: "FeaturedActivities",
    },
    {
      title: "Popular Destinations",
      icon: "map-marker",
      screen: "PopularDestinations",
    },
    {
      title: "Accomodations",
      icon: "hotel",
      screen: "FeaturedAccommodations",
    },
    {
      title: "Travel Packages",
      icon: "suitcase",
      screen: "TravelPackages",
    },
  ];

  return (
    <>
      <HeroSection
        image={require("../../../../assets/Images/wallpaperflare.jpg")}
        title="Discover Our Community"
        description="Find the best local experiences and hidden gems"
        buttonText="Explore Now"
        onButtonPress={() => navigation.navigate("WhereToGo")}
      />
      <ImageBackground
        source={require("../../../../assets/Images/waves-yellow.jpg")}
        style={styles.backgroundImage}
        imageStyle={{ opacity: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Search Bar */}
          <TouchableOpacity
            style={styles.searchBar}
            onPress={() => navigation.navigate("WhereToGo")}
          >
            <Ionicons name="search" size={20} color="#666" />
            <Text style={styles.searchText}>
              Where do you want to go today?
            </Text>
          </TouchableOpacity>

          {/* Main Menu Grid */}
          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => navigation.navigate(item.screen)}
                activeOpacity={0.7}
              >
                <View style={styles.menuIconContainer}>
                  <FontAwesome name={item.icon} size={32} color="#841584" />
                </View>
                <Text style={styles.menuItemText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 30,
    margin: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchText: {
    marginLeft: 10,
    color: "#666",
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  menuItem: {
    width: "48%",
    alignItems: "center",
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "rgba(132, 21, 132, 0.1)",
  },
  menuItemText: {
    color: "#333",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
});

export default Home;
