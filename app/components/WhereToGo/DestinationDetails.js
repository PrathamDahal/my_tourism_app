import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Platform,
  FlatList,
} from "react-native";
import { Activities } from "../../data/Activities";
import Icon from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import RatingStars from "../../custom/RatingStars";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";

const DestinationDetails = ({ route }) => {
  const { destination } = route.params;
  const navigation = useNavigation();

  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("Info"); // Default to Info tab
  const windowWidth = Dimensions.get("window").width;
  const isTablet =
    Platform.isPad || (Platform.OS === "android" && windowWidth >= 600);
  const limit = isTablet ? 1000 : 500;
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  const activitiesData = Activities.map((item, index) => ({
    ...item,
    id: index.toString(), // Ensure each item has a unique ID
  }));

  if (!destination) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Destination not found</Text>
      </View>
    );
  }

  const mainImage = destination.image[0];

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "Attractions":
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabText}>Attractions content goes here</Text>
            {/* Replace with your actual attractions data */}
          </View>
        );
      case "Activities":
        return (
          <View style={styles.tabContent}>
            <FlatList
              data={activitiesData}
              numColumns={2} // This creates the 2-column layout
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.activityCard}>
                  <View style={styles.activityNumber}>
                    <Text style={styles.numberText}>{item.id}</Text>
                  </View>
                  <Text style={styles.activityText}>{item.activity}</Text>
                </View>
              )}
              contentContainerStyle={styles.activitiesContainer}
            />
          </View>
        );
      case "Info":
      default:
        return (
          <View style={styles.tabContent}>
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Icon name="calendar" size={20} color="#b22222" />
                  <View style={{ marginLeft: 8 }}>
                    <Text style={styles.infoLabel}>Best Time To Visit</Text>
                    <Text style={styles.infoValue}>April To October</Text>
                  </View>
                </View>
                <View style={styles.infoItem}>
                  <Icon name="sun-o" size={20} color="#b22222" />
                  <View style={{ marginLeft: 8 }}>
                    <Text style={styles.infoLabel}>Climate</Text>
                    <Text style={styles.infoValue}>Mediterranean</Text>
                  </View>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Icon name="language" size={20} color="#b22222" />
                  <View style={{ marginLeft: 8 }}>
                    <Text style={styles.infoLabel}>Language</Text>
                    <Text style={styles.infoValue}>Greek</Text>
                  </View>
                </View>
                <View style={styles.infoItem}>
                  <Icon name="dollar" size={20} color="#b22222" />
                  <View style={{ marginLeft: 8 }}>
                    <Text style={styles.infoLabel}>Currency</Text>
                    <Text style={styles.infoValue}>Euro (eur)</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Main Image with Title */}
        <View style={styles.mainImageContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back-ios" size={32} color="#fff" />
          </TouchableOpacity>
          <Image
            source={{ uri: mainImage.url }}
            style={[styles.mainImage, { width: windowWidth }]}
            resizeMode="cover"
          />
          <View style={styles.titleOverlay}>
            <Icon name="map-marker" size={24} color="#fff" />
            <Text style={styles.titleText}>{destination.title}</Text>
          </View>
        </View>

        {/* Description (always visible) */}
        <View style={styles.contentContainer}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RatingStars rating={destination.rating} />
            </View>
            <Text style={{ marginLeft: 8, fontSize: 18, color: "#555" }}>
              {destination.rating.toFixed(1)}
            </Text>
          </View>

          <TouchableOpacity onPress={toggleExpanded}>
            <Text style={styles.paragraph}>
              {expanded || destination.description.length <= limit
                ? destination.description
                : `${destination.description.substring(0, limit)}...`}
              {destination.description.length > limit && (
                <Text style={{ color: "#C62828", fontWeight: "bold" }}>
                  {expanded ? " Read less" : " Read more"}
                </Text>
              )}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "Info" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("Info")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Info" && styles.activeTabText,
              ]}
            >
              Info
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "Attractions" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("Attractions")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Attractions" && styles.activeTabText,
              ]}
            >
              Attractions
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "Activities" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("Activities")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Activities" && styles.activeTabText,
              ]}
            >
              Activities
            </Text>
          </TouchableOpacity>
        </View>

        {/* Render the active tab content */}
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  notFoundContainer: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  notFoundText: {
    color: "red",
    fontSize: 16,
  },
  mainImageContainer: {
    position: "relative",
    marginBottom: 24,
  },
  mainImage: {
    height: 300,
  },
  backButton: {
    position: "absolute",
    zIndex: 2,
    top: 40,
    left: 20,
  },
  titleOverlay: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    bottom: 16,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
  },
  titleText: {
    fontSize: 24,
    marginLeft: 10,
    color: "white",
    fontFamily: "",
    fontWeight: "500",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  contentContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "500",
    marginBottom: 16,
    color: "#333",
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    borderRadius: 10,
    paddingVertical: 6,
    backgroundColor: "#C62828",
    borderBottomWidth: 1,
    borderBottomColor: "#e21e1eff",
    marginHorizontal: 22,
    marginBottom: 16,
  },
  tabButton: {
    width: "32%",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    borderRadius: 10,
  },
  activeTabButton: {
    backgroundColor: "#fff",
    borderBottomColor: "#b22222",
  },
  tabText: {
    fontSize: 16,
    textAlign: "center",
    color: "#fff",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "semi-bold",
  },
  tabContent: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  infoContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "#888",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  activitiesContainer: {
    padding: 16,
  },
  activityCard: {
    width: "48%", // Leaves some space for margin
    margin: "1%",
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  activityNumber: {
    backgroundColor: "#b22222",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  activityText: {
    flex: 1,
    fontSize: 14,
  },
  numberText: {
    color: "white",
    fontSize: 14,
  },
  activityText: {
    fontSize: 16,
    flex: 1,
    fontFamily: "OpenSans",
  },
  dividerImage: {
    width: "100%",
    height: 20,
    marginVertical: 8,
  },
});

export default DestinationDetails;
