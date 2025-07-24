import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { destinations } from "../../../data/DestinationCarousel";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

const WhereToGo = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredDestinations = destinations.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSuggestionSelect = (value) => {
    setSearchQuery(value);
    setShowSuggestions(false);
  };

  const renderDestinationCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.imageScroll}
      >
        {item.image.map((img) => (
          <Image
            key={img.id}
            source={{ uri: img.url }}
            style={styles.cardImage}
          />
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.cardButton}
        onPress={() =>
          navigation.navigate("DestinationDetails", { destination: item })
        }
      >
        <Text style={styles.cardButtonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Where To Go</Text>

      <TextInput
        placeholder="Search destinations..."
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          setShowSuggestions(true);
        }}
        style={styles.searchInput}
      />

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
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  searchInput: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  suggestionsContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
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
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  imageScroll: {
    marginBottom: 10,
  },
  cardImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginRight: 10,
  },
  cardButton: {
    backgroundColor: "#4a90e2",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  cardButtonText: {
    color: "white",
    fontWeight: "500",
  },
});

export default WhereToGo;
