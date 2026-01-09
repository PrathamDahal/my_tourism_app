import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { fontNames } from "../../../config/font";
import { useGetAllDestinationsQuery } from "../../../services/destinationApi";
import { API_BASE_URL } from "../../../../config";
import CustomBottomTab from "../../../custom/BottomTabComponent";

const WhereToGo = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ✅ Fetch from API
  const { data, isLoading, isError, isFetching, refetch } =
    useGetAllDestinationsQuery();

  if (isLoading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#C62828" />
        <Text>Loading destinations...</Text>
      </View>
    );

  if (isError)
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>Failed to load destinations</Text>
      </View>
    );

  // ✅ Extract actual destination array
  const destinations = data?.data || [];

  // ✅ Filter based on search
  const filteredDestinations = destinations.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSuggestionSelect = (value) => {
    setSearchQuery(value);
    setShowSuggestions(false);
  };

  const renderDestinationCard = ({ item }) => {
    const description = item.description || "";
    const isTablet =
      Platform.isPad ||
      (Platform.OS === "android" && Dimensions.get("window").width >= 600);
    const maxChars = isTablet ? 500 : 250;
    const displayText =
      description.length > maxChars
        ? `${description.substring(0, maxChars)}...`
        : description;

    const imageUrl = `${API_BASE_URL}${item.heroImageUrl}`;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("DestinationDetails", { slug: item.slug })
        }
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <View style={styles.cardTitleContainer}>
            <FontAwesome name="map-marker" size={24} color="#fff" />
            <Text style={styles.cardTitle}>{item.name}</Text>
          </View>
        </View>
        <Text style={styles.descriptionText} numberOfLines={3}>
          {displayText}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.title}>
        <View style={styles.leftGroup}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back-ios" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.titleText}>Destinations</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <FontAwesome name="bell" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search destinations..."
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            setShowSuggestions(true);
          }}
          style={styles.searchInput}
        />
        <TouchableOpacity
          style={styles.searchIcon}
          onPress={() => setShowSuggestions(true)}
        >
          <FontAwesome name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Suggestions */}
      {showSuggestions && searchQuery.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {filteredDestinations.length > 0 ? (
            filteredDestinations.slice(0, 5).map((item) => (
              <TouchableWithoutFeedback
                key={item.id}
                onPress={() => handleSuggestionSelect(item.name)}
              >
                <View style={styles.suggestionItem}>
                  <Text>{item.name}</Text>
                </View>
              </TouchableWithoutFeedback>
            ))
          ) : (
            <View style={styles.suggestionItem}>
              <Text>No matches found</Text>
            </View>
          )}
        </View>
      )}

      {/* Destination List */}
      <FlatList
        data={filteredDestinations}
        renderItem={renderDestinationCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshing={isFetching}
        onRefresh={refetch}
      />

      <CustomBottomTab />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: -1,
    backgroundColor: "#C62828",
    padding: 15,
    paddingTop: 40,
    marginBlock: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftGroup: { flexDirection: "row", alignItems: "center" },
  backButton: { marginRight: 10, padding: 5 },
  titleText: {
    fontSize: 24,
    color: "#fff",
    fontFamily: fontNames.nunito.regular,
  },
  iconButton: {
    marginLeft: 15,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginHorizontal: 24,
    gap: 3,
  },
  searchInput: {
    height: 45,
    width: "88%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  searchIcon: {
    height: 45,
    backgroundColor: "#C62828",
    padding: 11,
    borderRadius: 5,
  },
  suggestionsContainer: {
    width: "78%",
    marginHorizontal: 24,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: -9,
    marginBottom: 10,
    paddingVertical: 4,
    maxHeight: 150,
  },
  suggestionItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  listContainer: { paddingBottom: 20 },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: 22,
    marginBottom: 20,
    height: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  imageContainer: { position: "relative" },
  cardImage: { height: "85%", width: "100%" },
  cardTitleContainer: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.4)",
    bottom: 60,
    left: 10,
    zIndex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: fontNames.openSans.semibold,
    color: "#fff",
    marginLeft: 8,
  },
  descriptionText: {
    position: "absolute",
    padding: 15,
    bottom: 2,
    fontSize: 14,
    color: "#555",
  },
});

export default WhereToGo;
