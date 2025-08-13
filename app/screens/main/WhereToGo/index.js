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
  ImageBackground,
} from "react-native";
import { destinations } from "../../../data/DestinationCarousel";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

const WhereToGo = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredDestinations = destinations.filter((item) =>
    item.title.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  const handleSuggestionSelect = (value) => {
    setSearchQuery(value);
    setShowSuggestions(false);
  };

  const renderDestinationCard = ({ item }) => {
    // Handle undefined description with empty string fallback
    const description = item.description || "";
    const isTablet =
      Platform.isPad ||
      (Platform.OS === "android" && Dimensions.get("window").width >= 600);
    const maxChars = isTablet ? 500 : 250;
    const displayText =
      description.length > maxChars
        ? `${description.substring(0, maxChars)}...`
        : description;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("DestinationDetails", { destination: item })
        }
      >
        <ImageBackground
          source={{ uri: item.image[0]?.url || "fallback_image_uri" }}
          style={styles.cardImage}
          resizeMode="cover"
        >
          <Text style={styles.cardTitle}>{item.title}</Text>
        </ImageBackground>
        <Text style={styles.descriptionText} numberOfLines={3}>
          {displayText}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <View style={styles.leftGroup}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={32} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.titleText}>Destinations</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="bell" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

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
          onPress={(text) => {
            setSearchQuery(text);
            setShowSuggestions(true);
          }}
        >
          <Icon name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {showSuggestions && searchQuery.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {filteredDestinations.length > 0 ? (
            filteredDestinations.slice(0, 5).map((item) => (
              <TouchableWithoutFeedback
                key={item.id}
                onPress={() => handleSuggestionSelect(item.title)}
              >
                <View style={styles.suggestionItem}>
                  <Text>{item.title}</Text>
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

      <FlatList
        data={filteredDestinations}
        renderItem={renderDestinationCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  titleText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "800",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 2,
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
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    position: "relative",
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: 22,
    marginBottom: 20,
    height: 300, // Fixed height or adjust as needed
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    position: "relative",
    height: "90%",
    padding: 12,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)", // Semi-transparent black overlay
  },
  cardTitle: {
    position: "absolute",
    bottom: 60,
    left: 10,
    fontSize: 24,
    fontWeight: "800",
    color: "#ffffffff",
    zIndex: 1,
  },
  descriptionText: {
    position: "absolute",
    padding:15,
    bottom: 2,
    fontSize: 14,
    color: "#555",
  },
  cardButton: {
    backgroundColor: "#C62828",
    padding: 8,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  cardButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  iconButton: {
    marginLeft: 15,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
});

export default WhereToGo;
