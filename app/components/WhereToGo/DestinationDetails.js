import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Activities } from "../../data/Activities";

const DestinationDetails = ({ route }) => {
const { destination } = route.params;

  if (!destination) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Destination not found</Text>
      </View>
    );
  }

  const mainImage = destination.image[0];
  const windowWidth = Dimensions.get("window").width;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Main Image with Title */}
        <View style={styles.mainImageContainer}>
          <Image
            source={{ uri: mainImage.url }}
            style={[styles.mainImage, { width: windowWidth }]}
            resizeMode="cover"
          />
          <View style={styles.titleOverlay}>
            <Text style={styles.titleText}>{destination.title}</Text>
          </View>
        </View>

        {/* Content paragraphs */}
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>{destination.title}</Text>
          <Text style={styles.paragraph}>
            Potthast's unusual beauty has been the subject of inspiration for
            many travel writers. Its pristine air, spectacular backdrop of snowy
            peaks, blue lakes and surrounding geography make it 'the jewel in
            the Himalaya', a place of remarkable natural dimensions. With the
            magnificent Himalayan range forming the backdrop and the serenity of
            the landscape, Panchpokhari is a legacy destination.
          </Text>
          <Text style={styles.paragraph}>
            Panchpokhari is a great destination for a weekend getaway. It was
            once an important trade route between India and Tibet. To this day,
            merchants set up camps on the city outskirts, bringing goods from
            remote regions through Mustang and other passes. The Thakali people,
            indigenous to the Thak-Khola region of Nepal, are known to be
            entrepreneurs and many more along the trek routes to the Himalayan
            region.
          </Text>
          <Text style={styles.paragraph}>
            The Panchpokhari is best known for the stunning view of the
            Annapurna range. It is perhaps one of the few places on earth from
            where mountains above 8,000 m can be seen undisturbed from an
            altitude of 800 m within the distance of 28 km.
          </Text>
        </View>

        {/* Additional Images */}
        {destination.image.length >= 3 && (
          <View style={styles.additionalImagesContainer}>
            {destination.image.slice(1, 3).map((img) => (
              <View key={img.id} style={styles.imageWrapper}>
                <Image
                  source={{ uri: img.url }}
                  style={styles.additionalImage}
                  resizeMode="cover"
                />
              </View>
            ))}
          </View>
        )}

        {/* Things to do section */}
        <View style={styles.activitiesContainer}>
          <Text style={styles.activitiesTitle}>
            Things to do in Panchpokhari Lake
          </Text>
          <View style={styles.activitiesGrid}>
            {Activities.map((a) => (
              <View key={a.id} style={styles.activityItem}>
                <View style={styles.activityNumber}>
                  <Text style={styles.numberText}>{a.id}</Text>
                </View>
                <Text style={styles.activityText}>{a.activity}</Text>
              </View>
            ))}
          </View>
          <Image
            source={require("../../../assets/Images/yellow-line.png")} // Update path as needed
            style={styles.dividerImage}
            resizeMode="contain"
          />
        </View>
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
  titleOverlay: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
  },
  titleText: {
    fontSize: 32,
    color: "white",
    fontFamily: "redressed", // Make sure to load this font in your app
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
  additionalImagesContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 16,
  },
  imageWrapper: {
    flex: 1,
  },
  additionalImage: {
    width: "100%",
    height: 160,
    borderRadius: 8,
  },
  activitiesContainer: {
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 8,
  },
  activitiesTitle: {
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 16,
    fontFamily: "Playfair", // Make sure to load this font in your app
  },
  activitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
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
  numberText: {
    color: "white",
    fontSize: 14,
  },
  activityText: {
    fontSize: 16,
    flex: 1,
    fontFamily: "OpenSans", // Make sure to load this font in your app
  },
  dividerImage: {
    width: "100%",
    height: 20,
    marginVertical: 8,
  },
});

export default DestinationDetails;
