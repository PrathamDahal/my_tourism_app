import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import { destinations } from "../../../data/DestinationCarousel";
import { useNavigation } from "@react-navigation/native";

const WhereToGo = () => {
  const navigation = useNavigation();
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

      <FlatList
        data={destinations}
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
    marginBottom: 20,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },
  button: {
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
});

export default WhereToGo;
