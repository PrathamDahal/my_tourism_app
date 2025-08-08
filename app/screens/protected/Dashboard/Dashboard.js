import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useFetchUserProfileQuery } from "../../../services/userApi"; // Adjust if needed
import { useState } from "react";

const Dashboard = ({ navigation }) => {
  const { data } = useFetchUserProfileQuery();
  const userData = data?.role;
  const [openMenu, setOpenMenu] = useState(null);

  // Role-based stats config
  const sellerStats = [
    { id: "1", title: "See Category", icon: "list", color: "#d85046ff" },
    { id: "2", title: "Add Product", icon: "cube", color: "#50aaf5ff" },
  ];

  const hostStats = [
    { id: "1", title: "Add Accomodations", icon: "bed", color: "#ff07f3ff" },
  ];

  const agencyStats = [
    {
      id: "1",
      title: "Create Travel Packages",
      icon: "airplane",
      color: "#3d07ffff",
    },
  ];

  let stats = [];
  if (userData === "SELLER") stats = sellerStats;
  else if (userData === "HOST") stats = hostStats;
  else if (userData === "TRAVELAGENCY") stats = agencyStats;
  // else admin or other roles get nothing

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={require("../../../../assets/Images/Menu/main-menu-banner.jpg")}
        style={styles.headerImage}
        resizeMode="cover"
        imageStyle={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
      >
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>
            Welcome back, {userData || "User"}!
          </Text>
          <Text style={styles.subText}>
            Here's what's happening with your account!
          </Text>
        </View>
      </ImageBackground>

      {stats.length > 0 && (
        <View style={styles.dashboardBox}>
          <View style={styles.statsContainer}>
            {stats.map((stat) => (
              <View key={stat.id}>
                <TouchableOpacity
                  onPress={() =>
                    setOpenMenu(openMenu === stat.id ? null : stat.id)
                  }
                  style={styles.statRowWrapper}
                >
                  <LinearGradient
                    colors={["#f8ba9dff", "#ec7b4fff", "#f5371dff"]}
                    style={styles.statRow}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <View
                      style={[
                        styles.iconCircle,
                        { backgroundColor: stat.color },
                      ]}
                    >
                      <Ionicons name={stat.icon} size={24} color="#fff" />
                    </View>
                    <View style={styles.statTextContainer}>
                      <Text style={styles.statLabel}>{stat.title}</Text>
                    </View>

                    {/* Close/Open Icon */}
                    <Ionicons
                      name={
                        openMenu === stat.id ? "chevron-up" : "chevron-down"
                      }
                      size={20}
                      color="#fff"
                    />
                  </LinearGradient>
                </TouchableOpacity>

                {/* Expanded Section */}
                {openMenu === stat.id && (
                  <View style={styles.expandedSection}>
                    <View style={styles.expandedHeader}>
                      <Text style={styles.expandedTitle}>{stat.title}</Text>
                      <TouchableOpacity onPress={() => setOpenMenu(null)}>
                        <Ionicons name="close-circle" size={22} color="#444" />
                      </TouchableOpacity>
                    </View>
                    {stat.title === "See Category" ? (
                      <View>
                        <Text style={styles.expandedContent}>
                          📂 Category List:
                        </Text>
                        <Text style={styles.expandedContent}>
                          - Electronics
                        </Text>
                        <Text style={styles.expandedContent}>- Fashion</Text>
                        <Text style={styles.expandedContent}>
                          - Home Appliances
                        </Text>
                      </View>
                    ) : (
                      <View>
                        <Text style={styles.expandedContent}>
                          🛠 Feature Coming Soon for "{stat.title}"
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      )}

      <TouchableOpacity
        style={styles.helpCard}
        onPress={() => navigation.navigate("ContactUs")}
      >
        <Ionicons name="help-circle" size={24} color="#841584" />
        <Text style={styles.helpText}>Need help? Contact our support team</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  headerImage: {
    width: "100%",
    height: 280,
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  welcomeCard: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  subText: {
    fontSize: 14,
    color: "#eee",
  },
  dashboardBox: {
    backgroundColor: "#888",
    marginHorizontal: 10,
    marginBottom: 20,
    borderRadius: 18,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  statsContainer: {
    marginBottom: 20,
  },
  statRowWrapper: {
    marginBottom: 12,
    borderRadius: 30,
    overflow: "hidden",
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 30,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  statTextContainer: {
    flex: 1,
  },
  statLabel: {
    fontSize: 19,
    fontWeight: "600",
    color: "#fff",
  },
  helpCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  helpText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#841584",
  },
  expandedSection: {
    backgroundColor: "#fff",
    marginHorizontal: 8,
    marginTop: 5,
    marginBottom: 15,
    padding: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  expandedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  expandedTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  expandedContent: {
    fontSize: 14,
    color: "#666",
  },
});

export default Dashboard;
