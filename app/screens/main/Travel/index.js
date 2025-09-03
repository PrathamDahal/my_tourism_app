import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { fontNames } from "../../../config/font";
import RatingStars from "../../../custom/RatingStars";
import { useGetTravelPackagesQuery } from "../../../services/travelPackagesApi";

const TravelPackagesScreen = () => {
  const [search, setSearch] = useState("");
  const navigation = useNavigation();

  const {
    data: travelPackages,
    isLoading,
    isError,
    error,
  } = useGetTravelPackagesQuery();

  const renderPackage = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("TravelPackageDetails", { packageData: item })
      }
    >
      <Image source={{ uri: item.imageUrls[0]?.url }} style={styles.image} />
      <View style={styles.durationBadge}>
        <Ionicons name="time-outline" size={14} color="#000" />
        <Text style={styles.durationText}>{item.duration}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.location}>{item.location}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>Npr {item.price} </Text>
          <Text style={styles.person}>/person</Text>
        </View>
        <View style={styles.rating}>
          <RatingStars rating={item.rating} />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#C62828" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text>{error?.message || "Failed to load travel packages"}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.leftGroup}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back-ios" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Travel Packages</Text>
        </View>
        <TouchableOpacity style={styles.headerIconButton}>
          <Icon name="bell" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Row */}
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search packages..."
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.searchIconButton}>
          <MaterialIcons name="filter-list" size={22} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.searchIconButton, { backgroundColor: "#C62828" }]}
        >
          <Ionicons name="search" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Package List */}
      <FlatList
        data={travelPackages?.filter((item) =>
          item.title.toLowerCase().includes(search.toLowerCase())
        )}
        keyExtractor={(item) => item.id}
        renderItem={renderPackage}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default TravelPackagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#C62828",
    paddingHorizontal: 15,
    paddingTop: 45,
    paddingBottom: 12,
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
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    color: "#fff",
    fontFamily: fontNames.nunito.regular,
  },
  headerIconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    margin: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: fontNames.playfair.regular,
    width: "78%",
    height: "100%",
  },
  searchIconButton: {
    marginLeft: 2,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 16,
    marginHorizontal: 12,
    elevation: 3,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 180,
  },
  durationBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  durationText: {
    fontSize: 12,
    marginLeft: 4,
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontFamily: fontNames.openSans.semibold,
    fontSize: 16,
    marginBottom: 2,
  },
  location: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    color: "green",
    fontSize: 14,
    fontWeight: "bold",
  },
  person: {
    fontSize: 12,
    color: "#444",
  },
  rating: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    elevation: 1,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: "bold",
  },
});
