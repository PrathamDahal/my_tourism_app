// components/CustomBottomTab.js
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fontNames } from "../config/font";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CustomBottomTab = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const tabs = [
    {
      name: "Home",
      icon: "home-outline",
      screen: "MainMenu",
      routes: ["MainMenu"],
    },
    {
      name: "Packages",
      icon: "package-variant-closed",
      screen: "TravelPackageStack",
      routes: ["travelPackage", "TravelPackageDetails"],
    },
    {
      name: "Products",
      icon: "shopping-outline",
      screen: "LocalProductsStack",
      routes: [
        "LocalProducts",
        "ProductDisplay",
        "ProductDetails",
        "CategoryProducts",
      ],
    },
    {
      name: "Places",
      icon: "map-marker-outline",
      screen: "WhereToGoStack",
      routes: ["whereToGo", "DestinationDetails", "DestinationsPage"],
    },
    {
      name: "Stays",
      icon: "office-building-outline",
      screen: "WhereToStayStack",
      routes: ["WhereToStay", "StayDetails", "RoomBookings"],
    },
  ];

  const handleTabPress = (screen) => {
    navigation.navigate(screen);
  };

  const isActive = (tab) => tab.routes.includes(route.name);

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const active = isActive(tab);

        return (
          <TouchableOpacity
            key={index}
            style={styles.tab}
            onPress={() => handleTabPress(tab.screen)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={tab.icon}
              size={24}
              color={active ? "#C62828" : "#9E9E9E"}
            />

            <Text style={[styles.label, active && styles.activeLabel]}>
              {tab.name}
            </Text>

            {active && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 72,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    elevation: 10,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    color: "#9E9E9E",
    fontFamily: fontNames.nunito.regular,
  },
  activeLabel: {
    color: "#C62828",
    fontFamily: fontNames.nunito.semiBold,
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    width: 36,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#C62828",
  },
});

export default CustomBottomTab;
