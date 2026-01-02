import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
// import RatingStars from "../../custom/RatingStars";
import { Activities } from "../../data/Activities";
import { useGetDestinationBySlugQuery } from "../../services/destinationApi"; 
import { SafeAreaView } from "react-native-safe-area-context";
import { fontNames } from "../../config/font";
import { API_BASE_URL } from "../../../config";


const DestinationDetails = ({ route }) => {
  const { slug } = route.params;
  const navigation = useNavigation();
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("Info");

  const {
    data: destination,
    isLoading,
    isError,
  } = useGetDestinationBySlugQuery(slug);

  const windowWidth = Dimensions.get("window").width;
  const isTablet =
    Platform.isPad || (Platform.OS === "android" && windowWidth >= 600);
  const limit = isTablet ? 1000 : 500;

  const toggleExpanded = () => setExpanded(!expanded);

  if (isLoading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#C62828" />
        <Text>Loading destination...</Text>
      </View>
    );

  if (isError || !destination) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Destination not found</Text>
      </View>
    );
  }

  const activitiesData = Activities.map((item, index) => ({
    ...item,
    id: index.toString(),
  }));

  const mainImage = destination.heroImageUrl
    ? `${API_BASE_URL}${destination.heroImageUrl}`
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Hero Image */}
        <View style={styles.mainImageContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back-ios" size={32} color="#a7a5a5ff" />
          </TouchableOpacity>

          {destination.images?.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ paddingHorizontal: 16, marginBottom: 16 }}
            >
              {destination.images.map((img, idx) => (
                <Image
                  key={idx}
                  source={{ uri: `${API_BASE_URL}${img}` }}
                  style={{
                    width: 120,
                    height: 80,
                    borderRadius: 8,
                    marginRight: 8,
                  }}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          )}

          {mainImage ? (
            <Image
              source={{ uri: mainImage }}
              style={[styles.mainImage, { width: windowWidth }]}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.mainImage, { backgroundColor: "#ccc" }]} />
          )}

          <View style={styles.titleOverlay}>
            <FontAwesome name="map-marker" size={24} color="#b8b7b7ff" />
            <Text style={styles.titleText}>{destination.name}</Text>
          </View>
        </View>

        {/* Summary + Description */}
        <View style={styles.contentContainer}>
          <Text style={styles.summaryText}>{destination.summary}</Text>

          <TouchableOpacity onPress={toggleExpanded}>
            <Text style={styles.paragraph}>
              {expanded || (destination.description?.length ?? 0) <= limit
                ? destination.description
                : `${destination.description?.substring(0, limit)}...`}
              {(destination.description?.length ?? 0) > limit && (
                <Text style={{ color: "#C62828", fontWeight: "bold" }}>
                  {expanded ? " Read less" : " Read more"}
                </Text>
              )}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {["Info", "Attractions", "Activities"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                activeTab === tab && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === "Info" && (
          <View style={styles.tabContent}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <FontAwesome name="globe" size={22} color="#b22222" />
                <Text style={styles.infoLabel}>
                  Latitude: {destination.lat}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <FontAwesome name="globe" size={22} color="#b22222" />
                <Text style={styles.infoLabel}>
                  Longitude: {destination.lng}
                </Text>
              </View>
            </View>

            <View
              style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "baseline", marginLeft: 2, marginTop: 8 }}
            >
              <Text style={{ fontSize: 14, marginRight: 4, color: "#262626ff" }}>Tags:</Text>
              {destination.tags?.map((tag, i) => (
                <View
                  key={i}
                  style={{
                    backgroundColor: "#e8e8e8",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 16,
                    margin: 4,
                  }}
                >
                  <Text style={{ fontSize: 14, fontFamily: fontNames.openSans.semibold, color: "#555" }}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === "Attractions" && (
          <View style={styles.tabContent}>
            <Text style={styles.tabText}>Attractions coming soon...</Text>
          </View>
        )}

        {activeTab === "Activities" && (
          <View style={styles.tabContent}>
            <FlatList
              data={activitiesData}
              numColumns={2}
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
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFoundContainer: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  notFoundText: { color: "red", fontSize: 16 },
  mainImageContainer: { position: "relative", marginBottom: 24 },
  mainImage: { height: 300 },
  backButton: { position: "absolute", zIndex: 2, top: 40, left: 20 },
  titleOverlay: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "baseline",
    bottom: 16,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
  },
  titleText: {
    fontSize: 24,
    marginLeft: 10,
    color: "white",
    fontWeight: "500",
    textShadowColor: "rgba(0,0,0,0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  contentContainer: { paddingHorizontal: 24, marginBottom: 24 },
  summaryText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  paragraph: { fontSize: 16, lineHeight: 24, color: "#666" },
  tabContainer: {
    flexDirection: "row",
    paddingVertical: 4,
    justifyContent: "space-evenly",
    borderRadius: 10,
    backgroundColor: "#C62828",
    marginHorizontal: 22,
    marginBottom: 16,
  },
  tabButton: { width: "32%", paddingVertical: 6, borderRadius: 10 },
  activeTabButton: { backgroundColor: "#fff" },
  tabText: { fontSize: 16, fontFamily: fontNames.nunito.semiBold, textAlign: "center", color: "#fff" },
  activeTabText: { color: "#000", fontWeight: "600" },
  tabContent: { paddingHorizontal: 24, marginBottom: 16 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  infoItem: { flexDirection: "row", alignItems: "center", flex: 1 },
  infoLabel: { fontSize: 14, color: "#555", marginLeft: 8 },
  infoValue: { fontSize: 16, fontWeight: "500", color: "#333" },
  activitiesContainer: { padding: 16 },
  activityCard: {
    width: "48%",
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
  numberText: { color: "white", fontSize: 14 },
  activityText: { fontSize: 16, flex: 1 },
});

export default DestinationDetails;
